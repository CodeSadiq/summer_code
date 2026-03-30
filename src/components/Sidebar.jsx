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
      "bg-white dark:bg-[#0f172a]/80 backdrop-blur-2xl text-slate-600 min-h-[calc(100vh-64px)] hidden md:flex flex-col fixed left-0 top-16 z-30 transition-all duration-700 ease-in-out select-none border-r border-[#dcb46e]/40 dark:border-[#FDE047]/20",
      collapsed ? "w-16" : "w-[260px]"
    )}>
      <div className="flex-1 overflow-y-auto">
        <div className="p-0">
          {/* Header Area */}
          <div className={clsx("flex flex-col px-7 pt-8 pb-6 transition-all", collapsed ? "items-center gap-8" : "items-start gap-4")}>
            <div className="flex w-full items-center justify-between">
              {!collapsed && (
                <h2 className="text-[10px] font-black text-slate-400 dark:text-slate-500 tracking-[0.4em] uppercase truncate pr-2">
                  {(lessons[0]?.category || 'HTML') + ' COURSE'}
                </h2>
              )}

              <button
                onClick={() => setCollapsed(!collapsed)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all outline-none"
              >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
              </button>
            </div>
            {!collapsed && <div className="h-px w-3/4 bg-gradient-to-r from-[#dcb46e]/30 dark:from-white/10 to-transparent"></div>}
          </div>

          <nav className="flex flex-col px-3 gap-0.5">
            {lessons.map((lesson, idx) => (
              <NavLink
                to={`/lessons/${lesson.slug}`}
                key={lesson.slug}
                title={collapsed ? lesson.title : ''}
                className={({ isActive }) => clsx(
                  "relative flex items-center gap-4 px-4 py-3 rounded-[1.5rem] transition-all duration-300 group hover:-translate-y-0.5 mx-2 dark:rounded-2xl",
                  isActive
                    ? 'bg-cyan-50 text-slate-800 shadow-sm border border-cyan-200 bg-opacity-80 dark:bg-cyan-500/10 dark:text-white dark:border-cyan-400/20 dark:shadow-[0_0_15px_rgba(34,211,238,0.15)]'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50 border border-transparent dark:hover:text-white dark:hover:bg-slate-800/50',
                  collapsed ? "justify-center px-0 mx-0 rounded-2xl" : ""
                )}
              >
                {({ isActive }) => (
                  <>
                    {/* Minimalist Active Tab Indicator */}
                    <div className={clsx(
                      "absolute left-1.5 dark:left-0 top-1/4 bottom-1/4 w-[3px] bg-cyan-400 rounded-full dark:rounded-r-full dark:shadow-[0_0_8px_rgba(34,211,238,0.8)] transition-all duration-500",
                      isActive ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
                    )} />

                    <div className={clsx(
                      "text-[9px] font-black tracking-tight shrink-0 transition-colors uppercase",
                      isActive ? "text-cyan-600 dark:text-cyan-400 drop-shadow-sm dark:drop-shadow-none" : "text-slate-300 dark:text-slate-500 group-hover:text-slate-400 dark:group-hover:text-slate-300"
                    )}>
                      {String(idx + 1).padStart(2, '0')}
                    </div>

                    {!collapsed && (
                      <>
                        <span className="truncate text-xs font-semibold tracking-tight grow uppercase">
                          {lesson.title}
                        </span>
                        {lesson.locked ? (
                          <Lock size={10} className="text-slate-300" />
                        ) : (
                          <ArrowRight size={12} className="opacity-0 -translate-x-1 group-hover:opacity-40 group-hover:translate-x-0 transition-all text-slate-500" />
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
