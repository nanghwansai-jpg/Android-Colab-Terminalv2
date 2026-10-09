import React, { useState, useEffect } from 'react';
import { secureStorage, StoredSecrets } from '../services/secureStorage';
import { ShieldCheck, Lock, Unlock, KeyRound, Eye, EyeOff, Trash2, Copy, CheckCircle2 } from 'lucide-react';

interface SecureStoragePanelProps {
  lang: 'my' | 'en';
  onSound?: (type: 'click' | 'start' | 'alert' | 'success') => void;
  onApplyNgrokToken?: (token: string) => void;
  onClose?: () => void;
}

export const SecureStoragePanel: React.FC<SecureStoragePanelProps> = ({
  lang,
  onSound,
  onApplyNgrokToken,
  onClose,
}) => {
  const [pin, setPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(secureStorage.isUnlocked());
  const [hasVault, setHasVault] = useState(secureStorage.hasVault());
  const [secrets, setSecrets] = useState<StoredSecrets>({
    ngrokToken: '',
    hfToken: '',
    githubToken: '',
    colabSession: '',
    customSecret: '',
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showValues, setShowValues] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const triggerSound = (type: 'click' | 'start' | 'alert' | 'success' = 'click') => {
    if (onSound) onSound(type);
  };

  useEffect(() => {
    if (secureStorage.isUnlocked()) {
      const active = secureStorage.getSecrets();
      if (active) setSecrets(active);
      setIsUnlocked(true);
    }
  }, []);

  const handleUnlockOrCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin || pin.length < 4) {
      setErrorMsg(lang === 'my' ? 'Master PIN သည် အနည်းဆုံး ၄ လုံး ရှိရပါမည်။' : 'Master PIN must be at least 4 digits.');
      triggerSound('alert');
      return;
    }

    try {
      setErrorMsg('');
      const decrypted = await secureStorage.unlock(pin);
      setSecrets(decrypted);
      setIsUnlocked(true);
      setHasVault(true);
      triggerSound('success');
      setSuccessMsg(lang === 'my' ? 'Vault ကို အောင်မြင်စွာ ဖွင့်လိုက်ပါပြီ!' : 'Secure Vault unlocked successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid Master PIN');
      triggerSound('alert');
    }
  };

  const handleSaveSecrets = async () => {
    if (!pin) {
      setErrorMsg(lang === 'my' ? 'Master PIN ထည့်သွင်းရန် လိုအပ်ပါသည်။' : 'Master PIN required to encrypt vault.');
      triggerSound('alert');
      return;
    }

    try {
      await secureStorage.save(pin, secrets);
      setIsUnlocked(true);
      setHasVault(true);
      triggerSound('success');
      setSuccessMsg(lang === 'my' ? 'AES-256-GCM ဖြင့် လုံခြုံစွာ သိမ်းဆည်းပြီးပါပြီ!' : 'Encrypted & saved with AES-256-GCM!');
      setTimeout(() => setSuccessMsg(''), 3500);

      if (secrets.ngrokToken && onApplyNgrokToken) {
        onApplyNgrokToken(secrets.ngrokToken);
      }
    } catch (err: any) {
      setErrorMsg('Failed to encrypt: ' + err.message);
      triggerSound('alert');
    }
  };

  const handleLockVault = () => {
    secureStorage.lock();
    setIsUnlocked(false);
    setPin('');
    setSecrets({});
    triggerSound('click');
    setSuccessMsg(lang === 'my' ? 'Vault ကို ပြန်လည် ပိတ်လိုက်ပါပြီ။' : 'Vault locked & memory wiped.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handleWipeAll = () => {
    if (confirm(lang === 'my' ? 'လုံခြုံရေးအရ သိမ်းဆည်းထားသော အချက်အလက်အားလုံးကို ရှင်းထုတ်ဖျက်ဆီးမည် သေချာပါသလား?' : 'Permanently wipe all encrypted credentials from this device?')) {
      secureStorage.wipe();
      setIsUnlocked(false);
      setHasVault(false);
      setPin('');
      setSecrets({});
      triggerSound('alert');
      setSuccessMsg(lang === 'my' ? 'ဒေတာအားလုံးကို ဖျက်ဆီးပြီးပါပြီ။' : 'All secure data wiped permanently.');
      setTimeout(() => setSuccessMsg(''), 3000);
    }
  };

  const copyToClipboard = (text: string, keyName: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    triggerSound('success');
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const toggleShow = (key: string) => {
    setShowValues((prev) => ({ ...prev, [key]: !prev[key] }));
    triggerSound('click');
  };

  return (
    <div className="terminal-panel p-3 sm:p-4 rounded-xl flex flex-col gap-3 border border-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#00ff66]" />
          <div>
            <span className="text-sm font-black text-white uppercase tracking-wider block">
              {lang === 'my' ? 'လုံခြုံရေးသိုလှောင်ခန်း (SECURE VAULT)' : 'HARDWARE SECURE STORAGE'}
            </span>
            <span className="text-[11px] font-bold text-cyan-300 block">
              AES-256-GCM · PBKDF2 (100K ITER) · ZERO PLAINTEXT
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isUnlocked ? (
            <button
              onClick={handleLockVault}
              className="bg-amber-950/80 hover:bg-amber-900 border border-amber-400 text-amber-300 px-2.5 py-1 rounded text-xs font-black flex items-center gap-1 cursor-pointer"
              title="Lock Vault"
            >
              <Lock size={13} /> LOCK
            </button>
          ) : (
            <span className="text-xs font-bold text-rose-400 px-2 py-0.5 rounded bg-rose-950/50 border border-rose-500/50 flex items-center gap-1">
              <Lock size={12} /> ENCRYPTED
            </span>
          )}
          {onClose && (
            <button
              onClick={onClose}
              className="terminal-key-btn px-2 py-0.5 rounded text-xs font-black text-white hover:bg-slate-700 cursor-pointer"
            >
              [X]
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-2 rounded bg-rose-950/80 border border-rose-500 text-rose-200 text-xs font-bold">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="p-2 rounded bg-emerald-950/80 border border-[#00ff66] text-[#00ff66] text-xs font-bold flex items-center gap-1.5">
          <CheckCircle2 size={14} /> {successMsg}
        </div>
      )}

      {/* Unlock / Create PIN View */}
      {!isUnlocked ? (
        <form onSubmit={handleUnlockOrCreate} className="space-y-3 bg-black/60 p-3 rounded-lg border border-slate-800">
          <div className="space-y-1">
            <label className="text-xs font-black text-white flex items-center gap-1.5">
              <KeyRound size={14} className="text-[#00ff66]" />
              {hasVault
                ? (lang === 'my' ? 'Master PIN ဖြင့် သိုလှောင်ခန်းဖွင့်ပါ:' : 'ENTER MASTER PIN TO UNLOCK VAULT:')
                : (lang === 'my' ? 'Master PIN အသစ် သတ်မှတ်ပါ (အနည်းဆုံး ၄ လုံး):' : 'SET NEW MASTER PIN (MIN 4 DIGITS):')}
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="••••••••"
              maxLength={32}
              className="w-full bg-black border border-slate-700 p-2 rounded text-sm font-mono text-white tracking-widest focus:outline-none focus:border-[#00ff66]"
            />
          </div>

          <p className="text-xs text-slate-300 font-bold leading-relaxed">
            {lang === 'my'
              ? 'ဤသိုလှောင်ခန်းသည် Ngrok Token, Hugging Face Token နှင့် SSH Key များကို Client-Side တွင်သာ AES-256 ဖြင့် စာဝှက်သိမ်းဆည်းထားပြီး ၅ မိနစ်အတွင်း အလိုအလျောက် ပြန်ပိတ်ပါမည်။'
              : 'Credentials are encrypted on-device using Web Crypto AES-256-GCM. Decrypted values reside strictly in volatile memory and auto-lock after 5 minutes of inactivity.'}
          </p>

          <button
            type="submit"
            className="w-full bg-[#00ff66] hover:bg-emerald-400 text-black py-2 rounded font-black text-xs cursor-pointer flex items-center justify-center gap-1 shadow-md"
          >
            <Unlock size={14} /> {hasVault ? (lang === 'my' ? 'သိုလှောင်ခန်း ဖွင့်ရန် (UNLOCK)' : 'UNLOCK SECURE VAULT') : (lang === 'my' ? 'PIN သတ်မှတ်ပြီး ဖန်တီးရန်' : 'CREATE ENCRYPTED VAULT')}
          </button>
        </form>
      ) : (
        /* Unlocked Vault Secrets View */
        <div className="space-y-3">
          <div className="space-y-2 bg-black/70 p-3 rounded-lg border border-slate-800">
            {/* ngrok Token */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-cyan-300">NGROK AUTHTOKEN:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleShow('ngrok')}
                    className="text-slate-300 hover:text-white"
                  >
                    {showValues.ngrok ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {secrets.ngrokToken && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(secrets.ngrokToken || '', 'ngrok')}
                      className="text-[#00ff66] hover:text-white flex items-center gap-0.5 text-[11px]"
                    >
                      <Copy size={13} /> {copiedKey === 'ngrok' ? 'COPIED' : 'COPY'}
                    </button>
                  )}
                </div>
              </div>
              <input
                type={showValues.ngrok ? 'text' : 'password'}
                value={secrets.ngrokToken || ''}
                onChange={(e) => setSecrets({ ...secrets, ngrokToken: e.target.value })}
                placeholder="2xxxx_xxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-black border border-slate-700 p-2 rounded text-xs font-mono text-white focus:outline-none focus:border-cyan-400 font-semibold"
              />
            </div>

            {/* Hugging Face Token */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-amber-300">HUGGING FACE TOKEN (HF_TOKEN):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleShow('hf')}
                    className="text-slate-300 hover:text-white"
                  >
                    {showValues.hf ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {secrets.hfToken && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(secrets.hfToken || '', 'hf')}
                      className="text-[#00ff66] hover:text-white flex items-center gap-0.5 text-[11px]"
                    >
                      <Copy size={13} /> {copiedKey === 'hf' ? 'COPIED' : 'COPY'}
                    </button>
                  )}
                </div>
              </div>
              <input
                type={showValues.hf ? 'text' : 'password'}
                value={secrets.hfToken || ''}
                onChange={(e) => setSecrets({ ...secrets, hfToken: e.target.value })}
                placeholder="hf_xxxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-black border border-slate-700 p-2 rounded text-xs font-mono text-white focus:outline-none focus:border-amber-400 font-semibold"
              />
            </div>

            {/* GitHub PAT */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-emerald-400">GITHUB TOKEN (PAT):</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleShow('gh')}
                    className="text-slate-300 hover:text-white"
                  >
                    {showValues.gh ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {secrets.githubToken && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(secrets.githubToken || '', 'gh')}
                      className="text-[#00ff66] hover:text-white flex items-center gap-0.5 text-[11px]"
                    >
                      <Copy size={13} /> {copiedKey === 'gh' ? 'COPIED' : 'COPY'}
                    </button>
                  )}
                </div>
              </div>
              <input
                type={showValues.gh ? 'text' : 'password'}
                value={secrets.githubToken || ''}
                onChange={(e) => setSecrets({ ...secrets, githubToken: e.target.value })}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxx"
                className="w-full bg-black border border-slate-700 p-2 rounded text-xs font-mono text-white focus:outline-none focus:border-emerald-400 font-semibold"
              />
            </div>

            {/* Custom SSH Passphrase / Session */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs font-black">
                <span className="text-purple-300">SSH PASSPHRASE / COLAB SESSION:</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => toggleShow('custom')}
                    className="text-slate-300 hover:text-white"
                  >
                    {showValues.custom ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  {secrets.customSecret && (
                    <button
                      type="button"
                      onClick={() => copyToClipboard(secrets.customSecret || '', 'custom')}
                      className="text-[#00ff66] hover:text-white flex items-center gap-0.5 text-[11px]"
                    >
                      <Copy size={13} /> {copiedKey === 'custom' ? 'COPIED' : 'COPY'}
                    </button>
                  )}
                </div>
              </div>
              <input
                type={showValues.custom ? 'text' : 'password'}
                value={secrets.customSecret || ''}
                onChange={(e) => setSecrets({ ...secrets, customSecret: e.target.value })}
                placeholder="Secret key or passphrase..."
                className="w-full bg-black border border-slate-700 p-2 rounded text-xs font-mono text-white focus:outline-none focus:border-purple-400 font-semibold"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveSecrets}
              className="flex-1 bg-[#00ff66] hover:bg-emerald-400 text-black py-2 rounded font-black text-xs cursor-pointer text-center shadow-md font-mono"
            >
              {lang === 'my' ? 'သိုလှောင်ခန်း သိမ်းဆည်းရန် (ENCRYPT & SAVE)' : 'SAVE ENCRYPTED VAULT'}
            </button>
            <button
              onClick={handleWipeAll}
              className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500 text-rose-300 hover:text-white px-3 py-2 rounded text-xs font-black cursor-pointer flex items-center gap-1 font-mono"
              title="Wipe Storage"
            >
              <Trash2 size={13} /> WIPE
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
