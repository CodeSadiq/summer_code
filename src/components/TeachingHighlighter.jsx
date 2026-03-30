import React, { useRef, useEffect } from 'react';
import { useTeachingState } from '../contexts/TeachingContext';
import clsx from 'clsx';

export default function TeachingHighlighter({ children, stepIndex, hasCodeBlock, noIndicator = false }) {
  const { isActive, currentStep } = useTeachingState();
  const isCurrentBlock = isActive && currentStep === stepIndex;
  const blockRef = useRef(null);

  useEffect(() => {
    if (isCurrentBlock && blockRef.current) {
      blockRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [isCurrentBlock]);

  return (
    <div 
      ref={blockRef}
      className={clsx(
        "relative transition-all duration-700 w-full rounded-3xl",
        isCurrentBlock && !hasCodeBlock ? "bg-emerald-50/40" : "bg-transparent",
        isCurrentBlock ? "px-6 -mx-6 md:px-8 md:-mx-8 py-4 -my-4" : ""
      )}
    >
      {/* Subtle indicator bar for focus */}
      <div className={clsx(
        "absolute -left-2 top-1/2 -translate-y-1/2 w-1 bg-[#10b981] rounded-full transition-all duration-700",
        isCurrentBlock ? "h-12 opacity-100" : "h-0 opacity-0"
      )} />
      
      {children}
    </div>
  );
}
