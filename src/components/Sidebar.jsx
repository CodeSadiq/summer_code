import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Lock, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ collapsed, setCollapsed }) {
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <aside className={clsx(
      "bg-[#0f172a] text-slate-300 min-h-[calc(100vh-64px)] hidden md:flex flex-col fixed left-0 top-16 z-30 transition-all duration-700 ease-in-out select-none border-r border-white/5",
      collapsed ? "w-16" : "w-[260px]"
    )}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-0">
          {/* Header Area */}
          <div className={clsx("flex items-center justify-between px-7 py-8 transition-all", collapsed ? "flex-col gap-8" : "")}>
            {!collapsed && (
              <h2 className="text-[10px] font-black text-white/20 tracking-[0.4em] uppercase truncate pr-2">
                {(lessons[0]?.category || 'HTML') + ' COURSE'}
              </h2>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-white/10 hover:text-white/40 transition-all outline-none"
            >
              {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>
          </div>

          <nav className="flex flex-col px-3 gap-0.5">
            {lessons.map((lesson, idx) => (
              <NavLink
                to={`/lessons/${lesson.slug}`}
                key={lesson.slug}
                title={collapsed ? lesson.title : ''}
                className={({ isActive }) => clsx(
                  "relative flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? 'bg-white/5 text-white shadow-xl shadow-black/20 border border-white/5' 
                    : 'text-white/30 hover:text-white/60 hover:bg-white/[0.02]',
                  collapsed ? "justify-center px-0" : ""
                )}
              >
                {({ isActive }) => (
                  <>
                    {/* Minimalist Active Tab Indicator */}
                    <div className={clsx(
                      "absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-[#10b981] rounded-r-full transition-all duration-500",
                      isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                    )} />

                    <div className={clsx(
                      "text-[9px] font-black tracking-tight shrink-0 transition-colors uppercase",
                      isActive ? "text-[#10b981]" : "text-white/10"
                    )}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                    
                    {!collapsed && (
                      <>
                        <span className="truncate text-xs font-semibold tracking-tight grow uppercase">
                          {lesson.title}
                        </span>
                        {lesson.locked ? (
                          <Lock size={10} className="text-white/5" />
                        ) : (
                          <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all text-white" />
                        )}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
}
