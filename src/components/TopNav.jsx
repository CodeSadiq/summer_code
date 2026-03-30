import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Sparkles } from 'lucide-react';
import { useTeachingState } from '../contexts/TeachingContext';
import clsx from 'clsx';

export default function TopNav() {
  const { isActive, startTeaching, activeLesson } = useTeachingState();

  const topics = ["HTML", "CSS", "JavaScript", "Java", "DOM", "GitHub", "Node.js", "SQL"];
  const activeTopic = "HTML"; // This should be dynamic based on your current course route

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#fafaf9]/90 dark:bg-[#0f172a]/80 backdrop-blur-2xl border-b border-[#eab308]/20 dark:border-[#FDE047]/20 z-[100] flex items-center px-6 md:px-12 justify-between select-none shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-300 active:scale-95 group">
          <div className="w-10 h-10 rounded-[14px] glass-panel bg-white dark:bg-transparent border border-slate-200 dark:border-white/10 flex items-center justify-center p-2.5">
            <Code2 className="text-slate-700 dark:text-cyan-400 dark:drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" size={22} />
          </div>
          <span className="text-lg font-black text-slate-800 dark:text-white tracking-tighter uppercase tracking-[0.08em] transition-colors">SUMMERCODE</span>
        </Link>
        
        <div className="hidden lg:flex items-center p-1 bg-white dark:bg-[#1e293b]/50 rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm ml-4 relative">
          {topics.map(topic => (
            <button key={topic} className={clsx(
              "px-5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 relative z-10",
              topic === activeTopic 
                ? 'bg-gradient-to-r from-[#dcb46e] to-[#c18d30] dark:from-[#FDE047] dark:to-[#eab308] text-[#0f172a] shadow-md dark:shadow-[0_0_15px_rgba(253,224,71,0.3)]' 
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:-translate-y-0.5'
            )}>
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6">
        {!isActive && activeLesson && (
          <button 
            onClick={() => startTeaching(activeLesson)}
            className="flex items-center gap-3 px-8 py-2.5 text-[10px] font-black text-white bg-slate-800 dark:bg-[#1e293b] rounded-full hover:bg-black dark:hover:bg-black active:scale-95 shadow-md shadow-slate-200 dark:shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all tracking-widest uppercase dark:border dark:border-cyan-500/30"
          >
            <Sparkles size={16} className="text-[#10b981] dark:text-cyan-400" fill="currentColor" />
            GUIDED TEACHING
          </button>
        )}
        
        <button className="px-8 py-2.5 rounded-full text-[10px] font-black text-slate-700 dark:text-[#FDE047]/80 bg-transparent border border-slate-300 dark:border-[#FDE047]/20 hover:border-slate-400 dark:hover:border-[#FDE047]/40 hover:bg-slate-50 dark:hover:bg-transparent dark:hover:text-[#FDE047] transition-all active:scale-95 uppercase tracking-[0.1em] shadow-sm">
          Login
        </button>
      </div>
    </nav>
  );
}
