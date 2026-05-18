/**
 * ==========================================
 * NAVIGATION SIDEBAR - Sidebar.jsx
 * ==========================================
 * This component handles the list of lessons on the left side of the screen.
 * It's dynamic—it changes its list based on which course you are currently studying.
 */

import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useLocation, useNavigate } from 'react-router-dom'; // Tools for links and URL reading
import { ChevronLeft, ChevronRight, Search, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';
import { useTeachingState } from '../contexts/TeachingContext'; // AI State for mobile toggle
import { API_URL } from '../config';

export default function Sidebar({ collapsed, setCollapsed }) {
  // Pulling 'isSidebarOpen' to handle mobile "drawer" behavior
  const { isSidebarOpen, setIsSidebarOpen } = useTeachingState();
  const [lessons, setLessons] = useState([]); // All lessons from DB
  const [courses, setCourses] = useState([]);   // All courses (e.g., HTML, Python)
  const { slug, courseId, chapterId } = useParams(); // Current lesson ID or practice course from URL
  const location = useLocation();
  const navigate = useNavigate();
  const isPracticePage = location.pathname.startsWith('/practice/');

  // 1. FETCH DATA: Get the list of all lessons and courses when sidebar loads
  useEffect(() => {
    fetch(`${API_URL}/api/lessons`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLessons(data);
      });

    fetch(`${API_URL}/api/courses`, { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
      });
  }, [slug]);

  /**
   * COURSE DETECTION LOGIC
   * We look at the current lesson (from the URL slug) to figure out which 
   * course (HTML, JS, etc.) we should show in the sidebar.
   */

  // Filter lessons to only show the ones belonging to the current course
  const currentLesson = lessons.find(l => l.slug === slug);
  const currentCourse = currentLesson?.course || (courseId === 'Course' ? chapterId : courseId) || (lessons.length > 0 ? lessons[0].course : 'HTML');
  const filteredLessons = lessons
    .filter(l => l.course === currentCourse)
    .sort((a, b) => (a.chapterOrder || 0) - (b.chapterOrder || 0));

  return (
    <>
      {/* MOBILE BACKDROP: Dim the screen when the sidebar is open on phones */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)} // Close when clicking outside
        />
      )}

      <aside className={clsx(
        "border-r flex flex-col fixed left-0 z-50 transition-all duration-300 ease-in-out h-full overflow-y-auto",
        isPracticePage ? "bg-[#0f172a] border-slate-800/50 top-0" : "bg-white border-slate-200 top-16 h-[calc(100vh-64px)]",
        // RESPONSIVE BEHAVIOR:
        // Mobile: Moves in/out based on 'isSidebarOpen'
        // Desktop: Stays visible but can be 'collapsed' to a thin bar
        isSidebarOpen ? "translate-x-0 w-64 shadow-2xl" : "-translate-x-full md:translate-x-0",
        collapsed ? "md:w-16" : "md:w-64"
      )}>

        {/* 1. Header: Shows course name and the collapse toggle button */}
        <div className={clsx(
          "p-4 border-b flex items-center justify-between",
          isPracticePage ? "border-slate-800/50" : "border-slate-100"
        )}>
          {(!collapsed || isSidebarOpen) && (
            <div className={clsx(
              "flex items-center gap-2 font-black uppercase tracking-[0.1em] text-[13px]",
              isPracticePage ? "text-slate-200" : "text-slate-900"
            )}>
              {currentCourse}
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={clsx(
              "p-1 rounded hidden md:block",
              isPracticePage ? "text-slate-400 bg-slate-800 hover:bg-slate-700" : "text-slate-400 bg-slate-50"
            )}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* 2. Lesson List: Using NavLink for automatic "active" styling */}
        <nav className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto">
          {filteredLessons.map((lesson, idx) => (
            <NavLink
              to={isPracticePage ? `/practice/${currentCourse}/${lesson.slug}` : `/lessons/${lesson.slug}`}
              key={lesson.slug}
              title={collapsed ? lesson.title : ''}
              className={({ isActive }) => clsx(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                (collapsed && !isSidebarOpen) ? "justify-center" : "",
                // If this link matches the current URL (either as a lesson or as the current practice topic)
                (isActive || (isPracticePage && chapterId === lesson.slug))
                  ? (isPracticePage ? "bg-slate-700 text-white font-bold" : "bg-slate-100 text-slate-900 font-bold")
                  : (isPracticePage ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-50")
              )}
            >
              {({ isActive }) => (
                <>
                  {/* Step Number Badge */}
                  <span className={clsx(
                    "w-6 h-6 flex items-center justify-center flex-shrink-0 rounded-full text-[10px] font-medium",
                    isActive 
                      ? (isPracticePage ? "bg-blue-500 text-white" : "bg-slate-900 text-white") 
                      : (isPracticePage ? "bg-slate-800 text-slate-400" : "bg-slate-100 text-slate-500")
                  )}>
                    {idx + 1}
                  </span>

                  {/* Lesson Title (Hidden if collapsed) */}
                  {(!collapsed || isSidebarOpen) && (
                    <span className={clsx(
                      "truncate",
                      isPracticePage && !isActive ? "text-slate-300" : ""
                    )}>
                      {lesson.title}
                    </span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
        
        {/* 3. Exit Practice Button: Only shown in practice mode since navbar is hidden */}
        {isPracticePage && (
          <div className={clsx(
            "p-3 border-t",
            isPracticePage ? "border-slate-800/50 bg-[#0f172a]" : "border-slate-100 bg-white"
          )}>
            <button
              onClick={() => navigate(-1)}
              className={clsx(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                isPracticePage ? "text-slate-400 hover:text-white hover:bg-slate-800" : "text-slate-500 hover:bg-slate-50"
              )}
            >
              <ArrowLeft size={14} />
              {(!collapsed || isSidebarOpen) && <span>Exit Practice</span>}
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
