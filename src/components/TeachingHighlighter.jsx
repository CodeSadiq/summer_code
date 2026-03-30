import React, { useRef, useEffect } from 'react';
import { useTeachingState } from '../contexts/TeachingContext';
import clsx from 'clsx';

export default function TeachingHighlighter({ children, stepIndex, hasCodeBlock, noIndicator }) {
  const { currentStep, isActive } = useTeachingState();
  const blockRef = useRef(null);

  const isCurrentBlock = isActive && currentStep === stepIndex;

  useEffect(() => {
    if (isCurrentBlock && blockRef.current) {
      blockRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [isCurrentBlock]);

  return (
    <div 
      ref={blockRef}
      className={clsx(
        "relative transition-all duration-500 w-full rounded-2xl",
        isCurrentBlock && !hasCodeBlock ? "bg-emerald-50 shadow-[0_15px_40px_rgba(16,185,129,0.04)]" : "bg-transparent",
        isCurrentBlock ? "px-4 -mx-4 py-3 -my-1" : ""
      )}
    >
      {children}
    </div>
  );
}
