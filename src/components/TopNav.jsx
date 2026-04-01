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
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16">
      <div className="flex items-center gap-10">
        <Link to="/" className="flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-300 active:scale-95 group cursor-pointer">
          <div className="w-10 h-10 rounded-[14px] bg-white border border-slate-200 flex items-center justify-center p-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
            <Code2 className="text-slate-700" size={22} />
          </div>
          <span className="text-lg font-black text-slate-800 tracking-tighter uppercase tracking-[0.08em]">SUMMERCODE</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-1 ml-4">
          {topics.map(topic => (
            <button key={topic} className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all",
              topic === activeTopic 
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200 shadow-sm' 
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            )}>
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!isActive && activeLesson && (
          <button 
            onClick={() => startTeaching(activeLesson)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-colors active:scale-95 shadow-sm"
          >
            <Sparkles size={16} className="text-yellow-400" />
            Start Guided Teaching
          </button>
        )}
      </div>
    </nav>
  );
}
