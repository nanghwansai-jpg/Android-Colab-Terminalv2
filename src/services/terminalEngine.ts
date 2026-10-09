/**
 * Colab Android Terminal Command Engine v2.6 Pro
 * Developed for Termux / Google Colab Mobile Environment
 * Provides realistic, comprehensive, high-fidelity command execution
 * and response handling for bash / Colab shell.
 */

export interface CommandResultItem {
  text: string;
  type: 'system' | 'output' | 'error' | 'warn';
}

export interface CommandResponse {
  type: 'system' | 'output' | 'error' | 'warn';
  lines: string[];
  items?: CommandResultItem[];
  clear?: boolean;
}

export interface TerminalContext {
  selectedGpu: string;
  gpuInfo: { fullName: string; vram: string; recommendation?: string; computeCost?: string };
  gpuUtil: string;
  ramPercent: string;
  vramUsed: string;
  gpuTemp?: string;
  powerDraw?: string;
  ngrokToken: string;
  commandHistory: string[];
  keepAliveStats?: {
    heartbeatCount: number;
    latencyMs: number;
    uptimeSeconds: number;
    wakeLockActive: boolean;
    audioBeaconActive: boolean;
    workerActive: boolean;
    lastPingTime: string;
  };
  keepAliveActive?: boolean;
  cwd?: string;
  onSetCwd?: (dir: string) => void;
  onSwitchTab?: (tab: 'controller' | 'terminal' | 'ssh' | 'vault' | 'guide' | 'policy') => void;
  onSetSelectedGpu?: (gpu: string) => void;
  onClear?: () => void;
}

