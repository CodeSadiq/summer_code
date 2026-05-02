import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-twilight.css'; // Good dark theme
import { RotateCcw, Play, Loader2 } from 'lucide-react';
import { useTeachingState } from '../contexts/TeachingContext';
import { API_URL } from '../config';

export default function CodeBlock({ visibleText, language, stepIndex, audioDuration, defaultStdin }) {
  const [code, setCode] = useState(visibleText || '');
  const [output, setOutput] = useState(visibleText || '');
  const [hasRun, setHasRun] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState('');
  const [execError, setExecError] = useState(false);
  const [stdin, setStdin] = useState(defaultStdin || '');

  const isBrowserLang = ['html', 'css', 'javascript', 'js'].includes((language || '').toLowerCase());

  const {
    isActive, mode, currentStep, showContinueButton, setShowContinueButton,
    userHasRun, setUserHasRun, setMode, isPaused
  } = useTeachingState();

  // Sync state if prop changes
  useEffect(() => {
    setCode(visibleText || '');
    setOutput(visibleText || '');
    setStdin(defaultStdin || '');
  }, [visibleText, defaultStdin]);

  const isCurrentBlock = isActive && currentStep === stepIndex;
  const isReadOnly = (isCurrentBlock && (mode === 'BOT_CODING' || mode === 'EXPLAINING' || mode === 'EXPLAINING_CODE')) || (!isCurrentBlock && isActive);

  // Initialize output
  useEffect(() => {
    setOutput(visibleText);
    setStdin(defaultStdin || '');
    if (!isBrowserLang) {
      setExecResult('');
      setExecError(false);
    }
  }, [visibleText, defaultStdin, isBrowserLang]);

  const typingState = useRef({ index: 0, text: '' });

  // Reset typing state when entering a new code block explanation
  useEffect(() => {
    if (isCurrentBlock && mode === 'EXPLAINING_CODE') {
      typingState.current = { index: 0, text: '' };
      setCode('');
    }
  }, [isCurrentBlock, mode]);

  // Handle Bot Typing Simulation Resumption & Execution
  useEffect(() => {
    let timeoutId;
    let isTypingActive = true;

    if (isCurrentBlock && mode === 'EXPLAINING_CODE' && !isPaused) {
      const sourceText = visibleText || '';
      const chars = sourceText.split('');

      let msPerChar = 30;
      if (audioDuration && chars.length > 0) {
        // Reserve 500ms safety buffer so it comfortably finishes just before audio ends
        const targetMs = Math.max(500, audioDuration - 500);
        msPerChar = Math.max(5, Math.floor(targetMs / chars.length));
      }

      const typeNextChar = () => {
        if (!isTypingActive) return;

        const state = typingState.current;
        if (state.index < chars.length) {
          state.text += chars[state.index] || '';
          setCode(state.text);
          setOutput(state.text); // Dynamically update preview while typing
          state.index++;
          timeoutId = setTimeout(typeNextChar, msPerChar);
        } else {
          // Done typing
          setOutput(sourceText);
        }
      };

      // If we are starting fresh, wait 500ms. If resuming from pause, start immediately.
      timeoutId = setTimeout(typeNextChar, typingState.current.index === 0 ? 500 : msPerChar);
    }

    return () => {
      isTypingActive = false;
      clearTimeout(timeoutId);
    };
  }, [isCurrentBlock, mode, visibleText, isPaused, audioDuration]);

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

  const handleRun = async () => {
    setHasRun(true);
    if (isCurrentBlock && mode === 'AT_CODE_BLOCK') {
      setMode('USER_TRYING');
      setUserHasRun(true);
    } else if (isCurrentBlock && mode === 'USER_TRYING') {
      setUserHasRun(true);
    }

    if (isBrowserLang) {
      setOutput(code);
      setExecResult('');
    } else {
      setIsRunning(true);
      setExecResult('Executing code on remote server...');
      setExecError(false);
      try {
        const res = await fetch(`${API_URL}/api/execute`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code, language, stdin })
        });
        const data = await res.json();
        setExecResult(data.output || 'No output generated.');
        setExecError(data.error || !res.ok);
      } catch (err) {
        setExecResult('Execution failed. Please try again.');
        setExecError(true);
      } finally {
        setIsRunning(false);
      }
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
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 rounded-2xl border border-slate-200/60 dark:border-white/5 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none my-6 w-full transition-shadow duration-500">
      {/* Editor Side */}
      <div className="bg-[#0f172a] flex flex-col min-w-0 border-r border-slate-800">
        <div className="h-12 bg-[#0f172a] flex items-center px-4 justify-between border-b border-slate-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">EDITOR.{language}</span>
          <button onClick={handleReset} title="Reset Code" className="text-slate-500 hover:text-white transition-colors">
            <RotateCcw size={14} />
          </button>
        </div>
        <div className="flex-1 overflow-auto p-6 text-sm font-mono relative group text-blue-300 min-h-[300px]">
          {isReadOnly && <div className="absolute inset-0 z-10 cursor-not-allowed"></div>}
          {React.createElement(Editor.default || Editor, {
            value: code,
            onValueChange: c => {
              setCode(c);
              if (isCurrentBlock && mode === 'AT_CODE_BLOCK') setMode('USER_TRYING');
            },
            highlight: highlightWithPrism,
            padding: 0,
            textareaClassName: "focus:outline-none",
            style: {
              fontFamily: '"JetBrains Mono", "Fira Code", monospace',
              lineHeight: 1.6,
            },
            readOnly: isReadOnly,
            className: "text-blue-300 w-full h-full",
            placeholder: `Write some ${language} code...`
          })}
        </div>
        {!isBrowserLang && (
          <div className="bg-[#0b1121] border-t border-slate-800 p-4 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Standard Input (stdin)</label>
              {defaultStdin && (
                <span className="text-[9px] font-black uppercase tracking-widest bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded border border-amber-500/20">Input Required</span>
              )}
            </div>
            <textarea
              value={stdin}
              onChange={e => setStdin(e.target.value)}
              placeholder="Enter inputs here (separated by newlines)..."
              readOnly={isReadOnly}
              className="w-full bg-[#1e293b] border border-slate-700/50 rounded-lg p-3 text-xs text-slate-300 font-mono outline-none focus:border-blue-500/50 resize-y min-h-[60px]"
            />
          </div>
        )}
      </div>

      {/* Preview Side */}
      <div className="bg-white dark:bg-[#1e293b] flex flex-col min-w-0 transition-colors duration-500">
        <div className="h-12 border-b border-slate-100 dark:border-white/5 flex items-center justify-between px-4 bg-white dark:bg-[#1e293b]">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
            Preview
          </div>
          <button
            onClick={handleRun}
            className="flex items-center gap-2 bg-slate-900 dark:bg-emerald-600 text-white hover:bg-black dark:hover:bg-emerald-500 px-5 py-2 rounded-full text-[10px] font-black transition-all hover:shadow-lg hover:shadow-emerald-500/10 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
          >
            <Play size={12} fill="currentColor" /> RUN CODE
          </button>
        </div>
        <div className="flex-1 p-6 relative bg-white dark:bg-slate-900 overflow-auto">

          {!hasRun ? (
            <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-600 text-[10px] font-bold uppercase tracking-[0.2em]">
              Waiting for execution...
            </div>
          ) : isBrowserLang ? (
            <iframe
              srcDoc={`
                 <html>
                   <head>
                     <style>
                       body { 
                         margin: 0; 
                         padding: 20px; 
                         color: ${window.matchMedia('(prefers-color-scheme: dark)').matches ? '#f1f5f9' : '#0f172a'}; 
                         font-family: 'JetBrains Mono', 'Fira Code', monospace;
                         background: transparent;
                         font-size: 14px;
                         line-height: 1.5;
                       }
                       #console-output { color: #10b981; white-space: pre-wrap; }
                     </style>
                   </head>
                   <body>
                     <div id="root"></div>
                     <div id="console-output"></div>
                     <script>
                       const consoleOutput = document.getElementById('console-output');
                       const originalLog = console.log;
                       console.log = (...args) => {
                         const msg = args.map(arg => 
                           typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
                         ).join(' ');
                         consoleOutput.innerText += msg + '\\n';
                         originalLog(...args);
                       };
                       
                       try {
                         ${language === 'javascript' ? output : `document.getElementById('root').innerHTML = \`${output}\``}
                       } catch (err) {
                         consoleOutput.style.color = '#ef4444';
                         consoleOutput.innerText += 'Error: ' + err.message;
                       }
                     </script>
                   </body>
                 </html>
               `}
              title="preview"
              sandbox="allow-scripts allow-modals"
              className="w-full h-full border-0"
            />
          ) : (
            <div className="w-full h-full bg-[#0f172a] text-slate-300 font-mono text-sm p-6 rounded-xl overflow-auto whitespace-pre-wrap">
              {isRunning ? (
                <div className="flex items-center gap-3 text-emerald-400 animate-pulse">
                  <Loader2 className="animate-spin" size={18} /> Executing remotely...
                </div>
              ) : (
                <div className={execError ? "text-red-400" : "text-emerald-400"}>
                  {execResult || 'Ready to run.'}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
