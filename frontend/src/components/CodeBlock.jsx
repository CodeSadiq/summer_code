import React, { useState, useEffect, useRef } from 'react';
import Editor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-core';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/themes/prism-twilight.css';
import { RotateCcw, Play, Loader2, Maximize2 } from 'lucide-react';
import { useTeachingState } from '../contexts/TeachingContext';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import clsx from 'clsx';

export default function CodeBlock({ visibleText, language, stepIndex, audioDuration, defaultStdin }) {
  const navigate = useNavigate();
  const [code, setCode] = useState(visibleText || '');
  const [hasRun, setHasRun] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState('');
  const [execError, setExecError] = useState(false);
  const [stdin, setStdin] = useState(defaultStdin || '');

  // Interactive Terminal States
  const [terminalStep, setTerminalStep] = useState('READY'); // READY, PROMPTING, EXECUTING, DONE
  const [currentPrompt, setCurrentPrompt] = useState('');
  const [currentInput, setCurrentInput] = useState('');
  const [terminalLines, setTerminalLines] = useState([]);

  const isBrowserLang = ['html', 'css', 'javascript', 'js'].includes((language || '').toLowerCase());
  const terminalRef = useRef(null);
  const inputRef = useRef(null);

  const {
    isActive, mode, currentStep, showContinueButton, setShowContinueButton,
    userHasRun, setUserHasRun, setMode, isPaused
  } = useTeachingState();

  // Scroll to bottom of terminal when lines change
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines, terminalStep]);

  // Sync state if prop changes
  useEffect(() => {
    setCode(visibleText || '');
    setStdin(defaultStdin || '');
    setTerminalStep('READY');
    setTerminalLines([]);
    setHasRun(false);
  }, [visibleText, defaultStdin]);

  const isCurrentBlock = isActive && currentStep === stepIndex;
  const isReadOnly = (isCurrentBlock && (mode === 'BOT_CODING' || mode === 'EXPLAINING' || mode === 'EXPLAINING_CODE')) || (!isCurrentBlock && isActive);

  const typingState = useRef({ index: 0, text: '' });

  // Reset typing state when entering a new code block explanation
  useEffect(() => {
    if (isCurrentBlock && mode === 'EXPLAINING_CODE') {
      typingState.current = { index: 0, text: '' };
      setCode('');
    }
  }, [isCurrentBlock, mode]);

  // Handle Bot Typing Simulation
  useEffect(() => {
    let timeoutId;
    let isTypingActive = true;

    if (isCurrentBlock && mode === 'EXPLAINING_CODE' && !isPaused) {
      const sourceText = visibleText || '';
      const chars = sourceText.split('');

      let msPerChar = 30;
      if (audioDuration && chars.length > 0) {
        const targetMs = Math.max(500, audioDuration - 500);
        msPerChar = Math.max(5, Math.floor(targetMs / chars.length));
      }

      const typeNextChar = () => {
        if (!isTypingActive) return;
        const state = typingState.current;
        if (state.index < chars.length) {
          state.text += chars[state.index] || '';
          setCode(state.text);
          state.index++;
          timeoutId = setTimeout(typeNextChar, msPerChar);
        }
      };
      timeoutId = setTimeout(typeNextChar, typingState.current.index === 0 ? 500 : msPerChar);
    }

    return () => {
      isTypingActive = false;
      clearTimeout(timeoutId);
    };
  }, [isCurrentBlock, mode, visibleText, isPaused, audioDuration]);

  /**
   * INTERACTIVE PROMPT EXTRACTION
   * Scans the code for all strings inside printf/cout/input() 
   * that appear before input commands.
   */
  const detectPrompts = (sourceCode, lang) => {
    const l = (lang || '').toLowerCase();
    const prompts = [];

    if (l === 'c' || l === 'cpp') {
      // Regex to find printf followed by scanf/cin etc.
      // This is a heuristic for the pseudo-terminal
      const regex = /printf\s*\(\s*"([^"]*)"\s*\);?\s*(?:scanf|gets|fgets|cin)/g;
      let match;
      while ((match = regex.exec(sourceCode)) !== null) {
        prompts.push(match[1]);
      }

      // Fallback: if no printf+scanf pairs found, check for single scanf
      if (prompts.length === 0) {
        if (sourceCode.search(/(scanf|cin|gets|fgets)/) !== -1) {
          const firstPromptMatch = sourceCode.match(/"([^"]*)"/);
          if (firstPromptMatch) prompts.push(firstPromptMatch[1]);
        }
      }
    } else if (l === 'python') {
      const regex = /input\s*\(\s*"([^"]*)"\s*\)/g;
      let match;
      while ((match = regex.exec(sourceCode)) !== null) {
        prompts.push(match[1]);
      }
    }
    return prompts;
  };

  const [allPrompts, setAllPrompts] = useState([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [collectedInputs, setCollectedInputs] = useState([]);

  const handleRun = async () => {
    setHasRun(true);
    setTerminalLines([]);
    setExecError(false);
    setCurrentInput('');
    setCurrentPrompt('');
    setCollectedInputs([]);
    setCurrentPromptIndex(0);

    if (isCurrentBlock && mode === 'AT_CODE_BLOCK') {
      setMode('USER_TRYING');
      setUserHasRun(true);
    }

    if (isBrowserLang) {
      setTerminalStep('EXECUTING');
      setTerminalLines([{ type: 'output', text: 'Rendering preview...' }]);
      return;
    }

    const prompts = detectPrompts(code, language);
    if (prompts.length > 0) {
      setAllPrompts(prompts);
      setCurrentPromptIndex(0);
      setTerminalStep('PROMPTING');
      setCurrentPrompt(prompts[0]);
      setTerminalLines([]); // Start with empty history, the prompt is shown by the active input block
      return;
    }

    await performExecution(stdin);
  };

  const handleInputSubmit = async (e) => {
    if (e.key !== 'Enter') return;
    const val = currentInput;
    const newCollected = [...collectedInputs, val];
    setCollectedInputs(newCollected);
    setTerminalLines(prev => [...prev, { type: 'input', text: val, prompt: currentPrompt }]);
    setCurrentInput('');

    if (currentPromptIndex < allPrompts.length - 1) {
      const nextIdx = currentPromptIndex + 1;
      setCurrentPromptIndex(nextIdx);
      setCurrentPrompt(allPrompts[nextIdx]);
    } else {
      setTerminalStep('EXECUTING');
      // Combine all inputs with newlines for the backend
      await performExecution(newCollected.join('\n'));
    }
  };

  const performExecution = async (inputVal) => {
    setIsRunning(true);
    setTerminalStep('EXECUTING');
    try {
      const res = await fetch(`${API_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language, stdin: inputVal })
      });
      const data = await res.json();

      const rawOutput = data.output || (data.error ? 'Execution failed.' : 'No output generated.');
      let cleanOutput = rawOutput;

      // Remove all prompts from the output to avoid double-printing
      // since our terminal already printed them during the interactive phase.
      allPrompts.forEach(p => {
        if (cleanOutput.startsWith(p)) {
          cleanOutput = cleanOutput.substring(p.length).trimStart();
        }
      });

      const lines = cleanOutput.split('\n');
      for (const line of lines) {
        setTerminalLines(prev => [...prev, { type: 'output', text: line }]);
      }
      setExecError(data.error || !res.ok);
    } catch (err) {
      setTerminalLines(prev => [...prev, { type: 'error', text: 'Execution failed. Please try again.' }]);
      setExecError(true);
    } finally {
      setIsRunning(false);
      setTerminalStep('DONE');
    }
  };

  const handleReset = () => {
    setCode(visibleText);
    setTerminalStep('READY');
    setTerminalLines([]);
    setHasRun(false);
  };

  const highlightWithPrism = (codeStr) => {
    const lg = Prism.languages[language] || Prism.languages.markup;
    return Prism.highlight(codeStr, lg, language);
  };

  const handleTerminalClick = () => {
    if (terminalStep === 'PROMPTING' && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-0 rounded-2xl border border-slate-200/60 dark:border-white/5 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none my-6 w-full transition-shadow duration-500">
      <div className="bg-[#0f172a] flex flex-col min-w-0 border-r border-slate-800">
        <div className="h-12 bg-[#0f172a] flex items-center px-4 justify-between border-b border-slate-800">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">EDITOR.{language}</span>
          <div className="flex items-center gap-3">
            {stepIndex !== -1 && (
              <button
                onClick={() => navigate('/playground', { state: { code, language } })}
                title="Open in Playground"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Maximize2 size={14} />
              </button>
            )}
            <button onClick={handleReset} title="Reset Code" className="text-slate-500 hover:text-white transition-colors">
              <RotateCcw size={14} />
            </button>
          </div>
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
            style: { fontFamily: '"JetBrains Mono", monospace', lineHeight: 1.6 },
            readOnly: isReadOnly,
            className: "text-blue-300 w-full h-full"
          })}
        </div>
      </div>

      <div className="bg-white flex flex-col min-w-0 transition-colors duration-500">
        <div className="h-12 bg-white flex items-center justify-between px-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
              <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Terminal Preview
            </div>
          </div>
          <button
            onClick={handleRun}
            disabled={terminalStep === 'EXECUTING' || terminalStep === 'PROMPTING'}
            className="flex items-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500 px-5 py-1.5 rounded-full text-[10px] font-black transition-all disabled:opacity-50 uppercase tracking-widest"
          >
            <Play size={12} fill="currentColor" /> RUN CODE
          </button>
        </div>

        <div
          ref={terminalRef}
          onClick={handleTerminalClick}
          className={clsx(
            "flex-1 p-6 relative bg-white overflow-auto",
            terminalStep === 'PROMPTING' && "cursor-text"
          )}
        >
          {!hasRun ? (
            <div className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em]">
              Waiting for execution...
            </div>
          ) : isBrowserLang ? (
            <iframe
              srcDoc={`<!DOCTYPE html>
              <html>
                <head>
                  <style>
                    body { margin: 0; padding: 16px; color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; background: white; font-size: 13px; line-height: 1.5; }
                    #root { display: flex; flex-direction: column; gap: 4px; }
                    .log-entry { padding: 4px 0; border-bottom: 1px solid #f1f5f9; white-space: pre-wrap; word-break: break-all; }
                    .log-error { color: #ef4444; font-weight: bold; }
                  </style>
                </head>
                <body>
                  <div id="root"></div>
                  <script>
                    (function() {
                      const root = document.getElementById('root');
                      const originalLog = console.log;
                      console.log = (...args) => {
                        const div = document.createElement('div');
                        div.className = 'log-entry';
                        div.innerText = args.map(a => 
                          typeof a === 'object' ? JSON.stringify(a) : String(a)
                        ).join(' ');
                        root.appendChild(div);
                        originalLog.apply(console, args);
                      };
                      window.onerror = (msg, url, line, col, error) => {
                        const div = document.createElement('div');
                        div.className = 'log-entry log-error';
                        div.innerText = 'Error: ' + msg + (line ? ' (line ' + line + ')' : '');
                        root.appendChild(div);
                      };
                    })();
                  </script>
                  ${language === 'html'
                  ? code
                  : `<script type="text/javascript">
                        try {
                          ${code.replace(/<\/script>/gi, '<\\/script>')}
                        } catch(e) {
                          console.log('Runtime Error: ' + e.message);
                        }
                      </script>`
                }
                </body>
              </html>`}
              title="preview" className="w-full h-full border-0"
            />
          ) : (
            <div className="font-mono text-sm leading-relaxed">
              {terminalLines.map((line, i) => (
                <div key={i} className="mb-1 whitespace-nowrap">
                  {line.type === 'input' && (
                    <div className="flex gap-0 whitespace-nowrap">
                      <span className="text-slate-900 whitespace-nowrap">{line.prompt}</span>
                      <span className="text-slate-900 whitespace-nowrap">{line.text}</span>
                    </div>
                  )}
                  {line.type === 'output' && (
                    <div className="text-slate-900 whitespace-pre-wrap">{line.text}</div>
                  )}
                  {line.type === 'error' && (
                    <div className="text-red-600 whitespace-pre-wrap">{line.text}</div>
                  )}
                </div>
              ))}

              {terminalStep === 'PROMPTING' && (
                <div className="flex gap-0 mt-1 items-center">
                  <span className="text-slate-900 whitespace-nowrap">{currentPrompt}</span>
                  <input
                    ref={inputRef}
                    autoFocus
                    type="text"
                    value={currentInput}
                    onChange={e => setCurrentInput(e.target.value)}
                    onKeyDown={handleInputSubmit}
                    className="flex-1 bg-transparent border-0 outline-none text-slate-900 p-0 h-auto font-mono text-sm caret-slate-900"
                  />
                </div>
              )}

              {terminalStep === 'EXECUTING' && (
                <div className="flex items-center gap-2 text-blue-500 animate-pulse text-xs mt-1">
                  <Loader2 className="animate-spin" size={14} /> Executing...
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
