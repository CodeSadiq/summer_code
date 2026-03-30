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
    <nav className="fixed top-0 left-0 right-0 h-16 bg-[#0f172a] border-b border-white/5 z-[100] flex items-center px-6 md:px-12 justify-between select-none shadow-2xl shadow-black/40">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-3 transition-all active:scale-95 group">
          <div className="w-10 h-10 rounded-[14px] bg-white flex items-center justify-center p-2.5 shadow-2xl transition-all duration-700">
            <Code2 className="text-[#0f172a]" size={22} />
          </div>
          <span className="text-lg font-black text-white tracking-tighter uppercase tracking-[0.08em] transition-colors">SUMMERCODE</span>
        </Link>
        
        <div className="hidden lg:flex items-center p-1 bg-white/5 rounded-2xl border border-white/5 ml-4 relative">
          {topics.map(topic => (
            <button key={topic} className={clsx(
              "px-5 py-2 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all duration-500 relative z-10",
              topic === activeTopic 
                ? 'text-slate-900 bg-white shadow-xl' 
                : 'text-slate-500 hover:text-white'
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
            className="flex items-center gap-3 px-8 py-2.5 text-[10px] font-black text-white bg-slate-900 rounded-full hover:bg-black active:scale-95 shadow-2xl shadow-slate-900/10 transition-all tracking-widest uppercase"
          >
            <Sparkles size={16} className="text-[#10b981]" fill="currentColor" />
            GUIDED TEACHING
          </button>
        )}
        
        <button className="px-8 py-2.5 rounded-full text-[10px] font-black text-white/40 bg-transparent border border-white/5 hover:text-white hover:bg-white/5 transition-all active:scale-95 uppercase tracking-[0.1em]">
          Login
        </button>
      </div>
    </nav>
  );
}
