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
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-blue-600 rounded-lg p-1.5 flex flex-shrink-0">
            <Code2 className="text-white" size={20} />
          </div>
          <span className="text-xl font-bold text-slate-800 tracking-tight transition-colors group-hover:text-blue-600">SummerCode</span>
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
