import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  Code2, ArrowLeft, Save, Plus, Trash2, GripVertical,
  Type, AlignLeft, FileCode2, ChevronDown, ChevronUp,
  Eye, Loader2, CheckCircle2, AlertCircle, Sparkles, X, Music
} from 'lucide-react';
import clsx from 'clsx';

const API = 'http://localhost:5000';

const BLOCK_TYPES = [
  { type: 'heading', label: 'Heading', icon: <Type size={14} />, color: 'violet' },
  { type: 'highlightable_text', label: 'Text', icon: <AlignLeft size={14} />, color: 'blue' },
  { type: 'code', label: 'Code', icon: <FileCode2 size={14} />, color: 'emerald' },
];

const LANG_OPTIONS = ['html', 'css', 'javascript', 'python', 'jsx', 'typescript'];

function makeBlock(type) {
  return {
    id: `block-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    visibleText: '',
    ...(type === 'code' ? { language: 'html' } : {}),
    teachingScript: {
      step: 0,
      transcript: '',
      action: 'speak',
      duration: 3000,
    },
  };
}

/* ─── Block color helpers ─── */
const BLOCK_COLOR = {
  heading: { ring: 'ring-violet-500/30', badge: 'bg-violet-500/15 text-violet-300', dot: 'bg-violet-400' },
  highlightable_text: { ring: 'ring-blue-500/30', badge: 'bg-blue-500/15 text-blue-300', dot: 'bg-blue-400' },
  code: { ring: 'ring-emerald-500/30', badge: 'bg-emerald-500/15 text-emerald-300', dot: 'bg-emerald-400' },
};

/* ─── Single block editor ─── */
function BlockEditor({ block, idx, total, onChange, onDelete, onMove }) {
  const [open, setOpen] = useState(true);
  const col = BLOCK_COLOR[block.type] || BLOCK_COLOR.heading;

  const set = (key, val) => onChange({ ...block, [key]: val });
  const setScript = (key, val) => onChange({ ...block, teachingScript: { ...block.teachingScript, [key]: val } });

  return (
    <div className={`bg-[#161b2e] border border-white/5 rounded-2xl overflow-hidden ring-1 ${open ? col.ring : 'ring-transparent'} transition-all`}>
      {/* Block header */}
      <div
        className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none group"
        onClick={() => setOpen(o => !o)}
      >
        <GripVertical size={16} className="text-slate-600 group-hover:text-slate-400 shrink-0 cursor-grab" />
        <div className={`w-2 h-2 rounded-full ${col.dot}`} />
        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${col.badge}`}>
          {BLOCK_TYPES.find(b => b.type === block.type)?.label ?? block.type}
        </span>
        <p className="text-sm text-slate-300 flex-1 truncate">
          {block.visibleText?.slice(0, 60) || <span className="text-slate-600 italic">Empty block</span>}
        </p>
        <div className="flex items-center gap-1 ml-2">
          <IconBtn title="Move up" disabled={idx === 0} onClick={(e) => { e.stopPropagation(); onMove(idx, idx - 1); }}>
            <ChevronUp size={14} />
          </IconBtn>
          <IconBtn title="Move down" disabled={idx === total - 1} onClick={(e) => { e.stopPropagation(); onMove(idx, idx + 1); }}>
            <ChevronDown size={14} />
          </IconBtn>
          <IconBtn title="Delete block" danger onClick={(e) => { e.stopPropagation(); onDelete(block.id); }}>
            <Trash2 size={14} />
          </IconBtn>
          <span className="text-slate-600 ml-1">{open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
        </div>
      </div>

      {/* Block body */}
      {open && (
        <div className="px-4 pb-5 pt-1 border-t border-white/5 flex flex-col gap-4">
          {/* Visible content */}
          <div>
            <Label>
              {block.type === 'code' ? 'Code Content' : 'Visible Text'}
            </Label>
            {block.type === 'code' ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <Label>Language</Label>
                  <select
                    value={block.language || 'html'}
                    onChange={e => set('language', e.target.value)}
                    className="bg-[#0f1117] border border-white/10 text-sm text-slate-300 rounded-lg px-3 py-1.5 outline-none focus:ring-1 focus:ring-violet-500/50 ml-1"
                  >
                    {LANG_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>
                <textarea
                  value={block.visibleText}
                  onChange={e => set('visibleText', e.target.value)}
                  rows={6}
                  placeholder="// Write your code here..."
                  className="w-full bg-[#0a0d16] border border-white/10 rounded-xl px-4 py-3 text-sm text-emerald-300 font-mono outline-none focus:ring-2 focus:ring-emerald-500/30 resize-none placeholder-slate-700"
                />
              </>
            ) : (
              <textarea
                value={block.visibleText}
                onChange={e => set('visibleText', e.target.value)}
                rows={block.type === 'heading' ? 2 : 4}
                placeholder={block.type === 'heading' ? 'Heading text...' : 'Paragraph content...'}
                className="w-full bg-[#0f1117] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:ring-2 focus:ring-violet-500/30 resize-none placeholder-slate-700"
              />
            )}
          </div>

          {/* Teaching Script */}
          <div className="bg-[#0f1117] border border-white/5 rounded-xl p-4 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
              <Sparkles size={12} className="text-violet-400" /> Teaching Script
            </div>
            <div>
              <Label>Transcript (Hinglish narration)</Label>
              <textarea
                value={block.teachingScript?.transcript || ''}
                onChange={e => setScript('transcript', e.target.value)}
                rows={3}
                placeholder="Ye block HTML ka heading tag explain karta hai..."
                className="w-full bg-[#161b2e] border border-white/10 rounded-xl px-4 py-3 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-violet-500/30 resize-none placeholder-slate-700"
              />
            </div>

            {/* Audio Upload */}
            <AudioUploader block={block} onChange={onChange} />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Step Index</Label>
                <input
                  type="number"
                  min={0}
                  value={block.teachingScript?.step ?? 0}
                  onChange={e => setScript('step', Number(e.target.value))}
                  className="w-full bg-[#161b2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
              <div>
                <Label>Duration (ms) {block.teachingScript?.audioUrl ? <span className="text-violet-400 normal-case font-normal ml-1">← set by audio</span> : ''}</Label>
                <input
                  type="number"
                  min={500}
                  step={500}
                  value={block.teachingScript?.duration ?? 3000}
                  onChange={e => setScript('duration', Number(e.target.value))}
                  disabled={!!block.teachingScript?.audioUrl}
                  className="w-full bg-[#161b2e] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 outline-none focus:ring-2 focus:ring-violet-500/30 disabled:opacity-40"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Editor ─── */
export default function AdminLessonEditor() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isNew = slug === 'new';

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  const [lesson, setLesson] = useState({
    id: '',
    slug: '',
    title: '',
    description: '',
    chapterOrder: 1,
    blocks: [],
  });

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  /* Load existing lesson */
  useEffect(() => {
    if (isNew) return;
    fetch(`${API}/api/lessons/${slug}`)
      .then(r => r.json())
      .then(data => { setLesson(data); setLoading(false); })
      .catch(() => { showToast('Failed to load lesson', 'error'); setLoading(false); });
  }, [slug]);

  const setField = (key, val) => setLesson(l => ({ ...l, [key]: val }));

  /* Auto-generate slug from title */
  const handleTitleChange = (val) => {
    setField('title', val);
    if (isNew) {
      const autoSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      setField('slug', autoSlug);
      setField('id', autoSlug);
    }
  };

  /* Block operations */
  const addBlock = (type) => {
    const b = makeBlock(type);
    b.teachingScript.step = lesson.blocks.length;
    setLesson(l => ({ ...l, blocks: [...l.blocks, b] }));
    setShowAddMenu(false);
  };

  const updateBlock = (updated) =>
    setLesson(l => ({ ...l, blocks: l.blocks.map(b => b.id === updated.id ? updated : b) }));

  const deleteBlock = (id) =>
    setLesson(l => ({ ...l, blocks: l.blocks.filter(b => b.id !== id) }));

  const moveBlock = (from, to) => {
    setLesson(l => {
      const blocks = [...l.blocks];
      const [moved] = blocks.splice(from, 1);
      blocks.splice(to, 0, moved);
      return { ...l, blocks };
    });
  };

  /* Save */
  const handleSave = async () => {
    if (!lesson.title.trim()) { showToast('Title is required', 'error'); return; }
    if (!lesson.slug.trim()) { showToast('Slug is required', 'error'); return; }
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/admin/save-lesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lesson),
      });
      const data = await res.json();
      if (data.success) {
        showToast('Lesson saved!');
        if (isNew) navigate(`/admin/lesson/${lesson.slug}`, { replace: true });
      } else {
        showToast('Save failed', 'error');
      }
    } catch {
      showToast('Server error', 'error');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1117] flex items-center justify-center">
        <Loader2 size={36} className="animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-[#0f1117]/90 backdrop-blur-md border-b border-white/5 px-6 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="h-5 w-px bg-white/10" />

        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center">
            <Code2 size={12} className="text-white" />
          </div>
          <span className="text-sm font-semibold text-slate-300">
            {isNew ? 'New Lesson' : lesson.title || 'Edit Lesson'}
          </span>
        </div>

        <div className="flex-1" />

        {!isNew && (
          <Link
            to={`/lessons/${lesson.slug}`}
            target="_blank"
            className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all border border-white/10"
          >
            <Eye size={14} /> Preview
          </Link>
        )}

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white px-5 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 active:scale-95"
        >
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
          {saving ? 'Saving…' : 'Save Lesson'}
        </button>
      </header>

      <div className="flex flex-1 max-w-5xl mx-auto w-full px-6 py-8 gap-8">
        {/* Left: Lesson metadata */}
        <aside className="w-72 shrink-0 flex flex-col gap-4">
          <Section title="Lesson Info">
            <Field label="Title">
              <input
                value={lesson.title}
                onChange={e => handleTitleChange(e.target.value)}
                placeholder="e.g. HTML Introduction"
                className="admin-input"
              />
            </Field>
            <Field label="Slug (URL)">
              <div className="flex items-center bg-[#0f1117] border border-white/10 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-violet-500/30">
                <span className="text-slate-600 text-xs pl-3 pr-1 whitespace-nowrap">/lessons/</span>
                <input
                  value={lesson.slug}
                  onChange={e => setField('slug', e.target.value)}
                  placeholder="html-introduction"
                  className="flex-1 bg-transparent py-2.5 pr-3 text-sm text-slate-300 outline-none"
                />
              </div>
            </Field>
            <Field label="Description">
              <textarea
                value={lesson.description}
                onChange={e => setField('description', e.target.value)}
                rows={3}
                placeholder="Brief description of this lesson"
                className="admin-input resize-none"
              />
            </Field>
            <Field label="Chapter Order">
              <input
                type="number"
                min={1}
                value={lesson.chapterOrder}
                onChange={e => setField('chapterOrder', Number(e.target.value))}
                className="admin-input"
              />
            </Field>
          </Section>

          <Section title="Block Summary">
            {lesson.blocks.length === 0 ? (
              <p className="text-xs text-slate-600 italic">No blocks yet</p>
            ) : (
              <div className="flex flex-col gap-1.5">
                {lesson.blocks.map((b, i) => {
                  const col = BLOCK_COLOR[b.type] || BLOCK_COLOR.heading;
                  return (
                    <div key={b.id} className="flex items-center gap-2 text-xs text-slate-400">
                      <div className={`w-1.5 h-1.5 rounded-full ${col.dot}`} />
                      <span className="text-slate-600">{i + 1}.</span>
                      <span className="truncate">{b.visibleText?.slice(0, 30) || <em className="text-slate-600">empty</em>}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </Section>
        </aside>

        {/* Right: Blocks */}
        <main className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-semibold text-white">
              Blocks <span className="text-slate-600 font-normal text-sm">({lesson.blocks.length})</span>
            </h2>

            {/* Add block button */}
            <div className="relative">
              <button
                onClick={() => setShowAddMenu(m => !m)}
                className="flex items-center gap-2 bg-white/5 hover:bg-violet-500/15 border border-white/10 hover:border-violet-500/30 text-slate-300 hover:text-violet-300 px-4 py-2 rounded-xl text-sm font-medium transition-all"
              >
                <Plus size={15} /> Add Block
              </button>

              {showAddMenu && (
                <div className="absolute right-0 top-full mt-2 bg-[#1a2036] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden w-44">
                  {BLOCK_TYPES.map(bt => (
                    <button
                      key={bt.type}
                      onClick={() => addBlock(bt.type)}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors text-left"
                    >
                      {bt.icon} {bt.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setShowAddMenu(false)}
                    className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-600 hover:text-slate-400 border-t border-white/5 transition-colors"
                  >
                    <X size={11} /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {lesson.blocks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-white/5 rounded-2xl">
              <FileCode2 size={36} className="text-slate-700 mb-3" />
              <p className="text-slate-500 font-medium mb-1">No blocks yet</p>
              <p className="text-slate-700 text-sm mb-4">Add a heading, text, or code block to get started</p>
              <button
                onClick={() => setShowAddMenu(true)}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              >
                <Plus size={15} /> Add First Block
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {lesson.blocks.map((block, idx) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  idx={idx}
                  total={lesson.blocks.length}
                  onChange={updateBlock}
                  onDelete={deleteBlock}
                  onMove={moveBlock}
                />
              ))}

              {/* Add another block at bottom */}
              <button
                onClick={() => setShowAddMenu(true)}
                className="w-full py-3 border-2 border-dashed border-white/5 hover:border-violet-500/30 rounded-2xl text-slate-600 hover:text-violet-400 text-sm font-medium transition-all flex items-center justify-center gap-2 hover:bg-violet-500/5"
              >
                <Plus size={15} /> Add Block
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-in slide-in-from-bottom-4 fade-in ${
          toast.type === 'error'
            ? 'bg-red-900/90 text-red-200 border border-red-700/50'
            : 'bg-emerald-900/90 text-emerald-200 border border-emerald-700/50'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

/* ─── Audio Uploader sub-component ─── */
function AudioUploader({ block, onChange }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = React.useRef(null);
  const audioUrl = block.teachingScript?.audioUrl;

  const readDurationFromFile = (file) =>
    new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const audio = new Audio(url);
      audio.addEventListener('loadedmetadata', () => {
        resolve(Math.ceil(audio.duration * 1000)); // ms
        URL.revokeObjectURL(url);
      });
    });

  const handleFile = async (file) => {
    if (!file) return;
    console.log('Audio file selected:', file.name, file.type);

    const isAudio = file.type.startsWith('audio/') || 
                    /\.(mp3|wav|m4a|ogg|aac)$/i.test(file.name);
    
    if (!isAudio) {
      alert('Please upload a valid audio file (MP3, WAV, M4A, etc.)');
      return;
    }

    setUploading(true);
    console.log('Starting upload for file:', file.name);
    try {
      const duration = await readDurationFromFile(file);
      const form = new FormData();
      form.append('audio', file);
      const res = await fetch('http://localhost:5000/api/admin/upload-audio', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
      const data = await res.json();
      
      if (data.success) {
        // Correctly update the block via the prop
        onChange({
          ...block,
          teachingScript: { 
            ...block.teachingScript, 
            audioUrl: data.audioUrl,
            duration: duration,
            fileName: file.name,
            uploadedName: data.filename
          }
        });
      } else {
        throw new Error(data.error || 'Server error during upload');
      }
    } catch (e) {
      console.error('Audio upload error:', e);
      alert('Upload failed: ' + e.message);
    }
    setUploading(false);
  };

  const removeAudio = () => {
    if (confirm('Are you sure you want to remove this audio?')) {
      onChange({
        ...block,
        teachingScript: {
          ...block.teachingScript,
          audioUrl: null,
          fileName: null,
          uploadedName: null
        }
      });
    }
  };

  const onDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const triggerInput = (e) => {
    e.stopPropagation();
    if (inputRef.current) {
      console.log('Triggering file input click...');
      inputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      <Label>Teaching Audio <span className="text-slate-600 normal-case font-normal">(plays during guided mode)</span></Label>

      {audioUrl ? (
        /* ── Advanced audio check & play area ── */
        <div className="relative bg-[#161b2e] border border-violet-500/30 rounded-2xl overflow-hidden shadow-lg animate-in fade-in zoom-in-95 duration-300">
          {uploading && (
            <div className="absolute inset-0 z-10 bg-[#161b2e]/90 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
              <Loader2 size={24} className="text-violet-400 animate-spin" />
              <span className="text-[10px] font-bold text-violet-300 uppercase tracking-widest">Replacing Audio...</span>
            </div>
          )}
          
          <div className="px-4 py-3 bg-violet-500/5 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-violet-500/20 flex-shrink-0 flex items-center justify-center">
                <Music size={14} className="text-violet-400" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-[10px] font-bold text-violet-300 uppercase tracking-wider truncate">
                  {block.teachingScript?.fileName || 'Audio Uploaded'}
                </span>
                <span className="text-[10px] text-slate-500">{Math.round((block.teachingScript?.duration || 0) / 1000)}s total</span>
              </div>
            </div>
            <div className="flex gap-2 ml-2">
              <button
                type="button"
                onClick={triggerInput}
                className="text-[10px] font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-3 py-1.5 rounded-lg border border-white/5"
              >
                REPLACE
              </button>
              <button
                type="button"
                onClick={removeAudio}
                className="text-slate-500 hover:text-red-400 p-1.5 transition-colors"
                title="Remove audio"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="p-4 bg-[#0d111d]">
            <audio src={audioUrl} controls crossOrigin="anonymous" className="w-full h-10 custom-audio-player" />
            <p className="mt-2 text-[10px] text-center text-slate-600 italic">
               Check audio for Block {block.teachingScript?.step || 0}
            </p>
          </div>
        </div>
      ) : (
        /* ── Upload drop zone ── */
        <div
          onDragEnter={(e) => { onDrag(e); setDragOver(true); }}
          onDragOver={(e) => { onDrag(e); setDragOver(true); }}
          onDragLeave={(e) => { onDrag(e); setDragOver(false); }}
          onDrop={(e) => { onDrag(e); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
          onClick={triggerInput}
          className={clsx(
            "relative border-2 border-dashed rounded-2xl px-6 py-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
            dragOver ? "border-violet-500 bg-violet-500/10 scale-[0.98]" : "border-white/10 hover:border-violet-500/40 hover:bg-violet-500/5"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-3">
              <Loader2 size={32} className="text-violet-400 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-violet-300">Uploading Audio...</p>
                <p className="text-[10px] text-slate-500">Wait, processing file & reading duration</p>
              </div>
            </div>
          ) : (
            <>
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shadow-inner">
                <Music size={20} className="text-violet-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-slate-300">
                  <span className="text-violet-400">Click to upload</span> or drag & drop audio
                </p>
                <p className="text-[11px] text-slate-600 mt-1 uppercase tracking-widest font-black">
                  MP3, WAV, M4A, OGG · Max 50 MB
                </p>
              </div>
            </>
          )}
        </div>
      )}
      
      {/* Hidden File Input */}
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        className="hidden"
        onChange={(e) => {
          handleFile(e.target.files[0]);
          e.target.value = null; // Clear so same file can be picked again
        }}
      />
    </div>
  );
}

/* ─── Tiny helpers ─── */
function Label({ children }) {
  return <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">{children}</p>;
}

function Field({ label, children }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-[#161b2e] border border-white/5 rounded-2xl p-5 flex flex-col gap-4">
      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3">{title}</p>
      {children}
    </div>
  );
}

function IconBtn({ children, title, onClick, disabled, danger }) {
  return (
    <button
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`p-1.5 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed ${
        danger
          ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/10'
          : 'text-slate-500 hover:text-white hover:bg-white/10'
      }`}
    >
      {children}
    </button>
  );
}
