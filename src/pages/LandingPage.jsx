import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, PlayCircle, BookOpen, ArrowRight, Layers, Cpu, Globe, Bot } from 'lucide-react';
import clsx from 'clsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* Premium Glass Nav Capsule */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] max-w-6xl h-16 bg-white/70 backdrop-blur-xl border border-white/40 z-50 flex items-center justify-between px-8 rounded-full shadow-2xl shadow-slate-900/5 animate-entrance">
        <div className="flex items-center gap-3 transition-all hover:scale-[1.02] group">
          <div className="bg-slate-900 rounded-xl p-2 text-white shadow-xl shadow-slate-900/10 group-hover:bg-blue-600 transition-colors">
             <Code2 size={24} />
          </div>
          <span className="font-black text-xl text-slate-900 tracking-tighter uppercase tracking-[0.05em]">SummerCode</span>
        </div>
        
        <div className="flex items-center gap-6">
          <Link
            to="/admin"
            className="hidden md:block text-[11px] font-black text-slate-400 hover:text-slate-900 px-5 py-2.5 rounded-full transition-all uppercase tracking-widest"
          >
            Admin
          </Link>
          <Link
            to="/lessons/html-introduction"
            className="bg-slate-900 text-white px-8 py-2.5 rounded-full font-black text-[11px] tracking-widest uppercase hover:bg-black hover:shadow-xl hover:shadow-slate-900/20 transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Background Elements */}
      <div className="absolute top-[10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <main className="max-w-6xl mx-auto px-6 pt-48 pb-32">
        {/* Hero Content Area */}
        <div className="flex flex-col items-center text-center gap-10 animate-entrance">
          <div className="inline-flex items-center gap-2.5 bg-slate-50 text-slate-500 font-black px-6 py-2.5 rounded-full border border-slate-100 shadow-sm">
            <Sparkles size={16} className="text-blue-500" /> 
            <span className="text-[10px] tracking-[0.3em] uppercase">The Future of Education</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter max-w-5xl leading-[0.9] lg:leading-[0.85]">
             Master Coding in <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-500 to-indigo-600">Hinglish.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-3xl mt-4 leading-relaxed font-medium tracking-tight">
             Experience **Guided Learning** like never before. <br className="hidden md:block" />
             Interactive robot mentorship explained in the natural Hindi-English mix you love.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mt-10">
            <Link to="/lessons/html-introduction" className="bg-slate-900 hover:bg-black text-white px-12 py-6 rounded-full font-black shadow-2xl shadow-slate-900/20 hover:shadow-slate-900/40 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 text-sm tracking-widest uppercase active:scale-95">
               Start Free Course <PlayCircle size={20} />
            </Link>
            <button className="bg-white border border-slate-200 text-slate-900 hover:bg-slate-50 px-12 py-6 rounded-full font-black transition-all text-sm tracking-widest uppercase active:scale-95 shadow-sm">
               View Roadmap 2024
            </button>
          </div>
        </div>

        {/* Dynamic Feature Badges */}
        <div className="mt-32 flex justify-center gap-5 flex-wrap opacity-60">
           {[
             { label: 'Interactive AI Editor', icon: <Cpu /> },
             { label: 'Live Voice Guidance', icon: <Globe /> },
             { label: 'Cloud Persistence', icon: <Layers /> }
           ].map(f => (
             <div key={f.label} className="px-8 py-4 rounded-3xl flex items-center gap-3 text-slate-900 font-black text-[10px] tracking-widest uppercase transition-all hover:bg-slate-50 border border-transparent hover:border-slate-100">
                <div className="text-blue-500">{f.icon}</div> {f.label}
             </div>
           ))}
        </div>

        {/* Global Catalog Section */}
        <div className="mt-48 grid md:grid-cols-3 gap-10">
           {/* Active HTML Card */}
           <Link to="/lessons/html-introduction" className="group bg-white rounded-[3.5rem] p-12 border border-slate-100 hover:border-blue-500/20 hover:shadow-[0_40px_80px_-20px_rgba(37,99,235,0.15)] hover:-translate-y-3 transition-all relative overflow-hidden flex flex-col justify-between min-h-[440px]">
             <div>
               <div className="w-18 h-18 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mb-10 transition-colors group-hover:bg-blue-600 group-hover:text-white duration-500">
                  <Code2 size={40} />
               </div>
               <span className="absolute top-10 right-10 bg-blue-50 text-blue-600 text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest group-hover:bg-blue-500 group-hover:text-white transition-colors duration-500">Active Course</span>
               <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter leading-none">HTML Modern Basics</h3>
               <p className="text-slate-400 text-lg font-medium leading-relaxed tracking-tight group-hover:text-slate-500 transition-colors">Start your journey with the fundamental language of the web.</p>
             </div>
             <div className="inline-flex items-center text-blue-600 font-black text-sm tracking-widest uppercase group-hover:gap-4 transition-all">
               Begin Now <ArrowRight className="ml-2" />
             </div>
           </Link>

           {/* Coming Soon CSS */}
           <div className="bg-slate-50/50 rounded-[3.5rem] p-12 border border-slate-100 flex flex-col justify-between min-h-[440px] opacity-80 backdrop-blur-sm grayscale-[0.3]">
             <div>
                <div className="w-18 h-18 bg-white text-slate-200 rounded-3xl flex items-center justify-center mb-10 shadow-sm font-black text-2xl">CSS</div>
                <h3 className="text-4xl font-black text-slate-300 mb-4 tracking-tighter">CSS Visual Mastery</h3>
                <p className="text-slate-300 text-lg font-medium">Coming next month.</p>
             </div>
             <div className="text-slate-200 font-black text-[10px] tracking-widest uppercase border border-slate-100 py-3 px-6 rounded-full w-fit">In Development</div>
           </div>

           {/* Coming Soon JS */}
           <div className="bg-slate-50/50 rounded-[3.5rem] p-12 border border-slate-100 flex flex-col justify-between min-h-[440px] opacity-80 backdrop-blur-sm grayscale-[0.3]">
             <div>
                <div className="w-18 h-18 bg-white text-slate-200 rounded-3xl flex items-center justify-center mb-10 shadow-sm font-black text-2xl">JS</div>
                <h3 className="text-4xl font-black text-slate-300 mb-4 tracking-tighter">JavaScript Engine</h3>
                <p className="text-slate-300 text-lg font-medium">Learn the logic of the web.</p>
             </div>
             <div className="text-slate-200 font-black text-[10px] tracking-widest uppercase border border-slate-100 py-3 px-6 rounded-full w-fit">Waitlist Open</div>
           </div>
        </div>

        {/* Brand Footer Final Section */}
        <footer className="mt-64 text-center border-t border-slate-50 pt-20 pb-32">
           <div className="flex items-center justify-center gap-3 mb-8 opacity-20">
              <Code2 size={24} className="text-slate-900" />
              <span className="font-black text-lg text-slate-900 tracking-tighter uppercase tracking-widest">SummerCode Platform</span>
           </div>
           <p className="text-slate-300 text-[10px] font-black tracking-[0.4em] uppercase">Built with 💙 for Indian Developers</p>
        </footer>
      </main>
    </div>
  );
}
