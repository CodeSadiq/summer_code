import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, BookOpen } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar({ collapsed, setCollapsed }) {
  const [lessons, setLessons] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    fetch('http://localhost:5000/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error(err));
  }, []);

  // Find the current lesson to determine the active course
  const currentLesson = lessons.find(l => l.slug === slug);
  const currentCourse = currentLesson?.course || lessons[0]?.course || 'HTML';

  // Filter lessons to only show those in the current course
  const filteredLessons = lessons.filter(l => l.course === currentCourse);

  return (
    <aside className={clsx(
      "bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-white/5 flex flex-col fixed left-0 top-16 z-30 transition-[width,background-color] duration-300 ease-in-out h-[calc(100vh-64px)] overflow-y-auto",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]">
            <BookOpen size={14} className="text-blue-500" />
            {currentCourse} COURSE
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 rounded bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </div>

      {/* Search Bar */}
      {!collapsed && (
        <div className="px-4 py-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Search lessons..." 
              className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>
      )}

      {/* Lesson list */}
      <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
        {filteredLessons.map((lesson, idx) => (
          <NavLink
            to={`/lessons/${lesson.slug}`}
            key={lesson.slug}
            title={collapsed ? lesson.title : ''}
            className={({ isActive }) => clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
              collapsed ? "justify-center" : "",
              isActive
                ? "bg-slate-50 dark:bg-white/10 text-blue-700 dark:text-blue-400 font-semibold"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            {({ isActive }) => (
              <>
                {/* Number Badge */}
                <span className={clsx(
                  "w-6 h-6 flex items-center justify-center flex-shrink-0 rounded-full text-[10px] font-medium",
                  isActive ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400" : "bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-500"
                )}>
                  {idx + 1}
                </span>

                {/* Title */}
                {!collapsed && (
                  <span className="truncate">
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
