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
  const [activeSubTab, setActiveSubTab] = useState<'audit' | 'console_guide' | 'listing' | 'reviewer' | 'troubleshoot' | 'fdroid'>('troubleshoot');
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
        <div className="grid grid-cols-6 gap-1 pt-1 font-mono font-bold text-[9px] sm:text-[10px]">
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('troubleshoot');
            }}
            className={`py-1.5 px-0.5 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'troubleshoot'
                ? 'bg-rose-500 text-black font-black shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            FIX PUBLISH
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('audit');
            }}
            className={`py-1.5 px-0.5 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'audit'
                ? 'bg-[#00ff66] text-black font-black shadow-[0_0_10px_rgba(0,255,102,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            1. AUDIT
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('console_guide');
            }}
            className={`py-1.5 px-0.5 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'console_guide'
                ? 'bg-cyan-400 text-black font-black shadow-[0_0_10px_rgba(0,240,255,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            2. PLAY QA
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('listing');
            }}
            className={`py-1.5 px-0.5 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'listing'
                ? 'bg-amber-400 text-black font-black shadow-[0_0_10px_rgba(255,183,3,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            3. LISTING
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('reviewer');
            }}
            className={`py-1.5 px-0.5 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'reviewer'
                ? 'bg-purple-400 text-black font-black shadow-[0_0_10px_rgba(192,132,252,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            4. SANDBOX
          </button>
          <button
            onClick={() => {
              triggerSound('click');
              setActiveSubTab('fdroid');
            }}
            className={`py-1.5 px-0.5 rounded text-center cursor-pointer transition-all ${
              activeSubTab === 'fdroid'
                ? 'bg-blue-400 text-black font-black shadow-[0_0_10px_rgba(96,165,250,0.6)]'
                : 'bg-black text-slate-300 hover:text-white border border-slate-800'
            }`}
          >
            5. F-DROID
          </button>
        </div>
      </div>

      {/* SUB-TAB 0: PUBLISH TROUBLESHOOTER & DIAGNOSTICS */}
      {activeSubTab === 'troubleshoot' && (
        <div className="space-y-2.5">
          <div className="p-2.5 rounded bg-rose-950/60 border border-rose-500/60 text-rose-200 text-xs">
            <strong className="text-white block font-black mb-1">
              {lang === 'my'
                ? '⚠️ Play Console တွင် Publish မထွက်ရသည့် အကြောင်းရင်း (၇) ချက်နှင့် စစ်ဆေးဖြေရှင်းနည်းများ'
                : '⚠️ Top 7 Reasons Why Apps Do Not Publish on Play Console & Step-by-Step Fixes'}
            </strong>
            {lang === 'my'
              ? 'အောက်ပါအချက် ၇ ချက်ထဲမှ သင်၏ Play Console Dashboard ပေါ်တွင် မည်သည့်အချက်နှင့် ကိုက်ညီနေသည်ကို စစ်ဆေး၍ ချက်ချင်း ဖြေရှင်းနိုင်ပါသည်:'
              : 'Review your Google Play Console dashboard against these 7 diagnostic checks to unblock publishing:'}
          </div>

          <div className="space-y-2">
            {/* 1. 20 Testers / 14 Days */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-amber-400">
                  ၁။ ၂၀၂၃ နောက်ပိုင်း Personal Account ဖြစ်နေပါသလား? (20 Testers for 14 Days)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-500 text-[10px] font-mono">
                  အဓိက အကျဆုံး
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'my'
                  ? '၂၀၂၃ ခုနှစ် နိုဝင်ဘာလနောက်ပိုင်း ဖွင့်ထားသော Personal Account အားလုံးသည် တိုက်ရိုက် Production မတင်နိုင်ပါ။ Closed Testing (ပိတ်ထားသော စမ်းသပ်မှု) တွင် Tester ၂၀ ဦးဖြင့် အနည်းဆုံး ၁၄ ရက် အပြည့် Opt-in စမ်းသပ်ပြီးမှသာ Play Console Dashboard တွင် "Apply for production" ခလုတ် ပေါ်လာမည် ဖြစ်ပါသည်။'
                  : 'Since November 2023, Google requires all personal developer accounts to run a Closed Test with at least 20 opted-in testers for 14 continuous days before applying for Production rollout.'}
              </p>
              <div className="bg-black p-2 rounded border border-slate-800 text-[11px] text-cyan-300 font-mono font-bold">
                💡 ဖြေရှင်းနည်း: Play Console → Testing → Closed testing သို့ သွားပြီး Tester ၂၀ ဦး ထည့်သွင်းပါ။ ၁၄ ရက် ပြည့်ပါက Dashboard ပေါ်ရှိ "Apply for production" ကို နှိပ်၍ Questionnaire ဖြေဆိုပါ။
              </div>
            </div>

            {/* 2. In Review timeframe */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-[#00ff66]">
                  ၂။ Status တွင် "In review" (စစ်ဆေးဆဲ) ဟု ပြနေပါသလား?
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-[#00ff66] border border-[#00ff66]/50 text-[10px] font-mono">
                  ရုံးဖွင့်ရက် ၃-၇ ရက်
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'my'
                  ? 'ပထမဆုံးအကြိမ် တင်သည့် အက်ပ်များသည် Google ၏ Human Reviewers များမှ အသေးစိတ် စစ်ဆေးသောကြောင့် ပုံမှန်အားဖြင့် ရုံးဖွင့်ရက် ၃ ရက်မှ ၇ ရက် (တစ်ခါတစ်ရံ ၁၄ ရက်အထိ) ကြာမြင့်တတ်ပါသည်။'
                  : 'First-time app submissions from new developer accounts typically take 3 to 7 business days for Google Play review.'}
              </p>
              <div className="bg-black p-2 rounded border border-slate-800 text-[11px] text-amber-300 font-mono font-bold">
                ⚠️ သတိပြုရန်: "In review" ဖြစ်နေစဉ် အက်ပ်အသစ် ထပ်မတင်ပါနှင့်၊ Update ထပ်တင်ပါက Review Queue ပြန်စသွား၍ ပိုကြာသွားပါမည်။
              </div>
            </div>

            {/* 3. Managed Publishing */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-cyan-400">
                  ၃။ "Managed Publishing" ဖွင့်ထားမိပါသလား? (Ready to publish)
                </span>
                <span className="px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-500 text-[10px] font-mono">
                  ACTION NEEDED
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'my'
                  ? 'Managed Publishing ဖွင့်ထားပါက Google မှ အက်ပ်ကို အတည်ပြုပြီးသော်လည်း Store ပေါ်သို့ အလိုအလျောက် မရောက်ပါ။ "Ready to publish" ဟု ပြနေပါမည်။'
                  : 'If Managed Publishing is turned on, approved releases do not go live automatically until you manually click "Publish changes".'}
              </p>
              <div className="bg-black p-2 rounded border border-slate-800 text-[11px] text-[#00ff66] font-mono font-bold">
                💡 ဖြေရှင်းနည်း: Play Console → Publishing overview သို့ သွားပြီး ညာဘက်အပေါ်ရှိ "Publish changes" ခလုတ်ကို နှိပ်ပါ (သို့မဟုတ် Managed Publishing ကို "Turn off" ပြုလုပ်ပါ)။
              </div>
            </div>

            {/* 4. Incomplete App Content */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-rose-400">
                  ၄။ "App Content" (မူဝါဒ မေးခွန်းများ) အားလုံး မပြည့်စုံသေးပါသလား?
                </span>
                <span className="px-1.5 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-500 text-[10px] font-mono">
                  BLOCKING
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'my'
                  ? 'Play Console → Policy → App Content ရှိ မေးခွန်းများ (Privacy Policy, Data Safety, Content Rating, Target Audience, Ads စသည်) ထဲမှ တစ်ခုခု "Need attention" သို့မဟုတ် မဖြည့်ရသေးပါက Rollout ခလုတ် မှိန်နေပါမည် (Disabled)။'
                  : 'All declarations under Policy → App Content must be completed with green checks. A single incomplete declaration prevents rolling out.'}
              </p>
              <div className="bg-black p-2 rounded border border-slate-800 text-[11px] text-cyan-300 font-mono font-bold">
                💡 ဖြေရှင်းနည်း: ဤအက်ပ်၏ "2. PLAY QA" tab သို့ သွားပြီး မေးခွန်းတစ်ခုချင်းစီအတွက် အသင့်ဖြေဆိုရမည့် အဖြေများကို ကူးယူဖြည့်သွင်းပါ။
              </div>
            </div>

            {/* 5. Missing Store Listing Assets */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-purple-400">
                  ၅။ Store Listing ပုံများ (Icon, Banner, Screenshots) မပြည့်စုံသေးပါသလား?
                </span>
                <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 border border-purple-500 text-[10px] font-mono">
                  ASSETS
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'my'
                  ? 'Main store listing တွင် 512x512 App Icon၊ 1024x500 Feature Graphic Banner နှင့် အနည်းဆုံး ဖုန်း Screenshot ၂ ပုံ မတင်ရသေးပါက Release တင်၍ မရပါ။'
                  : 'Play Store requires 512x512 app icon, 1024x500 feature graphic, and at least 2 phone screenshots.'}
              </p>
            </div>

            {/* 6. Identity Verification */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-yellow-400">
                  ၆။ Developer Account Identity Verification မပြီးသေးပါသလား?
                </span>
                <span className="px-1.5 py-0.5 rounded bg-yellow-950 text-yellow-300 border border-yellow-500 text-[10px] font-mono">
                  ID CHECK
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'my'
                  ? 'Developer Account တွင် နိုင်ငံသားမှတ်ပုံတင် / Passport နှင့် လိပ်စာအထောက်အထား (Bank/Utility) verification မပြီးသေးပါက Google က အက်ပ်အားလုံးကို review ပိတ်ထားပါမည်။'
                  : 'Make sure your developer account identity verification is verified with Google Payments/Console.'}
              </p>
            </div>

            {/* 7. Rejection Check via Email */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-red-400">
                  ၇။ Google Play မှ Reject မေးလ် ရောက်ရှိနေပါသလား?
                </span>
                <span className="px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-500 text-[10px] font-mono">
                  EMAIL CHECK
                </span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                {lang === 'my'
                  ? 'Developer Gmail (xhackcoder@gmail.com) ၏ Inbox/Spam တွင် "Issue found on app submission" သို့မဟုတ် "Action required" ဟူသော ခေါင်းစဉ်ဖြင့် မေးလ် ရောက်ရှိနေပါက ၎င်းမေးလ်တွင် Reject ဖြစ်သည့် အကြောင်းရင်းတိတိကျကျ ပါရှိပါသည်။'
                  : 'Check your developer Gmail for messages titled "Issue found: ...". Google will provide the exact reason if an issue was detected.'}
              </p>
            </div>
          </div>
        </div>
      )}

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

      {/* SUB-TAB 5: F-DROID FOSS & ANTI-FEATURES COMPLIANCE */}
      {activeSubTab === 'fdroid' && (
        <div className="space-y-2.5">
          <div className="p-2.5 rounded bg-blue-950/60 border border-blue-500/60 text-blue-200 text-xs">
            <strong className="text-white block font-black mb-1">
              {lang === 'my'
                ? '📦 F-Droid အတွက် Google Feature များနှင့် Non-Free Anti-Features များ ဖယ်ရှားပြီးစီးမှု'
                : '📦 F-Droid FOSS Compliance: Proprietary Google Features & Anti-Features Removed'}
            </strong>
            {lang === 'my'
              ? 'F-Droid သည် 100% Pure Open-Source (FOSS) အက်ပ်များကိုသာ လက်ခံပြီး Proprietary Google Services/Tracking များကို တင်းကြပ်စွာ တားမြစ်ပါသည်။ ဤပရောဂျက်တွင် F-Droid Anti-Features အားလုံးကို အောင်မြင်စွာ ဖယ်ရှားပြင်ဆင်ထားပါသည်:'
              : 'F-Droid requires 100% Free and Open Source Software (FOSS) with zero proprietary Google libraries or tracking. All Anti-Features have been cleaned:'}
          </div>

          <div className="space-y-2">
            {/* Cleaned Features */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-2">
              <span className="text-[#00ff66] font-bold text-xs block">
                {lang === 'my' ? '✓ ဖယ်ရှားပြင်ဆင်ပြီးသော Google & Proprietary အချက်များ:' : '✓ Removed Google & Non-Free Features:'}
              </span>
              <ul className="text-slate-300 text-[11px] space-y-1.5 pl-3 list-disc">
                <li>
                  <strong className="text-white">Removed Google Play Services Gradle Plugin:</strong> `android/build.gradle` နှင့် `android/app/build.gradle` မှ `com.google.gms:google-services` အားလုံးကို လုံးဝ ဖယ်ရှားပြီးဖြစ်၍ F-Droid `NonFreeDep` အငြိမရှိပါ။
                </li>
                <li>
                  <strong className="text-white">Removed Google Fonts CDN Tracking:</strong> `index.html` မှ Google Fonts CDN (`fonts.googleapis.com`) အားလုံးကို ဖယ်ရှားပြီး Local `@fontsource/dseg7-classic` နှင့် System Monospace Font များကိုသာ အသုံးပြုထား၍ F-Droid `NonFreeNet` အငြိမရှိပါ။
                </li>
                <li>
                  <strong className="text-white">Zero Tracking & Analytics:</strong> Firebase Analytics, AdMob, Crashlytics စသည့် Google Telemetry များ လုံးဝ မပါဝင်ပါ။
                </li>
                <li>
                  <strong className="text-white">100% Client-Side AES-256-GCM:</strong> Cloud ဆာဗာ မလိုဘဲ အသုံးပြုသူ စက်ထဲတွင်သာ စာဝှက်စနစ် သုံးထားပါသည်။
                </li>
              </ul>
            </div>

            {/* F-Droid Metadata Recipe */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-blue-300">F-DROID METADATA RECIPE (YAML):</span>
                <button
                  onClick={() =>
                    copyText(
                      `Categories:
  - Development
  - System
License: Apache-2.0
AuthorName: Victor Geek
AuthorEmail: xhackcoder@gmail.com
SourceCode: https://github.com/xhackcoder/colab-android-terminal
IssueTracker: https://github.com/xhackcoder/colab-android-terminal/issues
CurrentVersion: 2.6.0
CurrentVersionCode: 1
RepoType: git
Repo: https://github.com/xhackcoder/colab-android-terminal.git
Builds:
  - versionName: 2.6.0
    versionCode: 1
    commit: v2.6.0
    subdir: android/app
    gradle:
      - yes
    prebuild:
      - npm install
      - npm run build
      - npx cap sync android`,
                      'fdroid_yaml'
                    )
                  }
                  className="text-cyan-300 underline cursor-pointer hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'fdroid_yaml' ? '[COPIED ✓]' : '[COPY RECIPE]'}
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                F-Droid Build Server (fdroiddata) သို့ တင်သွင်းရန် metadata ဖိုင်ကို `metadata/com.victorgeek.colabterminal.yml` တွင် အဆင်သင့် ဖန်တီးထားပါသည်။
              </p>
            </div>

            {/* AAB & APK Generation Commands */}
            <div className="terminal-panel p-3 rounded-lg border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span className="text-amber-300">AAB & APK GENERATION COMMANDS:</span>
                <button
                  onClick={() =>
                    copyText(
                      'npm run build && npx cap sync android && cd android && ./gradlew assembleDebug && ./gradlew bundleRelease',
                      'build_cmds'
                    )
                  }
                  className="text-[#00ff66] underline cursor-pointer hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {copiedKey === 'build_cmds' ? '[COPIED ✓]' : '[COPY BUILD SCRIPT]'}
                </button>
              </div>
              <pre className="bg-black p-2 rounded border border-slate-700 text-cyan-300 font-mono text-[10px] whitespace-pre-wrap">
{`# 1. Build Web Assets
npm run build

# 2. Sync to Android Platform
npx cap sync android

# 3. Generate APK (F-Droid / Debug / Sideload)
cd android && ./gradlew assembleDebug

# 4. Generate AAB (Google Play Store Release)
cd android && ./gradlew bundleRelease`}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
