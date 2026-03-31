import React from 'react';
import { useTeachingState } from '../contexts/TeachingContext';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function TeachingPanel() {
  const {
    isActive, mode, isSpeaking, showContinueButton, userHasRun,
    stopTeaching, togglePause, isPaused, continueTeaching, explainLastTopic
  } = useTeachingState();

  const getStatusText = () => {
    switch (mode) {
      case 'EXPLAINING': return "Explaining the topic...";
      case 'BOT_CODING': return "I am writing the code...";
      case 'AT_CODE_BLOCK': return showContinueButton ? "Your turn to try!" : "Wait for instruction";
      case 'USER_TRYING': return userHasRun ? "Great! Now run the code." : "Try editing then click Run!";
      default: return "Ready to start teaching!";
    }
  };

  return (
    <aside
      className={clsx(
        "fixed top-16 right-0 w-full md:w-[300px] h-[calc(100vh-64px)] z-50",
        "flex flex-col",
        isActive ? "pointer-events-auto" : "pointer-events-none"
      )}
      style={{
        transform: isActive ? "translateX(0)" : "translateX(110%)",
        opacity: isActive ? 1 : 0,
        transition: "transform 900ms cubic-bezier(0.16, 1, 0.3, 1), opacity 600ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "transform, opacity",
      }}
    >
      {/* Single unified container */}
      <div className="w-full flex-1 border-l border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 dark:border-white/5 text-center">
          <span className="text-[10px] font-black tracking-[0.35em] text-slate-400 dark:text-slate-500 uppercase select-none">
            Guided Teaching Mode
          </span>
        </div>

        {/* Bot face */}
        <div className="flex-1 flex flex-col items-center justify-center py-8 gap-5">
          {/* Outer ring */}
          <div className="rounded-full p-[5px] bg-slate-100 dark:bg-white/5">
            <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-[#162032] to-[#0b1520] flex items-center justify-center">

              {/* Eyes */}
              <div className="flex gap-6 absolute top-[34%]">
                <div className="w-[11px] h-7 rounded-full bg-emerald-400" />
                <div className="w-[11px] h-7 rounded-full bg-emerald-400" />
              </div>

              {/* Mouth dots */}
              <div className="absolute bottom-[27%] flex items-center gap-[5px]">
                {[0, 0.2, 0.4, 0.2, 0].map((delay, i) => (
                  <div
                    key={i}
                    className="w-[4px] h-[4px] rounded-full bg-emerald-400/70"
                    style={{
                      animation: isSpeaking
                        ? `dot-pulse 1.6s ease-in-out ${delay}s infinite`
                        : 'none',
                      animationPlayState: isPaused ? 'paused' : 'running',
                    }}
                  />
                ))}
              </div>

            </div>
          </div>

          {/* Status text */}
          <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400 italic text-center px-6">
            "{getStatusText()}"
          </p>
        </div>

        {/* Controls */}
        <div className="px-5 pb-6 flex flex-col gap-3 border-t border-slate-100 dark:border-white/5 pt-5">

          {/* Wait state */}
          {mode === 'AT_CODE_BLOCK' && !showContinueButton && (
            <div className="w-full py-4 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-semibold rounded-2xl flex justify-center items-center gap-2 text-[11px] tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Your turn to try
            </div>
          )}

          {/* Code block actions */}
          {mode === 'AT_CODE_BLOCK' && showContinueButton && (
            <div className="flex flex-col gap-2">
              <button
                onClick={explainLastTopic}
                className="w-full py-3.5 rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-700 dark:text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-white/10 transition-all active:scale-95"
              >
                <RotateCcw size={13} /> Explain Again
              </button>
              <button
                onClick={continueTeaching}
                className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                Go Ahead <ChevronRight size={14} />
              </button>
            </div>
          )}

          {/* Continue after user tried */}
          {mode === 'USER_TRYING' && userHasRun && (
            <button
              onClick={continueTeaching}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              Continue <ChevronRight size={14} />
            </button>
          )}

          {/* Pause / Stop row */}
          <div className="flex gap-2 h-12">
            <button
              onClick={togglePause}
              className={clsx(
                "flex-1 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-all active:scale-95 border",
                isPaused
                  ? "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  : "bg-gradient-to-b from-[#dcb46e] to-[#c18d30] border-transparent text-[#0f172a] hover:brightness-110"
              )}
            >
              {isPaused ? <Play size={13} fill="currentColor" /> : <Pause size={13} fill="currentColor" />}
              {isPaused ? "Resume" : "Pause"}
            </button>

            <button
              onClick={stopTeaching}
              className="w-12 rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-500/10 hover:border-red-200 dark:hover:border-red-500/20 transition-all group active:scale-90"
            >
              <div className="w-3.5 h-3.5 rounded-sm bg-slate-300 dark:bg-slate-600 group-hover:bg-red-400 transition-colors" />
            </button>
          </div>

        </div>
      </div>
    </aside>
  );
}
