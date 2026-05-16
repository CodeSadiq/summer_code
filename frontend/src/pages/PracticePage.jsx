import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronRight, ChevronLeft, CheckCircle2, XCircle,
  Trophy, RotateCcw, ArrowRight, Play, Loader2, Sparkles,
  HelpCircle, Code, Bug, Terminal
} from 'lucide-react';
import { API_URL } from '../config';
import clsx from 'clsx';
import { useTeachingState } from '../contexts/TeachingContext';
import CodeBlock from '../components/CodeBlock';

export default function PracticePage() {
  const { courseId, topicId } = useParams();
  const { isEnglish, setIsEnglish } = useTeachingState();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { index: { selectedOption, isSubmitted, isCorrect, isWrong, userCode, executionResult } }
  const [loading, setLoading] = useState(true);
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);
  const [isExecuting, setIsExecuting] = useState(false);
  const [lessonTitle, setLessonTitle] = useState('');

  // AI Explanation State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiExplanation, setAiExplanation] = useState('');
  const [showAiChat, setShowAiChat] = useState(false);

  const user = JSON.parse(localStorage.getItem('studentData') || '{}');

  useEffect(() => {
    fetchQuestions();
    fetchLessonTitle();
  }, [topicId]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let url = `${API_URL}/api/practice?userId=${user.email}`;
      if (courseId === 'Course') {
        url += `&topicId=${topicId}`;
      } else {
        url += `&topicId=${courseId}&lessonId=${topicId}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setQuestions(data);

      // Initialize first question answer
      if (data.length > 0) {
        setAnswers({
          0: { selectedOption: null, isSubmitted: false, userCode: data[0].starterCode || '' }
        });
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchLessonTitle = async () => {
    try {
      const res = await fetch(`${API_URL}/api/lessons`);
      const data = await res.json();
      const lesson = data.find(l => l.slug === topicId);
      if (lesson) setLessonTitle(lesson.title);
      else setLessonTitle(topicId);
    } catch (err) {
      setLessonTitle(topicId);
    }
  };

  const currentQuestion = questions[currentIndex] || {};
  const currentAnswer = answers[currentIndex] || { selectedOption: null, isSubmitted: false, userCode: currentQuestion.starterCode || '' };

  const activeQuestionText = (isEnglish && currentQuestion.englishQuestion) ? currentQuestion.englishQuestion : currentQuestion.question;
  const activeOptions = (isEnglish && currentQuestion.englishOptions) ? currentQuestion.englishOptions : currentQuestion.options;
  const activeExplanation = (isEnglish && currentQuestion.englishExplanation) ? currentQuestion.englishExplanation : currentQuestion.explanation;

  console.log('Language Debug:', { isEnglish, hasEnglish: !!currentQuestion.englishQuestion, activeQuestionText });

  const handleOptionSelect = (option) => {
    if (currentAnswer.isSubmitted) return;
    setAnswers(prev => ({
      ...prev,
      [currentIndex]: { ...prev[currentIndex], selectedOption: option }
    }));
  };

  const handleSubmit = () => {
    if (currentAnswer.isSubmitted) return;

    let isCorrect = false;
    if (currentQuestion.type === 'mcq' || currentQuestion.type === 'output') {
      const selectedIndex = activeOptions.indexOf(currentAnswer.selectedOption);
      const correctIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
      isCorrect = selectedIndex === correctIndex;
    } else if (currentQuestion.type === 'debug' || currentQuestion.type === 'coding') {
      isCorrect = currentAnswer.executionResult?.success;
    }

    if (isCorrect) setScore(prev => prev + 1);

    setAnswers(prev => ({
      ...prev,
      [currentIndex]: {
        ...prev[currentIndex],
        isSubmitted: true,
        isCorrect,
        isWrong: !isCorrect
      }
    }));
  };


  const handleAiExplain = async () => {
    setIsAiLoading(true);
    setShowAiChat(true);
    setAiExplanation('');

    try {
      const res = await fetch(`${API_URL}/api/ai/explain`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: activeQuestionText,
          options: activeOptions,
          selectedOption: currentAnswer.selectedOption,
          correctAnswer: currentQuestion.correctAnswer,
          userCode: currentAnswer.userCode,
          type: currentQuestion.type,
          language: isEnglish ? 'English' : 'Hinglish'
        })
      });

      const data = await res.json();
      if (data.success) {
        setAiExplanation(data.explanation);
      } else {
        setAiExplanation("Sorry, I couldn't generate an explanation right now.");
      }
    } catch (err) {
      console.error(err);
      setAiExplanation("Error connecting to AI Tutor.");
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setChatHistory([]); // Reset chat for new question
      setShowAiChat(false);
      if (!answers[nextIndex]) {
        setAnswers(prev => ({
          ...prev,
          [nextIndex]: { selectedOption: null, isSubmitted: false, userCode: questions[nextIndex].starterCode || '' }
        }));
      }
    } else {
      submitFinalScore();
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const submitFinalScore = async () => {
    const finalScorePerc = Math.round((score / questions.length) * 100);
    try {
      await fetch(`${API_URL}/api/practice/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.email,
          topicId,
          score: finalScorePerc
        })
      });
    } catch (err) {
      console.error('Failed to submit score:', err);
    }
    setShowSummary(true);
  };

  const handleRunCode = async () => {
    setIsExecuting(true);
    try {
      const res = await fetch(`${API_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: currentAnswer.userCode,
          language: 'javascript',
        })
      });
      const data = await res.json();
      const success = data.output?.trim() === currentQuestion.correctAnswer?.trim();

      setAnswers(prev => ({
        ...prev,
        [currentIndex]: {
          ...prev[currentIndex],
          executionResult: { output: data.output, success, error: data.error },
          isCorrect: success,
          isWrong: !success
        }
      }));

      if (success) {
        setAnswers(prev => ({
          ...prev,
          [currentIndex]: { ...prev[currentIndex], isSubmitted: true }
        }));
      }
    } catch (err) {
      setAnswers(prev => ({
        ...prev,
        [currentIndex]: { ...prev[currentIndex], executionResult: { output: 'Execution failed', error: true } }
      }));
    } finally {
      setIsExecuting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2e3748] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-[#2e3748] flex items-center justify-center p-6 text-center">
        <div className="space-y-6">
          <HelpCircle size={64} className="mx-auto text-slate-300" />
          <h2 className="text-2xl font-black text-white uppercase">No Questions Found</h2>
          <p className="text-slate-400">We couldn't find any practice questions for this topic yet.</p>
          <button onClick={() => navigate(-1)} className="px-8 py-3 bg-white text-slate-900 rounded-2xl font-bold">Go Back</button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    const perc = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-[#2e3748] flex items-center justify-center p-6">
        <div className="max-w-xl w-full text-center space-y-12 animate-entrance">
          <div className="space-y-4">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center mx-auto text-white shadow-xl shadow-blue-500/20 mb-8">
              <Trophy size={40} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">Session Complete!</h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Topic: {topicId}</p>
          </div>

          <div className="grid grid-cols-2 gap-12 py-8">
            <div className="space-y-1">
              <p className="text-6xl font-black text-white tracking-tighter">{score}/{questions.length}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Questions Correct</p>
            </div>
            <div className="space-y-1 border-l border-white/10">
              <p className="text-6xl font-black text-blue-400 tracking-tighter">{perc}%</p>
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Mastery Level</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <button
              onClick={() => window.location.reload()}
              className="flex-1 py-4 bg-white/5 border border-white/10 text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw size={14} /> Retry Session
            </button>
            <button
              onClick={() => navigate('/practice')}
              className="flex-1 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-50 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/10"
            >
              Back to Practice Hub <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2e3748] pb-20 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-[#1e293b]/40 backdrop-blur-xl border-b border-white/5 py-4">
        <div className="max-w-[1400px] mx-0 ml-0 pl-10 pr-10 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <h1 className="text-base font-black text-white uppercase tracking-[0.2em] leading-none mb-2">
                {lessonTitle || topicId}
              </h1>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/60 animate-pulse delay-75" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500/30 animate-pulse delay-150" />
                </div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">Practice Session</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsEnglish(!isEnglish)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-white/5 transition-all active:scale-95"
            >
              <Sparkles size={12} className={clsx(isEnglish ? "text-blue-400" : "text-emerald-400")} />
              {isEnglish ? "English Mode" : "Hinglish Mode"}
            </button>
            <div className="w-px h-8 bg-white/5" />
            <div className="flex items-center gap-4">
              <span className="text-5xl font-black text-white tracking-tighter">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <div className="w-px h-10 bg-white/10" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-300 uppercase tracking-[0.2em]">Question</span>
                <span className="text-[11px] font-black text-slate-200 uppercase tracking-widest">
                  OF {questions.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-0 ml-0 px-10 pt-6">
        <div className="space-y-6 animate-entrance">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tight max-w-2xl">
              {activeQuestionText}
            </h2>
          </div>

          <div className="space-y-4">
            {(currentQuestion.type === 'mcq' || currentQuestion.type === 'output') ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeOptions?.map((option, idx) => {
                  const isSelected = currentAnswer.selectedOption === option;
                  const correctIndex = currentQuestion.options.indexOf(currentQuestion.correctAnswer);
                  const isCorrect = currentAnswer.isSubmitted && idx === correctIndex;
                  const isWrong = currentAnswer.isSubmitted && isSelected && idx !== correctIndex;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionSelect(option)}
                      disabled={currentAnswer.isSubmitted}
                      className={clsx(
                        "p-5 rounded-2xl border-2 text-left transition-all duration-200 group flex items-center justify-between relative overflow-hidden",
                        !currentAnswer.isSubmitted && isSelected && "border-white bg-white/20 border-b-2 shadow-lg",
                        !currentAnswer.isSubmitted && !isSelected && "border-white/5 bg-white/[0.03] border-b-4 hover:border-white/20 hover:-translate-y-0.5 active:translate-y-0 active:border-b-2",
                        currentAnswer.isSubmitted && isCorrect && "border-emerald-500 bg-emerald-600 border-b-2 shadow-none",
                        currentAnswer.isSubmitted && isWrong && "border-rose-500 bg-rose-600 border-b-2 shadow-none",
                        currentAnswer.isSubmitted && !isCorrect && !isWrong && "border-white/5 opacity-40 bg-transparent border-b-2"
                      )}
                    >
                      {!currentAnswer.isSubmitted && <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      <span className={clsx(
                        "text-lg font-semibold transition-colors relative z-10",
                        currentAnswer.isSubmitted && (isCorrect || isWrong) ? "text-white" :
                          !currentAnswer.isSubmitted && isSelected ? "text-white" : "text-white"
                      )}>
                        {activeOptions[idx]}
                      </span>
                      {currentAnswer.isSubmitted && isCorrect && <CheckCircle2 className="text-white" size={24} />}
                      {currentAnswer.isSubmitted && isWrong && <XCircle className="text-white" size={24} />}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="rounded-3xl border border-white/10 overflow-hidden shadow-2xl bg-slate-900">
                  <div className="bg-slate-800 px-6 py-3 flex items-center justify-between border-b border-white/5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Editor</span>
                    <button
                      onClick={handleRunCode}
                      disabled={isExecuting || currentAnswer.isSubmitted}
                      className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95"
                    >
                      {isExecuting ? <Loader2 size={10} className="animate-spin" /> : <Play size={10} fill="currentColor" />}
                      Run Test
                    </button>
                  </div>
                  <textarea
                    value={currentAnswer.userCode}
                    onChange={(e) => setAnswers(prev => ({
                      ...prev,
                      [currentIndex]: { ...prev[currentIndex], userCode: e.target.value }
                    }))}
                    disabled={currentAnswer.isSubmitted}
                    spellCheck="false"
                    className="w-full h-40 bg-slate-950 text-emerald-400 font-mono p-4 outline-none resize-none text-xs"
                  />
                </div>

                {currentAnswer.executionResult && (
                  <div className={clsx(
                    "p-4 rounded-2xl border animate-pop-in",
                    currentAnswer.executionResult.success ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className={clsx("text-[9px] font-black uppercase tracking-widest", currentAnswer.executionResult.success ? "text-emerald-600" : "text-red-600")}>
                        {currentAnswer.executionResult.success ? "Test Passed" : "Test Failed"}
                      </span>
                    </div>
                    <pre className="text-xs font-mono text-slate-700">{currentAnswer.executionResult.output}</pre>
                  </div>
                )}
              </div>
            )}
          </div>

          {currentAnswer.isSubmitted && (
            <div className="flex flex-col gap-6 mt-10">
              {!showAiChat ? (
                <button
                  onClick={() => handleAiExplain()}
                  className="w-fit px-6 py-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <Sparkles size={14} className="group-hover:animate-pulse" /> ? Explanation
                </button>
              ) : (
                <div className="bg-[#1e293b]/90 border border-white/5 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl animate-slide-up-smooth backdrop-blur-xl">
                  {/* Header */}
                  <div className="px-6 py-4 bg-indigo-600/20 border-b border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-indigo-500/30 rounded-full flex items-center justify-center">
                        <Sparkles size={10} className="text-indigo-300" />
                      </div>
                      <span className="text-[9px] font-black text-indigo-200 uppercase tracking-widest">AI Explanation</span>
                    </div>
                    <button onClick={() => setShowAiChat(false)} className="text-slate-500 hover:text-white transition-colors">
                      <XCircle size={18} />
                    </button>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-slate-200 text-sm leading-relaxed whitespace-pre-wrap">
                    {isAiLoading ? (
                      <div className="flex items-center gap-2 text-indigo-400 text-[9px] font-black uppercase tracking-widest animate-pulse">
                        <Loader2 size={10} className="animate-spin" /> Thinking...
                      </div>
                    ) : (
                      aiExplanation
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="pt-4 flex justify-end items-center gap-4">
            {!currentAnswer.isSubmitted && (
              <button
                onClick={handleSubmit}
                disabled={(!currentAnswer.selectedOption && (currentQuestion.type === 'mcq' || currentQuestion.type === 'output'))}
                className={clsx(
                  "relative group px-8 py-4 rounded-2xl font-black text-[9px] uppercase tracking-[0.2em] transition-all active:scale-95 overflow-hidden",
                  (!currentAnswer.selectedOption && (currentQuestion.type === 'mcq' || currentQuestion.type === 'output'))
                    ? "bg-white/5 text-slate-600 cursor-not-allowed"
                    : "bg-white text-slate-900 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                )}
              >
                Submit Answer
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="fixed top-24 right-10 z-[100] flex items-center gap-3">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="bg-white/10 text-white px-6 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white/20 transition-all active:scale-95 flex items-center gap-3 border border-white/10"
          >
            <ChevronLeft size={18} />
            Back
          </button>
        )}
        {currentAnswer.isSubmitted && (
          <button
            onClick={handleNext}
            className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500 shadow-2xl shadow-blue-500/20 transition-all active:scale-95 flex items-center gap-3 border-2 border-white/10"
          >
            {currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
            <ChevronRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
