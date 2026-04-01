import React, { createContext, useContext, useState, useEffect } from 'react';

const TeachingContext = createContext();

export function TeachingProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState('IDLE'); // IDLE | EXPLAINING | AT_CODE_BLOCK | USER_TRYING | BOT_CODING | COMPLETED
  const [currentStep, setCurrentStep] = useState(0);
  const [currentCodeLine, setCurrentCodeLine] = useState(0);
  const [showContinueButton, setShowContinueButton] = useState(false);
  const [userHasRun, setUserHasRun] = useState(false);
  const [activeAnimations, setActiveAnimations] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentWordIndex, setCurrentWordIndex] = useState(-1);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [activeLesson, setActiveLesson] = useState(null);

  const startTeaching = (lesson) => {
    setActiveLesson(lesson);
    setIsActive(true);
    setCurrentStep(0);
    
    if (lesson && lesson.blocks[0]?.type === 'code') {
      setMode('WAITING_TO_TRY');
    } else {
      setMode('EXPLAINING');
    }
    setCurrentCodeLine(0);
    setShowContinueButton(false);
    setUserHasRun(false);
    setIsPaused(false);
  };

  const stopTeaching = () => {
    setIsActive(false);
    setMode('IDLE');
    setCurrentStep(0);
    setCurrentWordIndex(-1);
  };

  const explainTopic = () => {
    setMode('BOT_CODING');
    // Start bot coding Logic inside the CodeBlock or in Context?
  };

  const explainLastTopic = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      setMode('EXPLAINING');
    }
  };

  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  const continueTeaching = () => {
    if (activeLesson && currentStep >= activeLesson.blocks.length - 1) {
      setMode('COMPLETED');
      setTimeout(() => stopTeaching(), 1000);
      return;
    }
    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);
    
    if (activeLesson && activeLesson.blocks[nextStep]?.type === 'code') {
      setMode('WAITING_TO_TRY');
    } else {
      setMode('EXPLAINING');
    }
  };

  const jumpToStep = (stepIndex) => {
    if (!activeLesson || !isActive) return;
    setCurrentStep(stepIndex);
    
    if (activeLesson.blocks[stepIndex]?.type === 'code') {
      setMode('WAITING_TO_TRY');
    } else {
      setMode('EXPLAINING');
    }
    setCurrentCodeLine(0);
    setShowContinueButton(false);
    setUserHasRun(false);
    setIsPaused(false);
  };

  const startCodeExplanation = () => {
    setMode('EXPLAINING_CODE');
  };

  // Setup Admin mode keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.shiftKey && e.key.toLowerCase() === 'a') {
        setIsAdminMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const value = {
    isActive, setIsActive,
    mode, setMode,
    currentStep, setCurrentStep,
    currentCodeLine, setCurrentCodeLine,
    showContinueButton, setShowContinueButton,
    userHasRun, setUserHasRun,
    activeAnimations, setActiveAnimations,
    isPaused, setIsPaused,
    isSpeaking, setIsSpeaking,
    currentWordIndex, setCurrentWordIndex,
    isAdminMode, setIsAdminMode,
    activeLesson, setActiveLesson,
    startTeaching, stopTeaching, togglePause, continueTeaching, explainTopic, explainLastTopic,
    startCodeExplanation, jumpToStep
  };

  return (
    <TeachingContext.Provider value={value}>
      {children}
    </TeachingContext.Provider>
  );
}

export const useTeachingState = () => useContext(TeachingContext);
