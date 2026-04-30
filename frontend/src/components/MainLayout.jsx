import React from 'react';
import { useTeachingState } from '../contexts/TeachingContext';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import TeachingPanel from './TeachingPanel';
import clsx from 'clsx';
import { Play, ChevronRight, Menu, ArrowRight, Ban } from 'lucide-react';

export default function MainLayout({ children }) {
  const { isActive, startTeaching, activeLesson, isSidebarOpen, setIsSidebarOpen, isEnglish, continueTeaching, isSidebarCollapsed, setIsSidebarCollapsed } = useTeachingState();

  // Swipe gesture state
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  const minSwipeDistance = 50;

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    // Right swipe to open (from anywhere near left edge)
    if (isRightSwipe && !isSidebarOpen && touchStart < 100) {
      setIsSidebarOpen(true);
    }
    // Left swipe to close
    if (isLeftSwipe && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col bg-slate-50 font-sans text-slate-900 overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <TopNav />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />

        {/* Mobile Sidebar Reveal Trigger */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="md:hidden fixed left-0 top-[20%] w-3 h-20 bg-blue-600 rounded-r-2xl z-40 shadow-[4px_0_15px_-5px_rgba(37,99,235,0.4)] flex items-center justify-center transition-all active:w-6 active:bg-blue-700"
            aria-label="Toggle Sidebar"
          >
            <div className="w-1 h-8 bg-white/50 rounded-full" />
          </button>
        )}

        <main className={clsx(
          "flex-1 overflow-y-auto w-full transition-all duration-500 bg-slate-50",
          "pl-0",
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64",
          "md:pr-[260px]"
        )}>
          {children}
        </main>

        {/* The Teaching Panel */}
        <TeachingPanel />

        {/* Mobile FAB to start teaching or skip */}
        {activeLesson && location.pathname.startsWith('/lessons/') && (
          <button
            onClick={(!isActive && !isEnglish) ? () => startTeaching(activeLesson) : undefined}
            className={clsx(
              "md:hidden fixed bottom-6 right-6 rounded-full px-5 py-2.5 shadow-2xl z-40 flex items-center gap-2 font-bold text-[11px] tracking-wider uppercase border-b-2 transition-all active:scale-95",
              isActive 
                ? "bg-slate-100 text-slate-400 border-slate-200 cursor-default" 
                : isEnglish
                  ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-80"
                  : "bg-blue-600 text-white border-blue-800 animate-pulse"
            )}
            title={isEnglish ? "Guided teaching is not available in English mode" : ""}
          >
            {isEnglish ? (
              <>
                <Ban size={14} />
                Unavailable
              </>
            ) : (
              <>
                <Play fill="currentColor" size={14} className={clsx(isActive ? "text-slate-300" : "text-white")} />
                {isActive ? "Active" : "Teach"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