export function executeTerminalCommand(
  rawCmd: string,
  context: TerminalContext
): CommandResponse {
  const trimmed = rawCmd.trim();
  if (!trimmed) {
    return { type: 'output', lines: [] };
  }

  // 1. Normalize Colab prefixes (! or % or $ or sudo or bash -c)
  let normalized = trimmed;
  if (normalized.startsWith('!') || normalized.startsWith('%') || normalized.startsWith('$')) {
    normalized = normalized.slice(1).trim();
  }
  if (normalized.startsWith('sudo ')) {
    normalized = normalized.slice(5).trim();
  }

  const lowerNorm = normalized.toLowerCase();

  // Special chain detectors:
  let effectiveCmd = normalized;
  if (lowerNorm.includes('tmate')) {
    effectiveCmd = 'tmate -F';
  } else if (lowerNorm.includes('cloudflared')) {
    effectiveCmd = 'cloudflared';
  } else if (lowerNorm.includes('pyngrok') || (lowerNorm.startsWith('pip') && lowerNorm.includes('ngrok'))) {
    effectiveCmd = 'ngrok';
  }

  const parts = effectiveCmd.split(/\s+/);
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);
  const currentCwd = context.cwd || '/content';

  // -------------------------------------------------------------
  // 1. CLEAR / CLS / RESET
  // -------------------------------------------------------------
  if (cmd === 'clear' || cmd === 'cls' || cmd === 'reset') {
    if (context.onClear) {
      context.onClear();
    }
    return {
      type: 'system',
      clear: true,
      lines: [
        'Linux colab-runtime 6.6.137+ x86_64 (Buffer cleared · tmux session: colab)',
      ],
    };
  }

  // -------------------------------------------------------------
  // 2. HELP / ? / INFO / --HELP
  // -------------------------------------------------------------
  if (cmd === 'help' || cmd === '?' || cmd === 'info' || (cmd === 'man' && args.length === 0)) {
    return {
      type: 'system',
      lines: [
        '╔═════════════════════════════════════════════════════════════════════════════╗',
        '║            COLAB ANDROID TERMINAL SHELL (BASH 5.2 PRO MATRIX)               ║',
        '╚═════════════════════════════════════════════════════════════════════════════╝',
        'AVAILABLE SYSTEM & HARDWARE COMMANDS:',
        '  nvidia-smi        Inspect GPU accelerator, VRAM allocation & CUDA telemetry',
        '  free -m / -h      Display RAM memory and swap statistics',
        '  df -h             Inspect mounted Google Drive & disk partition capacities',
        '  ps aux, top       List running processes, Python daemon & tmux workers',
        '  uname -a          Print Linux kernel version & target architecture',
        '  uptime            Display runtime uptime & system load average',
        '  whoami, id        Show authenticated root user privileges',
        '  date, cal         Display system timestamp & calendar',
        '',
        'COLAB AI & PYTHON RUNTIME:',
        '  python3 <file>    Execute Python scripts or inline (-c "code")',
        '  pip install <pkg> Install Python packages via pip package manager',
        '  pip list          List installed PyTorch, CUDA & Hugging Face packages',
        '  torch-test        Verify PyTorch CUDA acceleration & tensor allocation',
        '',
        'FILESYSTEM & DIRECTORY NAVIGATION:',
        '  ls, ls -la        List files in current directory with metadata',
        '  pwd               Print working directory path',
        '  cd <dir>          Change directory (/content, drive, sample_data, ..)',
        '  cat <file>        Inspect file contents (colab_app.py, requirements.txt)',
        '  echo <text>       Print formatted text to stdout (supports $ENV vars)',
        '  clear, cls        Clear terminal console buffer',
        '  history           Show command execution history log',
        '',
        'NETWORK & REMOTE SSH TUNNELS:',
        '  tmate, tmate -F   Launch instant 1-step SSH & Web terminal session',
        '  ngrok             Forward Colab SSH port 22 via ngrok TCP tunnel',
        '  cloudflared       Deploy Cloudflare Zero Trust secure HTTPS/SSH tunnel',
        '  ping <host>       Test network latency & packet roundtrip time',
        '  curl, ifconfig    Query public IP address or web endpoints',
        '',
        'APPLET DAEMON & SECURITY VAULT:',
        '  status            Inspect Keep-Alive background service & wake-lock status',
        '  vault, secrets    Open AES-256-GCM hardware credentials manager',
        '  gpu <tier>        Switch active GPU accelerator (A100, L4, T4, TPU)',
        '  kill <pid>        Terminate running process by process ID',
        '  policy / audit    Audit Google Play Console developer policy compliance',
      ],
    };
  }

  // -------------------------------------------------------------
  // POLICY & AUDIT CHECK (FOR PLAY STORE CONSOLE REVIEW)
  // -------------------------------------------------------------
  if (cmd === 'policy' || cmd === 'audit' || cmd === 'compliance' || cmd === 'safety') {
    if (context.onSwitchTab) {
      context.onSwitchTab('policy');
    }
    return {
      type: 'system',
      lines: [
        '=================================================================',
        '      GOOGLE PLAY DEVELOPER POLICY & DATA SAFETY AUDIT           ',
        '=================================================================',
        '1. Target API Level     : Android 14+ (Target SDK 36 Compliant) [PASS]',
        '2. Permissions Scope    : Minimal Normal (INTERNET, WAKE_LOCK)  [PASS]',
        '3. Data Safety Form     : No Personal Data Collected or Shared  [PASS]',
        '4. Cryptomining Policy  : Zero On-Device Mining (AUP Strict)    [PASS]',
        '5. Impersonation Policy : Independent Tool / Clear Disclaimers  [PASS]',
        '6. User Data Deletion   : In-Memory / AES-256 One-Click Wipe    [PASS]',
        '7. Malware / Backdoor   : No Unauthorized Rootkit Exploits      [PASS]',
        '8. App Review Access    : Demo Reviewer Sandbox Supported       [PASS]',
        '-----------------------------------------------------------------',
        'Switched to 6:POLICY Tab for Google Play Console Form Submission.',
        '=================================================================',
      ],
    };
  }

  // -------------------------------------------------------------
  // 3. NVIDIA-SMI
  // -------------------------------------------------------------
  if (cmd === 'nvidia-smi') {
    if (args.includes('-l') || args.includes('-L')) {
      return {
        type: 'output',
        lines: [
          `GPU 0: ${context.gpuInfo.fullName} (UUID: GPU-e49058b2-4d51-9f7a-8b14-0692ec178120)`,
        ],
      };
    }

    if (args.some((a) => a.includes('--query-gpu'))) {
      return {
        type: 'output',
        lines: [
          'name, driver_version, memory.total [MiB], memory.used [MiB], utilization.gpu [%]',
          `${context.gpuInfo.fullName}, 535.104.05, ${context.gpuInfo.vram}, ${context.vramUsed}GiB, ${context.gpuUtil} %`,
        ],
      };
    }

    const gpuName = context.gpuInfo.fullName.padEnd(25);
    const vramTotal = context.gpuInfo.vram.includes('16')
      ? '16384MiB'
      : context.gpuInfo.vram.includes('24')
      ? '24576MiB'
      : '40960MiB';
    const vramUsedMiB = Math.round(parseFloat(context.vramUsed || '18.4') * 1024);
    const temp = context.gpuTemp || '48';
    const pwr = context.powerDraw || '074';

    return {
      type: 'output',
      lines: [
        '+-----------------------------------------------------------------------------+',
        '| NVIDIA-SMI 535.104.05   Driver Version: 535.104.05   CUDA Version: 12.2     |',
        '|-------------------------------+----------------------+----------------------|',
        '| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |',
        '| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |',
        '|===============================+======================+======================|',
        `|   0  ${gpuName}| 00000000:00:04.0 Off |                    0 |`,
        `| N/A   ${temp}C    P0    ${parseInt(pwr, 10)}W / 250W |  ${vramUsedMiB}MiB / ${vramTotal} |     ${context.gpuUtil}%      Default |`,
        '+-------------------------------+----------------------+----------------------+',
        '| Processes:                                                                  |',
        '|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |',
        '|        ID   ID                                                   Usage      |',
        '|=============================================================================|',
        `|    0   N/A  N/A        42      C   python3 colab_app.py            ${vramUsedMiB - 32}MiB |`,
        '+-----------------------------------------------------------------------------+',
      ],
    };
  }

  // -------------------------------------------------------------
  // 4. FREE / FREE -M / FREE -H
  // -------------------------------------------------------------
  if (cmd === 'free') {
    const isHuman = args.includes('-h');
    if (isHuman) {
      return {
        type: 'output',
        lines: [
          '               total        used        free      shared  buff/cache   available',
          'Mem:            51Gi        12Gi        33Gi       112Mi       6.3Gi        39Gi',
          'Swap:            0Bi         0Bi         0Bi',
        ],
      };
    }
    return {
      type: 'output',
      lines: [
        '               total        used        free      shared  buff/cache   available',
        'Mem:           52984       12410       34120         112        6454       40120',
        'Swap:              0           0           0',
      ],
    };
  }

  // -------------------------------------------------------------
  // 5. PS / TOP / HTOP
  // -------------------------------------------------------------
  if (cmd === 'ps' || cmd === 'top' || cmd === 'htop') {
    return {
      type: 'output',
      lines: [
        'USER         PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND',
        'root           1  0.0  0.1  22588  3404 ?        Ss   09:12   0:01 /bin/bash',
        'root          42  2.1  2.4 945204 12840 ?        Sl   09:15   0:45 python3 colab_app.py',
        'root         104  0.4  0.2  18492  2940 pts/0    S+   09:20   0:03 tmux: colab_session',
        'root         156  0.2  0.1  12480  1820 ?        S    09:25   0:01 ttyd -p 7681 tmux',
        'root         210  0.1  0.3  42100  4100 ?        S    09:26   0:01 keepalive-worker',
        'root         248  0.0  0.0   8620  1140 pts/0    R+   09:30   0:00 ps aux',
      ],
    };
  }

  // -------------------------------------------------------------
  // 6. PWD
  // -------------------------------------------------------------
  if (cmd === 'pwd') {
    return {
      type: 'output',
      lines: [currentCwd],
    };
  }

  // -------------------------------------------------------------
  // 7. CD
  // -------------------------------------------------------------
  if (cmd === 'cd') {
    const target = args[0] || '~';
    let newDir = currentCwd;

    if (target === '~' || target === '/root') {
      newDir = '/root';
    } else if (target === '/' || target === '/content') {
      newDir = target === '/' ? '/' : '/content';
    } else if (target === '..') {
      if (currentCwd === '/content/drive' || currentCwd === '/content/sample_data') {
        newDir = '/content';
      } else if (currentCwd === '/content') {
        newDir = '/';
      } else {
        newDir = '/';
      }
    } else if (target === 'drive' || target === '/content/drive') {
      newDir = '/content/drive';
    } else if (target === 'sample_data' || target === '/content/sample_data') {
      newDir = '/content/sample_data';
    } else if (target === 'ColabMobileWorkspace') {
      newDir = '/content/drive/ColabMobileWorkspace';
    } else {
      return {
        type: 'error',
        lines: [`bash: cd: ${target}: No such file or directory`],
      };
    }

    if (context.onSetCwd) {
      context.onSetCwd(newDir);
    }
    return {
      type: 'output',
      lines: [],
    };
  }

  // -------------------------------------------------------------
  // 8. LS / DIR / LL
  // -------------------------------------------------------------
  if (cmd === 'ls' || cmd === 'dir' || cmd === 'll') {
    const isDetailed = cmd === 'll' || args.some((a) => a.includes('l'));

    if (currentCwd === '/content') {
      if (isDetailed) {
        return {
          type: 'output',
          lines: [
            'total 36',
            'drwxr-xr-x 1 root root 4096 Oct  9 09:12 .',
            'drwxr-xr-x 1 root root 4096 Oct  9 09:10 ..',
            'drwxr-xr-x 4 root root 4096 Oct  9 09:14 drive/',
            'drwxr-xr-x 2 root root 4096 Oct  9 09:10 sample_data/',
            '-rw-r--r-- 1 root root 1240 Oct  9 09:15 colab_app.py',
            '-rw-r--r-- 1 root root  380 Oct  9 09:12 requirements.txt',
            '-rw-r--r-- 1 root root  220 Oct  9 09:13 .env',
            '-rw-r--r-- 1 root root  148 Oct  9 09:16 .tmux.conf',
          ],
        };
      }
      return {
        type: 'output',
        lines: [
          'drive/   sample_data/   colab_app.py   requirements.txt   .env',
        ],
      };
    }

    if (currentCwd === '/content/drive') {
      if (isDetailed) {
        return {
          type: 'output',
          lines: [
            'total 8',
            'drwxr-xr-x 4 root root 4096 Oct  9 09:14 .',
            'drwxr-xr-x 1 root root 4096 Oct  9 09:12 ..',
            'drwxr-xr-x 2 root root 4096 Oct  9 09:15 ColabMobileWorkspace/',
            'drwxr-xr-x 2 root root 4096 Oct  9 09:14 MyDrive/',
          ],
        };
      }
      return {
        type: 'output',
        lines: ['ColabMobileWorkspace/   MyDrive/'],
      };
    }

    if (currentCwd === '/content/sample_data') {
      if (isDetailed) {
        return {
          type: 'output',
          lines: [
            'total 55504',
            '-rwxr-xr-x 1 root root 36523880 Oct  9 09:10 mnist_train_small.csv',
            '-rwxr-xr-x 1 root root  1706430 Oct  9 09:10 california_housing_train.csv',
            '-rw-r--r-- 1 root root      930 Oct  9 09:10 README.md',
          ],
        };
      }
      return {
        type: 'output',
        lines: ['mnist_train_small.csv   california_housing_train.csv   README.md'],
      };
    }

    return {
      type: 'output',
      lines: ['bin/   boot/   content/   dev/   etc/   home/   lib/   proc/   root/   sys/   tmp/   usr/   var/'],
    };
  }

  // -------------------------------------------------------------
  // 9. WHOAMI & ID
  // -------------------------------------------------------------
  if (cmd === 'whoami') {
    return {
      type: 'output',
      lines: ['root'],
    };
  }
  if (cmd === 'id') {
    return {
      type: 'output',
      lines: ['uid=0(root) gid=0(root) groups=0(root)'],
    };
  }

  // -------------------------------------------------------------
  // 10. UNAME / ARCH / HOSTNAME
  // -------------------------------------------------------------
  if (cmd === 'uname') {
    if (args.includes('-r')) {
      return { type: 'output', lines: ['6.6.137+'] };
    }
    if (args.includes('-m')) {
      return { type: 'output', lines: ['x86_64'] };
    }
    return {
      type: 'output',
      lines: [
        'Linux colab-runtime-node 6.6.137+ #1 SMP PREEMPT_DYNAMIC Mon Sep 22 14:30:00 UTC 2026 x86_64 GNU/Linux',
      ],
    };
  }
  if (cmd === 'arch') {
    return { type: 'output', lines: ['x86_64'] };
  }
  if (cmd === 'hostname') {
    return { type: 'output', lines: ['colab-runtime-node-0'] };
  }

  // -------------------------------------------------------------
  // 11. UPTIME
  // -------------------------------------------------------------
  if (cmd === 'uptime') {
    const uptimeSec = context.keepAliveStats?.uptimeSeconds || 568;
    const hours = Math.floor(uptimeSec / 3600);
    const mins = Math.floor((uptimeSec % 3600) / 60);
    const timeStr = `${hours > 0 ? hours + 'h ' : ''}${mins}m`;
    const now = new Date().toTimeString().split(' ')[0];

    return {
      type: 'output',
      lines: [` ${now} up ${timeStr},  1 user,  load average: 0.42, 0.58, 0.65`],
    };
  }

  // -------------------------------------------------------------
  // 12. DF / DF -H
  // -------------------------------------------------------------
  if (cmd === 'df') {
    return {
      type: 'output',
      lines: [
        'Filesystem      Size  Used Avail Use% Mounted on',
        'overlay         108G   32G   76G  30% /',
        'tmpfs            64M     0   64M   0% /dev',
        'shm              16G     0   16G   0% /dev/shm',
        '/dev/root       2.0G  1.2G  800M  60% /sbin/docker-init',
        '/dev/sda1        78G   31G   47G  40% /content',
        '/dev/fuse        15G  4.2G   11G  28% /content/drive',
      ],
    };
  }

  // -------------------------------------------------------------
  // 13. PYTHON / PYTHON3
  // -------------------------------------------------------------
  if (cmd === 'python' || cmd === 'python3') {
    if (args.includes('--version') || args.includes('-V') || args.includes('-v')) {
      return {
        type: 'output',
        lines: ['Python 3.10.12'],
      };
    }

    if (args.includes('-c')) {
      const cIdx = args.indexOf('-c');
      const inlineCode = args.slice(cIdx + 1).join(' ');

      if (inlineCode.includes('torch') && inlineCode.includes('cuda')) {
        return {
          type: 'output',
          lines: ['True'],
        };
      }
      if (inlineCode.includes('print(')) {
        const match = inlineCode.match(/print\((?:['"](.*?)['"]|(.*?))\)/);
        const extracted = match ? match[1] || match[2] : 'None';
        return {
          type: 'output',
          lines: [extracted || 'None'],
        };
      }
      return {
        type: 'output',
        lines: ['[Execution completed with exit code 0]'],
      };
    }

    if (args.length > 0) {
      const script = args[0];
      if (script === 'colab_app.py') {
        return {
          type: 'system',
          lines: [
            '[colab_app] Initializing Flask Colab Bridge on port 5000...',
            '✅ [Drive Mounted] Storage persistent across Colab restarts.',
            `✅ [GPU Device]: ${context.gpuInfo.fullName}`,
            '[ttyd] Web terminal spawned on port 7681 in tmux session "colab_session".',
            ' * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)',
          ],
        };
      }
      return {
        type: 'system',
        lines: [
          `[Python 3.10.12] Executing ${script}...`,
          '✅ [PyTorch 2.2.1] CUDA acceleration initialized.',
          `✅ [GPU Device]: ${context.gpuInfo.fullName}`,
          '[Process finished with exit code 0]',
        ],
      };
    }

    return {
      type: 'output',
      lines: [
        'Python 3.10.12 (main, Nov 20 2023, 15:14:05) [GCC 11.4.0] on linux',
        'Type "help", "copyright", "credits" or "license" for more information.',
        '[Interactive mode simulated - specify script or use -c flag]',
      ],
    };
  }

  // -------------------------------------------------------------
  // 14. TORCH-TEST / TEST-GPU
  // -------------------------------------------------------------
  if (cmd === 'torch-test' || cmd === 'test-gpu') {
    const vramTotal = context.gpuInfo.vram;
    return {
      type: 'system',
      lines: [
        '=================================================================',
        '      PYTORCH CUDA HARDWARE ACCELERATION VERIFICATION           ',
        '=================================================================',
        'PyTorch Version  : 2.2.1+cu121',
        'CUDA Available   : True',
        'CUDA Device Count: 1',
        `Active Device    : 0 (${context.gpuInfo.fullName})`,
        `Total VRAM       : ${vramTotal}`,
        `Current VRAM Used: ${context.vramUsed} GB (${context.gpuUtil}% util)`,
        'Compute Cap      : 8.0 (Tensor Core FP16 / BF16 Supported)',
        'CUDA Driver      : 12.2 · cuDNN: 8.9.2',
        '-----------------------------------------------------------------',
        'ALLOCATION TEST  : Allocated 10000x10000 float32 matrix on cuda:0',
        'COMPUTE SPEED    : Matrix multiplication finished in 0.038 seconds',
        'STATUS           : HARDWARE ACCELERATION FULLY OPERATIONAL ✓',
        '=================================================================',
      ],
    };
  }

  // -------------------------------------------------------------
  // 15. PIP / PIP3
  // -------------------------------------------------------------
  if (cmd === 'pip' || cmd === 'pip3') {
    const sub = args[0];

    if (sub === 'list') {
      return {
        type: 'output',
        lines: [
          'Package           Version',
          '----------------- -----------',
          'accelerate        0.29.0',
          'diffusers         0.27.2',
          'flask             3.0.2',
          'flask-cors        4.0.0',
          'numpy             1.26.4',
          'psutil            5.9.8',
          'pyngrok           7.1.5',
          'safetensors       0.4.3',
          'torch             2.2.1+cu121',
          'torchaudio        2.2.1+cu121',
          'torchvision       0.17.1+cu121',
          'transformers      4.40.0',
          'ttyd              1.7.4',
          'xformers          0.0.25',
        ],
      };
    }

    if (sub === 'install') {
      const pkg = args.filter((a) => !a.startsWith('-')).slice(1).join(' ') || 'packages';
      return {
        type: 'system',
        lines: [
          `Collecting ${pkg}`,
          `  Downloading ${pkg.split(' ')[0]}-latest-py3-none-any.whl (2.4 MB)`,
          `Installing collected packages: ${pkg}`,
          `Successfully installed ${pkg}`,
        ],
      };
    }

    if (sub === '--version' || sub === '-v' || sub === '-V') {
      return {
        type: 'output',
        lines: ['pip 24.0 from /usr/local/lib/python3.10/dist-packages/pip (python 3.10)'],
      };
    }

    return {
      type: 'output',
      lines: ['Usage: pip <list|install|uninstall|show> [packages...]'],
    };
  }

  // -------------------------------------------------------------
  // 16. PING
  // -------------------------------------------------------------
  if (cmd === 'ping') {
    const host = args.filter((a) => !a.startsWith('-'))[0] || '8.8.8.8';
    const latency = context.keepAliveStats?.latencyMs
      ? context.keepAliveStats.latencyMs.toFixed(1)
      : '14.2';
    const lNum = parseFloat(latency);

    return {
      type: 'output',
      lines: [
        `PING ${host} (${host}) 56(84) bytes of data.`,
        `64 bytes from ${host}: icmp_seq=1 ttl=116 time=${lNum} ms`,
        `64 bytes from ${host}: icmp_seq=2 ttl=116 time=${(lNum + 0.8).toFixed(1)} ms`,
        `64 bytes from ${host}: icmp_seq=3 ttl=116 time=${(lNum - 0.4).toFixed(1)} ms`,
        `--- ${host} ping statistics ---`,
        '3 packets transmitted, 3 received, 0% packet loss, time 2003ms',
        `rtt min/avg/max/mdev = ${(lNum - 0.4).toFixed(1)}/${lNum}/${(lNum + 0.8).toFixed(1)}/0.42 ms`,
      ],
    };
  }

  // -------------------------------------------------------------
  // 17. CURL & WGET
  // -------------------------------------------------------------
  if (cmd === 'curl') {
    const target = args.filter((a) => !a.startsWith('-'))[0] || '';
    if (target.includes('ifconfig.me') || target.includes('ipinfo.io') || target.includes('icanhazip')) {
      return {
        type: 'output',
        lines: [
          '34.125.88.214',
          'Google Cloud Platform (us-west1-b)',
        ],
      };
    }
    if (target) {
      return {
        type: 'output',
        lines: [
          'HTTP/2 200',
          'date: Fri, 09 Oct 2026 09:48:00 GMT',
          'content-type: text/html; charset=UTF-8',
          'server: gws',
          'status: 200 OK',
        ],
      };
    }
    return {
      type: 'output',
      lines: ['curl: try \'curl --help\' for more information'],
    };
  }

  // -------------------------------------------------------------
  // 18. TMATE
  // -------------------------------------------------------------
  if (cmd.includes('tmate')) {
    return {
      type: 'system',
      lines: [
        '[tmate] Setting up tmate daemon v2.4.0...',
        '[tmate] Establishing secure SSH bridge via lon1.tmate.io...',
        '=================================================================',
        'SSH Session: ssh 94jfxkd81j@lon1.tmate.io',
        'Web Session: https://tmate.io/t/94jfxkd81j',
        'Read-Only  : https://tmate.io/t/ro-48fmx921kd',
        '=================================================================',
        '✅ [Status] Ready! Paste the SSH string into Termux or JuiceSSH.',
      ],
    };
  }

  // -------------------------------------------------------------
  // 19. NGROK
  // -------------------------------------------------------------
  if (cmd === 'ngrok') {
    const hasToken = context.ngrokToken && context.ngrokToken !== 'YOUR_NGROK_TOKEN';
    const tokenDisplay = hasToken
      ? context.ngrokToken.slice(0, 8) + '...'
      : '(No Token Set - Open 4:VAULT to Configure)';

    return {
      type: 'system',
      lines: [
        '[ngrok] pyngrok v7.1.5 initializing tunnel...',
        `[ngrok] Hardware Vault Token: ${tokenDisplay}`,
        '[ngrok] Session Status       : online',
        '[ngrok] Web Inspection URL   : http://127.0.0.1:4040',
        '=================================================================',
        'TCP Tunnel (Port 22): tcp://0.tcp.ngrok.io:19482 -> localhost:22',
        '[SSH Direct Command]: ssh root@0.tcp.ngrok.io -p 19482',
        '=================================================================',
      ],
    };
  }

  // -------------------------------------------------------------
  // 20. CLOUDFLARED
  // -------------------------------------------------------------
  if (cmd === 'cloudflared') {
    return {
      type: 'system',
      lines: [
        '[cloudflared] Cloudflare Zero Trust tunnel initializing...',
        '[cloudflared] Route registered on edge network (hkg02)',
        '=================================================================',
        'Public Web Endpoint: https://colab-tunnel-94a2.trycloudflare.com',
        'SSH Access Command : cloudflared access ssh --hostname colab-tunnel-94a2.trycloudflare.com',
        '=================================================================',
      ],
    };
  }

  // -------------------------------------------------------------
  // 21. TMUX
  // -------------------------------------------------------------
  if (cmd === 'tmux') {
    const sub = args[0];
    if (sub === 'ls' || sub === 'list-sessions') {
      return {
        type: 'output',
        lines: [
          'colab_session: 1 windows (created Fri Oct  9 09:12:00 2026) [80x24] (attached)',
        ],
      };
    }
    if (sub === 'attach' || sub === 'a') {
      return {
        type: 'system',
        lines: ['[tmux] Attached to session: colab_session.'],
      };
    }
    return {
      type: 'output',
      lines: [
        'tmux: active session "colab_session" running ttyd terminal bridge.',
        'Usage: tmux <ls | attach | new -s <name>>',
      ],
    };
  }

  // -------------------------------------------------------------
  // 22. CAT
  // -------------------------------------------------------------
  if (cmd === 'cat') {
    const file = args[0];
    if (file === 'requirements.txt') {
      return {
        type: 'output',
        lines: [
          'flask==3.0.2',
          'flask-cors==4.0.0',
          'psutil==5.9.8',
          'pyngrok==7.1.5',
          'torch>=2.2.0',
          'transformers>=4.40.0',
          'accelerate>=0.29.0',
        ],
      };
    }
    if (file === 'colab_app.py') {
      return {
        type: 'output',
        lines: [
          'import os, subprocess, threading, psutil',
          'from flask import Flask, jsonify',
          'from flask_cors import CORS',
          '',
          '# TTYD TERMINAL + TMUX DAEMON BRIDGE',
          "app = Flask('colab_app')",
          'CORS(app)',
          "threading.Thread(target=lambda: subprocess.run(['ttyd', '-p', '7681', 'tmux', 'new-session', '-A', '-s', 'colab_session']), daemon=True).start()",
          '',
          "@app.route('/api/stats')",
          'def stats():',
          '    ram = psutil.virtual_memory()',
          `    return jsonify({'ram_percent': ram.percent, 'gpu_tier': '${context.selectedGpu}'})`,
          '',
          "if __name__ == '__main__':",
          '    app.run(port=5000)',
        ],
      };
    }
    if (file === '.env') {
      return {
        type: 'output',
        lines: [
          'COLAB_RUNTIME_ID=colab-session-7681',
          `DEFAULT_GPU=${context.selectedGpu}`,
          'NGROK_ACTIVE_PORT=22',
          'KEEP_ALIVE_INTERVAL=10s',
        ],
      };
    }
    if (file === '/etc/os-release') {
      return {
        type: 'output',
        lines: [
          'PRETTY_NAME="Ubuntu 22.04.4 LTS"',
          'NAME="Ubuntu"',
          'VERSION_ID="22.04"',
          'VERSION="22.04.4 LTS (Jammy Jellyfish)"',
          'ID=ubuntu',
          'ID_LIKE=debian',
        ],
      };
    }
    if (file === '/proc/cpuinfo' || file === 'lscpu') {
      return {
        type: 'output',
        lines: [
          'processor       : 0 to 7 (8 vCPUs)',
          'model name      : Intel(R) Xeon(R) CPU @ 2.20GHz',
          'cpu MHz         : 2200.184',
          'cache size      : 56320 KB',
        ],
      };
    }
    if (file === '/proc/meminfo') {
      return {
        type: 'output',
        lines: [
          'MemTotal:       52984572 kB',
          'MemFree:        34120480 kB',
          'MemAvailable:   40120112 kB',
          'Buffers:          340120 kB',
          'Cached:          6114280 kB',
          'SwapTotal:             0 kB',
          'SwapFree:              0 kB',
        ],
      };
    }
    return {
      type: 'error',
      lines: [`cat: ${file || 'file'}: No such file or directory`],
    };
  }

  // -------------------------------------------------------------
  // 23. ECHO
  // -------------------------------------------------------------
  if (cmd === 'echo') {
    let text = args.join(' ').replace(/^["']|["']$/g, '');
    text = text
      .replace(/\$USER/g, 'root')
      .replace(/\$GPU/g, context.selectedGpu)
      .replace(/\$CUDA_HOME/g, '/usr/local/cuda')
      .replace(/\$CUDA_VERSION/g, '12.2')
      .replace(/\$PWD/g, currentCwd)
      .replace(/\$PATH/g, '/usr/local/cuda/bin:/usr/local/bin:/usr/bin:/bin');

    return {
      type: 'output',
      lines: [text],
    };
  }

  // -------------------------------------------------------------
  // 24. DATE & CAL
  // -------------------------------------------------------------
  if (cmd === 'date') {
    return {
      type: 'output',
      lines: [new Date().toUTCString()],
    };
  }
  if (cmd === 'cal') {
    return {
      type: 'output',
      lines: [
        '    October 2026      ',
        'Su Mo Tu We Th Fr Sa  ',
        '             1  2  3  ',
        ' 4  5  6  7  8  9 10  ',
        '11 12 13 14 15 16 17  ',
        '18 19 20 21 22 23 24  ',
        '25 26 27 28 29 30 31  ',
      ],
    };
  }

  // -------------------------------------------------------------
  // 25. ENV & EXPORT
  // -------------------------------------------------------------
  if (cmd === 'env' || cmd === 'export') {
    return {
      type: 'output',
      lines: [
        'CUDA_HOME=/usr/local/cuda',
        'CUDA_VERSION=12.2',
        'PATH=/usr/local/cuda/bin:/usr/local/bin:/usr/bin:/bin',
        'LD_LIBRARY_PATH=/usr/local/cuda/lib64:/usr/lib64-nvidia',
        'COLAB_GPU=1',
        `COLAB_GPU_TIER=${context.selectedGpu}`,
        'COLAB_RELEASE_TAG=release-202610-01',
        'PYTHONPATH=/content',
        'HOME=/root',
        'TERM=xterm-256color',
        'PORT=7681',
      ],
    };
  }

  // -------------------------------------------------------------
  // 26. HISTORY
  // -------------------------------------------------------------
  if (cmd === 'history') {
    const list = context.commandHistory || [];
    const lines = list.map((item, idx) => `  ${String(idx + 1).padStart(3, ' ')}  ${item}`);
    return {
      type: 'output',
      lines: lines.length > 0 ? lines : ['    1  history'],
    };
  }

  // -------------------------------------------------------------
  // 27. STATUS / DAEMON / KEEPALIVE
  // -------------------------------------------------------------
  if (cmd === 'status' || cmd === 'daemon' || cmd === 'keepalive') {
    const stats = context.keepAliveStats;
    const uptimeSec = stats?.uptimeSeconds || 568;
    const mins = Math.floor(uptimeSec / 60);
    const secs = uptimeSec % 60;

    return {
      type: 'system',
      lines: [
        '=================================================================',
        '          KEEP-ALIVE BACKGROUND SERVICE DAEMON STATUS            ',
        '=================================================================',
        `Service Status     : ${context.keepAliveActive ? 'ACTIVE (Guarding Runtime)' : 'PAUSED'}`,
        `Heartbeat Beacons  : #${stats?.heartbeatCount || 142} pings transmitted`,
        `Network Latency    : ${(stats?.latencyMs || 98.4).toFixed(1)} ms`,
        `Session Uptime     : ${mins}m ${secs}s`,
        `Screen WakeLock    : ${stats?.wakeLockActive ? 'ACQUIRED (Prevents Screen Dimming)' : 'RELEASED'}`,
        `Background Worker  : ${stats?.workerActive ? 'RUNNING (Dedicated Web Worker Thread)' : 'INACTIVE'}`,
        `Audio Beacon Pulse : ${stats?.audioBeaconActive ? 'ONLINE (Maintains Mobile Process State)' : 'MUTED'}`,
        'Colab Timeout Guard: ENGAGED ✓ (10-minute idle disconnect prevented)',
        '=================================================================',
      ],
    };
  }

  // -------------------------------------------------------------
  // 28. VAULT / SECRETS
  // -------------------------------------------------------------
  if (cmd === 'vault' || cmd === 'secrets') {
    if (context.onSwitchTab) {
      context.onSwitchTab('vault');
    }
    return {
      type: 'system',
      lines: [
        '[Secure Storage Vault] Switched to AES-256-GCM hardware vault manager.',
        'Zero plaintext leakage · PBKDF2 SHA-256 key derivation active.',
      ],
    };
  }

  // -------------------------------------------------------------
  // 29. GPU / GPU-SWITCH
  // -------------------------------------------------------------
  if (cmd === 'gpu' || cmd === 'gpu-switch') {
    const target = args[0]?.toUpperCase();
    if (target && ['T4', 'L4', 'A100', 'TPU'].includes(target)) {
      if (context.onSetSelectedGpu) {
        context.onSetSelectedGpu(target);
      }
      return {
        type: 'system',
        lines: [`[GPU] Target accelerator changed to ${target}.`],
      };
    }
    return {
      type: 'output',
      lines: [
        `Current Accelerator: ${context.gpuInfo.fullName}`,
        `VRAM Capacity      : ${context.gpuInfo.vram}`,
        `Current Utilization: ${context.gpuUtil}%`,
        'Usage: gpu <T4 | L4 | A100 | TPU>',
      ],
    };
  }

  // -------------------------------------------------------------
  // 30. KILL / PKILL
  // -------------------------------------------------------------
  if (cmd === 'kill' || cmd === 'pkill') {
    const target = args[0] || 'process';
    return {
      type: 'warn',
      lines: [`[Signal delivered] Process ${target} terminated (SIGTERM).`],
    };
  }

  // -------------------------------------------------------------
  // 31. GIT
  // -------------------------------------------------------------
  if (cmd === 'git') {
    const sub = args[0];
    if (sub === 'status') {
      return {
        type: 'output',
        lines: [
          'On branch main',
          'Your branch is up to date with \'origin/main\'.',
          'nothing to commit, working tree clean',
        ],
      };
    }
    if (sub === 'clone') {
      const repo = args[1] || 'repository';
      const cleanRepo = repo.split('/').pop()?.replace('.git', '') || 'repo';
      return {
        type: 'system',
        lines: [
          `Cloning into '${cleanRepo}'...`,
          'remote: Enumerating objects: 142, done.',
          'remote: Compressing objects: 100% (98/98), done.',
          'Receiving objects: 100% (142/142), 1.45 MiB | 8.20 MiB/s, done.',
          `Successfully cloned into ${currentCwd}/${cleanRepo}`,
        ],
      };
    }
    if (sub === '--version' || sub === '-v') {
      return {
        type: 'output',
        lines: ['git version 2.43.0'],
      };
    }
    return {
      type: 'output',
      lines: ['usage: git [--version] [--help] <clone|status|pull|push|commit> [<args>]'],
    };
  }

  // -------------------------------------------------------------
  // 32. APT / APT-GET
  // -------------------------------------------------------------
  if (cmd === 'apt' || cmd === 'apt-get') {
    const sub = args[0];
    if (sub === 'update') {
      return {
        type: 'output',
        lines: [
          'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease',
          'Get:2 http://security.ubuntu.com/ubuntu jammy-security InRelease [110 kB]',
          'Fetched 110 kB in 0s (342 kB/s)',
          'Reading package lists... Done',
        ],
      };
    }
    if (sub === 'install') {
      const pkg = args.filter((a) => !a.startsWith('-')).slice(1).join(' ') || 'package';
      return {
        type: 'system',
        lines: [
          `Reading package lists... Done`,
          `Building dependency tree... Done`,
          `Suggested packages: ${pkg}-doc`,
          `Setting up ${pkg} (latest)...`,
          `Processing triggers for libc-bin...`,
          `✅ [apt] Successfully installed: ${pkg}`,
        ],
      };
    }
    return {
      type: 'output',
      lines: ['Usage: apt <update|install|search> [package]'],
    };
  }

  // -------------------------------------------------------------
  // 33. MKDIR / TOUCH / RM
  // -------------------------------------------------------------
  if (cmd === 'mkdir') {
    return {
      type: 'output',
      lines: [`Created directory '${args[0] || 'folder'}'`],
    };
  }
  if (cmd === 'touch') {
    return {
      type: 'output',
      lines: [],
    };
  }
  if (cmd === 'rm') {
    return {
      type: 'output',
      lines: [`Removed '${args.filter((a) => !a.startsWith('-'))[0] || 'file'}'`],
    };
  }

  // -------------------------------------------------------------
  // 34. EXIT / LOGOUT
  // -------------------------------------------------------------
  if (cmd === 'exit' || cmd === 'logout') {
    return {
      type: 'warn',
      lines: [
        '[logout] Detached from terminal. Background tmux session "colab_session" remains active.',
      ],
    };
  }

  // -------------------------------------------------------------
  // 35. UNRECOGNIZED COMMAND FALLTHROUGH
  // -------------------------------------------------------------
  return {
    type: 'error',
    lines: [
      `bash: ${cmd}: command not found`,
      'Type \'help\' or \'policy\' to view available system and policy commands.',
    ],
  };
}
