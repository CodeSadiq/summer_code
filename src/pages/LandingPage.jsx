import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Code2, ArrowRight, Layers, Cpu, Mic2, MousePointer2 } from 'lucide-react';
import clsx from 'clsx';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-slate-950 relative overflow-hidden font-sans selection:bg-cyan-100 dark:selection:bg-cyan-900 selection:text-cyan-900 dark:selection:text-cyan-200">
      
      {/* Nebula Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-cyan-200/30 dark:bg-cyan-800/20 blur-[140px] rounded-full animate-slow-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-purple-200/30 dark:bg-purple-900/20 blur-[140px] rounded-full" />
        <div className="absolute top-[30%] left-[40%] w-[20%] h-[20%] bg-blue-200/20 dark:bg-blue-900/20 blur-[100px] rounded-full animate-float" />
      </div>

      {/* Nebula Glass Nav */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#fafaf9]/90 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-[#eab308]/20 dark:border-white/5 z-[100] flex items-center px-10 md:px-16 justify-between select-none shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] animate-entrance">
        <div className="flex items-center gap-10">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:-translate-y-0.5 duration-300 active:scale-95 group cursor-pointer">
            <div className="w-10 h-10 rounded-[14px] glass-panel bg-white dark:bg-transparent border border-slate-200 dark:border-white/10 flex items-center justify-center p-2.5">
              <Code2 className="text-slate-700 dark:text-cyan-400" size={22} />
            </div>
            <span className="text-lg font-black text-slate-800 dark:text-white tracking-tighter uppercase tracking-[0.08em]">SUMMERCODE</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8 ml-4">
             {["Courses", "Pricing", "About", "Community"].map(item => (
               <a key={item} href="#" className="text-[10px] font-black text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white uppercase tracking-[0.2em] transition-all">{item}</a>
             ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
           <button className="text-[10px] font-black text-slate-700 dark:text-white hover:text-slate-900 dark:hover:text-cyan-400 uppercase tracking-widest transition-all px-4">Sign In</button>
           <Link to="/lessons/html-introduction" className="px-10 py-2.5 rounded-full text-[10px] font-black text-white bg-gradient-to-r from-[#dcb46e] to-[#c18d30] hover:brightness-110 hover:shadow-md shadow-[#dcb46e]/20 transition-all active:scale-95 uppercase tracking-[0.25em]">
              Get Started
           </Link>
        </div>
      </nav>

      {/* Floating Hero Section */}
      <main className="relative z-10 pt-56 pb-20 px-6 flex flex-col items-center text-center">
        <div className="inline-block px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-400/20 text-cyan-700 dark:text-cyan-400 text-[9px] font-black uppercase tracking-[0.4em] mb-8 animate-entrance shadow-sm">
           Anti-Gravity Learning
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-800 dark:text-white tracking-tighter leading-[0.95] mb-10 max-w-5xl animate-entrance drop-shadow-sm">
          Master Coding In <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-600 dark:from-cyan-400 dark:via-blue-500 dark:to-cyan-400 drop-shadow-sm">Hinglish Language.</span>
        </h1>

        <p className="text-[10px] md:text-[11px] text-slate-600 dark:text-slate-400 max-w-3xl mb-16 font-black leading-relaxed tracking-[0.5em] animate-entrance uppercase">
           THE CORRECT WAY TO LEARN PROGRAMMING
        </p>

        <div className="flex flex-col md:flex-row gap-8 animate-entrance mb-32">
           <Link to="/lessons/html-introduction" className="group bg-slate-800 dark:bg-cyan-500 text-white dark:text-[#0f172a] px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] shadow-lg dark:shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-4 active:scale-95">
              Start Learning Free
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
           </Link>
           <button className="bg-white dark:bg-transparent text-slate-700 dark:text-white px-12 py-5 rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all active:scale-95 shadow-sm">
              View Curriculum
           </button>
        </div>

        {/* Floating Content Elements Animation */}
        <div className="absolute top-[20%] left-[10%] opacity-20 animate-float" style={{ animationDelay: '0s' }}>
           <div className="text-4xl text-cyan-600 font-mono">{"{ }"}</div>
        </div>
        <div className="absolute top-[40%] right-[10%] opacity-20 animate-float" style={{ animationDelay: '2s' }}>
           <div className="text-5xl text-purple-600 font-mono">{"<div />"}</div>
        </div>
        <div className="absolute bottom-[10%] left-[20%] opacity-20 animate-float" style={{ animationDelay: '1s' }}>
           <div className="text-3xl text-blue-600 font-mono">{"[ ]"}</div>
        </div>
      </main>

      {/* Feature Strip - Floating Glass Cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 py-32 mb-40 animate-entrance">
         <div className="text-center mb-24">
            <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter mb-4 translate-y-0 group">Guided Teaching</h2>
            <div className="h-1.5 w-16 bg-[#eab308] mx-auto rounded-full shadow-sm dark:shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
         </div>

         <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                title: "Har Line Ki Clarity", 
                desc: "Every line of code explained in pure Hinglish—no logic left behind.", 
                icon: <Mic2 size={24} />,
                accent: "cyan"
              },
              { 
                title: "Visual Spotlight", 
                desc: "Don't just read code; see it. Our highlighter automatically follows the mentor's voice.", 
                icon: <MousePointer2 size={24} />,
                accent: "gold"
              },
              { 
                title: "AI Study Mentor", 
                desc: "A high-fidelity state machine that knows your progress and guides you at your pace.", 
                icon: <Sparkles size={24} />,
                accent: "cyan"
              }
            ].map((feature, idx) => (
              <div key={idx} className="glass-panel bg-white/70 dark:bg-[#1e293b]/50 group p-10 rounded-[2.5rem] flex flex-col items-center text-center hover:border-slate-300 dark:hover:border-white/20 duration-500">
                 <div className={clsx(
                   "w-20 h-20 rounded-3xl flex items-center justify-center mb-10 transition-all duration-700 shadow-sm",
                   feature.accent === 'cyan' ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-cyan-100 dark:group-hover:bg-cyan-500/20 group-hover:text-cyan-700 dark:group-hover:text-cyan-300" : "bg-[#fef08a]/40 dark:bg-[#fde047]/10 text-[#b45309] dark:text-[#fde047] group-hover:bg-[#fef08a]/80 dark:group-hover:bg-[#fde047]/20 group-hover:text-[#92400e] dark:group-hover:text-[#fef08a]"
                 )}>
                    {feature.icon}
                 </div>
                 <h3 className="text-xl font-black text-slate-800 dark:text-white uppercase tracking-tight mb-5">{feature.title}</h3>
                 <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed max-w-[280px] opacity-80 group-hover:opacity-100 transition-opacity">
                    {feature.desc}
                 </p>
              </div>
            ))}
         </div>
      </section>

      {/* Catalog - High Elevation Cards */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-64">
        <div className="flex items-end justify-between mb-24 gap-8">
           <div className="flex flex-col gap-4">
              <span className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-[0.5em]">Current Catalog</span>
              <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">Explore Our Courses</h2>
           </div>
           <div className="h-px bg-slate-200 dark:bg-slate-800 flex-1 mb-5 hidden md:block"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
           {/* Active HTML Course Card */}
           <Link to="/lessons/html-introduction" className="glass-panel group p-12 rounded-[3.5rem] bg-white dark:bg-[#1e293b]/70 hover:border-slate-300 dark:hover:border-cyan-500/30 hover:shadow-xl dark:hover:shadow-[0_20px_40px_rgba(34,211,238,0.1)] hover:-translate-y-2 transition-all relative overflow-hidden flex flex-col justify-between min-h-[480px]">
             <div>
               <div className="w-16 h-16 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 rounded-2xl flex items-center justify-center mb-12 transition-all group-hover:scale-110 duration-700 dark:shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <Code2 size={32} />
               </div>
               <span className="absolute top-12 right-12 bg-gradient-to-r from-[#dcb46e] to-[#c18d30] text-white text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest shadow-sm">Active</span>
               <h3 className="text-4xl font-black text-slate-800 dark:text-white mb-6 tracking-tighter leading-none">HTML <br/> Modern Basics</h3>
               <p className="text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed tracking-tight group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
                 Learn the architectural foundation of the web with our anti-gravity guided teaching engine.
               </p>
             </div>
             
             <div className="flex items-center justify-between pt-12 mt-12 border-t border-slate-200 dark:border-slate-700">
                <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Enrollment Open</span>
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-[#0f172a] flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-[#dcb46e] group-hover:to-[#c18d30] dark:group-hover:from-[#dcb46e] dark:group-hover:to-[#c18d30] group-hover:text-white transition-all shadow-sm text-slate-600 dark:text-slate-400 group-hover:shadow-md">
                  <ArrowRight size={20} />
                </div>
             </div>
           </Link>

           {/* Placeholder for other courses */}
           {[
             { name: "CSS Architecture", icon: <Layers size={32} />, status: "Coming Soon" },
             { name: "JavaScript Engine", icon: <Cpu size={32} />, status: "Coming Soon" }
           ].map(course => (
             <div key={course.name} className="glass-panel p-12 rounded-[3.5rem] opacity-70 grayscale flex flex-col justify-between min-h-[480px] bg-slate-50/50 dark:bg-slate-900/40">
               <div>
                 <div className="w-16 h-16 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 rounded-2xl flex items-center justify-center mb-12">
                    {course.icon}
                 </div>
                 <span className="absolute top-12 right-12 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-black px-5 py-2 rounded-full uppercase tracking-widest">{course.status}</span>
                 <h3 className="text-4xl font-black text-slate-400 dark:text-slate-500 mb-6 tracking-tighter leading-none">{course.name}</h3>
                 <p className="text-base text-slate-500 dark:text-slate-600 font-medium leading-relaxed tracking-tight">
                    The next evolution of technical education is currently under development. Stay tuned for early access.
                 </p>
               </div>
               <div className="h-1 bg-slate-200 dark:bg-slate-800 w-full rounded-full overflow-hidden relative">
                  <div className="absolute inset-0 bg-slate-300 dark:bg-slate-600 w-1/3 rounded-full"></div>
               </div>
             </div>
           ))}
        </div>

        {/* Nebula Footer */}
        <footer className="mt-72 text-center border-t border-slate-200 dark:border-slate-800 pt-32 pb-48 relative overflow-hidden">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-600/20 dark:via-cyan-400/20 to-transparent"></div>
           <div className="flex items-center justify-center gap-4 mb-10 opacity-40 dark:opacity-60">
              <Code2 size={28} className="text-cyan-600 dark:text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              <span className="font-black text-2xl text-slate-800 dark:text-slate-200 tracking-tighter uppercase tracking-[0.2em]">SUMMERCODE ENGINE</span>
           </div>
           <p className="text-slate-500 dark:text-slate-600 text-[11px] font-black tracking-[0.5em] uppercase mb-5">Built to Defy Gravity</p>
           <p className="text-slate-400 dark:text-slate-700 text-[10px] font-bold">&copy; 2026 SummerCode Platform. Anti-Gravity V1.5</p>
        </footer>
      </section>

    </div>
  );
}
