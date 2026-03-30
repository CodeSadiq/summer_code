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
    <div className="flex flex-col xl:flex-row rounded-3xl overflow-hidden glass-panel my-10 w-full border-[#FDE047]/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)]">
      {/* Editor Side */}
      <div className="flex-1 bg-[#0d1117]/80 flex flex-col min-w-0 border-r border-[#30363d]/50 backdrop-blur-xl">
        <div className="h-14 bg-[#161b22]/50 flex items-center px-6 justify-between border-b border-[#30363d]/50">
          <div className="flex gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shadow-[0_0_8px_rgba(255,95,86,0.4)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shadow-[0_0_8px_rgba(255,189,46,0.4)]"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f] shadow-[0_0_8px_rgba(39,201,63,0.4)]"></div>
          </div>
          <span className="text-[10px] text-slate-500 font-mono tracking-widest uppercase font-black">EDITOR.{language}</span>
          <button onClick={handleReset} title="Reset Code" className="text-slate-500 hover:text-white transition-colors group">
            <RotateCcw size={14} className="group-active:-rotate-180 transition-transform duration-500" />
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
      <div className="flex-1 bg-[#020617]/50 flex flex-col min-w-0 backdrop-blur-xl">
        <div className="h-14 border-b border-[#30363d]/50 flex items-center justify-between px-6 bg-[#161b22]/30">
          <div className="flex items-center gap-2.5 text-[10px] font-black text-slate-500 tracking-widest uppercase">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
            Preview Output
          </div>
          <button 
            onClick={handleRun}
            className="flex items-center gap-2 bg-[#FDE047] hover:bg-[#ffe875] text-[#0f172a] px-5 py-2 rounded-full text-[10px] font-black transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(253,224,71,0.2)] active:scale-95 uppercase tracking-widest"
          >
            <Play size={12} fill="currentColor" /> RUN CODE
          </button>
        </div>
        <div className="flex-1 p-6 bg-[#020617]/80 min-h-[300px] relative">
           {!hasRun ? (
             <div className="flex items-center justify-center h-full text-slate-600 text-[10px] font-black uppercase tracking-[0.2em] italic">
                Waiting for script execution...
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
