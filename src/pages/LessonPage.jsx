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
      isCurrentStep ? "scale-[1.02] origin-left" : "",
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
    setActiveLesson, continueTeaching, activeLesson
  } = useTeachingState();

  const audioRef = useRef(null);

  // Auto-advance to the next block after audio ends.
  // Stops at code blocks so the user can try them.
  const autoAdvance = (block) => {
    if (!isActive) return;
    const nextIdx = currentStep + 1;
    if (!activeLesson || nextIdx >= activeLesson.blocks.length) return;
    const nextBlock = activeLesson.blocks[nextIdx];
    if (nextBlock?.type === 'code') {
      // Pause at code blocks — user must try & click Continue
      return;
    }
    // Small delay so the highlight clears before moving
    setTimeout(() => continueTeaching(), 400);
  };

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
          setTimeout(() => {
            if (audioRef.current === audio) {
              setIsSpeaking(false);
              autoAdvance(block);
            }
          }, script.duration || 3000);
        });
      }
      audio.addEventListener('ended', () => {
        setIsSpeaking(false);
        autoAdvance(block);
      });
      audio.addEventListener('error', () => setTimeout(() => setIsSpeaking(false), 2000));
    } else {
      const timer = setTimeout(() => {
        setIsSpeaking(false);
        autoAdvance(block);
      }, script.duration || 3500);
      return () => clearTimeout(timer);
    }
  }, [isActive, mode, currentStep, lesson, isPaused, setIsSpeaking]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPaused) audio.pause();
    else if (isActive) audio.play().catch(() => { });
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
      <div className="flex flex-col min-h-[calc(100vh-64px)] w-full max-w-5xl px-8 md:px-16 py-24 animate-pulse gap-6">
        <div className="h-16 w-20 bg-emerald-50 rounded-3xl" />
        <div className="h-12 w-3/4 bg-slate-50 rounded-3xl" />
      </div>
    );
  }

  if (!lesson && !loading) return <div className="p-12 text-center text-red-500 font-bold">Lesson not found</div>;

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full max-w-5xl px-12 py-16 relative font-sans animate-entrance overflow-hidden">

      {/* Static Background Particles - beside title area */}
      <div className="absolute top-12 right-8 w-[220px] h-[260px] pointer-events-none z-0 overflow-hidden">
        {[
          { text: '<div>', top: '8%',  left: '45%', },
          { text: '<p>',   top: '35%', left: '70%', },
          { text: '<br>',  top: '60%', left: '30%', },
          { text: '</>',   top: '82%', left: '58%', },
        ].map((tag, i) => (
          <div
            key={i}
            className="absolute font-mono text-[9px] font-bold text-[#b48d53]/30 dark:text-[#fde047]/15 bg-[#f5efe3]/50 dark:bg-[#fef08a]/5 px-2.5 py-1 rounded-md select-none"
            style={{ top: tag.top, left: tag.left }}
          >
            {tag.text}
          </div>
        ))}
      </div>

      <div className="flex-1 relative z-10">
        {isAdminMode && (
          <div className="fixed top-0 left-0 right-0 bg-red-600/90 backdrop-blur-md text-white font-black text-center py-2 text-[10px] tracking-[0.4em] z-[100] shadow-2xl uppercase border-b border-white/20">
            Admin Preview Active
          </div>
        )}

        {/* Header Section */}
        <header className="mb-20">
          <div className="flex flex-col gap-6">
            <span className="text-5xl md:text-7xl font-black text-transparent select-none pb-2 pl-4 dark:pl-0" style={{ WebkitTextStroke: '2px #dcb46e', opacity: 1 }}>
              {String(lesson.chapterOrder || (currentIdx + 1)).padStart(2, '0')}
            </span>

            {lesson.blocks[0] && (
              <TeachingHighlighter stepIndex={0} noIndicator={true}>
                <h1 className={clsx(
                  "text-4xl md:text-5xl font-black text-slate-800 dark:text-white tracking-tight leading-[1.05] drop-shadow-sm transition-all duration-700",
                  (isActive && currentStep === 0) ? "text-[#b45309] dark:text-[#b45309] scale-[1.01] origin-left" : ""
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

            const blockLayoutClass = clsx(
              "transition-all duration-500",
              isCurrentBlock ? "scale-[1.01] origin-left" : ""
            );

            if (block.type === 'code') {
              return (
                <div key={block.id} className={blockLayoutClass}>
                  <TeachingHighlighter stepIndex={actualStep} hasCodeBlock={true}>
                    <CodeBlock
                      visibleText={block.visibleText}
                      language={block.language || 'html'}
                      stepIndex={actualStep}
                    />
                  </TeachingHighlighter>
                </div>
              );
            }

            return (
              <div key={block.id} className={blockLayoutClass}>
                <TeachingHighlighter stepIndex={actualStep} hasCodeBlock={false}>
                  <p className={clsx(
                    "text-sm md:text-base leading-relaxed transition-all duration-500 tracking-tight",
                    isCurrentBlock
                      ? "text-slate-800 dark:text-white font-bold"
                      : "text-slate-600 dark:text-slate-400 font-medium"
                  )}>
                    {isAdminMode && isCurrentBlock
                      ? <span className="font-bold text-red-600 border-b-4 border-red-100 pb-1">{block.teachingScript?.transcript}</span>
                      : <KaraokeText text={block.visibleText} isCurrentStep={isCurrentBlock} isAdminMode={isAdminMode} />
                    }
                  </p>
                </TeachingHighlighter>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="relative z-10 mt-32 pt-12 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 pb-12 transition-all duration-700">
        <div className="flex-1 w-full md:w-auto">
          {prevLesson ? (
            <Link
              to={`/lessons/${prevLesson.slug}`}
              className="flex items-center gap-4 group p-4 -ml-4 hover:bg-slate-50/50 rounded-[2rem] transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#fef08a] transition-all duration-500">
                <ArrowLeft size={20} className="text-slate-500 group-hover:text-slate-800" />
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase mb-1">Previous</span>
                <span className="text-lg font-black text-slate-700 group-hover:text-slate-900 transition-colors uppercase tracking-tight leading-none drop-shadow-sm">{prevLesson.title}</span>
              </div>
            </Link>
          ) : (
            <div className="h-1" />
          )}
        </div>

        <div className="flex-1 flex justify-end text-right w-full md:w-auto">
          {nextLesson ? (
            <Link
              to={`/lessons/${nextLesson.slug}`}
              className="flex items-center gap-4 group p-4 -mr-4 hover:bg-slate-50/50 rounded-[2rem] transition-all duration-300 flex-row-reverse"
            >
              <div className="w-11 h-11 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center shrink-0 group-hover:bg-[#fef08a] transition-all duration-500">
                <ArrowRight size={20} className="text-slate-500 group-hover:text-slate-800" />
              </div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 tracking-[0.3em] uppercase mb-1">Next Lesson</span>
                <span className="text-lg font-black text-slate-700 group-hover:text-slate-900 transition-colors uppercase tracking-tight leading-none drop-shadow-sm">{nextLesson.title}</span>
              </div>
            </Link>
          ) : (
            <div className="py-3 px-8 rounded-[2rem] bg-[#f5efe3] dark:bg-[#EAB308]/5 dark:border dark:border-[#EAB308]/30 text-[#b48d53] dark:text-[#EAB308] text-[11px] font-black uppercase tracking-[0.3em] font-sans transition-all">End of Course</div>
          )}
        </div>
      </div>

    </div>
  );
}
