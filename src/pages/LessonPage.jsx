import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTeachingState } from '../contexts/TeachingContext';
import TeachingHighlighter from '../components/TeachingHighlighter';
import CodeBlock from '../components/CodeBlock';
import { Play, ArrowRight, ArrowLeft } from 'lucide-react';
import clsx from 'clsx';

function KaraokeText({ text, isCurrentStep, isAdminMode }) {
  return (
    <span className={clsx(
      "transition-all duration-300 inline-block",
      isCurrentStep ? "font-bold text-slate-900 scale-[1.02] origin-left" : "text-slate-700",
      isAdminMode && isCurrentStep ? "opacity-0 select-none" : ""
    )}>
      {text}
    </span>
  );
}

export default function LessonPage() {
  const { slug } = useParams();
  const [lesson, setLesson] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const { 
    isActive, currentStep, isAdminMode,
    setIsSpeaking, mode, isPaused,
    setActiveLesson 
  } = useTeachingState();

  const audioRef = useRef(null);

  useEffect(() => {
    fetch('http://localhost:5000/api/lessons')
      .then(res => res.json())
      .then(data => setLessons(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/api/lessons/${slug}`)
      .then(res => res.json())
      .then(data => { 
        setLesson(data); 
        setActiveLesson(data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [slug, setActiveLesson]);

  const currentIdx = lessons.findIndex(l => l.slug === slug);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }

    if (!isActive || mode !== 'EXPLAINING' || !lesson) {
      setIsSpeaking(false);
      return;
    }

    const block = lesson.blocks[currentStep];
    if (!block?.teachingScript) {
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    const script = block.teachingScript;
    let finalAudioUrl = script.audioUrl;
    if (!finalAudioUrl && script.uploadedName) {
      finalAudioUrl = `http://localhost:5000/audio/${script.uploadedName}`;
    }

    if (finalAudioUrl) {
      const audio = new Audio(finalAudioUrl);
      audioRef.current = audio;
      if (!isPaused) {
        audio.play().catch(() => {
          setTimeout(() => { if (audioRef.current === audio) setIsSpeaking(false); }, script.duration || 3000);
        });
      }
      audio.addEventListener('ended', () => setIsSpeaking(false));
      audio.addEventListener('error', () => setTimeout(() => setIsSpeaking(false), 2000));
    } else {
      const timer = setTimeout(() => setIsSpeaking(false), script.duration || 3500);
      return () => clearTimeout(timer);
    }
  }, [isActive, mode, currentStep, lesson, isPaused, setIsSpeaking]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPaused) audio.pause();
    else if (isActive) audio.play().catch(() => {});
  }, [isPaused, isActive]);

  useEffect(() => {
    if (!isActive && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsSpeaking(false);
    }
  }, [isActive, setIsSpeaking]);

  if (loading && !lesson) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-64px)] w-full max-w-5xl px-8 md:px-16 py-24 animate-pulse">
        <div className="h-16 w-20 bg-emerald-50 rounded-3xl mb-8" />
        <div className="h-12 w-3/4 bg-slate-50 rounded-3xl mb-20" />
      </div>
    );
  }

  if (!lesson && !loading) return <div className="p-12 text-center text-red-500 font-bold">Lesson not found</div>;

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full max-w-5xl px-8 md:px-16 py-16 relative font-sans animate-entrance">
       
       <div className="flex-1">
          {isAdminMode && (
            <div className="fixed top-0 left-0 right-0 bg-red-600 text-white font-black text-center py-2 text-[10px] tracking-[0.4em] z-[100] shadow-2xl uppercase">
                Admin Preview Active
            </div>
          )}

          {/* Header Section */}
          <header className="mb-20">
            <div className="flex flex-col gap-4">
                <span className="text-4xl md:text-5xl font-black text-[#10b981] tracking-tighter opacity-70 select-none">
                  {String(lesson.chapterOrder || (currentIdx + 1)).padStart(2, '0')}
                </span>
                
                {lesson.blocks[0] && (
                  <TeachingHighlighter stepIndex={0} noIndicator={true}>
                    <h1 className={clsx(
                      "text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-[1.05] transition-all duration-700",
                      (isActive && currentStep === 0) ? "text-[#10b981] scale-[1.01] origin-left" : ""
                    )}>
                      {isAdminMode && (isActive && currentStep === 0) ? lesson.blocks[0].teachingScript?.transcript : lesson.blocks[0].visibleText}
                    </h1>
                  </TeachingHighlighter>
                )}
            </div>
          </header>

          {/* Content Blocks */}
          <div className="space-y-12">
            {lesson.blocks.slice(1).map((block, idx) => {
              const actualStep = idx + 1;
              const isCurrentBlock = isActive && currentStep === actualStep;
              
              if (block.type === 'code') {
                return (
                  <TeachingHighlighter key={block.id} stepIndex={actualStep} hasCodeBlock={true}>
                    <div className="rounded-[2.5rem] overflow-hidden shadow-2xl shadow-slate-200/40 border border-slate-100">
                        <CodeBlock 
                          visibleText={block.visibleText} 
                          language={block.language || 'html'} 
                          stepIndex={actualStep} 
                        />
                    </div>
                  </TeachingHighlighter>
                );
              }
              
              return (
                <TeachingHighlighter key={block.id} stepIndex={actualStep} hasCodeBlock={false}>
                  <div className={clsx(
                    "transition-all duration-700",
                    isCurrentBlock ? "translate-x-3" : ""
                  )}>
                    <p className={clsx(
                      "text-sm md:text-base leading-relaxed transition-all duration-700 font-medium tracking-tight",
                      isCurrentBlock ? "text-slate-900" : "text-slate-500"
                    )}>
                      {isAdminMode && isCurrentBlock 
                        ? <span className="font-bold text-red-600 border-b-4 border-red-100 pb-1">{block.teachingScript?.transcript}</span>
                        : <KaraokeText text={block.visibleText} isCurrentStep={isCurrentBlock} isAdminMode={isAdminMode} />
                      }
                    </p>
                  </div>
                </TeachingHighlighter>
              );
            })}
          </div>
       </div>

       {/* Footer Navigation - Properly Formatted & Gounded */}
       <div className="mt-32 pt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-8 pb-12 transition-all">
         {/* Previous Lesson */}
         <div className="flex-1 w-full md:w-auto">
           {prevLesson ? (
             <Link 
               to={`/lessons/${prevLesson.slug}`}
               className="flex items-center gap-4 group p-4 -ml-4 hover:bg-slate-50 rounded-[2rem] transition-all duration-500"
             >
               <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
                  <ArrowLeft size={20} />
               </div>
               <div className="flex flex-col">
                  <span className="text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase mb-1">Previous</span>
                  <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none">{prevLesson.title}</span>
               </div>
             </Link>
           ) : (
             <div className="h-1" />
           )}
         </div>

         {/* Next Lesson */}
         <div className="flex-1 flex justify-end text-right w-full md:w-auto">
           {nextLesson ? (
             <Link 
               to={`/lessons/${nextLesson.slug}`}
               className="flex items-center gap-4 group p-4 -mr-4 hover:bg-slate-50 rounded-[2rem] transition-all duration-500 flex-row-reverse"
             >
               <div className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shadow-sm">
                  <ArrowRight size={20} />
               </div>
               <div className="flex flex-col items-end">
                  <span className="text-[9px] font-black text-slate-300 tracking-[0.3em] uppercase mb-1">Next Lesson</span>
                  <span className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none">{nextLesson.title}</span>
               </div>
             </Link>
           ) : (
             <div className="py-2 px-6 rounded-full border border-slate-100 text-slate-300 text-[10px] font-black uppercase tracking-widest italic">End of Course</div>
           )}
         </div>
       </div>

    </div>
  );
}
