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
        "relative transition-all duration-300 w-full rounded-2xl",
        isCurrentBlock
          ? "bg-blue-50/80 border border-blue-100/50 shadow-sm"
          : "bg-transparent border border-transparent",
        isCurrentBlock ? "px-6 -mx-6 py-4 -my-2" : ""
      )}
    >
      {children}
    </div>
  );
}
