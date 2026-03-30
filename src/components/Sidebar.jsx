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
      "bg-[#1e1e1e] text-slate-300 min-h-[calc(100vh-64px)] hidden md:flex flex-col fixed left-0 top-16 z-30 transition-all duration-500 ease-in-out select-none border-r border-white/5 shadow-2xl",
      collapsed ? "w-16" : "w-[280px]"
    )}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-0">
          {/* Header Area */}
          <div className={clsx("flex items-center justify-between px-8 py-8 transition-all", collapsed ? "flex-col gap-8" : "")}>
            {!collapsed && (
              <h2 className="text-[10px] font-black text-white/30 tracking-[0.35em] uppercase">
                HTML COURSE
              </h2>
            )}
            
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition-all outline-none"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="flex flex-col mt-2 px-3">
            {lessons.map((lesson, idx) => (
              <NavLink
                to={`/lessons/${lesson.slug}`}
                key={lesson.slug}
                title={collapsed ? lesson.title : ''}
                className={({ isActive }) => clsx(
                  "relative flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group mb-1",
                  isActive 
                    ? 'bg-white/[0.05] text-white shadow-lg' 
                    : 'text-white/30 hover:text-white/70 hover:bg-white/[0.02]',
                  collapsed ? "justify-center px-0" : ""
                )}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Indicator Strip */}
                    <div className={clsx(
                      "absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-[#10b981] rounded-r-full transition-all duration-500",
                      isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                    )} />

                    <div className={clsx(
                      "text-[10px] font-black tracking-tighter shrink-0 transition-colors uppercase",
                      isActive ? "text-[#10b981]" : "text-white/10"
                    )}>
                      {String(idx).padStart(2, '0')}
                    </div>
                    
                    {!collapsed && (
                      <>
                        <span className="truncate text-[13px] font-bold tracking-tight grow">
                          {lesson.title}
                        </span>
                        {lesson.locked ? (
                          <Lock size={12} className="text-white/5" />
                        ) : (
                          <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0 transition-all text-white" />
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
