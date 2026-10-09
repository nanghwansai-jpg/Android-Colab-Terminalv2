import React from 'react';

interface VirtualKeyBarProps {
  onInsertText: (text: string) => void;
  onSendKey: (key: string) => void;
  onSendSignal: (signal: 'SIGINT' | 'SIGTSTP' | 'EOF') => void;
  onClear: () => void;
  onHistoryPrev: () => void;
  onHistoryNext: () => void;
  onTabComplete: () => void;
  ctrlActive: boolean;
  setCtrlActive: React.Dispatch<React.SetStateAction<boolean>>;
  altActive: boolean;
  setAltActive: React.Dispatch<React.SetStateAction<boolean>>;
  onSound?: (type: 'click' | 'start' | 'alert' | 'success') => void;
}

export const VirtualKeyBar: React.FC<VirtualKeyBarProps> = ({
  onInsertText,
  onSendKey,
  onSendSignal,
  onClear,
  onHistoryPrev,
  onHistoryNext,
  onTabComplete,
  ctrlActive,
  setCtrlActive,
  altActive,
  setAltActive,
  onSound,
}) => {
  const triggerSound = (type: 'click' | 'start' | 'alert' | 'success' = 'click') => {
    if (onSound) onSound(type);
  };

  return (
    <div className="flex flex-col gap-1.5 p-2 bg-[#080b11] border border-slate-800 rounded-xl select-none shadow-inner">
      {/* Row 1: Function & Modifier Keys */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-matrix pb-0.5">
        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onSendKey('Escape');
          }}
          className="terminal-key-btn px-2.5 py-1.5 rounded text-xs font-black text-amber-300 hover:text-white shrink-0"
          title="Escape"
        >
          ESC
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onTabComplete();
          }}
          className="terminal-key-btn px-2.5 py-1.5 rounded text-xs font-black text-cyan-300 hover:text-white shrink-0"
          title="Auto-complete command"
        >
          TAB
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            setCtrlActive((prev) => !prev);
          }}
          className={`px-2.5 py-1.5 rounded text-xs font-black shrink-0 transition-all ${
            ctrlActive
              ? 'bg-[#00ff66] text-black border border-[#00ff66] shadow-[0_0_10px_rgba(0,255,102,0.8)]'
              : 'terminal-key-btn text-slate-100 hover:text-[#00ff66]'
          }`}
          title="Toggle Control modifier latch"
        >
          CTRL
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            setAltActive((prev) => !prev);
          }}
          className={`px-2.5 py-1.5 rounded text-xs font-black shrink-0 transition-all ${
            altActive
              ? 'bg-[#00f0ff] text-black border border-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.8)]'
              : 'terminal-key-btn text-slate-100 hover:text-[#00f0ff]'
          }`}
          title="Toggle Alt modifier latch"
        >
          ALT
        </button>

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-0.5" />

        {/* Essential Terminal Symbol Keys */}
        {['-', '/', '|', '~', '$', '&'].map((symbol) => (
          <button
            key={symbol}
            type="button"
            onClick={() => {
              triggerSound('click');
              onInsertText(symbol);
            }}
            className="terminal-key-btn px-2.5 py-1.5 rounded text-xs font-black text-white hover:text-[#00ff66] shrink-0"
          >
            {symbol}
          </button>
        ))}

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-0.5" />

        {/* Process Signal Controls */}
        <button
          type="button"
          onClick={() => {
            triggerSound('alert');
            onSendSignal('SIGINT');
          }}
          className="bg-rose-950/80 hover:bg-rose-900 border border-rose-500 text-rose-300 hover:text-white px-2 py-1.5 rounded text-xs font-black shrink-0"
          title="Send SIGINT Interrupt (^C)"
        >
          ^C
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onSendSignal('SIGTSTP');
          }}
          className="bg-amber-950/80 hover:bg-amber-900 border border-amber-500 text-amber-300 hover:text-white px-2 py-1.5 rounded text-xs font-black shrink-0"
          title="Send SIGTSTP Suspend (^Z)"
        >
          ^Z
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onSendSignal('EOF');
          }}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 hover:text-white px-2 py-1.5 rounded text-xs font-black shrink-0"
          title="Send End of File (^D)"
        >
          ^D
        </button>
      </div>

      {/* Row 2: Navigation & Buffer Controls */}
      <div className="flex items-center gap-1 overflow-x-auto scrollbar-matrix pb-0.5">
        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onHistoryPrev();
          }}
          className="terminal-key-btn px-3 py-1 rounded text-xs font-black text-[#00ff66] hover:text-white shrink-0"
          title="Previous command in history"
        >
          ▲ UP
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onHistoryNext();
          }}
          className="terminal-key-btn px-3 py-1 rounded text-xs font-black text-[#00ff66] hover:text-white shrink-0"
          title="Next command in history"
        >
          ▼ DOWN
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onSendKey('ArrowLeft');
          }}
          className="terminal-key-btn px-2.5 py-1 rounded text-xs font-black text-slate-200 hover:text-white shrink-0"
          title="Move cursor left"
        >
          ◀
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onSendKey('ArrowRight');
          }}
          className="terminal-key-btn px-2.5 py-1 rounded text-xs font-black text-slate-200 hover:text-white shrink-0"
          title="Move cursor right"
        >
          ▶
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onSendKey('Home');
          }}
          className="terminal-key-btn px-2 py-1 rounded text-xs font-black text-cyan-300 hover:text-white shrink-0"
          title="Cursor Home"
        >
          HOME
        </button>

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onSendKey('End');
          }}
          className="terminal-key-btn px-2 py-1 rounded text-xs font-black text-cyan-300 hover:text-white shrink-0"
          title="Cursor End"
        >
          END
        </button>

        <div className="h-4 w-px bg-slate-700 shrink-0 mx-0.5" />

        <button
          type="button"
          onClick={() => {
            triggerSound('click');
            onClear();
          }}
          className="bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-white px-2.5 py-1 rounded text-xs font-black shrink-0"
          title="Clear screen"
        >
          CLEAR
        </button>

        <button
          type="button"
          onClick={async () => {
            try {
              const text = await navigator.clipboard.readText();
              if (text) {
                triggerSound('success');
                onInsertText(text);
                return;
              }
            } catch {
              // Clipboard API denied in restricted environment
            }
            const fallback = window.prompt('Paste text/command here:');
            if (fallback) {
              triggerSound('success');
              onInsertText(fallback);
            } else {
              triggerSound('click');
            }
          }}
          className="bg-emerald-950 hover:bg-emerald-900 border border-[#00ff66]/60 text-[#00ff66] hover:text-white px-2.5 py-1 rounded text-xs font-black shrink-0"
          title="Paste from clipboard"
        >
          PASTE
        </button>
      </div>
    </div>
  );
};
