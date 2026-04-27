import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import clsx from 'clsx';
import { useTeachingState } from '../contexts/TeachingContext';
import { API_URL } from '../config';

export default function Sidebar({ collapsed, setCollapsed }) {
  const { isSidebarOpen, setIsSidebarOpen } = useTeachingState();
  const [lessons, setLessons] = useState([]);
  const [topics, setTopics] = useState([]);
  const { slug } = useParams();

  useEffect(() => {
    fetch(`${API_URL}/api/lessons`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLessons(data);
        else setLessons([]);
      })
      .catch(err => {
        console.error(err);
        setLessons([]);
      });

    fetch(`${API_URL}/api/topics`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTopics(data);
        else setTopics([]);
      })
      .catch(err => {
        console.error(err);
        setTopics([]);
      });
  }, []);


  const getFirstLessonSlug = (courseName) => {
    const courseLessons = lessons.filter(l => l.course === courseName);
    if (courseLessons.length > 0) {
      return courseLessons.sort((a, b) => (a.chapterOrder || 0) - (b.chapterOrder || 0))[0].slug;
    }
    return null;
  };

  // Find the current lesson to determine the active course
  const currentLesson = lessons.find(l => l.slug === slug);
  const currentCourse = currentLesson?.course || (lessons.length > 0 ? lessons[0].course : 'HTML');

  // Filter lessons to only show those in the current course
  const filteredLessons = lessons.filter(l => l.course === currentCourse);

  return (
    <>
      {/* Mobile Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={clsx(
        "bg-white border-r border-slate-200 flex flex-col fixed left-0 top-16 z-50 transition-all duration-300 ease-in-out h-[calc(100vh-64px)] overflow-y-auto",
        isSidebarOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0",
        collapsed ? "md:w-16" : "md:w-64"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          {(!collapsed || isSidebarOpen) && (
            <div className="flex items-center gap-2 text-slate-900 font-black uppercase tracking-[0.1em] text-[13px]">
              {currentCourse} COURSE
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded bg-slate-50 hover:bg-slate-100 transition-colors hidden md:block"
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Search Bar */}
        {(!collapsed || isSidebarOpen) && (
          <div className="px-4 py-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search lessons..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
                (collapsed && !isSidebarOpen) ? "justify-center" : "",
                isActive
                  ? "bg-slate-100 text-slate-900 font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              {({ isActive }) => (
                <>
                  <span className={clsx(
                    "w-6 h-6 flex items-center justify-center flex-shrink-0 rounded-full text-[10px] font-medium",
                    isActive ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"
                  )}>
                    {idx + 1}
                  </span>
                  {(!collapsed || isSidebarOpen) && <span className="truncate">{lesson.title}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Course Switcher - For mobile users only */}
        {isSidebarOpen && topics.length > 0 && (
          <div className="mt-auto p-4 border-t border-slate-100 md:hidden">
            <div className="text-[9px] font-bold text-slate-400 tracking-widest uppercase mb-3 px-2">
              Browse Courses
            </div>
            <div className="grid grid-cols-1 gap-1">
              {topics.filter(t => t.status === 'Active').map(topic => {
                const slug = getFirstLessonSlug(topic.name);
                if (!slug) return null;
                const isActiveCourse = currentCourse === topic.name;

                return (
                  <NavLink
                    key={topic.id}
                    to={`/lessons/${slug}`}
                    className={clsx(
                      "px-3 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2",
                      isActiveCourse
                        ? "bg-slate-100 text-slate-900"
                        : "text-slate-600 hover:bg-slate-50"
                    )}
                  >
                    <div className={clsx("w-1.5 h-1.5 rounded-full", isActiveCourse ? "bg-slate-900" : "bg-slate-300")} />
                    {topic.name}
                  </NavLink>
                );
              })}
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
