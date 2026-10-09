# 📱 Colab Android Terminal v2.6 Pro
> **Developed by Victor Geek** (`xhackcoder@gmail.com`)  
> *High-performance Colab Controller & Mobile Terminal Client with Real-time Telemetry, Hardware Keys, AES-256 Vault, and Google Play Console Compliance.*

---

## 🌐 Language Selection / ဘာသာစကား ရွေးချယ်ရန်

* **[🇲🇲 မြန်မာဘာသာ (Myanmar Version)](#-မြန်မာဘာသာ-myanmar-version)**
* **[🇬🇧 English Version](#-english-version)**

---

<details open>
<summary><h2>🇲🇲 မြန်မာဘာသာ (Myanmar Version)</h2></summary>

### 📖 စီမံကိန်း အကျဉ်းချုပ် (Overview)
**Colab Android Terminal** သည် Android စမတ်ဖုန်းများပေါ်မှနေ၍ Google Colab၊ Cloud GPU Server များနှင့် Remote Linux VM များကို အဆင်ပြေချောမွေ့စွာ ထိန်းချုပ်မောင်းနှင်နိုင်စေရန် ဖန်တီးထားသော High-Performance Mobile Terminal & Controller Client တစ်ခု ဖြစ်ပါသည်။

ဖုန်း browser တွင် Colab သုံးစွဲရာ၌ အချိန် ၁၀ မိနစ်ခန့် အသုံးမပြုဘဲ ထားပါက Runtime ပြတ်တောက်သွားခြင်း (Idle Timeout)၊ ဖုန်း Touchscreen ပေါ်တွင် Terminal ရိုက်ရခက်ခဲခြင်း၊ လျှို့ဝှက် Token များကို မလုံခြုံစွာ သိမ်းဆည်းရခြင်း စသည့် ပြဿနာများကို ပြီးပြည့်စုံစွာ ဖြေရှင်းပေးထားပါသည်။

---

### ✨ အဓိက အင်္ဂါရပ်များ (Key Features)

1. **Keep-Alive Background Daemon စနစ်**
   - **Screen WakeLock API:** ဖုန်း screen ပိတ်မသွားစေရန် ထိန်းသိမ်းပေးခြင်း။
   - **Background Web Worker:** Browser background ရောက်သွားသော်လည်း အလုပ်လုပ်နေသော သီးသန့် Heartbeat Thread။
   - **Audio Beacon Pulse:** Android OS မှ process ကို အိပ်မပျော်သွားစေရန် 18Hz Sub-bass beacon ဖြင့် အသက်သွင်းပေးထားခြင်း။
   - ၁၀ မိနစ် Colab Idle Timeout ကြောင့် Runtime Disconnect ဖြစ်ခြင်းမှ အပြည့်အဝ ကာကွယ်ပေးပါသည်။

2. **Interactive Bash Terminal Engine**
   - အစစ်အမှန် Bash 5.2 Matrix ပုံစံဖြင့် `nvidia-smi`၊ `python3`၊ `torch-test`၊ `pip`၊ `tmate`၊ `ngrok`၊ `cloudflared` စသည့် Colab & AI commands များကို တိုက်ရိုက် run နိုင်ခြင်း။
   - ANSI color formatting၊ Command History log (▲ UP / ▼ DOWN)၊ Auto-complete (TAB)။
   - Log အားလုံး သို့မဟုတ် တစ်ကြောင်းချင်းစီကို 1-Click Copy ကူးယူနိုင်ခြင်းနှင့် လျင်မြန်သော Paste ခလုတ်။

3. **Virtual Hardware Key Bar (Termux Extra Keys)**
   - Android touchscreen ပေါ်တွင် Terminal ရိုက်ရာ၌ အရေးပါသော tactile keys များဖြစ်သည့် `ESC`, `TAB`, `CTRL`, `ALT`, `Home`, `End`, `Arrow Keys (◀ ▶)` ပါဝင်ခြင်း။
   - Process ရပ်တန့်ရန် `^C` (SIGINT), ဆိုင်းငံ့ရန် `^Z` (SIGTSTP), အဆုံးသတ်ရန် `^D` (EOF) အချက်ပြခလုတ်များ ပါဝင်ခြင်း။

4. **Hardware Secure Storage (AES-256-GCM Vault)**
   - Ngrok Token, Hugging Face Token, GitHub PAT, SSH Passphrase များကို Device ပေါ်တွင်သာ Web Crypto **AES-256-GCM** (PBKDF2 100,000 iterations) ဖြင့် စာဝှက်သိမ်းဆည်းပေးခြင်း။
   - Master PIN ဖြင့်သာ ဖွင့်နိုင်ပြီး ၅ မိနစ်အတွင်း အလိုအလျောက် ပြန်ပိတ်ခြင်း (Auto-Lock)။
   - အချက်အလက်အားလုံးကို ချက်ချင်းရှင်းထုတ်နိုင်သော **WIPE** ခလုတ် ပါဝင်ခြင်း။

5. **Android SSH Remote Tunnel Suite**
   - **tmate:** အကောင့်ဖွင့်ရန်မလိုဘဲ ချက်ချင်း Web & SSH Terminal Link ရရှိစေသော ၁ ဆင့်နည်းလမ်း။
   - **ngrok TCP Port 22:** Port 22 ကို Forward လုပ်ပြီး Termux သို့မဟုတ် JuiceSSH မှ တိုက်ရိုက်ချိတ်ဆက်နိုင်ခြင်း။
   - **Cloudflare Zero Trust:** အကန့်အသတ်မရှိ အခမဲ့ HTTPS & SSH Tunnel တည်ဆောက်ခြင်း။

6. **Google Play Console Policy & Audit Center (`6:POLICY` Tab)**
   - Play Store Console သို့ အက်ပ်တင်ရာတွင် Policy Filter များ မငြိစွန်းစေရန် စစ်ဆေးချက် ၁၀ ချက်ကို App အတွင်း ထည့်သွင်းပေးထားခြင်း။
   - Data Safety မေးခွန်းများ၊ Target Audience (13+)၊ Ads (No) စသည့် Console မေးခွန်းများ၏ တိကျသော အဖြေလမ်းညွှန် ပါဝင်ခြင်း။
   - Google Review Team များ အလွယ်တကူ စစ်ဆေးအတည်ပြုနိုင်မည့် **Reviewer Demo Sandbox Mode** ပါဝင်ခြင်း။

---

### 🛡️ Google Play Store Policy စစ်ဆေးပြင်ဆင်ချက်များ

| Policy ခေါင်းစဉ် | အခြေအနေ | အသေးစိတ် ပြင်ဆင်ချက် |
|---|---|---|
| **Target API Level** | **PASS** | Google Play ၏ နောက်ဆုံးသတ်မှတ်ချက်နှင့် ကိုက်ညီသော `targetSdkVersion = 36` (Android 15+) သတ်မှတ်ထားခြင်း။ |
| **Permissions Minimization** | **PASS** | Sensitive/Dangerous permissions (Storage/Camera/Location) လုံးဝမပါဘဲ `INTERNET` နှင့် `WAKE_LOCK` သာ ကန့်သတ်ထားခြင်း။ |
| **Network Security Config** | **PASS** | `network_security_config.xml` ဖြင့် Localhost (7681/5000) ကိုသာ ခြွင်းချက်ထားပြီး ပြင်ပဆက်သွယ်မှုအားလုံး HTTPS/TLS သာ သုံးထားခြင်း။ |
| **Trademark & Impersonation** | **PASS** | Google LLC / Google Colab နှင့် တိုက်ရိုက်ပတ်သက်မှုမရှိကြောင်း ရှင်းလင်းသော Legal Disclaimer ထည့်သွင်းထားခြင်း။ |
| **Zero Cryptomining Policy** | **PASS** | စက်ပစ္စည်းပေါ်တွင် Cryptomining လုံးဝ မပြုလုပ်ရန်နှင့် Google Cloud AUP ကို တိကျစွာလိုက်နာကြောင်း အာမခံထားခြင်း။ |
| **Data Safety & Privacy** | **PASS** | User Data စုဆောင်း/မျှဝေခြင်း မရှိခြင်း။ Token များကို ဖုန်းထဲတွင်သာ Local AES-256 ဖြင့် စာဝှက်သိမ်းဆည်းထားခြင်း။ |

---

### 🚀 စတင်အသုံးပြုခြင်းနှင့် Run နည်းလမ်းများ (Getting Started)

#### လိုအပ်ချက်များ (Prerequisites)
- **Node.js:** v18 သို့မဟုတ် v20+
- **NPM** သို့မဟုတ် **Bun**
- **Android Studio** (Android APK/AAB build ရန်အတွက်)
- **Java JDK:** 17 သို့မဟုတ် 21

#### ၁။ အက်ပ်အား Local စက်တွင် Run ရန်
```bash
# Dependencies သွင်းယူခြင်း
npm install

# Local Dev Server စတင်ခြင်း (Port 3000)
npm run dev
```
Browser တွင် `http://localhost:3000` သို့ ဝင်ရောက်ကြည့်ရှုနိုင်ပါသည်။

#### ၂။ Production Build ပြုလုပ်ခြင်း
```bash
npm run build
```

#### ၃။ Android APK နှင့် Play Store AAB ထုတ်ယူခြင်း
```bash
# Capacitor platform အား sync ပြုလုပ်ခြင်း
npx cap sync android

# Android project directory ထဲသို့ ဝင်ရောက်ခြင်း
cd android

# Debug APK ထုတ်ယူခြင်း
./gradlew assembleDebug

# Google Play Store တင်ရန် Release AAB (Android App Bundle) ထုတ်ယူခြင်း
./gradlew bundleRelease
```
Output ဖိုင်တည်နေရာ:
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Play Store AAB: `android/app/build/outputs/bundle/release/app-release.aab`

#### ၄။ GitHub Actions ဖြင့် အလိုအလျောက် Build ပြုလုပ်ခြင်း
`.github/workflows/build-apk.yml` တွင် GitHub Actions CI/CD စီစဉ်ထားပြီး ဖြစ်သောကြောင့် GitHub Repository သို့ push လုပ်လိုက်ရုံဖြင့် APK & AAB ကို Releases/Artifacts ကဏ္ဍတွင် အလိုအလျောက် Download ရယူနိုင်ပါသည်။

---

### 📝 Google Play Console တွင် ဖြေဆိုရမည့် အဖြေများ (App Content QA)

Google Play Console > **Policy > App Content** တွင် အောက်ပါအတိုင်း ရွေးချယ်ပါ -

1. **App Access:** "All functionality is available without special access restrictions"
2. **Ads:** "No, my app does not contain ads"
3. **Target Audience:** "13 years and older" (Could appeal to children: **No**)
4. **News Apps:** "No"
5. **COVID-19 Contact Tracing:** "No"
6. **Data Safety:**
   - Does your app collect or share any user data? -> **No**
   - Is user data encrypted in transit? -> **Yes**
   - Can users delete their data? -> **Yes** (In-app One-click Wipe)
7. **Government Apps:** "No"
8. **Financial Features:** "No financial features"

</details>

---

<details open>
<summary><h2>🇬🇧 English Version</h2></summary>

### 📖 Project Overview
**Colab Android Terminal v2.6 Pro** is an open-source, high-performance mobile terminal controller engineered for developers, researchers, and AI engineers managing Google Colab sessions, remote GPU accelerators, and cloud Linux instances directly from mobile devices.

It eliminates common mobile cloud issues including the 10-minute idle timeout disconnect, mobile soft-keyboard terminal limitations, and unencrypted API credential storage.

---

### ✨ Key Features

1. **Keep-Alive Background Daemon**
   - **Screen WakeLock API:** Prevents screen timeout during extensive model inference/training.
   - **Background Web Worker:** Dedicated, unthrottled timer thread keeping WebSocket and HTTP sessions alive.
   - **Audio Beacon Pulse:** Emits inaudible sub-bass 18Hz micro-pulses ensuring mobile operating systems do not freeze background runtime processes.
   - Fully guards against the 10-minute idle disconnect on Google Colab.

2. **Interactive Bash Terminal Engine**
   - Realistic Bash 5.2 shell executing `nvidia-smi`, `python3`, `torch-test`, `pip`, `tmate`, `ngrok`, `cloudflared`, `status`, and `policy`.
   - Full ANSI color terminal styling with interactive command history (`UP` / `DOWN`) and `TAB` autocompletion.
   - Fast one-click line copy, bulk copy, and clipboard paste actions.

3. **Virtual Hardware Key Bar (Termux Extra Keys)**
   - Touchscreen-friendly tactile keys: `ESC`, `TAB`, `CTRL`, `ALT`, `HOME`, `END`, and directional navigation arrows.
   - Essential process interruption signals: `^C` (SIGINT Force Stop), `^Z` (SIGTSTP Suspend), and `^D` (EOF).

4. **Hardware Secure Storage (AES-256-GCM Vault)**
   - End-to-end client-side encryption using Web Crypto API (**AES-256-GCM** with PBKDF2 100,000 iterations).
   - Encrypts Ngrok AuthTokens, Hugging Face API keys, GitHub tokens, and SSH passphrases.
   - Ephemeral memory cache with an automatic 5-minute auto-lock timer and permanent one-click **WIPE** functionality.

5. **SSH Remote Tunneling Suite**
   - **tmate:** Zero-setup, instant 1-step web terminal and SSH address generation.
   - **ngrok TCP Tunnel:** Port 22 SSH forwarding for direct connection from Termux or JuiceSSH.
   - **Cloudflare Zero Trust:** Unlimited high-speed HTTPS & SSH edge tunnels.

6. **Google Play Console Policy & Audit Center (`6:POLICY` Tab)**
   - In-app 10-point policy scanner verifying Target SDK 36, Zero-Mining compliance, Data Safety declarations, and Non-Affiliation disclaimers.
   - Step-by-step questionnaire cheat sheet for the Play Console App Content dashboard.
   - Built-in **Reviewer Demo Sandbox Mode** for frictionless Google Play app reviewer evaluation.

---

### 🛡️ Google Play Console Policy Compliance Matrix

| Policy Dimension | Status | Verification & Resolution Details |
|---|---|---|
| **Target API Level** | **PASS** | Set to `targetSdkVersion = 36` (Android 15+), surpassing Google Play minimum of SDK 34+. |
| **Permissions Minimization** | **PASS** | Restricted to safe normal permissions (`INTERNET`, `WAKE_LOCK`, `ACCESS_NETWORK_STATE`). No sensitive runtime permissions requested. |
| **Network Security Config** | **PASS** | Uses `network_security_config.xml` to restrict cleartext HTTP strictly to localhost (`127.0.0.1:7681`, `localhost:5000`) while enforcing TLS for external endpoints. |
| **Trademark & Impersonation** | **PASS** | Includes prominent legal disclaimer: *"Independent developer utility not affiliated with, sponsored by, or endorsed by Google LLC or Google Colab."* |
| **Cryptomining Policy** | **PASS** | Zero on-device cryptocurrency mining. Strictly complies with Google Play policies and Google Cloud Platform Acceptable Use Policy. |
| **Data Safety & Privacy** | **PASS** | Zero personal data collection. Ephemeral secrets encrypted on-device via AES-256-GCM with instant user deletion support. |

---

### 🚀 Getting Started & Build Instructions

#### Prerequisites
- **Node.js:** v18 or v20+
- **NPM** or **Bun**
- **Android Studio** (for building Android packages)
- **Java JDK:** 17 or 21

#### 1. Running Locally
```bash
# Install dependencies
npm install

# Start local Vite development server on port 3000
npm run dev
```
Open `http://localhost:3000` in your web browser.

#### 2. Building Web Application
```bash
npm run build
```

#### 3. Building Android APK & Play Store AAB Bundle
```bash
# Synchronize web assets to Capacitor Android project
npx cap sync android

# Navigate to the Android project directory
cd android

# Build Debug APK
./gradlew assembleDebug

# Build Production AAB (Android App Bundle) for Google Play Console
./gradlew bundleRelease
```
Build Output Locations:
- Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
- Release AAB: `android/app/build/outputs/bundle/release/app-release.aab`

#### 4. Automated CI/CD (GitHub Actions)
The repository includes `.github/workflows/build-apk.yml`. Pushing to your repository or releasing a tag triggers an automated build that generates both the APK and Google Play AAB bundle as downloadable artifacts.

---

### 📝 Google Play Console App Content Answers

When completing the **App Content** declarations in the Google Play Console, use these recommended answers:

1. **App Access:** Select *"All functionality is available without special access restrictions"*.
2. **Ads:** Select *"No, my app does not contain ads"*.
3. **Target Audience:** Select *"13 years and older"*. Select *"No"* for "Could your store listing appeal to children?".
4. **News Apps:** Select *"No"*.
5. **COVID-19 Contact Tracing:** Select *"My app is not a COVID-19 app"*.
6. **Data Safety Section:**
   - Does your app collect or share any user data? -> **No**
   - Is data encrypted in transit? -> **Yes**
   - Do you provide a way for users to request data deletion? -> **Yes** (Via the in-app "WIPE" button).
7. **Government Apps:** Select *"No"*.
8. **Financial Features:** Select *"No financial features"*.

---

### ⚖️ Legal Disclaimer
*Colab Android Terminal is an independent developer client and is **NOT** affiliated with, authorized, maintained, sponsored, or endorsed by Google LLC, Google Colab, or Alphabet Inc. All trademarks (including Google, Google Colaboratory, and Colab) belong to their respective trademark holders.*

---

### 📬 Contact & Support
- **Developer:** Victor Geek
- **Email:** `xhackcoder@gmail.com`
- **Application ID:** `com.victorgeek.colabterminal`
- **Version:** v2.6 Pro

</details>
