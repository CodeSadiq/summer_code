import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, Layers, Cpu, Mic2, MousePointer2, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import CodeBlock from '../components/CodeBlock';
import { API_URL } from '../config';

export default function LandingPage() {
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/api/topics`)
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setTopics(data);
        else setTopics([]);
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

  const getFirstLessonSlug = (courseName) => {
    const courseLessons = lessons.filter(l => l.course === courseName);
    if (courseLessons.length > 0) {
      return courseLessons.sort((a, b) => (a.chapterOrder || 0) - (b.chapterOrder || 0))[0].slug;
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#fafaf9] relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Enhanced Viewport Background - Grid, Blobs and Code Symbols */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate opacity-[0.2]" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/10 blur-[140px] rounded-full" />

        {/* Static Code Symbols - Subtle visibility */}
        <div className="absolute top-[12vh] left-[5vw] text-8xl font-black font-mono text-indigo-600/[0.08] select-none">{"{ }"}</div>
        <div className="absolute top-[22vh] right-[4vw] text-9xl font-black font-mono text-indigo-600/[0.08] select-none">{"<div>"}</div>
        <div className="absolute top-[75vh] left-[8vw] text-7xl font-black font-mono text-indigo-600/[0.08] select-none">{"[ ]"}</div>
      </div>

      {/* 1. Hero Viewport Wrapper */}
      <section className="relative w-full overflow-hidden">

        {/* Static Hero Content Container */}
        <main className="relative z-20 pt-32 pb-32 px-6 flex flex-col items-center text-center max-w-[1600px] mx-auto">

          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-outfit font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-12 max-w-[1400px] mt-10">
            Coding Seekho <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
              Hinglish Mein.
            </span>
          </h1>




          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mb-16 font-medium leading-relaxed">
            Ab language ki tension chhodo. Pure logic samjhein apni bhasha mein <br className="hidden md:block" />
            aur banayein real-world projects, pehli line se.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link to={`/lessons/${lessons[0]?.slug || 'html-introduction'}`} className="group bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3">
              SHURU KAREIN — IT'S FREE
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/courses" className="bg-white text-slate-900 border border-slate-200 px-10 py-5 rounded-2xl font-bold transition-all hover:bg-slate-50 active:scale-95">
              SYLLABUS DEKHEIN
            </Link>
          </div>
        </main>
      </section>

      {/* Straight Divider */}
      <div className="h-px w-full bg-slate-200" />

      {/* 2. Feature Strip - Compact High-Contrast Section */}
      <section className="relative z-10 bg-slate-900 py-16 overflow-hidden border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Guided Teaching</h2>
              <div className="h-1.5 w-12 bg-blue-500 rounded-full"></div>
            </div>

            <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
              {[
                { title: "Har Line Ki Clarity", desc: "Code ka har ek line pure Hinglish mein samjhaya gaya hai—koi logic nahi chhutega.", icon: <Mic2 size={22} /> },
                { title: "Lecture Mode", desc: "Pure content ko ek lecture ki tarah dekhein. Highlighter mentor ki awaaz ko follow karta hai.", icon: <MousePointer2 size={22} /> },
                { title: "Khud Try Karke Dekhein", desc: "Browser mein hi code likhein, edit karein aur run karein.", icon: <Code2 size={22} /> }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 flex-shrink-0 transition-all duration-300">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white uppercase tracking-tight mb-2">{feature.title}</h3>
                    <p className="text-sm text-slate-400 font-medium leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4. Catalog - High Visibility Grid */}
      <section className="relative z-10 bg-white py-32 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="text-left">
              <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">Available Courses</h2>
              <p className="text-lg text-slate-500 max-w-2xl font-medium">
                Join thousands of students learning to build for the future in their own language.
              </p>
            </div>
            <Link
              to="/courses"
              className="group flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:bg-blue-600 active:scale-95 shadow-lg shrink-0"
            >
              VIEW ALL COURSES
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {topics.map((course) => {
              const slug = getFirstLessonSlug(course.name);
              const isActive = course.status === 'Active' && slug;
              const description = course.name === 'HTML'
                ? "Web ki basic foundation aur architecture seekhein hamare interactive mode ke saath."
                : (course.description || `Master the essentials of ${course.name} from scratch with hands-on practice.`);

              return (
                <div key={course.id || course.name} className={clsx("h-full", !isActive && "opacity-75")}>
                  <Link
                    to={isActive ? `/lessons/${slug}` : '#'}
                    onClick={(e) => !isActive && e.preventDefault()}
                    className={clsx(
                      "group relative h-full flex flex-col bg-slate-50 rounded-[3rem] p-12 border border-slate-200/50 transition-all duration-500 overflow-hidden",
                      isActive ? "hover:border-slate-900/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)]" : "cursor-not-allowed"
                    )}
                  >
                    {/* Decorative background element */}
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-slate-900/[0.03] rounded-full blur-3xl group-hover:bg-slate-900/[0.05] transition-all duration-500" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-10">
                        <div className={clsx(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 transition-all duration-300",
                          isActive ? "bg-white group-hover:bg-slate-900 group-hover:text-white group-hover:scale-110" : "bg-slate-100 text-slate-400"
                        )}>
                          <Layers size={28} />
                        </div>
                        
                        {isActive ? (
                          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active
                          </span>
                        ) : (
                          <span className="px-3 py-1.5 bg-slate-200 text-slate-500 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-300">
                            Coming Soon
                          </span>
                        )}
                      </div>

                      <div className="flex-grow">
                        <h3 className={clsx(
                          "text-3xl font-black mb-6 transition-colors",
                          isActive ? "text-slate-800 group-hover:text-slate-900" : "text-slate-400"
                        )}>
                          {course.name}
                        </h3>
                        <p className={clsx(
                          "font-medium leading-relaxed mb-10",
                          isActive ? "text-slate-600" : "text-slate-400"
                        )}>
                          {description}
                        </p>
                      </div>

                      <div className={clsx(
                        "flex items-center gap-3 text-sm font-black uppercase tracking-widest transition-colors",
                        isActive ? "text-slate-600 group-hover:text-slate-900" : "text-slate-300"
                      )}>
                        {isActive ? 'Seekhna Shuru Karein' : 'Pehle Se Taiyar Rahein'}
                        <div className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
                          isActive ? "bg-slate-900 text-white group-hover:translate-x-2" : "bg-slate-200 text-slate-400"
                        )}>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple Compact Footer */}
      <footer className="bg-[#020617] text-white py-12 px-6 relative z-10 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:items-start items-center gap-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Code2 className="text-white" size={24} />
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
