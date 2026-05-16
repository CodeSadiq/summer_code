import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Play, RotateCcw, Share2, Download, Save, Terminal,
  Code, Layout, Settings, Loader2, ChevronDown, Check, Copy, FileCode
} from 'lucide-react';
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
import { API_URL } from '../config';
import clsx from 'clsx';

const SUPPORTED_LANGS = [
  { id: 'javascript', name: 'JavaScript', icon: 'JS' },
  { id: 'python', name: 'Python', icon: 'PY' },
  { id: 'html', name: 'HTML', icon: 'HTML' },
  { id: 'css', name: 'CSS', icon: 'CSS' },
  { id: 'cpp', name: 'C++', icon: 'C++' },
  { id: 'c', name: 'C', icon: 'C' },
];

export default function PlaygroundPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialData = location.state || { code: '// Happy Coding!\nconsole.log("Hello from SummerCode!");', language: 'javascript' };

  const [code, setCode] = useState(initialData.code);
  const [language, setLanguage] = useState(initialData.language);
  const [isRunning, setIsRunning] = useState(false);
  const [terminalLines, setTerminalLines] = useState([]);
  const [execError, setExecError] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const isBrowserLang = ['html', 'css', 'javascript', 'js'].includes(language.toLowerCase());
  const terminalRef = useRef(null);

  useEffect(() => {
    // Hide body scroll to prevent "thin line" gaps at edges
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalLines]);

  const highlightWithPrism = (codeStr) => {
    const lg = Prism.languages[language] || Prism.languages.javascript;
    return Prism.highlight(codeStr, lg, language);
  };

  const handleRun = async () => {
    setTerminalLines([{ type: 'info', text: `Starting ${language} execution...` }]);
    setExecError(false);
    setIsRunning(true);

    if (isBrowserLang) {
      setTerminalLines(prev => [...prev, { type: 'success', text: 'Rendering preview in live container.' }]);
      setIsRunning(false);
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();

      if (data.output) {
        const lines = data.output.split('\n');
        lines.forEach(l => setTerminalLines(prev => [...prev, { type: 'output', text: l }]));
      }
      if (data.error || !res.ok) {
        setTerminalLines(prev => [...prev, { type: 'error', text: data.error || 'Execution failed.' }]);
        setExecError(true);
      }
    } catch (err) {
      setTerminalLines(prev => [...prev, { type: 'error', text: 'Connection to engine failed.' }]);
      setExecError(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `playground_code.${language === 'javascript' ? 'js' : language}`;
    a.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handleReset = () => {
    if (window.confirm('Reset code to initial state?')) {
      setCode(initialData.code);
      setTerminalLines([]);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 -bottom-1 bg-[#0f172a] text-slate-300 flex flex-col font-sans overflow-hidden">
      {/* Header */}
      <header className="h-16 border-b border-white/5 bg-[#0f172a] flex items-center justify-between px-6 z-50">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/5 rounded-xl transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="h-6 w-px bg-white/10" />
          <div>
            <h1 className="text-sm font-black text-white uppercase tracking-widest leading-none mb-1">IDE Workspace</h1>
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setShowLangMenu(!showLangMenu)}
                className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-1 hover:text-white transition-colors"
              >
                {language} <ChevronDown size={10} />
              </button>
              {showLangMenu && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-[100]">
                  {SUPPORTED_LANGS.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => { setLanguage(lang.id); setShowLangMenu(false); }}
                      className="w-full px-4 py-2 text-left text-xs font-bold uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-colors flex items-center justify-between"
                    >
                      {lang.name} {language === lang.id && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleCopy} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all flex items-center gap-2">
            {copyFeedback ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} />}
          </button>
          <button onClick={handleDownload} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
            <Download size={18} />
          </button>
          <div className="h-6 w-px bg-white/10 mx-2" />
          <button
            onClick={handleRun}
            disabled={isRunning}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-emerald-500/20"
          >
            {isRunning ? <Loader2 className="animate-spin" size={14} /> : <Play size={14} fill="currentColor" />}
            Run Code
          </button>
        </div>
      </header>

      {/* Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Editor Side */}
        <div className="flex-1 flex flex-col border-r border-white/5">
          <div className="h-10 bg-[#1e293b]/50 border-b border-white/5 px-4 flex items-center justify-between">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <FileCode size={12} /> Source.{(language === 'javascript' || language === 'js') ? 'js' : language}
            </span>
            <button onClick={handleReset} className="text-[9px] font-black text-slate-500 hover:text-rose-400 uppercase tracking-widest transition-colors">
              Reset Editor
            </button>
          </div>
          <div className="flex-1 overflow-auto bg-[#0f172a] p-4 font-mono text-sm">
            {React.createElement(Editor.default || Editor, {
              value: code,
              onValueChange: setCode,
              highlight: highlightWithPrism,
              padding: 20,
              style: { fontFamily: '"JetBrains Mono", monospace', fontSize: 14, minHeight: '100%' },
              className: "prism-editor"
            })}
          </div>
        </div>

        {/* Output Side */}
        <div className="w-1/3 flex flex-col bg-white border-l border-slate-200">
          <div className="h-10 bg-slate-50 border-b border-slate-200 px-4 flex items-center gap-2">
            <Terminal size={12} className="text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Execution Output</span>
          </div>
          <div
            ref={terminalRef}
            className="flex-1 overflow-auto p-6 font-mono text-xs leading-relaxed"
          >
            {terminalLines.length === 0 && !isBrowserLang && (
              <div className="text-slate-400 italic">Click "Run Code" to see output...</div>
            )}

            {isBrowserLang ? (
              <div className="h-full flex flex-col gap-4">
                <div className="text-[10px] font-black text-indigo-500/50 uppercase tracking-widest">Browser Runtime</div>
                <iframe
                  srcDoc={`<html>
                    <body style="margin:0;padding:16px;color:#0f172a;font-family:monospace;background:white;font-size:12px;">
                      <div id="root"></div>
                      <script>
                        const root = document.getElementById('root');
                        console.log = (...args) => {
                          const div = document.createElement('div');
                          div.style.padding = '2px 0';
                          div.style.borderBottom = '1px solid #f1f5f9';
                          div.innerText = '> ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' ');
                          root.appendChild(div);
                        };
                        try {
                          ${language === 'javascript' || language === 'js' ? code : `root.innerHTML = \`${code.replace(/`/g, '\\`').replace(/\${/g, '\\${')}\``}
                        } catch(e) {
                          const div = document.createElement('div');
                          div.style.color = '#ef4444';
                          div.innerText = 'Error: ' + e.message;
                          root.appendChild(div);
                        }
                      </script>
                    </body>
                  </html>`}
                  title="preview" className="w-full h-full border border-slate-100 rounded-xl bg-white shadow-inner"
                />
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {terminalLines.map((line, i) => (
                  <div key={i} className={clsx(
                    "flex gap-2",
                    line.type === 'error' ? "text-rose-600" :
                      line.type === 'success' ? "text-emerald-600" :
                        line.type === 'info' ? "text-indigo-600" : "text-slate-800"
                  )}>
                    <span className="opacity-30">[{i + 1}]</span>
                    <span>{line.text}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative h-10 bg-[#1e293b] border-t border-white/5 px-6 flex items-center justify-between z-50">
        {/* Gap Fix: Bleed background 10px downwards */}
        <div className="absolute top-full left-0 right-0 h-10 bg-[#1e293b]" />

        <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">
          <span>Engine: Judge0 v2.0</span>
          <div className="w-1 h-1 rounded-full bg-slate-700" />
          <span>Status: {isRunning ? 'Executing...' : 'Idle'}</span>
        </div>
        <div className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
          SummerCode Playground
        </div>
      </footer>

      <style dangerouslySetInnerHTML={{
        __html: `
        .prism-editor textarea { outline: none !important; }
        .prism-editor pre { pointer-events: none; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
