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
        "relative transition-all duration-700 w-full rounded-2xl",
        isCurrentBlock && !hasCodeBlock
          ? "bg-cyan-400/5 dark:bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.06)]"
          : "bg-transparent",
        isCurrentBlock ? "px-6 -mx-6 py-4 -my-2" : ""
      )}
    >
      {children}
    </div>
  );
}
