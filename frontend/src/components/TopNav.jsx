import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Code2, Sparkles, Moon, Sun, ArrowRight, User } from 'lucide-react';
import { useTeachingState } from '../contexts/TeachingContext';
import clsx from 'clsx';
import { API_URL } from '../config';

export default function TopNav() {
  const { isActive, startTeaching, activeLesson } = useTeachingState();
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/topics`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTopics(data);
        else setTopics([]);
      })
      .catch(err => console.error('Error fetching topics:', err));

    fetch(`${API_URL}/api/lessons`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLessons(data);
        else setLessons([]);
      })
      .catch(err => console.error('Error fetching lessons:', err));
  }, []);

  const getFirstLessonSlug = (courseName) => {
    const courseLessons = lessons.filter(l => l.course === courseName);
    if (courseLessons.length > 0) {
      return courseLessons.sort((a, b) => (a.chapterOrder || 0) - (b.chapterOrder || 0))[0].slug;
    }
    return null;
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/');
    window.location.reload();
  };

  return (
    <nav className="sticky top-0 h-16 bg-[#fafaf9] dark:bg-slate-950 border-b border-slate-200 dark:border-slate-900 z-[100] flex items-center px-4 md:px-10 justify-between overflow-hidden">

      <div className="flex items-center flex-1 min-w-0">
        <Link to="/" className="flex items-center gap-3 group mr-4 shrink-0 flex-shrink-0">
          <div className="w-10 h-10 rounded-[14px] bg-white/5 border border-white/10 flex items-center justify-center p-2.5">
            <Code2 className="text-blue-400" size={22} />
          </div>
          <span className="text-base sm:text-lg font-outfit font-black text-slate-800 dark:text-white tracking-tighter uppercase tracking-[0.08em]">SUMMERCODE</span>
        </Link>
        
        {/* Slidable Topics Container - Loading from DB */}
        <div className="hidden md:flex flex-1 items-center max-w-2xl ml-4 lg:ml-8 relative group">
          <div className="bg-slate-200/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/10 rounded-full p-1 w-full overflow-hidden">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar px-2 py-0.5 scroll-smooth">
              {topics.map((topic) => {
                const slug = getFirstLessonSlug(topic.name);
                const isNavigable = topic.status === 'Active' && slug;

                return (
                  <Link
                    key={topic.id}
                    to={isNavigable ? `/lessons/${slug}` : '#'}
                    onClick={(e) => !isNavigable && e.preventDefault()}
                    className={clsx(
                      "px-5 py-2 rounded-full text-[13px] font-bold transition-all duration-300 whitespace-nowrap",
                      isNavigable
                        ? "text-slate-400 hover:text-white"
                        : "text-slate-400 dark:text-slate-600 cursor-not-allowed opacity-60"
                    )}
                  >
                    {topic.name}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-4 flex-shrink-0">
        {(!isActive && activeLesson && location.pathname.startsWith('/lessons/')) && (
          <button
            onClick={() => startTeaching(activeLesson)}
            className="hidden md:flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-full px-5 py-2.5 text-sm font-semibold transition-all active:scale-95 shadow-sm"
          >
            <Sparkles size={16} className="text-yellow-400" />
            <span className="hidden lg:inline">Start Guided Teaching</span>
            <span className="lg:hidden">Start Teaching</span>
          </button>
        )}
        {localStorage.getItem('adminToken') || localStorage.getItem('studentToken') ? (
          <div className="flex items-center gap-4">
            {localStorage.getItem('studentToken') && (
              <Link to="/profile" className="hidden md:flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-colors">
                <User size={12} className="text-blue-500" />
                {JSON.parse(localStorage.getItem('studentData'))?.name || 'Student'}
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link to="/login" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-all active:scale-95 flex items-center group">
            Login
            {location.pathname === '/' && <ArrowRight size={14} className="ml-1.5 transition-transform group-hover:translate-x-0.5" />}
          </Link>
        )}
      </div>
    </nav>
  );
}
