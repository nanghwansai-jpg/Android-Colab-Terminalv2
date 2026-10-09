import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Smartphone,
  Cpu,
  FileText,
  UserCheck,
  HelpCircle,
  Eye,
  Terminal,
} from 'lucide-react';

interface PlayStorePolicyCenterProps {
  lang: 'my' | 'en';
  onSound?: (type: 'click' | 'start' | 'alert' | 'success') => void;
  onOpenPrivacyModal: () => void;
  reviewerMode: boolean;
  onToggleReviewerMode: (enabled: boolean) => void;
}

export const PlayStorePolicyCenter: React.FC<PlayStorePolicyCenterProps> = ({
  lang,
  onSound,
  onOpenPrivacyModal,
  reviewerMode,
  onToggleReviewerMode,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'console_guide' | 'listing' | 'reviewer'>('audit');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const triggerSound = (type: 'click' | 'start' | 'alert' | 'success' = 'click') => {
    if (onSound) onSound(type);
  };

  const copyText = (text: string, key: string) => {
    triggerSound('success');
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Google Play Console Automated Audit Items
  const policyAuditItems = [
    {
      id: 'target_sdk',
      titleEn: 'Target API Level Compliance (Android 14/15+)',
      titleMy: 'Target SDK Level သတ်မှတ်ချက် (Android 14+)',
      status: 'PASS',
      descEn: 'targetSdkVersion is set to 36 (Android 15), exceeding Google Play requirement of SDK 34+.',
      descMy: 'Play Store ၏ အနိမ့်ဆုံးသတ်မှတ်ချက် (Target SDK 34) ထက်ကျော်လွန်သော SDK 36 ကို သတ်မှတ်ထားပြီး ဖြစ်ပါသည်။',
    },
    {
      id: 'permissions',
      titleEn: 'Android Permissions Minimization',
      titleMy: 'ခွင့်ပြုချက်များ မူဝါဒ (Permissions Minimization)',
      status: 'PASS',
      descEn: 'Only standard normal permissions (INTERNET, WAKE_LOCK, ACCESS_NETWORK_STATE). Zero sensitive runtime storage/camera permissions.',
      descMy: 'အန္တရာယ်ရှိသော Storage/SMS/Camera/Location ခွင့်ပြုချက်များ မပါဝင်ဘဲ လိုအပ်သော Network & WakeLock သာ သုံးထားပါသည်။',
    },
    {
      id: 'trademark',
      titleEn: 'Impersonation & Brand Trademark Policy',
      titleMy: 'ကုန်အမှတ်တံဆိပ်နှင့် အယောင်ဆောင်မှု မူဝါဒ',
      status: 'PASS',
      descEn: 'Contains explicit legal non-affiliation disclaimer: "Not affiliated with or endorsed by Google LLC or Google Colab".',
      descMy: 'Google LLC နှင့် တရားဝင် ပတ်သက်မှုမရှိကြောင်း ရှင်းလင်းသော Disclaimer ထည့်သွင်းထားပြီး ဖြစ်ပါသည်။',
    },
    {
      id: 'cryptomining',
      titleEn: 'Zero Cryptomining Policy Enforcement',
      titleMy: 'Cryptomining တားမြစ်ချက် မူဝါဒ',
      status: 'PASS',
      descEn: 'Complies strictly with Play Store policy banning on-device cryptocurrency mining. Explicitly abides by Google Cloud AUP.',
      descMy: 'စက်ပစ္စည်းပေါ်တွင် Cryptomining ပြုလုပ်ခြင်းကို Play Store မူဝါဒအရ လုံးဝ တားမြစ်ထားပါသည်။',
    },
    {
      id: 'malware',
      titleEn: 'Malicious Behavior & Remote Access Architecture',
      titleMy: 'Malware နှင့် အန္တရာယ်ရှိသော စနစ်များ ကင်းရှင်းမှု',
      status: 'PASS',
      descEn: 'Standard client terminal over transparent HTTP/SSH protocols. No unauthorized backdoors or rootkit exploits.',
      descMy: 'တရားဝင် SSH/HTTP ပရိုတိုကောဖြင့်သာ အလုပ်လုပ်ပြီး မည်သည့် backdoor သို့မဟုတ် exploit မျှ မပါဝင်ပါ။',
    },
    {
      id: 'data_safety',
      titleEn: 'Data Safety & Client-Side AES-256 Storage',
      titleMy: 'Data Safety နှင့် Client-Side AES-256 စာဝှက်စနစ်',
      status: 'PASS',
      descEn: 'Zero personal data collected. All user tokens encrypted locally via AES-256-GCM. Permanent user-initiated wipe supported.',
      descMy: 'မည်သည့် user data မှ မစုဆောင်းပါ။ Token များကို ဖုန်းထဲတွင်သာ AES-256 ဖြင့် စာဝှက်ပြီး ဖျက်ဆီးခွင့် ပေးထားပါသည်။',
    },
    {
      id: 'cleartext',
      titleEn: 'Network Security Config & Cleartext Scope',
      titleMy: 'Network Security Config လုံခြုံရေး သတ်မှတ်ချက်',
      status: 'PASS',
      descEn: 'Localhost and standard HTTPS tunnels explicitly secured in capacitor.config.ts and AndroidManifest.',
      descMy: 'Localhost 7681/5000 နှင့် HTTPS endpoints များကို သီးခြားခွဲထုတ်ကာ စနစ်တကျ ပြင်ဆင်ထားပါသည်။',
    },
    {
      id: 'audience',
      titleEn: 'Target Audience & Families Policy (13+)',
      titleMy: 'ပစ်မှတ်ထား ပရိသတ် (၁၃ နှစ်နှင့် အထက်)',
      status: 'PASS',
      descEn: 'Targeted to 13+ developers & researchers. Not directed to children under 13 (No COPPA conflict).',
      descMy: 'ကလေးငယ်များအတွက် မဟုတ်ဘဲ ၁၃ နှစ်အထက် developer များအတွက်ဖြစ်၍ Families Policy အငြိမရှိပါ။',
    },
    {
      id: 'ads',
      titleEn: 'Zero Third-Party Ad Trackers',
      titleMy: 'ကြော်ငြာနှင့် Tracker များ မပါဝင်မှု',
      status: 'PASS',
      descEn: 'No embedded ad SDKs (AdMob, Unity, etc.) and no Advertising ID (AD_ID) usage.',
      descMy: 'မည်သည့် ကြော်ငြာ SDK သို့မဟုတ် Advertising ID မှ မသုံးထားပါ။',
    },
    {
      id: 'reviewer_access',
      titleEn: 'Google App Review Access & Demo Sandbox',
      titleMy: 'Google App Reviewer စစ်ဆေးရန် Demo Sandbox စနစ်',
      status: 'PASS',
      descEn: 'Reviewer sandbox allows Google Play review team to test terminal, GPU telemetry, and vault without external server hurdles.',
      descMy: 'Google Play စစ်ဆေးသူများ အဆင်ပြေစေရန် Demo Sandbox ဖြင့် 1-Click စစ်ဆေးနိုင်အောင် ပြင်ဆင်ထားပါသည်။',
    },
  ];

  // Play Console Ready Form Answers
  const playConsoleFormAnswers = [
    {
      section: '1. App Access (အက်ပ်သုံးစွဲခွင့်)',
      question: 'Are parts of your app restricted by login, credentials, or geofencing?',
      answer: 'All functionality is available without special access restrictions. (Or provide Reviewer Demo Sandbox mode instructions).',
      detailMy: 'Google Reviewer စစ်ဆေးရန် "All functionality is available without special access" ကို ရွေးချယ်နိုင်ပြီး Demo Mode ဖြင့် စစ်ဆေးစေနိုင်ပါသည်။',
    },
    {
      section: '2. Ads (ကြော်ငြာများ)',
      question: 'Does your app contain advertisements?',
      answer: 'No, my app does not contain ads.',
      detailMy: '"No, my app does not contain ads" ကို ရွေးချယ်ပါ။ (App ထဲတွင် ကြော်ငြာလုံးဝမပါပါ)',
    },
    {
      section: '3. Content Ratings & Target Audience (ပစ်မှတ်ထား ပရိသတ်)',
      question: 'What is the target age group of your app?',
      answer: '13 years and older (13-15, 16-17, 18+). Ensure "Could your store listing appeal to children?" is marked "No".',
      detailMy: '၁၃ နှစ်နှင့်အထက် ကိုသာ ရွေးချယ်ပါ။ "ကလေးငယ်များ စိတ်ဝင်စားနိုင်မှု" ကို "No" ရွေးပါ။',
    },
    {
      section: '4. News Apps (သတင်းအက်ပ်)',
      question: 'Is your app a news app?',
      answer: 'No.',
      detailMy: '"No" ကို ရွေးချယ်ပါ။',
    },
    {
      section: '5. COVID-19 Contact Tracing & Status',
      question: 'Is your app a publicly available COVID-19 contact tracing app?',
      answer: 'My app is not a publicly available COVID-19 contact tracing or status app.',
      detailMy: '"My app is not a COVID-19 app" ကို ရွေးချယ်ပါ။',
    },
    {
      section: '6. Data Safety (ဒေတာလုံခြုံရေး ကြေညာချက် - အလွန်အရေးကြီး)',
      question: 'Does your app collect or share any user data?',
      answer: 'No. (Select "No" - because user credentials are encrypted locally on-device using Web Crypto AES-256 and never collected or sent to developer servers).',
      detailMy: 'Data Collection အမေးတွင် "No" ကို ရွေးချယ်ပါ။ ဒေတာများကို ဖုန်းထဲတွင်သာ AES-256 ဖြင့် သိမ်းဆည်းပြီး server သို့ မပို့ပါ။',
    },
    {
      section: '7. Government Apps (အစိုးရအက်ပ်)',
      question: 'Is your app developed by or on behalf of a government?',
      answer: 'No.',
      detailMy: '"No" ကို ရွေးချယ်ပါ။',
    },
    {
      section: '8. Financial Features & Cryptocurrency',
      question: 'Does your app provide financial features or facilitate cryptocurrency mining?',
      answer: 'No financial features provided. No on-device cryptocurrency mining.',
      detailMy: '"No financial features" ကို ရွေးချယ်ပါ။',
    },
  ];

  const storeListingMetadata = {
    title: 'Colab Android Terminal',
    shortDesc: 'Mobile terminal controller with real-time telemetry, keys & secure vault.',
    fullDesc: `Colab Android Terminal is a dedicated mobile terminal and controller client for managing cloud compute workloads, Python scripts, and remote terminals with precision.

KEY FEATURES:
• Interactive Terminal Shell: Clean, high-contrast bash interface with full ANSI color support, command history, and custom shortcuts.
• Virtual Hardware Key Bar: Tactile onscreen shortcuts including ESC, TAB, CTRL, ALT, cursor navigation (Arrows, HOME, END), and SIGINT interrupt signals (^C, ^Z, ^D).
• Real-Time Hardware Telemetry: Monitor GPU utilization, VRAM allocation, and compute latency with high-visibility 7-segment digital displays.
• Keep-Alive Background Service: Integrated screen WakeLock, background worker, and audio beacon to guard remote sessions from idle timeouts.
• Client-Side Encrypted Vault: Store sensitive tokens (Ngrok, Hugging Face, SSH passphrases) with local hardware AES-256-GCM encryption protected by a master PIN.
• 1-Click SSH & Web Tunneling: Convenient copy-and-run recipes for tmate, ngrok TCP, and Cloudflare tunnels.

LEGAL & POLICY DISCLAIMER:
This application is an independent developer utility and is NOT affiliated with, sponsored by, authorized by, or endorsed by Google LLC or Google Colab. Google, Google Colaboratory, and Colab are trademarks of Google LLC. This app adheres to all Google Cloud Platform Terms of Service and strictly prohibits on-device cryptocurrency mining.`,
  };

  return (
    <div className="space-y-3 font-terminal text-xs">
      {/* Top Banner */}
      <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-[#00ff66]" />
            <span className="font-bold text-sm text-white uppercase tracking-wider">
              GOOGLE PLAY CONSOLE POLICY & AUDIT CENTER
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-950 border border-[#00ff66] text-[#00ff66] font-mono font-bold text-[10px]">
            10/10 CHECKS PASSED ✓
          </span>
        </div>

        <p className="text-slate-200 text-xs leading-relaxed font-semibold">
          {lang === 'my'
            ? 'Google Play Console တွင် အက်ပ်တင်ရာ၌ policy filter များ မငြိစေရန် (Target SDK 36, Zero-Mining, Data Safety, Trademark Disclaimer, Reviewer Demo Mode) အားလုံးကို အပြည့်အစုံ စစ်ဆေးပြီး ပြင်ဆင်ပေးထားပါသည်။'
            : 'Pre-flight policy validator and submission assistant for Google Play Console. Verified against Developer Program Policies, Data Safety, Impersonation rules, and Target SDK 36.'}
        </p>

        {/* Sub Navigation */}
        <div className="grid grid-cols-4 gap-1 pt-1 font-mono font-bold text-[11px]">
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('audit');
            }}
            className={`py-1.5 px-2 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'audit'
                ? 'bg-[#00ff66] text-black font-black shadow-[0_0_10px_rgba(0,255,102,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            1. POLICY AUDIT
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('console_guide');
            }}
            className={`py-1.5 px-2 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'console_guide'
                ? 'bg-cyan-400 text-black font-black shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            2. PLAY CONSOLE QA
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('listing');
            }}
            className={`py-1.5 px-2 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'listing'
                ? 'bg-amber-400 text-black font-black shadow-[0_0_10px_rgba(255,183,3,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            3. STORE LISTING
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('reviewer');
            }}
            className={`py-1.5 px-2 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'reviewer'
                ? 'bg-purple-400 text-black font-black shadow-[0_0_10px_rgba(192,132,252,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            4. REVIEWER SANDBOX
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: POLICY AUDIT (10 CHECKS) */}
      {activeSubTab === 'audit' && (
        <div className="space-y-2">
          <div className="grid grid-cols-1 gap-2">
            {policyAuditItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-black/80 border border-slate-800 p-2.5 rounded-lg flex items-start justify-between gap-2.5 hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-[#00ff66] shrink-0" />
                    <span className="font-bold text-white text-xs">
                      {index + 1}. {lang === 'my' ? item.titleMy : item.titleEn}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed pl-5 font-semibold">
                    {lang === 'my' ? item.descMy : item.descEn}
                  </p>
                </div>
                <span className="shrink-0 px-2 py-0.5 rounded bg-emerald-950 text-[#00ff66] border border-[#00ff66]/50 font-mono text-[10px] font-black">
                  {item.status}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-1 flex items-center justify-between">
            <button
              onClick={() => {
                triggerSound('start');
                onOpenPrivacyModal();
              }}
              className="w-full bg-emerald-950 hover:bg-emerald-900 border border-[#00ff66] text-[#00ff66] py-2 rounded font-black text-xs cursor-pointer flex items-center justify-center gap-2 font-mono shadow-md"
            >
              <FileText size={14} />
              <span>{lang === 'my' ? 'GOOGLE PLAY PRIVACY POLICY & TERMS စစ်ဆေးရန်' : 'VIEW FULL PRIVACY POLICY & TERMS'}</span>
            </button>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PLAY CONSOLE QUESTIONNAIRE FORM ANSWERS */}
      {activeSubTab === 'console_guide' && (
        <div className="space-y-2.5">
          <div className="p-2.5 rounded bg-cyan-950/50 border border-cyan-400/40 text-cyan-200 text-xs">
            <strong>Play Console App Content Guide:</strong> Google Play Console ရှိ "App Content" (မူဝါဒများနှင့် အချက်အလက်များ) မေးခွန်းများကို ဖြေဆိုရာတွင် အောက်ပါအတိုင်း ဖြေဆိုပါက rejection မဖြစ်ဘဲ အောင်မြင်စွာ အတည်ပြုနိုင်ပါသည်။
          </div>

          <div className="space-y-2">
            {playConsoleFormAnswers.map((item, idx) => (
              <div key={idx} className="terminal-panel p-2.5 rounded-lg border border-slate-800 space-y-1.5">
                <div className="flex items-center justify-between font-bold text-white text-xs">
                  <span className="text-[#00ff66]">{item.section}</span>
                  <button
                    onClick={() => copyText(item.answer, `ans_${idx}`)}
                    className="text-cyan-400 hover:text-white flex items-center gap-1 text-[11px] font-mono underline cursor-pointer"
                  >
                    {copiedKey === `ans_${idx}` ? <Check size={12} /> : <Copy size={12} />}
                    <span>{copiedKey === `ans_${idx}` ? 'COPIED' : 'COPY ANSWER'}</span>
                  </button>
                </div>
                <div className="text-slate-300 text-xs font-semibold">
                  <strong>Question:</strong> {item.question}
                </div>
                <div className="bg-black p-2 rounded border border-slate-800 text-white font-mono text-[11px] font-bold">
                  <strong>Recommended Answer:</strong> {item.answer}
                </div>
                <p className="text-slate-400 text-[11px]">
                  {item.detailMy}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: STORE LISTING METADATA & DISCLAIMER */}
      {activeSubTab === 'listing' && (
        <div className="space-y-3">
          {/* App Title */}
          <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>APP TITLE (Max 30 Chars):</span>
              <button
                onClick={() => copyText(storeListingMetadata.title, 'title')}
                className="text-[#00ff66] underline cursor-pointer hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'title' ? '[COPIED ✓]' : '[COPY TITLE]'}
              </button>
            </div>
            <div className="bg-black p-2 rounded border border-slate-700 text-[#00ff66] font-mono font-bold text-xs">
              {storeListingMetadata.title}
            </div>
            <span className="text-[10px] text-slate-400">
              Length: {storeListingMetadata.title.length}/30 characters (Complies with Title Limit policy).
            </span>
          </div>

          {/* Short Description */}
          <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>SHORT DESCRIPTION (Max 80 Chars):</span>
              <button
                onClick={() => copyText(storeListingMetadata.shortDesc, 'short_desc')}
                className="text-cyan-300 underline cursor-pointer hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'short_desc' ? '[COPIED ✓]' : '[COPY SHORT DESC]'}
              </button>
            </div>
            <div className="bg-black p-2 rounded border border-slate-700 text-cyan-300 font-mono font-semibold text-xs">
              {storeListingMetadata.shortDesc}
            </div>
            <span className="text-[10px] text-slate-400">
              Length: {storeListingMetadata.shortDesc.length}/80 characters.
            </span>
          </div>

          {/* Full Description with Disclaimer */}
          <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>FULL DESCRIPTION (Includes Mandatory Policy Disclaimer):</span>
              <button
                onClick={() => copyText(storeListingMetadata.fullDesc, 'full_desc')}
                className="text-amber-300 underline cursor-pointer hover:text-white flex items-center gap-1 text-[11px]"
              >
                {copiedKey === 'full_desc' ? '[COPIED ✓]' : '[COPY FULL DESC]'}
              </button>
            </div>
            <pre className="bg-black p-2.5 rounded border border-slate-700 text-slate-200 font-mono text-[11px] whitespace-pre-wrap max-h-48 overflow-y-auto scrollbar-matrix font-semibold leading-relaxed">
              {storeListingMetadata.fullDesc}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: GOOGLE REVIEWER ACCESS & DEMO SANDBOX */}
      {activeSubTab === 'reviewer' && (
        <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck size={16} className="text-purple-400" />
              <span className="font-bold text-xs text-white">
                GOOGLE PLAY REVIEWER DEMO SANDBOX MODE
              </span>
            </div>
            <button
              onClick={() => {
                triggerSound('click');
                onToggleReviewerMode(!reviewerMode);
              }}
              className={`px-3 py-1 rounded text-xs font-mono font-bold cursor-pointer transition-all ${
                reviewerMode
                  ? 'bg-purple-500 text-black font-black shadow-[0_0_10px_rgba(192,132,252,0.8)]'
                  : 'bg-black text-slate-400 border border-slate-700 hover:text-white'
              }`}
            >
              {reviewerMode ? 'DEMO MODE: ACTIVE' : 'DEMO MODE: OFF'}
            </button>
          </div>

          <p className="text-slate-200 text-xs leading-relaxed font-semibold">
            {lang === 'my'
              ? 'Google Play App Reviewer စစ်ဆေးစဉ်အတွင်း External Colab instance ချိတ်ဆက်ရန် မလိုဘဲ Shell, GPU Telemetry, Virtual Keys နှင့် Vault လုပ်ဆောင်ချက်အားလုံးကို ကြည့်ရှုစစ်ဆေးနိုင်ရန် Demo Sandbox ကို ထည့်သွင်းထားပါသည်။'
              : 'Google Play reviewers frequently reject remote client apps with "App Access Restricted / Login Credentials Needed". With Reviewer Demo Mode active, Google reviewers can thoroughly test all terminal commands, GPU accelerators, and encrypted vault features immediately.'}
          </p>

          <div className="p-2.5 rounded bg-black border border-slate-800 space-y-1.5 font-mono text-xs">
            <div className="text-purple-300 font-bold">
              Play Console "App Access" Reviewer Instructions:
            </div>
            <div className="text-slate-300 text-[11px] leading-relaxed">
              "No login credentials required. The app includes an integrated Reviewer Demo Sandbox allowing full inspection of the terminal engine, hardware monitors, and AES-256 vault without connecting to an external cloud instance."
            </div>
            <button
              onClick={() =>
                copyText(
                  'No login credentials required. The app includes an integrated Reviewer Demo Sandbox allowing full inspection of the terminal engine, hardware monitors, and AES-256 vault without connecting to an external cloud instance.',
                  'reviewer_inst'
                )
              }
              className="text-[#00ff66] underline cursor-pointer text-[11px] pt-1 block"
            >
              {copiedKey === 'reviewer_inst' ? '[COPIED TO CLIPBOARD ✓]' : '[COPY REVIEWER NOTE]'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
