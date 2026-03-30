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
      "fixed top-16 right-0 w-full md:w-[380px] h-[calc(100vh-64px)] bg-slate-50/50 backdrop-blur-xl border-l border-slate-100 z-50 flex flex-col shadow-[0_0_80px_rgba(0,0,0,0.02)] transition-all duration-700 ease-in-out",
      isActive ? "translate-x-0" : "translate-x-full"
    )}>
      {/* Label Header */}
      <div className="pt-10 pb-4 text-center">
        <span className="text-[10px] font-black tracking-[0.3em] text-slate-300 uppercase select-none">
          Teaching Engine Active
        </span>
      </div>

      {/* Robot Visuals Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-10 pb-8">
        <div className={clsx(
          "relative w-44 h-44 rounded-full bg-[#111827] flex items-center justify-center transition-all duration-700 shadow-2xl",
          isSpeaking && "ring-[12px] ring-emerald-500/5 shadow-emerald-500/10",
          !isSpeaking && "shadow-slate-900/10"
        )}>
          {/* Glowing Eyes */}
          <div className="flex gap-6 absolute top-[40%]">
            <div className={clsx(
              "w-2.5 bg-[#10b981] rounded-full transition-all duration-300 shadow-[0_0_20px_#10b981]", 
              isSpeaking ? "h-7" : "h-3.5"
            )} />
            <div className={clsx(
              "w-2.5 bg-[#10b981] rounded-full transition-all duration-300 shadow-[0_0_20px_#10b981]", 
              isSpeaking ? "h-7" : "h-3.5"
            )} />
          </div>

          {/* Visualizer Mouth */}
          <div className="absolute bottom-[25%] flex gap-1.5 items-center h-4">
            {[1, 2, 3, 4, 5].map((bar) => (
              <div 
                key={bar} 
                className={clsx(
                  "w-1 bg-emerald-500/40 rounded-full transition-all duration-150",
                  isSpeaking ? "animate-wave h-4" : "h-0.5"
                )}
                style={isSpeaking ? { animationDelay: `${bar * 0.1}s` } : {}}
              />
            ))}
          </div>
        </div>

        <div className="mt-12 text-center max-w-[240px] px-4">
          <p className="text-[14px] font-semibold text-slate-400 italic tracking-tight leading-relaxed animate-entrance">
            "{getStatusText()}"
          </p>
        </div>
      </div>

      {/* Controls Area - Perfectly Formatted Buttons */}
      <div className="p-8 pb-12 flex flex-col gap-4">
        
        {/* State-aware Instruction Bar */}
        {mode === 'AT_CODE_BLOCK' && !showContinueButton && (
          <div className="w-full py-5 bg-white border border-slate-100 text-slate-400 font-black rounded-3xl flex justify-center items-center gap-3 text-[11px] tracking-[0.25em] uppercase shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            AB AAP TRY KARO
          </div>
        )}

        {mode === 'AT_CODE_BLOCK' && showContinueButton && (
          <div className="flex flex-col gap-3">
            <button 
              onClick={explainLastTopic} 
              className="bg-blue-600 text-white p-5 rounded-3xl hover:bg-blue-700 flex justify-center gap-2.5 font-black text-[11px] tracking-widest items-center transition-all active:scale-95 shadow-xl shadow-blue-500/30"
            >
              <RotateCcw size={16} /> EXPLAIN AGAIN
            </button>
            <button 
              onClick={continueTeaching} 
              className="bg-slate-900 text-white p-5 rounded-3xl hover:bg-black flex justify-center gap-2.5 font-black text-[11px] tracking-widest items-center transition-all active:scale-95 shadow-lg shadow-slate-900/10"
            >
              GO AHEAD <ChevronRight size={16} />
            </button>
          </div>
        )}

        {mode === 'USER_TRYING' && userHasRun && (
          <button 
            onClick={continueTeaching} 
            className="w-full bg-[#10b981] font-black py-5 text-white rounded-3xl shadow-xl shadow-emerald-500/30 hover:bg-emerald-600 flex justify-center items-center gap-2.5 text-[11px] tracking-[0.2em] transition-all"
          >
             CONTINUE TEACHING <ChevronRight size={16} />
          </button>
        )}

        {/* Persistent Engine Controls */}
        <div className="flex gap-3 mt-2">
          <button 
            onClick={togglePause} 
            className={clsx(
              "flex-1 py-4 rounded-2xl flex items-center justify-center gap-2.5 text-[11px] font-black tracking-[0.25em] transition-all shadow-md active:scale-95 uppercase",
              isPaused 
                ? "bg-[#10b981] text-white shadow-emerald-500/20" 
                : "bg-white border border-slate-200 text-slate-900 hover:border-slate-300 shadow-sm"
            )}
          >
            {isPaused ? <Play size={16} fill="currentColor" /> : <Pause size={16} fill="currentColor" />}
            <span>{isPaused ? "Resume" : "Pause"}</span>
          </button>
          
          <button 
            onClick={stopTeaching} 
            className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center hover:bg-red-50 hover:border-red-100 transition-all group shadow-sm active:scale-90"
          >
            <div className="w-4 h-4 rounded-[3px] border-2 border-slate-300 group-hover:bg-red-500 group-hover:border-red-500 transition-all"></div>
          </button>
        </div>
      </div>
    </aside>
  );
}
