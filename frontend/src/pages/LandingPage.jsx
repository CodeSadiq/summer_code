import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowRight, Layers, Cpu, Mic2, MousePointer2, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import CodeBlock from '../components/CodeBlock';
import TopNav from '../components/TopNav';
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
    <div className="flex flex-col min-h-screen bg-[#fafaf9] dark:bg-slate-950 relative overflow-hidden font-sans selection:bg-blue-100 dark:selection:bg-blue-900 selection:text-blue-900 dark:selection:text-blue-200">
      
      {/* Enhanced Viewport Background - Grid and Blobs only */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate opacity-[0.2] dark:opacity-[0.1]" />
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-400/10 dark:bg-blue-600/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-400/10 dark:bg-indigo-600/5 blur-[140px] rounded-full" />
      </div>

      <TopNav />

      {/* 1. Hero Viewport Wrapper */}
      <section className="relative w-full overflow-hidden">

        {/* Static Hero Content Container */}
        <main className="relative z-20 pt-32 pb-32 px-6 flex flex-col items-center text-center max-w-[1600px] mx-auto">

          <h1 className="text-6xl md:text-8xl lg:text-[110px] font-outfit font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1] mb-12 max-w-[1400px] mt-10">
            Coding Seekho <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600">
              Hinglish Mein.
            </span>
          </h1>




          <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mb-16 font-medium leading-relaxed">
            Ab language ki tension chhodo. Pure logic samjhein apni bhasha mein <br className="hidden md:block" />
            aur banayein real-world projects, pehli line se.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-6">
            <Link to={`/lessons/${lessons[0]?.slug || 'html-introduction'}`} className="group bg-slate-900 dark:bg-blue-600 dark:hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl flex items-center gap-3">
              SHURU KAREIN — IT'S FREE
              <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/courses" className="bg-white dark:bg-white/5 text-slate-900 dark:text-white border border-slate-200 dark:border-white/10 px-10 py-5 rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-white/10 active:scale-95">
              SYLLABUS DEKHEIN
            </Link>
          </div>
        </main>
      </section>

      {/* 2. Feature Strip - Soft Blue/Indigo Section */}
      <section className="relative z-10 bg-[#f8faff] dark:bg-slate-900/40 py-32 overflow-hidden border-t border-slate-200/50">
        {/* Stylish Terminator Shape (Top) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180 opacity-50">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-[40px]">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-[#fafaf9] dark:fill-slate-950"></path>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-5xl font-outfit font-black text-slate-800 dark:text-white tracking-tighter mb-4 translate-y-0 group">Guided Teaching</h2>
            <div className="h-1.5 w-16 bg-blue-500 mx-auto rounded-full shadow-sm"></div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { title: "Har Line Ki Clarity", desc: "Code ka har ek line pure Hinglish mein samjhaya gaya hai—koi logic nahi chhutega.", icon: <Mic2 size={24} /> },
              { title: "Lecture Mode", desc: "Pure content ko ek lecture ki tarah dekhein. Hamara highlighter mentor ki awaaz ko automatically follow karta hai.", icon: <MousePointer2 size={24} /> },
              { title: "Khud Try Karke Dekhein", desc: "Browser mein hi code likhein, edit karein aur run karein.", icon: <Code2 size={24} /> }
            ].map((feature, idx) => (
              <div key={idx} className="bg-white dark:bg-slate-800 group p-10 rounded-[2.5rem] flex flex-col items-center text-center border border-slate-100 dark:border-slate-700 shadow-xl shadow-blue-500/[0.02] transition-all duration-500 hover:-translate-y-2">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-10 bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 font-bold shadow-inner">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-5">{feature.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-[280px]">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Try It Yourself - Soft Slate Section */}
      <section className="relative z-10 bg-[#f1f5f9] dark:bg-slate-900 py-32 border-y border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-20 bg-white dark:bg-slate-950 rounded-[3rem] border border-slate-200 dark:border-white/5 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 shadow-2xl">
          <div className="flex-1 text-center lg:text-left lg:pl-10">
            <h2 className="text-7xl md:text-9xl font-black text-slate-800 dark:text-white tracking-tighter mb-4">HTML</h2>
            <p className="text-xl md:text-2xl text-slate-500 dark:text-slate-400 font-medium mb-10 max-w-md mx-auto lg:mx-0 leading-relaxed">
              Web pages banane ki standard language. <br /> Sahi tareeke se seekhein.
            </p>
            <Link to="/lessons/html-introduction" className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-full text-xs font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95">
              Seekhna Shuru Karein
            </Link>
          </div>
          <div className="w-full lg:w-[60%] lg:pr-10 relative">
             <div className="bg-slate-50 dark:bg-slate-900 rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 overflow-hidden">
                <CodeBlock
                  language="markup"
                  visibleText={`<!DOCTYPE html>\n<html>\n<body>\n  <h1>Mera Code</h1>\n  <p style="color: blue;">Edit me!</p>\n</body>\n</html>`}
                  stepIndex={-1}
                />
             </div>
          </div>
        </div>
      </section>

      {/* 4. Catalog - Pure White Section */}
      <section className="relative z-10 bg-white dark:bg-slate-950 py-48">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between mb-24 gap-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tighter">Available Courses</h2>
            <div className="h-px bg-slate-100 dark:bg-slate-800 flex-1 hidden md:block"></div>
          </div>

          <div className="flex overflow-x-auto gap-10 pb-12 no-scrollbar">
            {topics.map((course) => (
              <Link key={course.id} to={`/lessons/${getFirstLessonSlug(course.name) || 'html-introduction'}`} 
                className="shrink-0 w-[420px] p-12 rounded-[4rem] bg-[#f8faff] dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:-translate-y-3 transition-all min-h-[500px] flex flex-col justify-between shadow-sm hover:shadow-xl">
                <div>
                  <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center mb-12 shadow-lg">
                    <Layers size={32} />
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-6 leading-tight">{course.name}</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">{course.description}</p>
                </div>
                <div className="flex justify-end pt-12 border-t border-slate-200/50">
                  <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-blue-600 text-white flex items-center justify-center">
                    <ArrowRight size={20} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Elite Midnight Black Footer */}
      <footer className="bg-[#020617] text-white pt-32 pb-16 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-16 border-b border-white/5 pb-24">
            <div className="flex flex-col gap-6">
              <Link to="/" className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                  <Code2 className="text-white" size={28} />
                </div>
                <span className="text-xl font-black tracking-widest uppercase font-outfit">SUMMERCODE</span>
              </Link>
              <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
                Elite teaching experience high-performance platform for the next generation of Indian developers.
              </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-12 md:gap-24">
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Platform</span>
                {["Courses", "Pricing", "About"].map(item => (
                  <Link key={item} to="#" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">{item}</Link>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Legal</span>
                {["Terms", "Privacy"].map(item => (
                  <Link key={item} to="#" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">{item}</Link>
                ))}
              </div>
              <div className="flex flex-col gap-6">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Admin</span>
                <Link to="/admin" className="text-xs font-bold text-slate-400 hover:text-white transition-colors">Dashboard</Link>
              </div>
            </div>
          </div>
          
          <div className="mt-16 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">
              &copy; 2026 SummerCode Platform. <span className="text-blue-500/50 ml-2">Built with Excellence in India.</span>
            </p>
            <div className="flex gap-8 items-center">
               <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
               <span className="text-[10px] font-black tracking-[0.5em] uppercase text-slate-700">Premium Education</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
