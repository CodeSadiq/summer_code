import React from 'react';
import { useTeachingState } from '../contexts/TeachingContext';
import TopNav from './TopNav';
import Sidebar from './Sidebar';
import TeachingPanel from './TeachingPanel';
import clsx from 'clsx';
import { Play } from 'lucide-react';

export default function MainLayout({ children }) {
  const { isActive, startTeaching, activeLesson } = useTeachingState();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar collapsed={isSidebarCollapsed} setCollapsed={setIsSidebarCollapsed} />
        
        <main className={clsx(
          "flex-1 overflow-y-auto w-full transition-all duration-500 bg-slate-50 dark:bg-slate-950",
          "pl-0",
          isSidebarCollapsed ? "md:pl-16" : "md:pl-64",
          "md:pr-[260px]"
        )}>
          {children}
        </main>
        
        {/* The Teaching Panel */}
        <TeachingPanel />

        {/* Mobile FAB to start teaching when not active */}
        {!isActive && activeLesson && (
          <button
            onClick={() => startTeaching(activeLesson)}
            className="md:hidden fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-xl z-40 animate-pulse flex items-center gap-2 font-semibold"
          >
            <Play fill="currentColor" size={20} />
            Teach Me
          </button>
        )}
      </div>
    </div>
  );
}
