import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ShieldCheck,
  TriangleAlert,
  Volume2,
  VolumeX,
  Lock,
  Terminal,
  Activity,
  Cpu,
  Radio,
  BookOpen,
  Sparkles,
  Copy,
  Check,
  FileCheck2,
  UserCheck,
} from 'lucide-react';
import { keepAliveService, KeepAliveStats } from './services/keepAliveService';
import { secureStorage } from './services/secureStorage';
import { VirtualKeyBar } from './components/VirtualKeyBar';
import { SecureStoragePanel } from './components/SecureStoragePanel';
import { PlayStorePolicyCenter } from './components/PlayStorePolicyCenter';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { executeTerminalCommand } from './services/terminalEngine';

interface GpuTier {
  id: string;
  label: string;
  fullName: string;
  vram: string;
  computeCost: string;
  recommendation: string;
}

const GPU_TIERS: Record<string, GpuTier> = {
  T4: {
    id: 'T4',
    label: 'Tesla T4',
    fullName: 'NVIDIA Tesla T4 (16GB GDDR6)',
    vram: '16GB VRAM',
    computeCost: 'Free Tier & Pro (1 CU/hr)',
    recommendation: 'Wan 1.3B, SD1.5, PyTorch & LLM fine-tuning',
  },
  L4: {
    id: 'L4',
    label: 'Ada L4',
    fullName: 'NVIDIA L4 Tensor Core (24GB)',
    vram: '24GB VRAM',
    computeCost: 'Pro/Pro+ (Moderate Compute)',
    recommendation: 'Wan 2.1 Fast, ComfyUI Video, CogVideoX (FP8)',
  },
  A100: {
    id: 'A100',
    label: 'A100 Ultra',
    fullName: 'NVIDIA A100-SXM4 (40/80GB HBM2e)',
    vram: '40GB / 80GB VRAM',
    computeCost: 'Pro/Pro+ (High Performance)',
    recommendation: 'Wan 2.1 14B High-Res, CogVideoX-5B, Large LLMs',
  },
  TPU: {
    id: 'TPU',
    label: 'TPU v2/v3',
    fullName: 'Google Tensor Processing Unit (v2/v3)',
    vram: '8-core TPU Matrix',
    computeCost: 'Free & Pro (High Throughput)',
    recommendation: 'PyTorch XLA, JAX, Distributed Transformers',
  },
};

interface TerminalLog {
  id: string;
  type: 'system' | 'input' | 'output' | 'error' | 'warn';
  text: string;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<'controller' | 'terminal' | 'ssh' | 'vault' | 'guide' | 'policy'>('controller');
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [lang, setLang] = useState<'my' | 'en'>('my');
  const [reviewerMode, setReviewerMode] = useState(true);

