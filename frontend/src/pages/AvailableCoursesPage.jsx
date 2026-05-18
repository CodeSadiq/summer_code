import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, Layers } from 'lucide-react';
import { API_URL } from '../config';
import { useTeachingState } from '../contexts/TeachingContext';

export default function AvailableCoursesPage() {
  const { isEnglish } = useTeachingState();
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
        else setCourses([]);
      })
      .catch(console.error);

    fetch(`${API_URL}/api/lessons`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setLessons(data);
        else setLessons([]);
      })
      .catch(console.error);
  }, []);

  const getFirstLessonSlug = (courseId) => {
    const courseLessons = lessons.filter(l => l.course === courseId);
    if (courseLessons.length > 0) {
      return courseLessons.sort((a, b) => (a.chapterOrder || 0) - (b.chapterOrder || 0))[0].slug;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f4ecea] flex flex-col font-sans">

      {/* Hero Header */}
      <header className="pt-32 pb-20 px-6 text-left max-w-7xl mx-auto w-full">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
          {isEnglish ? "Explore All Courses" : "Sabhi Courses Dekhein"}
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl font-medium">
          {isEnglish 
            ? "Explore our complete catalog of interactive programming courses." 
            : "Humare sabhi interactive programming courses ka catalog dekhein."}
        </p>
      </header>

      {/* Main Grid */}
      <main className="flex-1 max-w-7xl mx-auto px-6 pb-32 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {courses.map((course) => {
            const firstSlug = getFirstLessonSlug(course.id);
            const isActive = course.status === 'Active' && firstSlug;
            const fallbackDesc = isEnglish 
              ? `Master the essentials of ${course.name} from scratch with hands-on practice.`
              : `${course.name} ko scratch se seekhein, hands-on practice ke saath.`;
            const description = isEnglish ? (course.englishDescription || course.description || fallbackDesc) : (course.description || fallbackDesc);
            
            return (
              <div key={course.id || course.name} className={`h-full ${!isActive ? 'opacity-75' : ''}`}>
                <Link 
                  to={isActive ? `/lessons/${firstSlug}` : '#'}
                  onClick={(e) => !isActive && e.preventDefault()}
                  className={`group relative h-full flex flex-col bg-slate-50 rounded-[3rem] p-12 border border-slate-200/50 transition-all duration-500 overflow-hidden ${isActive ? 'hover:border-slate-900/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)]' : 'cursor-not-allowed'}`}
                >
                  {/* Decorative background element */}
                  <div className="absolute -right-8 -top-8 w-40 h-40 bg-slate-900/[0.03] rounded-full blur-3xl group-hover:bg-slate-900/[0.05] transition-all duration-500" />
                  
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-10">
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 transition-all duration-300 ${isActive ? 'bg-white group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110' : 'bg-slate-100 text-slate-400'}`}>
                        {(() => {
                          const iconMap = {
                            'Code2': <Code2 size={28} />,
                            'Layers': <Layers size={28} />,
                            'Cpu': <Code2 size={28} />, // Fallback for JS
                            'MousePointer2': <Code2 size={28} />,
                            'Sparkles': <Code2 size={28} />,
                            'layout': <Layers size={28} />,
                            'code': <Code2 size={28} />
                          };
                          return iconMap[course.icon] || <Code2 size={28} />;
                        })()}
                      </div>
                      
                      {isActive ? (
                        <span className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-emerald-500">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                          {isEnglish ? "Active" : "Shuru Hai"}
                        </span>
                      ) : (
                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
                          {isEnglish ? "Coming Soon" : "Jald Aa Raha Hai"}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className={`text-3xl font-black mb-6 transition-colors ${isActive ? 'text-slate-800 group-hover:text-slate-900' : 'text-slate-400'}`}>{course.name}</h3>
                      <p className={`font-medium leading-relaxed mb-10 ${isActive ? 'text-slate-600' : 'text-slate-400'}`}>
                        {description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-10 border-t border-slate-200/50">
                      <div className={`text-[10px] font-black uppercase tracking-[0.2em] ${isActive ? 'text-slate-400' : 'text-slate-300'}`}>
                        {lessons.filter(l => l.course === course.id).length} Chapters
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-transform shadow-lg ${isActive ? 'bg-slate-900 text-white group-hover:translate-x-2' : 'bg-slate-200 text-slate-400'}`}>
                        <ArrowRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </main>

      {/* Simple Compact Footer */}
      <footer className="bg-[#282a36] text-white py-12 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:items-start items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-lg shadow-white/10">
                <Code2 className="text-[#282a36]" size={24} />
              </div>
              <span className="text-lg font-black tracking-widest uppercase font-outfit">SUMMERCODE</span>
            </Link>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              &copy; 2026 SummerCode. Built in India.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8 md:gap-12">
            {[
              { label: "Courses", href: "/courses" },
              { label: "Admin", href: "/admin" },
              { label: "Privacy", href: "#" },
              { label: "Terms", href: "#" }
            ].map(item => (
              <Link key={item.label} to={item.href} className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
