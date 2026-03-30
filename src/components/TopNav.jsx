import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, Sparkles } from 'lucide-react';
import { useTeachingState } from '../contexts/TeachingContext';
import clsx from 'clsx';

export default function TopNav() {
  const { isActive, startTeaching, activeLesson } = useTeachingState();

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white/60 backdrop-blur-2xl border-b border-slate-100/80 z-[100] flex items-center px-6 md:px-12 justify-between select-none shadow-[0_1px_40px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-3 transition-all active:scale-95 group">
          <div className="w-10 h-10 rounded-[14px] bg-slate-900 flex items-center justify-center p-2.5 shadow-2xl shadow-slate-900/10 group-hover:bg-blue-600 group-hover:shadow-blue-600/20 transition-all duration-700">
            <Code2 className="text-white" size={22} />
          </div>
          <span className="text-lg font-black text-slate-900 tracking-tighter uppercase tracking-[0.08em] transition-colors group-hover:text-blue-600">SUMMERCODE</span>
        </Link>
        
        <div className="hidden lg:flex gap-2 ml-4 items-center">
          {["HTML", "CSS", "JavaScript", "Java", "DOM", "GitHub", "Node.js", "SQL", "Admin"].map(topic => (
            <button key={topic} className={clsx(
              "px-5 py-2 rounded-full text-[11px] font-black tracking-widest uppercase transition-all duration-500",
              topic === 'HTML' 
                ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' 
                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-100/40'
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
            className="hidden md:flex items-center gap-3 px-7 py-2.5 text-[10px] font-black text-slate-900 bg-white border border-slate-200 rounded-full hover:bg-slate-50 active:scale-95 shadow-xl shadow-slate-100/50 transition-all tracking-widest uppercase"
          >
            <Sparkles size={16} className="text-[#10b981]" fill="currentColor" />
            GUIDED TEACHING
          </button>
        )}
        
        <button className="px-10 py-2.5 rounded-full text-[10px] font-black text-white bg-slate-900 hover:bg-black hover:shadow-2xl hover:shadow-slate-900/20 transition-all active:scale-95 uppercase tracking-[0.25em]">
          Login
        </button>
      </div>
    </nav>
  );
}
