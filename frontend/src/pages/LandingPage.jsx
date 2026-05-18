import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, Layers, Cpu, Mic2, MousePointer2, Sparkles, Search } from 'lucide-react';
import clsx from 'clsx';
import CodeBlock from '../components/CodeBlock';
import { useTeachingState } from '../contexts/TeachingContext';
import { API_URL } from '../config';

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen bg-[#d9ede1] relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">

      {/* Enhanced Viewport Background - Grid, Blobs and Code Symbols */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate opacity-[0.2]" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-white/40 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-emerald-200/40 blur-[140px] rounded-full" />

        {/* Static Code Symbols - Subtle visibility */}
        <div className="absolute top-[12vh] left-[5vw] text-8xl font-black font-mono text-[#282a36]/[0.08] select-none">{"{ }"}</div>
        <div className="absolute top-[35vh] right-4 text-9xl font-black font-mono text-[#282a36]/[0.08] select-none">{"<div>"}</div>
        <div className="absolute top-[75vh] left-[8vw] text-7xl font-black font-mono text-[#282a36]/[0.08] select-none">{"[ ]"}</div>
      </div>

      {/* 1. Hero Viewport Wrapper */}
      <section className="relative w-full overflow-hidden">

        {/* Static Hero Content Container */}
        <main className="relative z-20 pt-32 pb-32 px-6 flex flex-col items-center text-center max-w-[1600px] mx-auto">

          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-outfit font-extrabold text-[#282a36] tracking-tight leading-[1.1] mb-12 max-w-[1400px] mt-10">
            {isEnglish ? "Learn to " : "Coding "}
            <span className="text-emerald-700">
              {isEnglish ? "Code." : "Seekho."}
            </span>
          </h1>




          <p className="text-xl md:text-3xl text-[#282a36]/80 max-w-3xl mb-14 font-medium leading-relaxed tracking-tight">
            {isEnglish
              ? "With an integrated guided learning platform."
              : "Guided Teaching ke saath Hinglish me."}
          </p>

          <div className="w-full max-w-4xl flex flex-col items-center">
            <form
              className="w-full flex items-center bg-white rounded-full p-2 border-2 border-white/40 mb-10 overflow-hidden transition-all focus-within:border-emerald-200 focus-within:ring-4 focus-within:ring-emerald-500/10"
              onSubmit={(e) => {
                e.preventDefault();
                // Future search implementation
              }}
            >
              <input
                type="text"
                placeholder={isEnglish ? "Search our tutorials, e.g. HTML" : "Search karein, e.g. HTML"}
                className="flex-1 bg-transparent px-8 py-5 outline-none text-[#282a36] font-medium text-xl placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="bg-[#04aa6d] hover:bg-[#038c5a] text-white p-5 px-12 md:px-16 rounded-full transition-colors flex items-center justify-center active:scale-95"
              >
                <Search size={26} strokeWidth={3} />
              </button>
            </form>

            <Link
              to="/courses"
              className="text-slate-600 font-bold text-xl hover:text-[#04aa6d] underline decoration-slate-300 hover:decoration-[#04aa6d] decoration-2 underline-offset-8 transition-colors tracking-tight"
            >
              {isEnglish ? "Not Sure Where To Begin?" : "Kahan Se Shuru Karein?"}
            </Link>
          </div>
        </main>
      </section>

      {/* Curve Divider */}
      <div className="w-full overflow-hidden leading-[0] m-0 p-0 relative z-10 bg-transparent -mb-[1px]">
        <svg
          className="block w-full h-[60px] md:h-[120px]"
          viewBox="0 0 1440 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#282a36"
            d="M0,45 C320,25 420,75 720,65 C1020,55 1200,25 1440,25 L1440,100 L0,100 Z"
          ></path>
        </svg>
      </div>

      {/* 2. Feature Strip - Compact High-Contrast Section */}
      <section className="relative z-10 bg-[#282a36] py-16 overflow-hidden border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-4 gap-12 items-center">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-black text-white tracking-tighter mb-4">Guided Teaching</h2>
              <div className="h-1.5 w-12 bg-white rounded-full"></div>
            </div>

            <div className="lg:col-span-3 grid md:grid-cols-3 gap-8">
              {[
                {
                  title: isEnglish ? "Clarity in Every Line" : "Har Line Ki Clarity",
                  desc: isEnglish ? "Every single line of code is explained in pure English—no logic is left behind." : "Code ka har ek line pure Hinglish mein samjhaya gaya hai—koi logic nahi chhutega.",
                  icon: <Mic2 size={22} />
                },
                {
                  title: "Lecture Mode",
                  desc: isEnglish ? "Experience the content like a real lecture. The highlighter follows the mentor's voice." : "Pure content ko ek lecture ki tarah dekhein. Highlighter mentor ki awaaz ko follow karta hai.",
                  icon: <MousePointer2 size={22} />
                },
                {
                  title: isEnglish ? "Try It Yourself" : "Khud Try Karke Dekhein",
                  desc: isEnglish ? "Write, edit, and run code directly in your browser." : "Browser mein hi code likhein, edit karein aur run karein.",
                  icon: <Code2 size={22} />
                }
              ].map((feature, idx) => (
                <div key={idx} className="flex gap-5 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white flex-shrink-0 transition-all duration-300">
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
      <section className="relative z-10 bg-[#f4ecea] py-32 border-t border-[#e8dfdc]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-24 gap-8">
            <div className="text-left">
              <h2 className="text-5xl md:text-6xl font-black text-[#282a36] tracking-tighter mb-6">
                {isEnglish ? "Available Courses" : "Humare Courses"}
              </h2>
              <p className="text-lg text-[#282a36]/80 max-w-2xl font-medium">
                {isEnglish
                  ? "Start your coding journey today in your own language, right from scratch."
                  : "Coding seekhein Hinglish mein, bilkul scratch se."}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {courses.slice(0, 5).map((course) => {
              const fallbackDesc = isEnglish
                ? `Master the essentials of ${course.name} from scratch with hands-on practice.`
                : `${course.name} ko scratch se seekhein, hands-on practice ke saath.`;
              const description = isEnglish ? (course.englishDescription || course.description || fallbackDesc) : (course.description || fallbackDesc);
              const slug = getFirstLessonSlug(course.id);
              const isActive = course.status === 'Active' && slug;

              return (
                <div key={course.id || course.name} className={clsx("h-full", !isActive && "opacity-75")}>
                  <Link
                    to={isActive ? `/lessons/${slug}` : '#'}
                    onClick={(e) => !isActive && e.preventDefault()}
                    className={clsx(
                      "group relative h-full flex flex-col bg-slate-50 rounded-[3rem] p-12 border border-slate-200/50 transition-all duration-500 overflow-hidden",
                      isActive ? "hover:border-[#282a36]/20 hover:shadow-[0_30px_60px_-15px_rgba(15,23,42,0.1)]" : "cursor-not-allowed"
                    )}
                  >
                    {/* Decorative background element */}
                    <div className="absolute -right-8 -top-8 w-40 h-40 bg-[#282a36]/[0.03] rounded-full blur-3xl group-hover:bg-[#282a36]/[0.05] transition-all duration-500" />

                    <div className="relative z-10 flex flex-col h-full">
                      <div className="flex items-start justify-between mb-10">
                        <div className={clsx(
                          "w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 transition-all duration-300",
                          isActive ? "bg-white group-hover:bg-[#282a36] group-hover:text-white group-hover:scale-110" : "bg-slate-100 text-slate-400"
                        )}>
                          {(() => {
                            const iconMap = {
                              'Code2': <Code2 size={28} />,
                              'Layers': <Layers size={28} />,
                              'Cpu': <Cpu size={28} />,
                              'MousePointer2': <MousePointer2 size={28} />,
                              'Sparkles': <Sparkles size={28} />,
                              'layout': <Layers size={28} />, // fallback for old data
                              'code': <Cpu size={28} /> // fallback for old data
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
                        <h3 className={clsx(
                          "text-3xl font-black mb-6 transition-colors",
                          isActive ? "text-slate-800 group-hover:text-[#282a36]" : "text-slate-400"
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
                        isActive ? "text-slate-600 group-hover:text-[#282a36]" : "text-slate-300"
                      )}>
                        {isActive ? (isEnglish ? 'Start Learning' : 'Seekhna Shuru Karein') : (isEnglish ? 'Coming Soon' : 'Pehle Se Taiyar Rahein')}
                        <div className={clsx(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-transform",
                          isActive ? "bg-[#282a36] text-white group-hover:translate-x-2" : "bg-slate-200 text-slate-400"
                        )}>
                          <ArrowRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}

            {/* View All Courses Card */}
            <div className="h-full">
              <Link
                to="/courses"
                className="group relative h-full flex flex-col items-center justify-center bg-[#282a36] rounded-[3rem] p-12 border border-[#282a36] transition-all duration-500 overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(40,42,54,0.3)] hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#282a36] to-[#1a1b23] z-0" />
                <div className="absolute -right-8 -bottom-8 w-40 h-40 bg-white/[0.05] rounded-full blur-3xl group-hover:bg-white/[0.1] transition-all duration-500 z-0" />

                <div className="relative z-10 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-20 h-20 rounded-[2rem] bg-white/10 flex items-center justify-center text-white mb-8 group-hover:scale-110 group-hover:bg-emerald-500 transition-all duration-500">
                    <ArrowRight size={32} />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">
                    {isEnglish ? "Explore All Courses" : "Sabhi Courses Dekhein"}
                  </h3>
                  <p className="font-medium text-slate-400">
                    {isEnglish
                      ? "Explore our complete catalog of interactive programming courses."
                      : "Humare sabhi interactive programming courses ka catalog dekhein."}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

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
