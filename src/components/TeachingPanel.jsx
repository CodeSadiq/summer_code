import React from 'react';
import { useTeachingState } from '../contexts/TeachingContext';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import clsx from 'clsx';

export default function TeachingPanel() {
  const {
    isActive, mode, isSpeaking, showContinueButton, userHasRun,
    stopTeaching, togglePause, isPaused, continueTeaching, explainLastTopic
  } = useTeachingState();

  if (!isActive) return null;

  const getStatusText = () => {
    switch (mode) {
      case 'EXPLAINING': return "Analyzing the topic now...";
      case 'BOT_CODING': return "I am writing the code...";
      case 'AT_CODE_BLOCK': return showContinueButton ? "AB AAP TRY KARO" : "Wait for instruction";
      case 'USER_TRYING': return userHasRun ? "Great! Now run the code." : "Try editing then click Run!";
      default: return "Ready to start teaching!";
    }
  };

  return (
    <aside className={clsx(
      "fixed top-16 right-0 w-full md:w-[380px] h-[calc(100vh-64px)] z-50 flex flex-col transition-all duration-700 ease-in-out",
      isActive ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Inner Engine Card */}
      <div className="flex-1 mx-6 mt-8 mb-4 rounded-[2.5rem] border border-[#dcb46e]/60 dark:border-white/10 flex flex-col bg-gradient-to-b from-cyan-50/80 dark:from-[#0f172a]/95 to-transparent dark:bg-[#020617]/50 shadow-[0_10px_30px_rgba(0,0,0,0.02)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)] overflow-hidden relative backdrop-blur-md">
        
        {/* Label Header */}
        <div className="pt-8 pb-6 text-center border-b border-cyan-100/50 dark:border-white/5 bg-cyan-50/30 dark:bg-white/5">
          <span className="text-[10px] font-black tracking-[0.4em] text-slate-800 dark:text-slate-400 uppercase select-none">
            Teaching Engine Active
          </span>
        </div>

        {/* Robot Visuals Area */}
        <div className="flex-1 flex flex-col items-center justify-center px-10 pb-8">
          <div className={clsx(
            "relative w-48 h-48 rounded-full bg-gradient-to-br from-[#1e293b] to-[#020617] flex items-center justify-center transition-all duration-700 shadow-[0_25px_60px_rgba(0,0,0,0.6)] border border-white/5",
            isSpeaking && "ring-[2px] ring-cyan-400/20 shadow-cyan-400/10",
          )}>
            {/* Glowing Eyes */}
            <div className="flex gap-7 absolute top-[38%]">
              <div className={clsx(
                "w-2.5 bg-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]",
                isSpeaking ? "h-8" : "h-3.5"
              )} />
              <div className={clsx(
                "w-2.5 bg-cyan-400 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(34,211,238,0.8)]",
                isSpeaking ? "h-8" : "h-3.5"
              )} />
            </div>

            {/* Visualizer Mouth */}
            <div className="absolute bottom-[22%] flex gap-2 items-center h-5">
              {[1, 2, 3, 4, 5].map((bar) => (
                <div
                  key={bar}
                  className={clsx(
                    "w-1 bg-cyan-400/30 rounded-full transition-all duration-150",
                    isSpeaking ? "animate-wave h-5 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" : "h-0.5"
                  )}
                  style={isSpeaking ? { animationDelay: `${bar * 0.1}s` } : {}}
                />
              ))}
            </div>
          </div>

          <div className="mt-14 text-center max-w-[260px] px-6">
            <p className="text-[13px] font-semibold text-slate-700 dark:text-slate-300 italic tracking-tight leading-relaxed animate-entrance drop-shadow-sm">
              "{getStatusText()}"
            </p>
          </div>
        </div>
      </div>
      {/* End of Inner Card */}

      {/* Controls Area - Perfectly Formatted Buttons */}
      <div className="px-6 pb-8 flex flex-col gap-4">

        {/* State-aware Instruction Bar */}
        {mode === 'AT_CODE_BLOCK' && !showContinueButton && (
          <div className="w-full py-5 bg-[#1e293b]/5 dark:bg-[#1e293b]/50 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400 font-black rounded-[2rem] flex justify-center items-center gap-3 text-[11px] tracking-[0.3em] uppercase shadow-inner">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-[0_0_8px_cyan] animate-pulse" />
            AB AAP TRY KARO
          </div>
        )}

        {mode === 'AT_CODE_BLOCK' && showContinueButton && (
          <div className="flex flex-col gap-4">
            <button
              onClick={explainLastTopic}
              className="bg-white dark:bg-white/5 border border-slate-300 dark:border-white/5 text-slate-700 dark:text-white p-5 rounded-[2rem] hover:bg-slate-50 dark:hover:bg-white/10 flex justify-center gap-3 font-black text-[11px] tracking-widest items-center transition-all active:scale-95 shadow-sm"
            >
              <RotateCcw size={16} /> EXPLAIN AGAIN
            </button>
            <button
              onClick={continueTeaching}
              className="bg-gradient-to-r from-[#d9a05b] to-[#c18d2f] dark:bg-[#FDE047] text-[#0f172a] p-5 rounded-[2rem] hover:brightness-110 flex justify-center gap-3 font-black text-[11px] tracking-widest items-center transition-all active:scale-95 shadow-md dark:shadow-[0_20px_40px_rgba(253,224,71,0.15)]"
            >
              GO AHEAD <ChevronRight size={16} />
            </button>
          </div>
        )}

        {mode === 'USER_TRYING' && userHasRun && (
          <button
            onClick={continueTeaching}
            className="w-full bg-cyan-500 dark:bg-cyan-400 font-black py-5 text-white dark:text-[#0f172a] rounded-[2rem] shadow-md dark:shadow-[0_20px_40px_rgba(34,211,238,0.2)] hover:bg-cyan-400 flex justify-center items-center gap-3 text-[11px] tracking-[0.2em] transition-all active:scale-95"
          >
            CONTINUE TEACHING <ChevronRight size={16} />
          </button>
        )}

        {/* Persistent Engine Controls */}
        <div className="flex gap-4 mt-2 h-[54px]">
          <button
            onClick={togglePause}
            className={clsx(
              "flex-1 rounded-[1.5rem] flex items-center justify-center gap-3 text-[11px] font-black tracking-[0.3em] transition-all active:scale-95 uppercase border",
              isPaused
                ? "bg-white dark:bg-slate-800/80 border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 shadow-sm"
                : "bg-gradient-to-b from-[#dcb46e] to-[#c18d30] dark:from-[#eab308] dark:to-[#a16207] text-[#0f172a] shadow-md border-transparent hover:brightness-110"
            )}
          >
            {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>

          <button
            onClick={stopTeaching}
            className="w-[54px] bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group active:scale-90 shadow-sm"
          >
            <div className="w-4 h-4 rounded-[4px] border-2 border-slate-400 dark:border-slate-500 group-hover:bg-slate-300 dark:group-hover:bg-slate-400 group-hover:border-slate-300 dark:group-hover:border-slate-400 transition-all"></div>
          </button>
        </div>
      </div>
    </aside>
  );
}
