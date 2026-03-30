import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, PlayCircle, BookOpen, ArrowRight, Layers, Cpu, Globe, Bot, Mic2, MousePointer2 } from 'lucide-react';
import clsx from 'clsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Decorative High-Fidelity Background Glows */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[#10b981]/5 blur-[120px] rounded-full animate-slow-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      {/* Premium Full-Width Glass Nav Section */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-white/60 backdrop-blur-2xl border-b border-slate-100/80 z-[100] flex items-center px-10 md:px-16 justify-between select-none shadow-[0_1px_40px_rgba(0,0,0,0.02)] animate-entrance">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-3 transition-all active:scale-95 group cursor-pointer">
            <div className="w-10 h-10 rounded-[14px] bg-slate-900 flex items-center justify-center p-2.5 shadow-2xl shadow-slate-900/10 transition-all duration-700">
              <Code2 className="text-white" size={22} />
            </div>
            <span className="text-lg font-black text-slate-900 tracking-tighter uppercase tracking-[0.08em] transition-colors">SUMMERCODE</span>
          </div>

          <div className="hidden lg:flex items-center gap-8 ml-4">
             {["Courses", "Pricing", "About", "Community"].map(item => (
               <a key={item} href="#" className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-[0.2em] transition-colors">{item}</a>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
           <button className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors px-4">Sign In</button>
           <Link to="/lessons/html-introduction" className="px-10 py-2.5 rounded-full text-[10px] font-black text-white bg-slate-900 hover:bg-black hover:shadow-2xl hover:shadow-slate-900/20 transition-all active:scale-95 uppercase tracking-[0.25em]">
              Get Started
           </Link>
        </div>
      </nav>

      {/* Primary Hero Section - Simplified & Authoritative */}
      <main className="relative z-10 pt-48 pb-10 px-6 flex flex-col items-center text-center">
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[0.95] mb-8 max-w-5xl animate-entrance">
          Master Coding In <br/>
          <span className="text-[#10b981]">Hinglish Language.</span>
        </h1>

        <p className="text-sm md:text-[11px] text-slate-400 max-w-3xl mb-12 font-black leading-relaxed tracking-[0.4em] animate-entrance opacity-80 uppercase">
           THE CORRECT WAY TO LEARN PROGRAMMING
        </p>

        <div className="flex flex-col md:flex-row gap-6 animate-entrance mb-20">
           <Link to="/lessons/html-introduction" className="group bg-slate-900 text-white px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-black hover:shadow-3xl hover:shadow-slate-900/40 transition-all flex items-center gap-4 active:scale-95">
              Start Learning Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
           </Link>
           <button className="bg-white border border-slate-200 text-slate-900 px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95">
              View Curriculum
           </button>
        </div>
      </main>

      {/* Guided Teaching Features - Pure & Clean */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-32 mb-32 animate-entrance">
         <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter mb-4">Guided Teaching</h2>
            <div className="h-1 w-12 bg-[#10b981] mx-auto rounded-full"></div>
         </div>

         <div className="grid md:grid-cols-3 gap-16">
            {[
              { 
                title: "Har Line Ki Clarity", 
                desc: "Every line of code explained in pure Hinglish—no logic left behind.", 
                icon: <Mic2 size={24} />,
                color: "emerald"
              },
              { 
                title: "Visual Spotlight", 
                desc: "Don't just read code; see it. Our highlighter automatically follows the mentor's voice.", 
                icon: <MousePointer2 size={24} />,
                color: "emerald"
              },
              { 
                title: "AI Study Mentor", 
                desc: "A high-fidelity state machine that knows your progress and guides you at your pace.", 
                icon: <Sparkles size={24} />,
                color: "emerald"
              }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                 <div className="w-16 h-16 rounded-2xl bg-slate-50 text-[#10b981] flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-[#10b981] group-hover:text-white group-hover:scale-110 shadow-sm border border-slate-100">
                    {feature.icon}
                 </div>
                 <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-3">{feature.title}</h3>
                 <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-[260px] opacity-70">
                    {feature.desc}
                 </p>
              </div>
            ))}
         </div>
      </section>

      {/* Course Catalog (formatted to matching Lesson Page Cards) */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-64">
        <div className="flex items-end justify-between mb-20 gap-8">
           <div className="flex flex-col gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Current Catalog</span>
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter">Explore Our Courses</h2>
           </div>
           <div className="h-px bg-slate-100 flex-1 mb-4 hidden md:block"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
           {/* Active HTML Course Card */}
           <Link to="/lessons/html-introduction" className="group bg-white rounded-[2.5rem] p-10 border border-slate-100/80 hover:border-[#10b981]/20 hover:shadow-[0_40px_80px_-20px_rgba(16,185,129,0.1)] hover:-translate-y-2 transition-all relative overflow-hidden flex flex-col justify-between min-h-[400px]">
             <div>
               <div className="w-14 h-14 bg-emerald-50 text-[#10b981] rounded-2xl flex items-center justify-center mb-10 transition-all group-hover:bg-slate-900 group-hover:text-white group-hover:rotate-6 duration-500">
                  <Code2 size={28} />
               </div>
               <span className="absolute top-10 right-10 bg-emerald-50 text-[#10b981] text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest group-hover:bg-[#10b981] group-hover:text-white transition-colors duration-500">Active Course</span>
               <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tighter">HTML Modern Basics</h3>
               <p className="text-sm text-slate-500 font-medium leading-relaxed tracking-tight opacity-70">
                 Learn the architectural foundation of the web with our high-fidelity guided teaching engine.
               </p>
             </div>
             
             <div className="flex items-center justify-between pt-10 mt-10 border-t border-slate-50">
                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Enrollment Open</span>
                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-[#10b981] group-hover:text-white transition-all">
                  <ArrowRight size={16} />
                </div>
             </div>
           </Link>

           {/* Placeholder for other courses */}
           {[
             { name: "CSS Architecture", icon: <Layers size={28} />, status: "Coming Soon" },
             { name: "JavaScript Engine", icon: <Cpu size={28} />, status: "Coming Soon" }
           ].map(course => (
             <div key={course.name} className="group bg-white rounded-[2.5rem] p-10 border border-slate-50/50 opacity-60 flex flex-col justify-between min-h-[400px]">
               <div>
                 <div className="w-14 h-14 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mb-10">
                    {course.icon}
                 </div>
                 <span className="absolute top-10 right-10 bg-slate-50 text-slate-400 text-[9px] font-black px-4 py-2 rounded-full uppercase tracking-widest">{course.status}</span>
                 <h3 className="text-3xl font-black text-slate-200 mb-4 tracking-tighter">{course.name}</h3>
                 <p className="text-sm text-slate-300 font-medium leading-relaxed tracking-tight">
                    The next evolution of technical education is currently under development. Stay tuned for early access.
                 </p>
               </div>
               <div className="h-0.5 bg-slate-50 w-full rounded-full"></div>
             </div>
           ))}
        </div>

        {/* Dynamic Footer Section */}
        <footer className="mt-64 text-center border-t border-slate-100 pt-24 pb-32">
           <div className="flex items-center justify-center gap-3 mb-8 opacity-10">
              <Code2 size={24} className="text-slate-900" />
              <span className="font-black text-lg text-slate-900 tracking-tighter uppercase tracking-widest">SummerCode Platform</span>
           </div>
           <p className="text-slate-300 text-[10px] font-black tracking-[0.4em] uppercase mb-4">Built with Precision for the Future</p>
           <p className="text-slate-200 text-[9px] font-bold">&copy; 2026 SummerCode Platform. All rights reserved.</p>
        </footer>
      </section>

    </div>
  );
}
