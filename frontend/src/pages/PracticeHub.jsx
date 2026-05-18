import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { HelpCircle, ChevronRight, Sparkles, BookOpen, Terminal } from 'lucide-react';
import { API_URL } from '../config';
import clsx from 'clsx';
import { useTeachingState } from '../contexts/TeachingContext';

export default function PracticeHub() {
  const { isEnglish } = useTeachingState();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/courses`)
      .then(res => res.json())
      .then(data => {
        setCourses(data.filter(t => t.status === 'Active'));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-[#2e3748] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/20 border-t-[#038b59] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#2e3748] p-8 md:p-24 font-sans">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="text-center space-y-4">

          <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter">
            {isEnglish ? "Practice Hub" : "Practice Hub"}
          </h1>
          <p className="text-slate-400 font-medium max-w-lg mx-auto">
            {isEnglish 
              ? "Select a topic to test your knowledge with interactive challenges and coding tasks." 
              : "Apni knowledge test karne ke liye koi topic select karein aur interactive challenges/coding tasks solve karein."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Courses */}
          {courses.map(course => (
            <Link 
              key={course.id}
              to={`/practice/Course/${course.id}`}
              className="group bg-white/5 border border-white/10 rounded-[2.5rem] p-8 flex items-center justify-between hover:bg-white/10 hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white/5 text-slate-400 rounded-2xl flex items-center justify-center transition-colors group-hover:bg-[#038b59] group-hover:text-white">
                   <BookOpen size={32} />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">{course.name}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {isEnglish ? (course.englishSubtitle || course.subtitle || 'Practice Mode') : (course.subtitle || 'Practice Mode')}
                  </p>
                </div>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-[#038b59] group-hover:text-white transition-all -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100">
                <ChevronRight size={20} />
              </div>
            </Link>
          ))}

          {/* Quick Playground Access */}
          <Link 
            to="/playground"
            className="group relative bg-gradient-to-br from-[#038b59] to-[#026642] rounded-[2.5rem] p-8 flex items-center justify-between hover:scale-[1.02] transition-all shadow-2xl shadow-[#038b59]/20 md:col-span-2 mt-4 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-white/10 text-white rounded-3xl flex items-center justify-center backdrop-blur-md border border-white/20 group-hover:scale-110 transition-transform">
                 <Terminal size={40} />
              </div>
              <div>
                <h3 className="text-3xl font-black text-white tracking-tighter">Coding Playground</h3>
                <p className="text-emerald-100 text-sm font-bold uppercase tracking-[0.2em] opacity-80">
                  {isEnglish 
                    ? "Full-Screen IDE • Run Any Language" 
                    : "Full-Screen IDE • Koi bhi language run karein"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-2xl border border-white/20 text-white text-xs font-black uppercase tracking-widest backdrop-blur-md group-hover:bg-white group-hover:text-[#038b59] transition-all relative z-10">
              {isEnglish ? "Launch IDE" : "IDE Shuru Karein"} <ChevronRight size={16} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
