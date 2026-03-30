import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-twilight.css'; // Good dark theme
import { RotateCcw, Play } from 'lucide-react';
import { useTeachingState } from '../contexts/TeachingContext';

export default function CodeBlock({ visibleText, language, stepIndex }) {
  const [code, setCode] = useState(visibleText);
  const [output, setOutput] = useState('');
  const [hasRun, setHasRun] = useState(true);
  
  const { 
    isActive, mode, currentStep, showContinueButton, setShowContinueButton,
    userHasRun, setUserHasRun, setMode, isPaused
  } = useTeachingState();

  const isCurrentBlock = isActive && currentStep === stepIndex;
  const isReadOnly = (isCurrentBlock && (mode === 'BOT_CODING' || mode === 'EXPLAINING')) || (!isCurrentBlock && isActive);

  // Initialize output
  useEffect(() => {
    setOutput(visibleText);
  }, [visibleText]);

  // Handle Bot Typing Simulation
  useEffect(() => {
    if (isCurrentBlock && mode === 'BOT_CODING' && !isPaused) {
      setCode('');
      const lines = visibleText.split('\n');
      let currentLine = 0;
      
      const typeNextLine = () => {
        if (currentLine < lines.length) {
          setCode(prev => prev + (prev ? '\n' : '') + lines[currentLine]);
          currentLine++;
          setTimeout(typeNextLine, 800);
        } else {
          // Done typing
          setOutput(visibleText);
          setMode('AT_CODE_BLOCK');
        }
      };
      
      const timer = setTimeout(typeNextLine, 800);
      return () => clearTimeout(timer);
    }
  }, [isCurrentBlock, mode, visibleText, setMode, isPaused]);

  // Handle "Go Ahead" Timer visibility
  useEffect(() => {
    if (isCurrentBlock && mode === 'AT_CODE_BLOCK' && !isPaused) {
      const btnTimer = setTimeout(() => setShowContinueButton(true), 5000);
      return () => clearTimeout(btnTimer);
    }
    if (mode !== 'AT_CODE_BLOCK') {
       setShowContinueButton(false);
    }
  }, [isCurrentBlock, mode, isPaused, setShowContinueButton]);

  const handleRun = () => {
    setOutput(code);
    setHasRun(true);
    if (isCurrentBlock && mode === 'AT_CODE_BLOCK') {
      setMode('USER_TRYING');
      setUserHasRun(true);
    } else if (isCurrentBlock && mode === 'USER_TRYING') {
      setUserHasRun(true);
    }
  };

  const handleReset = () => {
    setCode(visibleText);
    setOutput(visibleText);
  };

  const highlightWithPrism = (codeStr) => {
    const lg = Prism.languages[language] || Prism.languages.markup;
    return Prism.highlight(codeStr, lg, language);
  };

  return (
    <div className="flex flex-col xl:flex-row rounded-2xl overflow-hidden border shadow-lg my-8 w-full">
      {/* Editor Side */}
      <div className="flex-1 bg-[#0d1117] flex flex-col min-w-0 border-r border-[#30363d]">
        <div className="h-12 bg-[#161b22] flex items-center px-4 justify-between border-b border-[#30363d]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">EDITOR.{language}</span>
          <button onClick={handleReset} title="Reset Code" className="text-slate-400 hover:text-white transition-colors group">
            <RotateCcw size={14} className="group-active:-rotate-180 transition-transform duration-300" />
          </button>
        </div>
        <div className="flex-1 overflow-auto bg-[#0d1117] p-4 text-sm font-mono relative group">
           {isReadOnly && <div className="absolute inset-0 z-10 cursor-not-allowed"></div>}
           {React.createElement(Editor.default || Editor, {
             value: code,
             onValueChange: c => {
                 setCode(c);
                 if(isCurrentBlock && mode === 'AT_CODE_BLOCK') setMode('USER_TRYING');
             },
             highlight: highlightWithPrism,
             padding: 10,
             textareaClassName: "focus:outline-none",
             style: {
               fontFamily: '"JetBrains Mono", "Fira Code", monospace',
               lineHeight: 1.6,
               minHeight: '200px'
             },
             readOnly: isReadOnly,
             className: "text-slate-100 placeholder-slate-600",
             placeholder: `Write some ${language} code...`
           })}
        </div>
      </div>

      {/* Preview Side */}
      <div className="flex-1 bg-white flex flex-col min-w-0">
        <div className="h-12 border-b flex items-center justify-between px-4 bg-slate-50">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            Preview
          </div>
          <button 
            onClick={handleRun}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play size={12} fill="currentColor" /> RUN CODE
          </button>
        </div>
        <div className="flex-1 p-4 bg-white min-h-[250px] relative">
           {!hasRun ? (
             <div className="flex items-center justify-center h-full text-slate-400 text-sm font-medium">
                Waiting for run...
             </div>
           ) : (
             <iframe 
               srcDoc={output}
               title="preview"
               sandbox="allow-scripts"
               className="w-full h-full border-0"
             />
           )}
        </div>
      </div>
    </div>
  );
}