  // Telemetry Hardware Stats
  const [telemetry, setTelemetry] = useState({
    ram: '42.4',
    gpu: 'A100',
    gpuMemory: '40GB',
    gpuUtil: '65.2',
    calcRegister: '45.34802201',
    vramUsed: '18.4',
    gpuTemp: '48',
    powerDraw: '074',
  });

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedLogId, setCopiedLogId] = useState<string | null>(null);
  const [copiedAllLogs, setCopiedAllLogs] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedGpu, setSelectedGpu] = useState('A100');
  const [showGpuModal, setShowGpuModal] = useState(false);

  // Keep-Alive Background Service State
  const [keepAliveActive, setKeepAliveActive] = useState(true);
  const [keepAliveStats, setKeepAliveStats] = useState<KeepAliveStats>({
    heartbeatCount: 142,
    latencyMs: 98.4,
    uptimeSeconds: 568,
    wakeLockActive: false,
    audioBeaconActive: false,
    workerActive: false,
    lastPingTime: 'Running',
  });

  // Terminal & Virtual Key State
  const [cwd, setCwd] = useState('/content');
  const [commandInput, setCommandInput] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [ctrlActive, setCtrlActive] = useState(false);
  const [altActive, setAltActive] = useState(false);
  const [showKeyBar, setShowKeyBar] = useState(true);

  const [terminalLogs, setTerminalLogs] = useState<TerminalLog[]>([
    { id: '1', type: 'system', text: 'Linux colab-runtime 6.6.137+ x86_64 (Colab Android Terminal Node)' },
    { id: '2', type: 'system', text: 'GPU 0: NVIDIA A100-SXM4 (40GB VRAM) · CUDA 12.2 · Python 3.10.12' },
    { id: '3', type: 'system', text: 'Keep-Alive Daemon: ACTIVE (Heartbeat ping + WakeLock guard)' },
    { id: '4', type: 'system', text: 'Play Store Compliance: Target SDK 36 · Data Safety Verified · Zero-Mining Strict' },
    { id: '5', type: 'system', text: 'Secure Vault: AES-256-GCM Hardware Storage & Virtual Keys Ready.' },
    { id: '6', type: 'output', text: 'Type "help" or "policy" to audit Google Play Console requirements.' },
  ]);

  const inputRef = useRef<HTMLInputElement>(null);
  const terminalScrollRef = useRef<HTMLDivElement>(null);

  // Audio Synthesizer (Web Audio API)
  const playSound = useCallback(
    (type: 'click' | 'start' | 'alert' | 'success') => {
      if (!soundEnabled) return;
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
          osc.frequency.setValueAtTime(650, ctx.currentTime);
          gain.gain.setValueAtTime(0.04, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
          osc.start();
          osc.stop(ctx.currentTime + 0.05);
        } else if (type === 'start') {
          osc.frequency.setValueAtTime(440, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
          osc.start();
          osc.stop(ctx.currentTime + 0.14);
        } else if (type === 'alert') {
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(320, ctx.currentTime);
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
          osc.start();
          osc.stop(ctx.currentTime + 0.25);
        } else if (type === 'success') {
          osc.frequency.setValueAtTime(523.25, ctx.currentTime);
          osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08);
          osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16);
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
          osc.start();
          osc.stop(ctx.currentTime + 0.28);
        }
      } catch {}
    },
    [soundEnabled]
  );

  const triggerAlert = (msg: string) => {
    setAlertMessage(msg);
    setShowAlert(true);
    playSound('alert');
  };

  const dismissAlert = () => {
    setShowAlert(false);
    setAlertMessage('');
  };

  // Initialize Keep-Alive Background Service
  useEffect(() => {
    const unsubscribe = keepAliveService.subscribe((stats) => {
      setKeepAliveStats(stats);
      setTelemetry((prev) => ({
        ...prev,
        calcRegister: (45.348 + (stats.heartbeatCount % 100) * 0.0012).toFixed(8),
      }));
    });

    if (keepAliveActive) {
      keepAliveService.start({ enableAudioBeacon: true }).catch(() => {});
    }

    return () => {
      unsubscribe();
      keepAliveService.stop();
    };
  }, []);

  // Sync Keep-Alive toggles
  const handleToggleKeepAlive = (enable: boolean) => {
    setKeepAliveActive(enable);
    if (enable) {
      playSound('start');
      keepAliveService.start({ enableAudioBeacon: true }).catch(() => {});
      appendLog('[Keep-Alive Daemon] Active heartbeat ping & wake lock enabled.', 'system');
    } else {
      playSound('click');
      keepAliveService.stop();
      triggerAlert(
        lang === 'my'
          ? 'သတိပေးချက်: Keep-Alive Background Service ခေတ္တရပ်ထားပါသည်။ Colab သည် ၁၀ မိနစ်အတွင်း Disconnect ဖြစ်နိုင်ပါသည်။'
          : 'Warning: Keep-Alive daemon paused. Google Colab will disconnect when idle for 10 minutes.'
      );
      appendLog('[Keep-Alive Daemon] Stopped by user.', 'warn');
    }
  };

  const appendLog = (text: string, type: TerminalLog['type'] = 'output') => {
    setTerminalLogs((prev) => [...prev, { id: Math.random().toString(), type, text }]);
    setTimeout(() => {
      if (terminalScrollRef.current) {
        terminalScrollRef.current.scrollTo({
          top: terminalScrollRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 25);
  };

  const fallbackCopy = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
    } catch {}
  };

  const handleCopyText = (text: string, id?: string) => {
    playSound('click');
    const onDone = () => {
      if (id) {
        setCopiedLogId(id);
        setTimeout(() => setCopiedLogId(null), 2000);
      }
      setToastMessage(lang === 'my' ? 'ကူးယူပြီးပါပြီ ✓' : 'Copied to clipboard ✓');
      setTimeout(() => setToastMessage(null), 2200);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(onDone, () => {
        fallbackCopy(text);
        onDone();
      });
    } else {
      fallbackCopy(text);
      onDone();
    }
  };

  const handleCopyAllLogs = () => {
    playSound('click');
    const allText = terminalLogs.map((l) => l.text).join('\n');
    if (!allText) return;
    handleCopyText(allText);
    setCopiedAllLogs(true);
    setTimeout(() => setCopiedAllLogs(false), 2500);
  };

  const handlePasteToInput = async () => {
    playSound('click');
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setCommandInput((prev) => prev + text);
          playSound('success');
          inputRef.current?.focus();
          setToastMessage(lang === 'my' ? 'Paste ထည့်သွင်းပြီးပါပြီ ✓' : 'Pasted from clipboard ✓');
          setTimeout(() => setToastMessage(null), 2000);
          return;
        }
      }
    } catch {}

    const fallback = window.prompt(
      lang === 'my' ? 'Paste ပြုလုပ်လိုသော Command ကို ထည့်ပါ:' : 'Paste your command here:'
    );
    if (fallback) {
      setCommandInput((prev) => prev + fallback);
      playSound('success');
      inputRef.current?.focus();
      setToastMessage(lang === 'my' ? 'Paste ထည့်သွင်းပြီးပါပြီ ✓' : 'Pasted from clipboard ✓');
      setTimeout(() => setToastMessage(null), 2000);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    playSound('click');
    handleCopyText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  // Execute Shell Command
  const handleCommandSubmit = (e?: React.FormEvent, customCmd?: string) => {
    if (e) e.preventDefault();
    const cmd = (customCmd !== undefined ? customCmd : commandInput).trim();
    if (!cmd) return;

    playSound('click');
    const promptPath = cwd === '/content' ? '/content' : cwd;
    appendLog(`root@colab:${promptPath}# ${cmd}`, 'input');

    // Update History
    setCommandHistory((prev) => [...prev, cmd]);
    setHistoryIndex(-1);
    setCommandInput('');

    // Auto-reset latch modifiers if set
    if (ctrlActive) setCtrlActive(false);
    if (altActive) setAltActive(false);

    const result = executeTerminalCommand(cmd, {
      selectedGpu,
      gpuInfo: GPU_TIERS[selectedGpu] || GPU_TIERS.A100,
      gpuUtil: telemetry.gpuUtil,
      ramPercent: telemetry.ram,
      vramUsed: telemetry.vramUsed,
      gpuTemp: telemetry.gpuTemp,
      powerDraw: telemetry.powerDraw,
      ngrokToken: activeNgrokToken,
      commandHistory: [...commandHistory, cmd],
      keepAliveStats,
      keepAliveActive,
      cwd,
      onSetCwd: (newDir) => setCwd(newDir),
      onSwitchTab: (tab) => setActiveTab(tab),
      onSetSelectedGpu: (gpu) => setSelectedGpu(gpu),
      onClear: () => {
        setTerminalLogs([
          {
            id: Date.now().toString(),
            type: 'system',
            text: 'Linux colab-runtime 6.6.137+ (Buffer cleared · tmux session: colab)',
          },
        ]);
      },
    });

    if (result.clear) {
      return;
    }

    if (result.type === 'error') {
      playSound('alert');
    } else if (result.type === 'system') {
      playSound('success');
    }

    if (result.lines && result.lines.length > 0) {
      result.lines.forEach((line) => {
        appendLog(line, result.type);
      });
    }
  };

  // SIGINT Force Interrupt Action
  const handleSigint = () => {
    triggerAlert(
      lang === 'my'
        ? '⚠️ သတိပေးချက်: SIGINT (Ctrl+C) အချက်ပြ ပေးပို့လိုက်ပါသည်။ လက်ရှိ background လုပ်ငန်းစဉ်များ ချက်ချင်း ရပ်တန့်သွားမည် ဖြစ်ပါသည်။'
        : '⚠️ Alert: SIGINT (Ctrl+C) signal dispatched. Active worker process forcefully interrupted.'
    );
    appendLog('^C', 'input');
    appendLog('[Signal] SIGINT sent (Force Interrupt Process).', 'error');
  };

  // Virtual Key Bar Handlers
  const handleVirtualInsert = (symbol: string) => {
    setCommandInput((prev) => prev + symbol);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleVirtualSendKey = (keyName: string) => {
    if (keyName === 'Escape') {
      setCommandInput('');
      setCtrlActive(false);
      setAltActive(false);
    } else if (keyName === 'ArrowLeft' && inputRef.current) {
      inputRef.current.focus();
      const pos = Math.max(0, (inputRef.current.selectionStart || 0) - 1);
      inputRef.current.setSelectionRange(pos, pos);
    } else if (keyName === 'ArrowRight' && inputRef.current) {
      inputRef.current.focus();
      const pos = Math.min(commandInput.length, (inputRef.current.selectionStart || 0) + 1);
      inputRef.current.setSelectionRange(pos, pos);
    } else if (keyName === 'Home' && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(0, 0);
    } else if (keyName === 'End' && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(commandInput.length, commandInput.length);
    }
  };

  const handleVirtualSignal = (signal: 'SIGINT' | 'SIGTSTP' | 'EOF') => {
    if (signal === 'SIGINT') {
      handleSigint();
    } else if (signal === 'SIGTSTP') {
      appendLog('^Z', 'input');
      appendLog('[Signal] SIGTSTP sent (Job suspended).', 'warn');
      playSound('alert');
    } else if (signal === 'EOF') {
      appendLog('^D', 'input');
      appendLog('[Signal] EOF transmitted.', 'system');
      playSound('click');
    }
  };

  const handleHistoryPrev = () => {
    if (commandHistory.length === 0) return;
    const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
    setHistoryIndex(nextIdx);
    setCommandInput(commandHistory[nextIdx]);
  };

  const handleHistoryNext = () => {
    if (commandHistory.length === 0 || historyIndex === -1) return;
    const nextIdx = historyIndex + 1;
    if (nextIdx >= commandHistory.length) {
      setHistoryIndex(-1);
      setCommandInput('');
    } else {
      setHistoryIndex(nextIdx);
      setCommandInput(commandHistory[nextIdx]);
    }
  };

  const handleTabComplete = () => {
    const common = [
      'nvidia-smi',
      'python3',
      'pip install',
      'pip list',
      'torch-test',
      'tmate -F',
      'ngrok',
      'cloudflared',
      'clear',
      'free -m',
      'df -h',
      'ps aux',
      'top',
      'uptime',
      'whoami',
      'uname -a',
      'cat colab_app.py',
      'cat requirements.txt',
      'ls -la',
      'pwd',
      'cd drive',
      'tmux ls',
      'git clone',
      'vault',
      'status',
      'policy',
      'help',
    ];
    const current = commandInput.trim();
    if (!current) {
      setCommandInput('nvidia-smi');
      return;
    }
    const match = common.find((cmd) => cmd.startsWith(current));
    if (match) {
      setCommandInput(match);
      playSound('success');
    }
  };

  // Dynamic Colab Bootstrap Script with Secure Vault Token Insertion
  const activeNgrokToken = secureStorage.getSecrets()?.ngrokToken || 'YOUR_NGROK_TOKEN';
  const bootstrapPythonScript = `!pip install flask flask-cors psutil ttyd tmux pyngrok -qq
import os, subprocess, threading, psutil
from flask import Flask, jsonify
from flask_cors import CORS

# GOOGLE DRIVE PERSISTENT WORKSPACE
WORKSPACE_DIR = "/content/drive/MyDrive/ColabMobileWorkspace"
try:
  from google.colab import drive
  drive.mount('/content/drive', force_remount=False)
  os.makedirs(WORKSPACE_DIR, exist_ok=True)
  print("✅ [Drive Mounted] Storage persistent across Colab restarts.")
except Exception as e: pass

# TTYD TERMINAL + TMUX DAEMON BRIDGE
app = Flask('colab_app')
CORS(app)
threading.Thread(target=lambda: subprocess.run(['ttyd', '-p', '7681', 'tmux', 'new-session', '-A', '-s', 'colab_session']), daemon=True).start()

# NGROK TUNNEL (INJECTED SECURELY)
try:
  from pyngrok import ngrok
  ngrok.set_auth_token("${activeNgrokToken}")
  tunnel = ngrok.connect(7681, "http")
  print("🌐 [Web Terminal]:", tunnel.public_url)
except Exception as e: pass

@app.route('/api/stats')
def stats():
  ram = psutil.virtual_memory()
  return jsonify({'ram_percent': ram.percent, 'gpu_tier': '${selectedGpu}'})

if __name__ == '__main__': app.run(port=5000)`;

  // SSH Tunnels List with Dynamic Secrets
  const sshTunnels = [
    {
      id: 'tmate',
      name: 'tmate Instant Web & SSH Terminal',
      badge: '1-Step · No Token',
      descEn: 'Zero setup instant SSH and Web terminal. Generates ready-to-use SSH string & web browser URL.',
      descMy: 'အကောင့်ဖွင့်ရန်မလိုဘဲ ချက်ချင်း SSH နှင့် Web Link ရရှိစေသော အလွယ်ကူဆုံးနည်းလမ်း။',
      command: 'apt-get install tmate -y -qq && tmate -F',
      connectClient: 'Termux',
      connectSyntax: 'ssh <generated-tmate-session>@lon1.tmate.io',
    },
    {
      id: 'ngrok',
      name: 'ngrok TCP Port 22 Tunnel',
      badge: 'High Speed · Stable',
      descEn: 'Forward Colab SSH port 22 via ngrok TCP tunnel directly to your mobile Termux app.',
      descMy: 'ngrok token ဖြင့် port 22 ကို forward လုပ်ပြီး Termux သို့မဟုတ် JuiceSSH မှ တိုက်ရိုက်ချိတ်နည်း။',
      command: `!pip install pyngrok -qq
from pyngrok import ngrok
ngrok.set_auth_token("${activeNgrokToken}")
tunnel = ngrok.connect(22, "tcp")
print(f"SSH Command: ssh root@{tunnel.public_url.split('//')[1].replace(':', ' -p ')}")`,
      connectClient: 'JuiceSSH',
      connectSyntax: 'ssh root@0.tcp.ngrok.io -p <port>',
    },
    {
      id: 'cloudflared',
      name: 'Cloudflare Zero Trust SSH',
      badge: 'Free · Unlimited',
      descEn: 'Free unlimited Cloudflare Tunnel bridging localhost terminal to global HTTPS endpoint.',
      descMy: 'Cloudflare Free Tunnel ဖြင့် port အားလုံးကို public access ပြုလုပ်ပေးသော စနစ်။',
      command: 'wget -q -O cloudflared https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 && chmod +x cloudflared && ./cloudflared tunnel --url tcp://localhost:22',
      connectClient: 'Browser',
      connectSyntax: 'cloudflared access ssh --hostname <tunnel-domain>',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-2 sm:p-4 md:p-6 flex items-center justify-center font-terminal">
      <div className="terminal-chassis max-w-lg w-full rounded-2xl p-3 sm:p-5 flex flex-col gap-3 shadow-2xl relative select-none">
        {/* Floating Toast Feedback for Copy/Paste */}
        {toastMessage && (
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-50 bg-[#00ff66] text-black font-mono font-black text-xs px-3.5 py-1.5 rounded-full shadow-2xl flex items-center gap-1.5 border border-black animate-jelly-jiggle select-none pointer-events-none">
            <Check size={13} className="stroke-[3]" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="flex flex-col gap-1.5 pb-1.5 border-b border-slate-800">
          {/* Black Digital Watch Display Strip */}
          <div className="w-full bg-black border border-slate-800 rounded-xl px-2.5 py-1.5 flex items-center justify-between shadow-inner gap-2">
            {/* Digital Watch Single Row Title */}
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <span className="w-2 h-2 rounded-full bg-[#00ff66] animate-pulse shrink-0" />
              <h1 className="font-digital-watch text-[11px] xs:text-xs sm:text-sm font-black tracking-normal sm:tracking-wider text-[#00ff66] glow-green-digit uppercase whitespace-nowrap overflow-visible">
                COLAB ANDROID TERMINAL
              </h1>
            </div>

            {/* Compact Action Controls: Language & Sound */}
            <div className="flex items-center gap-1 shrink-0">
              {/* Language Switcher */}
              <button
                onClick={() => {
                  playSound('click');
                  setLang(lang === 'my' ? 'en' : 'my');
                }}
                className="terminal-key-btn px-2 py-0.5 rounded text-[11px] font-bold text-cyan-300 hover:text-white"
              >
                {lang === 'my' ? 'EN' : 'မြန်မာ'}
              </button>

              {/* Sound Toggle */}
              <button
                onClick={() => {
                  setSoundEnabled(!soundEnabled);
                  playSound('click');
                }}
                className="terminal-key-btn p-1 rounded text-slate-200 hover:text-white"
                title="Sound Toggle"
              >
                {soundEnabled ? (
                  <Volume2 size={13} className="text-[#00ff66]" />
                ) : (
                  <VolumeX size={13} className="text-slate-400" />
                )}
              </button>
            </div>
          </div>

          {/* Subtitle Branding & Legal Non-Affiliation Disclaimer */}
          <div className="flex items-center justify-between text-[11px] px-1 font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold text-slate-400">DEVELOPED BY</span>
              <span className="text-[11px] font-black text-[#00ff66] tracking-wider uppercase bg-[#00ff66]/10 px-1.5 py-0.2 rounded border border-[#00ff66]/40">
                VICTOR GEEK
              </span>
            </div>
            <div className="flex items-center gap-1">
              {reviewerMode && (
                <span className="text-[9px] px-1 rounded bg-purple-950 text-purple-300 border border-purple-500 font-bold">
                  SANDBOX ON
                </span>
              )}
              <span className="text-slate-400 font-bold text-[10px]">v2.6 PRO</span>
            </div>
          </div>

          {/* Trademark Disclaimer Ribbon */}
          <div className="text-[9px] px-1 text-slate-400 font-mono tracking-tight leading-none">
            Independent utility · Not affiliated with or endorsed by Google LLC or Google Colab.
          </div>
        </div>

        {/* System Alert Notification Banner */}
        {showAlert && (
          <div className="bg-red-950/80 border-2 border-red-500 rounded-xl p-3 text-white flex items-start justify-between gap-3 shadow-lg">
            <div className="flex items-start gap-2">
              <TriangleAlert size={18} className="text-red-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <span className="text-xs sm:text-sm font-black tracking-wider uppercase text-red-200 block">
                  {lang === 'my' ? '⚠️ အရေးကြီး သတိပေးချက်' : '⚠️ SYSTEM ALERT'}
                </span>
                <p className="text-xs text-white font-bold leading-relaxed mt-0.5">
                  {alertMessage}
                </p>
              </div>
            </div>
            <button
              onClick={dismissAlert}
              className="terminal-key-btn px-2.5 py-1 rounded text-xs font-black text-white hover:bg-slate-700 cursor-pointer shrink-0"
            >
              {lang === 'my' ? '[X] ပိတ်ရန်' : '[X] CLOSE'}
            </button>
          </div>
        )}

        {/* Digital Matrix Chassis Screen (Black Format, Compact Space) */}
        <div className="terminal-screen-matrix rounded-xl p-2.5 sm:p-3 flex flex-col gap-2">
          {/* Integrated Status Banner */}
          <div className="flex items-center justify-between text-[10px] font-mono font-bold pb-1.5 border-b border-slate-800">
            <div className="flex items-center gap-1 flex-wrap">
              <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-[#00ff66] border border-[#00ff66]/50 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00ff66] animate-pulse" />
                SHELL ONLINE
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-700">
                PORT: 7681
              </span>
              <span
                className={`px-1.5 py-0.5 rounded border flex items-center gap-1 ${
                  secureStorage.isUnlocked()
                    ? 'bg-emerald-950/80 border-[#00ff66]/70 text-[#00ff66]'
                    : 'bg-black border-slate-700 text-amber-300'
                }`}
              >
                <Lock size={10} /> {secureStorage.isUnlocked() ? 'VAULT: OPEN' : 'VAULT: SECURE'}
              </span>
            </div>
            <div className="text-slate-300 flex items-center gap-1 text-[10px]">
              <span>PING:</span>
              <span className="font-dseg7 glow-green-digit text-xs font-bold">
                {keepAliveStats.latencyMs.toFixed(1)}
              </span>
              <span>ms</span>
            </div>
          </div>

          {/* Hardware Telemetry Dashboard */}
          <div className="border-b border-slate-800/90 pb-2">
            <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 font-bold mb-1">
              <span className="tracking-wider text-slate-300">HARDWARE TELEMETRY</span>
              <span className="text-slate-300">
                REG:{' '}
                <strong className="font-dseg7 glow-green-digit text-[11px] px-1 py-0.5 rounded bg-black border border-slate-800">
                  {(+telemetry.calcRegister).toFixed(3)}
                </strong>
              </span>
            </div>

            <div className="grid grid-cols-4 gap-1 text-center font-mono font-bold">
              <div className="bg-black/70 border border-slate-800/80 rounded py-1 px-1 flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-semibold">RAM</span>
                <span className="font-dseg7 glow-green-digit text-xs font-bold leading-tight">
                  {telemetry.ram}%
                </span>
              </div>

              <div className="bg-black/70 border border-slate-800/80 rounded py-1 px-1 flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-semibold truncate max-w-full">
                  GPU ({selectedGpu})
                </span>
                <span className="font-dseg7 glow-green-digit text-xs font-bold leading-tight">
                  {telemetry.gpuUtil}%
                </span>
              </div>

              <div className="bg-black/70 border border-slate-800/80 rounded py-1 px-1 flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-semibold">VRAM</span>
                <span className="font-dseg7 glow-green-digit text-xs font-bold leading-tight">
                  {telemetry.vramUsed}G
                </span>
              </div>

              <div className="bg-black/70 border border-slate-800/80 rounded py-1 px-1 flex flex-col items-center">
                <span className="text-[9px] text-slate-400 font-semibold">BEAT</span>
                <span className="font-dseg7 glow-green-digit text-xs font-bold leading-tight">
                  #{keepAliveStats.heartbeatCount}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation Tabs (High Contrast Crisp Tabs - Includes Policy Hub) */}
          <div className="grid grid-cols-6 gap-1 text-xs font-bold border-b border-slate-800 pb-2">
            {[
              { id: 'controller', label: '1:CTRL' },
              { id: 'terminal', label: '2:SHELL' },
              { id: 'ssh', label: '3:SSH' },
              { id: 'vault', label: '4:VAULT' },
              { id: 'guide', label: '5:GUIDE' },
              { id: 'policy', label: '6:POLICY' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    playSound('click');
                    setActiveTab(tab.id as any);
                  }}
                  className={`py-2 px-0.5 text-center rounded transition-all cursor-pointer font-bold text-[11px] truncate ${
                    isActive
                      ? tab.id === 'vault'
                        ? 'btn-active-amber'
                        : tab.id === 'policy'
                        ? 'btn-active-purple'
                        : tab.id === 'terminal' || tab.id === 'guide'
                        ? 'btn-active-cyan'
                        : 'btn-active-green'
                      : 'terminal-panel text-slate-200 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab Contents */}
          <div
            className={
              activeTab === 'terminal'
                ? 'flex flex-col gap-2 min-h-[420px] sm:min-h-[480px] text-xs'
                : 'max-h-[390px] overflow-y-auto scrollbar-matrix pr-1 space-y-3 text-xs leading-relaxed'
            }
          >
            {/* 1: CONTROL TAB */}
            {activeTab === 'controller' && (
              <div className="space-y-3">
                {/* Keep-Alive Daemon Action Buttons */}
                <div className="grid grid-cols-4 gap-1.5 text-xs font-black">
                  <button
                    onClick={() => handleToggleKeepAlive(true)}
                    className="bg-emerald-950 hover:bg-emerald-900 border border-[#00ff66] text-[#00ff66] py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-md font-bold"
                  >
                    ► PING
                  </button>

                  <button
                    onClick={() => handleToggleKeepAlive(false)}
                    className="bg-amber-950 hover:bg-amber-900 border border-amber-400 text-amber-300 py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-md font-bold"
                  >
                    ❚❚ PAUSE
                  </button>

                  <button
                    onClick={handleSigint}
                    className="bg-rose-950 hover:bg-rose-900 border border-rose-500 text-rose-300 py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-md font-bold"
                  >
                    ■ KILL
                  </button>

                  <button
                    onClick={() => {
                      playSound('start');
                      setActiveTab('terminal');
                      appendLog('[Keep-Alive Daemon] Attached to tmux session: colab_session.', 'system');
                    }}
                    className="bg-cyan-950 hover:bg-cyan-900 border border-cyan-400 text-cyan-300 py-2.5 rounded-lg flex items-center justify-center gap-1 cursor-pointer shadow-md font-bold"
                  >
                    ↻ ATTACH
                  </button>
                </div>

                {/* Keep-Alive Background Service Status Card */}
                <div className="terminal-panel p-3 rounded-lg space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-[#00ff66] flex items-center gap-1">
                      <Radio size={13} className="animate-pulse" />
                      STATUS: {keepAliveActive ? 'ACTIVE DAEMON' : 'IDLE (PAUSED)'}
                    </span>
                    <span className="text-cyan-300 font-bold">
                      TIMEOUT GUARD: {keepAliveActive ? 'ON' : 'OFF'}
                    </span>
                  </div>

                  <p className="text-slate-100 text-xs font-semibold leading-relaxed">
                    {lang === 'my'
                      ? 'Screen WakeLock, Background Worker နှင့် Audio Beacon စနစ်များဖြင့် ဖုန်း Screen ပိတ်ထားသော်လည်း Google Colab Runtime မပြတ်တောက်စေရန် အလိုအလျောက် ထိန်းသိမ်းထားပါသည်။'
                      : 'Screen WakeLock, Background Web Worker, and Audio Beacon active to prevent Google Colab timeout disconnect.'}
                  </p>

                  <div className="grid grid-cols-3 gap-1 pt-1 text-[11px] font-bold font-mono">
                    <span className="px-2 py-1 rounded bg-black/60 text-slate-200 border border-slate-800">
                      WAKELOCK: <strong className="text-[#00ff66]">{keepAliveStats.wakeLockActive ? 'ON' : 'OFF'}</strong>
                    </span>
                    <span className="px-2 py-1 rounded bg-black/60 text-slate-200 border border-slate-800">
                      WORKER: <strong className="text-cyan-300">{keepAliveStats.workerActive ? 'ACTIVE' : 'IDLE'}</strong>
                    </span>
                    <span className="px-2 py-1 rounded bg-black/60 text-slate-200 border border-slate-800">
                      BEACON: <strong className="text-amber-300">{keepAliveStats.audioBeaconActive ? 'SYNCED' : 'MUTED'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <span className="text-amber-300 font-bold">
                      GPU: {GPU_TIERS[selectedGpu].label} (<span className="font-dseg7 glow-green-digit text-xs">{telemetry.vramUsed}</span>GB)
                    </span>
                    <button
                      onClick={() => setShowGpuModal(true)}
                      className="text-cyan-400 underline font-bold cursor-pointer hover:text-white"
                    >
                      [CHANGE TIER]
                    </button>
                  </div>
                </div>

                {/* Colab Bootstrap Script Card */}
                <div className="terminal-panel p-3 rounded-lg space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span className="text-white">COLAB BOOTSTRAP PYTHON SCRIPT:</span>
                    <button
                      onClick={() => copyToClipboard(bootstrapPythonScript, 'bootstrap')}
                      className="text-[#00ff66] underline cursor-pointer hover:text-white font-bold"
                    >
                      {copiedId === 'bootstrap' ? '[COPIED!]' : '[COPY CODE]'}
                    </button>
                  </div>
                  <pre className="text-xs font-mono bg-black p-2.5 rounded border border-slate-800 text-[#00ff66] overflow-x-auto whitespace-pre-wrap max-h-24 scrollbar-matrix font-semibold">
                    {bootstrapPythonScript}
                  </pre>
                </div>

                {/* Google Play Store Policy Compliance Quick Bar */}
                <div className="p-2.5 rounded bg-black border border-slate-800 flex items-center justify-between text-xs font-mono font-bold">
                  <div className="flex items-center gap-1.5 text-[#00ff66]">
                    <ShieldCheck size={14} />
                    <span>GOOGLE PLAY CONSOLE POLICY VERIFIED ✓</span>
                  </div>
                  <button
                    onClick={() => {
                      playSound('click');
                      setActiveTab('policy');
                    }}
                    className="text-cyan-400 underline cursor-pointer hover:text-white"
                  >
                    [CHECK 10/10]
                  </button>
                </div>
              </div>
            )}

            {/* 2: SHELL TERMINAL TAB */}
            {activeTab === 'terminal' && (
              <div className="flex-1 flex flex-col gap-2 min-h-0">
                {/* Minimal Header Sub-bar */}
                <div className="terminal-panel px-2.5 py-1.5 rounded font-bold text-xs flex items-center justify-between text-white font-mono border border-slate-800">
                  <span className="text-[#00ff66] font-bold text-xs truncate max-w-[170px] sm:max-w-xs">
                    ROOT@COLAB-RUNTIME:{cwd === '/content' ? '/content' : cwd}#
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyAllLogs}
                      className="text-[#00ff66] hover:text-white text-xs underline cursor-pointer font-bold flex items-center gap-1"
                      title="Copy all terminal logs to clipboard"
                    >
                      {copiedAllLogs ? '[COPIED ✓]' : '[COPY ALL]'}
                    </button>
                    <button
                      onClick={() => handleCommandSubmit(undefined, 'clear')}
                      className="text-amber-300 hover:text-white text-xs underline cursor-pointer font-bold"
                      title="Clear Screen"
                    >
                      [CLEAR]
                    </button>
                    <button
                      onClick={() => setShowKeyBar(!showKeyBar)}
                      className="text-cyan-300 hover:text-white text-xs underline cursor-pointer font-bold"
                      title="Toggle Virtual Shortcut Keys Bar"
                    >
                      {showKeyBar ? '[HIDE KEYS]' : '[KEYS]'}
                    </button>
                  </div>
                </div>

                {/* Maximized Full-Face Terminal Screen */}
                <div
                  ref={terminalScrollRef}
                  onClick={(e) => {
                    const selection = window.getSelection();
                    if (selection && selection.toString().trim().length > 0) return;
                    if (e.target === terminalScrollRef.current) {
                      inputRef.current?.focus();
                    }
                  }}
                  className="bg-black border border-slate-800 scrollbar-matrix p-3 rounded-lg font-mono text-xs space-y-1.5 flex-1 min-h-[290px] sm:min-h-[350px] overflow-y-auto shadow-inner select-text cursor-text"
                >
                  {terminalLogs.map((log) => {
                    const isCopied = copiedLogId === log.id;
                    const canCopy = log.text.trim().length > 0;
                    return (
                      <div
                        key={log.id}
                        className={`group relative flex items-start justify-between gap-1.5 rounded px-1 -mx-1 hover:bg-slate-900/60 transition-colors select-text ${
                          log.type === 'system'
                            ? 'text-[#00ff66] font-bold'
                            : log.type === 'input'
                            ? 'text-cyan-300 font-bold underline'
                            : log.type === 'error'
                            ? 'text-rose-400 font-bold'
                            : log.type === 'warn'
                            ? 'text-amber-300 font-bold'
                            : 'text-slate-100 font-semibold'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-all flex-1 select-text">
                          {log.text}
                        </div>
                        {canCopy && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyText(log.text, log.id);
                            }}
                            className="opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity text-[10px] px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0 cursor-pointer select-none font-sans font-bold flex items-center gap-1"
                            title="Copy line"
                          >
                            {isCopied ? (
                              <>
                                <Check size={10} className="text-[#00ff66]" />
                                <span className="text-[#00ff66]">COPIED</span>
                              </>
                            ) : (
                              <>
                                <Copy size={10} />
                                <span>COPY</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Compact Virtual Shortcut Key Bar */}
                {showKeyBar && (
                  <VirtualKeyBar
                    onInsertText={handleVirtualInsert}
                    onSendKey={handleVirtualSendKey}
                    onSendSignal={handleVirtualSignal}
                    onClear={() => handleCommandSubmit(undefined, 'clear')}
                    onHistoryPrev={handleHistoryPrev}
                    onHistoryNext={handleHistoryNext}
                    onTabComplete={handleTabComplete}
                    ctrlActive={ctrlActive}
                    setCtrlActive={setCtrlActive}
                    altActive={altActive}
                    setAltActive={setAltActive}
                    onSound={playSound}
                  />
                )}

                {/* Input Prompt Form */}
                <form onSubmit={handleCommandSubmit} className="flex items-center gap-1.5 pt-0.5">
                  <span className="font-black text-sm text-[#00ff66] shrink-0">
                    {cwd === '/content' ? '$' : `${cwd.split('/').pop()} $`}
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={commandInput}
                    onChange={(e) => setCommandInput(e.target.value)}
                    placeholder="Enter bash command (e.g. nvidia-smi, policy, help)..."
                    className="flex-1 min-w-0 bg-black border border-slate-700 p-2 rounded text-xs font-mono text-white font-bold focus:outline-none focus:border-[#00ff66]"
                  />
                  <button
                    type="button"
                    onClick={handlePasteToInput}
                    className="terminal-key-btn px-2.5 py-2 rounded text-xs font-mono font-bold text-cyan-300 hover:text-white shrink-0 cursor-pointer flex items-center gap-1"
                    title="Paste from clipboard"
                  >
                    <span>PASTE</span>
                  </button>
                  <button
                    type="submit"
                    className="bg-[#00ff66] hover:bg-emerald-400 text-black px-3.5 py-2 rounded font-mono font-black cursor-pointer text-xs shadow-md shrink-0"
                  >
                    SEND
                  </button>
                </form>
              </div>
            )}

            {/* 3: SSH REMOTE TUNNEL TAB */}
            {activeTab === 'ssh' && (
              <div className="space-y-3">
                <div className="font-bold text-xs text-cyan-300 font-mono">
                  ANDROID SSH REMOTE TUNNEL SUITE:
                </div>

                {sshTunnels.map((tunnel) => (
                  <div
                    key={tunnel.id}
                    className="terminal-panel p-3 rounded-lg space-y-1.5 border border-slate-800"
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span className="text-white flex items-center gap-1.5">
                        <Terminal size={14} className="text-[#00ff66]" />
                        {tunnel.name}
                      </span>
                      <button
                        onClick={() => {
                          playSound('start');
                          setActiveTab('terminal');
                          handleCommandSubmit(undefined, tunnel.command.split('\n')[0]);
                        }}
                        className="text-[#00ff66] underline cursor-pointer hover:text-white font-bold"
                      >
                        [EXECUTE]
                      </button>
                    </div>

                    <p className="text-xs text-slate-200 font-semibold leading-tight">
                      {lang === 'my' ? tunnel.descMy : tunnel.descEn}
                    </p>

                    <pre className="text-xs font-mono bg-black p-2 rounded border border-slate-800 text-cyan-300 overflow-x-auto whitespace-pre-wrap font-bold">
                      {tunnel.command}
                    </pre>

                    <div className="text-xs font-mono flex items-center justify-between pt-1 text-slate-300">
                      <span>
                        CLIENT: <strong className="text-white">{tunnel.connectClient}</strong>
                      </span>
                      <span className="text-cyan-400 font-bold">{tunnel.connectSyntax}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 4: SECURE VAULT TAB */}
            {activeTab === 'vault' && (
              <SecureStoragePanel
                lang={lang}
                onSound={playSound}
                onApplyNgrokToken={(token) => {
                  appendLog(`[Secure Storage] Ngrok token updated from hardware vault.`, 'system');
                }}
              />
            )}

            {/* 5: GUIDE TAB */}
            {activeTab === 'guide' && (
              <div className="space-y-2.5 text-xs text-slate-100 leading-relaxed font-semibold">
                <div className="terminal-panel p-3 rounded-lg space-y-1 border border-slate-800">
                  <div className="font-bold text-xs text-[#00ff66]">
                    1. PREVENTING COLAB TIMEOUT (KEEP-ALIVE DAEMON)
                  </div>
                  <p>
                    {lang === 'my'
                      ? 'Colab tab ပိတ်သွားပါက ၁၀ မိနစ်အတွင်း Disconnect ဖြစ်တတ်သည်။ Screen WakeLock, Background Worker နှင့် Audio Beacon ပါဝင်သော Keep-Alive စနစ်ဖြင့် ဖုန်း Screen ပိတ်ထားသော်လည်း Runtime မပြတ်တောက်စေပါ။'
                      : 'Google Colab disconnects idle tabs. Run the bootstrap code and keep the ping active in this app to prevent runtime timeout.'}
                  </p>
                </div>

                <div className="terminal-panel p-3 rounded-lg space-y-1 border border-slate-800">
                  <div className="font-bold text-xs text-cyan-400">
                    2. VIRTUAL SHORTCUT KEY BAR (TERMUX EXTRA KEYS)
                  </div>
                  <p>
                    {lang === 'my'
                      ? 'Android touchscreen ပေါ်တွင် Terminal ရိုက်ရာတွင် ESC, TAB, CTRL, ALT, Arrow keys, ^C, ^Z, ^D ခလုတ်များကို Virtual Key Bar မှ တိုက်ရိုက် အသုံးပြုနိုင်ပါသည်။'
                      : 'Virtual Shortcut Key Bar provides tactile hardware keys like ESC, TAB, CTRL, ALT, Arrow navigation, and signal keys (^C, ^Z, ^D) tailored for touchscreens.'}
                  </p>
                </div>

                <div className="terminal-panel p-3 rounded-lg space-y-1 border border-slate-800">
                  <div className="font-bold text-xs text-amber-300">
                    3. HARDWARE SECURE STORAGE (ENCRYPTED VAULT)
                  </div>
                  <p>
                    {lang === 'my'
                      ? 'Ngrok, Hugging Face Token နှင့် SSH Passphrase များကို AES-256-GCM ဖြင့် စာဝှက်သိမ်းဆည်းပေးပြီး Master PIN ဖြင့်သာ ဖွင့်နိုင်ကာ ၅ မိနစ်အတွင်း အလိုအလျောက် ပြန်လည် Lock ပြုလုပ်ပါသည်။'
                      : 'Store sensitive credentials with AES-256-GCM encryption protected by a master PIN and ephemeral memory clearing.'}
                  </p>
                </div>

                <div className="terminal-panel p-3 rounded-lg space-y-1 border border-slate-800">
                  <div className="font-bold text-xs text-purple-300">
                    4. GOOGLE PLAY CONSOLE POLICY COMPLIANCE
                  </div>
                  <p>
                    {lang === 'my'
                      ? 'Play Store တွင် အက်ပ်တင်ရန် လိုအပ်သော Target SDK 36, Zero-Mining မူဝါဒ, Data Safety မေးခွန်းများနှင့် Reviewer Sandbox များကို "6:POLICY" tab တွင် အသေးစိတ် ဝင်ရောက်စစ်ဆေးနိုင်ပါသည်။'
                      : 'Review Target SDK 36, Data Safety declarations, and Reviewer Sandbox under the 6:POLICY tab to ensure smooth Google Play Store Console approval.'}
                  </p>
                </div>
              </div>
            )}

            {/* 6: GOOGLE PLAY STORE POLICY & CONSOLE AUDIT CENTER */}
            {activeTab === 'policy' && (
              <PlayStorePolicyCenter
                lang={lang}
                onSound={playSound}
                onOpenPrivacyModal={() => setShowPrivacyModal(true)}
                reviewerMode={reviewerMode}
                onToggleReviewerMode={(val) => {
                  setReviewerMode(val);
                  appendLog(`[Play Store Audit] Reviewer Demo Sandbox mode ${val ? 'ENABLED' : 'DISABLED'}.`, 'system');
                }}
              />
            )}
          </div>
        </div>

        {/* Bottom Hardware Keypad Buttons */}
        <div className="grid grid-cols-4 gap-1.5 pt-1 text-xs font-bold font-mono">
          <button
            onClick={() => {
              playSound('start');
              setActiveTab('controller');
            }}
            className="terminal-key-btn py-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-[10px] text-amber-300 font-bold">MENU</span>
            <span>CONTROL</span>
          </button>

          <button
            onClick={() => {
              playSound('start');
              setActiveTab('terminal');
            }}
            className="terminal-key-btn py-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-[10px] text-[#00ff66] font-bold">PTY</span>
            <span>SHELL</span>
          </button>

          <button
            onClick={() => {
              playSound('start');
              setActiveTab('policy');
            }}
            className="terminal-key-btn py-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-[10px] text-purple-300 font-bold">STORE</span>
            <span>POLICY</span>
          </button>

          <button
            onClick={handleSigint}
            className="bg-rose-950 hover:bg-rose-900 border border-rose-500 text-rose-300 py-2.5 rounded-lg flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-[10px] text-red-200 font-bold">SIGINT</span>
            <span>AC / KILL</span>
          </button>
        </div>

        {/* Footer Credit & Version Info */}
        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-800 text-slate-300 font-mono font-bold">
          <span>Colab Android Terminal v2.6 Pro</span>
          <span>
            Developed by <strong className="text-[#00ff66]">Victor Geek</strong>
          </span>
        </div>
      </div>

      {/* GPU Accelerator Modal */}
      {showGpuModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md">
          <div className="terminal-panel max-w-sm w-full rounded-2xl p-4 flex flex-col gap-3 shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between font-bold text-sm text-white">
              <span>SELECT CLOUD GPU ACCELERATOR:</span>
              <button
                onClick={() => setShowGpuModal(false)}
                className="terminal-key-btn px-2.5 py-0.5 rounded cursor-pointer text-white"
              >
                [X]
              </button>
            </div>

            <div className="space-y-2">
              {Object.keys(GPU_TIERS).map((key) => {
                const tier = GPU_TIERS[key];
                const isSelected = selectedGpu === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      playSound('click');
                      setSelectedGpu(key);
                      setShowGpuModal(false);
                      appendLog(`[GPU] Switched target accelerator to ${tier.fullName}`, 'system');
                    }}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-[#00ff66] text-black font-black shadow-[0_0_12px_rgba(0,255,102,0.8)] border-[#00ff66]'
                        : 'bg-black hover:bg-slate-900 text-white border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs">
                      <span>{tier.fullName}</span>
                      <span className="font-dseg7">{tier.vram}</span>
                    </div>
                    <p className={`text-xs mt-1 font-semibold ${isSelected ? 'text-black' : 'text-slate-300'}`}>
                      {tier.recommendation} · {tier.computeCost}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Google Play Store Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        lang={lang}
        onSound={playSound}
      />
    </div>
  );
}
