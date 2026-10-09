/**
 * Secure Storage Service with AES-256-GCM Web Crypto API
 * Designed for Colab Android Terminal / Termux Environment
 * - Zero plaintext leakage
 * - PBKDF2 Key Derivation (100,000 iterations, SHA-256)
 * - Randomized Salt & 96-bit IV per encryption
 * - In-memory ephemeral decrypted cache with configurable auto-lock timer
 */

export interface StoredSecrets {
  ngrokToken?: string;
  hfToken?: string;
  githubToken?: string;
  colabSession?: string;
  customSecret?: string;
  sshKeyPass?: string;
}

const STORAGE_KEY = 'colab_vault_v1';
const DEFAULT_AUTO_LOCK_MS = 5 * 60 * 1000; // 5 minutes auto-lock

let inMemorySecrets: StoredSecrets | null = null;
let autoLockTimer: ReturnType<typeof setTimeout> | null = null;

// Convert ArrayBuffer to Base64
function bufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Convert Base64 to ArrayBuffer
function base64ToBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

// Derive AES-GCM Key using PBKDF2
async function deriveKey(pin: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(pin),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt as BufferSource,
      iterations: 100000,
      hash: 'SHA-256',
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

export const secureStorage = {
  /**
   * Check if encrypted vault exists on device
   */
  hasVault(): boolean {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  /**
   * Check if vault is currently unlocked in memory
   */
  isUnlocked(): boolean {
    return inMemorySecrets !== null;
  },

  /**
   * Unlock vault using master PIN / passphrase
   */
  async unlock(pin: string): Promise<StoredSecrets> {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      inMemorySecrets = {};
      this.resetAutoLockTimer();
      return inMemorySecrets;
    }

    try {
      const payload = JSON.parse(raw);
      const salt = new Uint8Array(base64ToBuffer(payload.salt));
      const iv = new Uint8Array(base64ToBuffer(payload.iv));
      const ciphertext = base64ToBuffer(payload.ciphertext);

      const key = await deriveKey(pin, salt);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        ciphertext
      );

      const dec = new TextDecoder();
      const secrets: StoredSecrets = JSON.parse(dec.decode(decrypted));
      inMemorySecrets = secrets;
      this.resetAutoLockTimer();
      return secrets;
    } catch {
      throw new Error('Invalid Master PIN or corrupted secure storage.');
    }
  },

  /**
   * Save and encrypt secrets with master PIN
   */
  async save(pin: string, secrets: StoredSecrets): Promise<void> {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const key = await deriveKey(pin, salt);

    const enc = new TextEncoder();
    const encoded = enc.encode(JSON.stringify(secrets));

    const ciphertext = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoded
    );

    const payload = {
      salt: bufferToBase64(salt.buffer),
      iv: bufferToBase64(iv.buffer),
      ciphertext: bufferToBase64(ciphertext),
      updatedAt: new Date().toISOString(),
      algo: 'AES-256-GCM',
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    inMemorySecrets = { ...secrets };
    this.resetAutoLockTimer();
  },

  /**
   * Lock the vault and wipe memory immediately
   */
  lock(): void {
    inMemorySecrets = null;
    if (autoLockTimer) {
      clearTimeout(autoLockTimer);
      autoLockTimer = null;
    }
  },

  /**
   * Retrieve active secrets if unlocked
   */
  getSecrets(): StoredSecrets | null {
    if (inMemorySecrets) {
      this.resetAutoLockTimer();
    }
    return inMemorySecrets;
  },

  /**
   * Clear all stored secrets from device
   */
  wipe(): void {
    localStorage.removeItem(STORAGE_KEY);
    inMemorySecrets = null;
    if (autoLockTimer) {
      clearTimeout(autoLockTimer);
      autoLockTimer = null;
    }
  },

  /**
   * Reset the auto-lock timer upon activity
   */
  resetAutoLockTimer(timeoutMs = DEFAULT_AUTO_LOCK_MS): void {
    if (autoLockTimer) {
      clearTimeout(autoLockTimer);
    }
    autoLockTimer = setTimeout(() => {
      this.lock();
    }, timeoutMs);
  },
};
