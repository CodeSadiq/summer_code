import React from 'react';
import { useTeachingState } from '../contexts/TeachingContext';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function TeachingPanel() {
  const {
    isActive, mode, isSpeaking, showContinueButton, userHasRun,
    stopTeaching, togglePause, isPaused, continueTeaching, explainLastTopic,
    startCodeExplanation
  } = useTeachingState();

  const [canExplainCode, setCanExplainCode] = React.useState(false);

  React.useEffect(() => {
    if (mode === 'WAITING_TO_TRY') {
      setCanExplainCode(false);
      const timer = setTimeout(() => setCanExplainCode(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [mode]);

  const getStatusText = () => {
    switch (mode) {
      case 'EXPLAINING': return "Explaining the topic...";
      case 'EXPLAINING_CODE': return "Explaining the code...";
      case 'WAITING_TO_TRY': return "Try out this code!";
      case 'BOT_CODING': return "I am writing the code...";
      case 'AT_CODE_BLOCK': return showContinueButton ? "Your turn to try!" : "Wait for instruction";
      case 'USER_TRYING': return userHasRun ? "Great! Now run the code." : "Try editing then click Run!";
      default: return "Ready to start teaching!";
    }
  };

  return (
    <aside
      className={clsx(
        "fixed top-16 right-0 w-full md:w-[260px] h-[calc(100vh-64px)] z-50",
        "flex flex-col",
        isActive ? "pointer-events-auto" : "pointer-events-none"
      )}
      style={{
        transform: isActive ? "translateX(0)" : "translateX(110%)",
        opacity: isActive ? 1 : 0,
        transition: "transform 500ms cubic-bezier(0.16, 1, 0.3, 1), opacity 400ms",
      }}
    >
      {/* Single unified container */}
      <div className="w-full flex-1 border-l border-slate-200 bg-white overflow-hidden flex flex-col shadow-2xl">

        {/* Header */}
        <div className="px-6 pt-6 pb-5 border-b border-slate-100 text-center">
          <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase select-none">
            Guided Teaching Mode
          </span>
        </div>

        {/* Bot face */}
        <div className="flex-1 flex flex-col items-center justify-center py-8 gap-5">
          {/* Outer ring */}
          <div className="rounded-full p-2 bg-slate-50 border border-slate-100">
            <div className="relative w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center shadow-inner">

              {/* Eyes */}
              <div className="flex gap-6 absolute top-[34%]">
                <div className="w-[10px] h-6 rounded-full bg-blue-400" />
                <div className="w-[10px] h-6 rounded-full bg-blue-400" />
              </div>

              {/* Mouth dots */}
              <div className="absolute bottom-[27%] flex items-center gap-1.5">
                {[0, 0.2, 0.4, 0.2, 0].map((delay, i) => (
                  <div
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-blue-400/80"
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
          <p className="text-sm font-medium text-slate-600 px-6 text-center">
            "{getStatusText()}"
          </p>
        </div>

        {/* Controls */}
        <div className="px-5 pb-6 flex flex-col gap-3 border-t border-slate-100 pt-5">

          {/* Wait state */}
          {mode === 'AT_CODE_BLOCK' && !showContinueButton && (
            <div className="w-full py-3 bg-slate-50 border border-slate-200 text-slate-500 font-semibold rounded-xl flex justify-center items-center gap-2 text-[11px] tracking-widest uppercase">
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
              Your turn to try
            </div>
          )}

          {/* Code block actions */}
          {mode === 'AT_CODE_BLOCK' && showContinueButton && (
            <div className="flex flex-col gap-2">
              <button
                onClick={explainLastTopic}
                className="w-full py-3 rounded-xl border border-slate-200 bg-white text-slate-700 text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-blue-600 transition-all active:scale-95"
              >
                <RotateCcw size={14} /> Explain Again
              </button>
              <button
                onClick={continueTeaching}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
              >
                Go Ahead <ChevronRight size={16} />
              </button>
            </div>
          )}

          {/* Continue after user tried */}
          {mode === 'USER_TRYING' && userHasRun && (
            <button
              onClick={continueTeaching}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold tracking-widest uppercase flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm"
            >
              Continue <ChevronRight size={16} />
            </button>
          )}

          {/* Pause / Stop row */}
          {mode === 'WAITING_TO_TRY' ? (
            <div className="flex gap-2 h-12">
              <button
                onClick={canExplainCode ? startCodeExplanation : undefined}
                className={clsx(
                  "flex-1 rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold tracking-[0.1em] uppercase transition-all shadow-sm",
                  canExplainCode
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white active:scale-95 border-emerald-600"
                    : "bg-amber-50 text-amber-600 border border-amber-200/60 pointer-events-none"
                )}
              >
                {!canExplainCode ? "Ab aap try kro..." : "Explain Code"}
              </button>
              <button
                onClick={stopTeaching}
                className="w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all group active:scale-90"
                title="Stop Teaching"
              >
                <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-400 group-hover:bg-red-500 transition-colors" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2 h-12">
              <button
                onClick={togglePause}
                className={clsx(
                  "flex-1 rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold tracking-widest uppercase transition-all active:scale-95",
                  isPaused
                    ? "bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100"
                    : "bg-slate-900 text-white hover:bg-slate-800 shadow-sm"
                )}
              >
                {isPaused ? <Play size={14} fill="currentColor" /> : <Pause size={14} fill="currentColor" />}
                {isPaused ? "Resume" : "Pause"}
              </button>

              <button
                onClick={stopTeaching}
                className="w-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-red-50 hover:border-red-200 transition-all group active:scale-90"
                title="Stop Teaching"
              >
                <div className="w-3.5 h-3.5 rounded-[3px] bg-slate-400 group-hover:bg-red-500 transition-colors" />
              </button>
            </div>
          )}

        </div>
      </div>
    </aside>
  );
}
