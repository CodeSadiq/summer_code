import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
      "bg-white dark:bg-[#0f172a] text-slate-600 min-h-[calc(100vh-64px)] hidden md:flex flex-col fixed left-0 top-16 z-30 transition-[width] duration-500 ease-in-out select-none border-r border-slate-100 dark:border-white/5",
      collapsed ? "w-16" : "w-[240px]"
    )}>

      {/* Collapse toggle */}
      <div className={clsx(
        "flex items-center px-4 pt-6 pb-4",
        collapsed ? "justify-center" : "justify-between"
      )}>
        {!collapsed && (
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-600 tracking-[0.3em] uppercase">
            {(lessons[0]?.category || 'HTML')} Course
          </span>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Lesson list */}
      <nav className="flex flex-col gap-0.5 px-2 pb-6">
        {lessons.map((lesson, idx) => (
          <NavLink
            to={`/lessons/${lesson.slug}`}
            key={lesson.slug}
            title={collapsed ? lesson.title : ''}
            className={({ isActive }) => clsx(
              "relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
              collapsed ? "justify-center" : "",
              isActive
                ? "bg-slate-100 dark:bg-white/5 text-slate-900 dark:text-white"
                : "text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-slate-300"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Active dot */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-emerald-400 rounded-r-full" />
                )}

                {/* Number */}
                <span className={clsx(
                  "text-[10px] font-bold shrink-0 w-5 text-center",
                  isActive ? "text-emerald-500" : "text-slate-300 dark:text-slate-600"
                )}>
                  {String(idx + 1).padStart(2, '0')}
                </span>

                {/* Title */}
                {!collapsed && (
                  <span className="text-xs font-medium truncate leading-tight">
                    {lesson.title}
                  </span>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
