import React from 'react';
import { ShieldCheck, Lock, CheckCircle2, Copy } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'my' | 'en';
  onSound?: (type: 'click' | 'start' | 'alert' | 'success') => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
  lang,
  onSound,
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const privacyText = `PRIVACY POLICY & TERMS OF SERVICE
Last Updated: October 2026
Application: Colab Android Terminal (com.victorgeek.colabterminal)
Developer: Victor Geek (Email: xhackcoder@gmail.com)

1. OVERVIEW & AFFILIATION DISCLAIMER
Colab Android Terminal is an independent developer productivity and remote terminal utility. 
DISCLAIMER: This application is NOT affiliated with, sponsored by, authorized by, or endorsed by Google LLC, Google Colab, or Alphabet Inc. All trademarks (including Google, Google Colaboratory, Colab) belong to their respective owners.

2. DATA COLLECTION & DATA SAFETY
- Zero Personal Data Collected: We do not collect, harvest, store, or sell your name, email, location, contacts, or device identifiers.
- No External Analytics or Tracking: No third-party ad networks (AdMob, Unity, etc.) or tracking SDKs are embedded.
- Client-Side Hardware Encryption: All user-provided credentials (such as Ngrok AuthToken, Hugging Face Token, or SSH passphrases) are encrypted locally on your Android device using the Web Crypto API (AES-256-GCM with PBKDF2 100,000 iterations). Plaintext keys are never stored on disk and are never transmitted to any external server managed by us.
- Data Deletion: Users can permanently wipe all encrypted data at any time via the in-app "WIPE" button in the Secure Vault tab.

3. ANDROID PERMISSIONS USAGE
- android.permission.INTERNET: Required solely to communicate with user-configured endpoints (such as your own Google Colab instance, tmate session, ngrok tunnel, or localhost proxy).
- android.permission.ACCESS_NETWORK_STATE: Used to detect network connectivity status and measure round-trip latency.
- android.permission.WAKE_LOCK: Used optionally by the user to keep the screen active during long-running cloud compute scripts to prevent idle disconnection.

4. ACCEPTABLE USE & ZERO CRYPTOMINING POLICY
- Cryptomining Strictly Prohibited: In accordance with Google Play Developer Policies and Google Cloud Platform Terms of Service, this app strictly prohibits on-device cryptocurrency mining or executing unauthorized mining workloads.
- Zero Exploit Guarantee: This utility operates as a standard, transparent terminal client over user-authorized SSH and HTTP bridges. It contains no backdoors, malware, or unauthorized access bypasses.

5. TARGET AUDIENCE
This app is intended for developers, researchers, and students aged 13 and above. It is not directed to children under 13 years of age.

6. CONTACT & INQUIRIES
For privacy or policy inquiries, contact developer Victor Geek at: xhackcoder@gmail.com`;

  const handleCopy = () => {
    if (onSound) onSound('success');
    navigator.clipboard.writeText(privacyText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md text-xs text-slate-100 leading-relaxed font-semibold">
      <div className="terminal-panel max-w-lg w-full rounded-2xl p-4 sm:p-5 flex flex-col gap-3 shadow-2xl border border-slate-700 max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between font-bold text-sm text-white border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#00ff66]" />
            <div>
              <span className="text-white block font-black">
                {lang === 'my' ? 'GOOGLE PLAY PRIVACY POLICY & TERMS' : 'GOOGLE PLAY PRIVACY POLICY & TERMS'}
              </span>
              <span className="text-[10px] text-cyan-300 block font-normal">
                Complies with Google Play Developer Program & Data Safety Policies
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              if (onSound) onSound('click');
              onClose();
            }}
            className="terminal-key-btn px-2.5 py-1 rounded cursor-pointer text-white font-bold"
          >
            [X]
          </button>
        </div>

        {/* Scrollable Policy Body */}
        <div className="space-y-3 bg-black p-3 rounded-lg border border-slate-800 overflow-y-auto scrollbar-matrix text-xs">
          <div className="p-2.5 rounded bg-emerald-950/60 border border-[#00ff66]/40 text-[#00ff66] text-[11px] flex items-start gap-2">
            <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
            <div>
              <strong>Play Console Data Safety Summary:</strong> No data collected, no data shared, all local tokens AES-256-GCM encrypted, user-initiated deletion supported, target audience 13+.
            </div>
          </div>

          <div className="space-y-2 text-slate-200">
            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-[#00ff66]">
              1. Non-Affiliation Disclaimer (Impersonation Policy Compliance)
            </h3>
            <p>
              {lang === 'my'
                ? 'Colab Android Terminal သည် သီးခြားလွတ်လပ်သော developer tool ဖြစ်ပြီး Google LLC, Google Colaboratory သို့မဟုတ် Alphabet Inc. တို့နှင့် တိုက်ရိုက်ပတ်သက်မှု၊ ခွင့်ပြုချက် သို့မဟုတ် ထောက်ခံမှုမရှိပါ။ ကုန်အမှတ်တံဆိပ်အားလုံးသည် ၎င်းတို့၏ သက်ဆိုင်ရာ ပိုင်ရှင်များထံသာ သက်ဆိုင်ပါသည်။'
                : 'Colab Android Terminal is an independent developer utility and is NOT affiliated with, sponsored by, or endorsed by Google LLC or Google Colab. All trademarks belong to their respective owners.'}
            </p>

            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-cyan-300">
              2. Data Safety & Zero-Collection Guarantee
            </h3>
            <p>
              {lang === 'my'
                ? 'ဤ App သည် အသုံးပြုသူ၏ မည်သည့် ကိုယ်ရေးအချက်အလက် (အမည်၊ ဖုန်းနံပါတ်၊ နေရာဒေသ၊ အီးမေးလ်) ကိုမျှ စုဆောင်းခြင်း၊ ရောင်းချခြင်း သို့မဟုတ် ပြင်ပဆာဗာသို့ ပေးပို့ခြင်း လုံးဝ မပြုလုပ်ပါ။'
                : 'We collect NO personal user data. No advertising SDKs, analytics tracking, or user telemetry exist in this app.'}
            </p>

            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-amber-300">
              3. Local Hardware AES-256-GCM Encryption
            </h3>
            <p>
              {lang === 'my'
                ? 'အသုံးပြုသူ ထည့်သွင်းထားသော Ngrok AuthToken, Hugging Face Token, SSH Passphrase များကို Device ပေါ်တွင်သာ Web Crypto AES-256-GCM စနစ်ဖြင့် စာဝှက်သိမ်းဆည်းထားပြီး Master PIN ဖြင့်သာ ဖွင့်နိုင်ပါသည်။'
                : 'Sensitive credentials are encrypted on-device via Web Crypto AES-256-GCM with PBKDF2 (100,000 iterations). Plaintext is never stored or transmitted.'}
            </p>

            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-rose-300">
              4. Zero Cryptomining & Malware Policy
            </h3>
            <p>
              {lang === 'my'
                ? 'Google Play Store မူဝါဒနှင့် Google Cloud AUP အရ ဤ App သည် ဖုန်းပေါ်တွင် သို့မဟုတ် Remote စနစ်တွင် ခွင့်ပြုချက်မရှိဘဲ Cryptomining ပြုလုပ်ခြင်းကို တင်းကြပ်စွာ တားမြစ်ထားပြီး မည်သည့် backdoor / rootkit မှ မပါဝင်ပါ။'
                : 'Strictly complies with Google Play Cryptomining and Device Abuse policies. No on-device or unauthorized cloud mining is facilitated.'}
            </p>

            <h3 className="text-white font-bold text-xs uppercase tracking-wider text-purple-300">
              5. Minimal Android Permissions Scope
            </h3>
            <p>
              Only standard normal permissions are used: <code className="text-white bg-slate-800 px-1 rounded">INTERNET</code>, <code className="text-white bg-slate-800 px-1 rounded">ACCESS_NETWORK_STATE</code>, and <code className="text-white bg-slate-800 px-1 rounded">WAKE_LOCK</code> (optional screen keep-alive). No runtime storage, camera, contacts, or location access requested.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
          <button
            onClick={handleCopy}
            className="flex-1 bg-[#00ff66] hover:bg-emerald-400 text-black py-2 rounded font-black text-xs cursor-pointer flex items-center justify-center gap-1.5 shadow-md font-mono"
          >
            <Copy size={13} />
            <span>{copied ? (lang === 'my' ? 'ကူးယူပြီးပါပြီ ✓' : 'COPIED TO CLIPBOARD ✓') : (lang === 'my' ? 'မူဝါဒစာသား ကူးယူရန် (COPY TEXT)' : 'COPY PRIVACY POLICY TEXT')}</span>
          </button>
          <button
            onClick={() => {
              if (onSound) onSound('click');
              onClose();
            }}
            className="terminal-key-btn px-4 py-2 rounded text-xs font-bold text-white hover:bg-slate-700 cursor-pointer"
          >
            [CLOSE]
          </button>
        </div>
      </div>
    </div>
  );
};
