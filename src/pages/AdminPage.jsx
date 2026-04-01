import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Code2, Plus, Trash2, Edit3, GripVertical,
  BookOpen, LayoutDashboard, LogOut, Eye, ChevronRight,
  Sparkles, AlertCircle, CheckCircle2, Loader2, Music
} from 'lucide-react';

const API = 'http://localhost:5000';

export default function AdminPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragIdx, setDragIdx] = useState(null);
  const [toast, setToast] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    fetch(`${API}/api/lessons`)
      .then(r => r.json())
      .then(data => { setLessons(data); setLoading(false); })
      .catch(() => { showToast('Could not connect to server', 'error'); setLoading(false); });
  }, []);

  const handleDelete = async (slug) => {
    if (!window.confirm('Delete this lesson? This cannot be undone.')) return;
    setDeleting(slug);
    const res = await fetch(`${API}/api/admin/delete-lesson/${slug}`, { method: 'DELETE' });
    const data = await res.json();
    if (data.success) {
      setLessons(prev => prev.filter(l => l.slug !== slug));
      showToast('Lesson deleted');
    } else {
      showToast('Failed to delete', 'error');
    }
    setDeleting(null);
  };

  // Drag-to-reorder
  const onDragStart = (idx) => setDragIdx(idx);
  const onDragOver = (e, idx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === idx) return;
    const next = [...lessons];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setLessons(next);
    setDragIdx(idx);
  };
  const onDragEnd = async () => {
    setDragIdx(null);
    await fetch(`${API}/api/admin/reorder-lessons`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slugs: lessons.map(l => l.slug) }),
    });
    showToast('Order saved');
  };

  return (
    <div className="min-h-screen bg-[#0f1117] text-white flex">
      {/* Sidebar */}
      <aside className="w-60 bg-[#161b2e] border-r border-white/5 flex flex-col fixed top-0 left-0 h-screen z-40">
        <div className="p-5 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 rounded-[14px] bg-transparent border border-white/10 flex items-center justify-center p-2.5 shadow-sm">
              <Code2 className="text-white" size={22} />
            </div>
            <div>
              <p className="text-lg font-black text-white tracking-tighter uppercase tracking-[0.08em] leading-none mb-0.5">SUMMERCODE</p>
              <p className="text-[10px] text-violet-400 font-semibold uppercase tracking-widest leading-none">Admin</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 flex flex-col gap-1">
          <SideItem icon={<LayoutDashboard size={16} />} label="Dashboard" active />
          <SideItem icon={<BookOpen size={16} />} label="Lessons" onClick={() => {}} />
          <SideItem
            icon={<Plus size={16} />}
            label="New Lesson"
            onClick={() => navigate('/admin/lesson/new')}
          />
        </nav>

        <div className="p-3 border-t border-white/5">
          <Link
            to="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Eye size={15} /> Preview Site
          </Link>
          <button className="w-full flex items-center gap-2 text-slate-400 hover:text-red-400 text-sm px-3 py-2 rounded-lg hover:bg-white/5 transition-colors mt-1">
            <LogOut size={15} /> Exit Admin
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="ml-60 flex-1 flex flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-[#0f1117]/80 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Lessons</h1>
            <p className="text-slate-400 text-sm mt-0.5">{lessons.length} lesson{lessons.length !== 1 ? 's' : ''} · drag to reorder</p>
          </div>
          <button
            onClick={() => navigate('/admin/lesson/new')}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/30 hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={16} /> Create Lesson
          </button>
        </header>

        <main className="p-8 flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-slate-500">
              <Loader2 size={32} className="animate-spin" />
            </div>
          ) : lessons.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <BookOpen size={32} className="text-slate-600" />
              </div>
              <p className="text-slate-400 font-medium mb-4">No lessons yet</p>
              <button
                onClick={() => navigate('/admin/lesson/new')}
                className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
              >
                <Plus size={15} /> Create your first lesson
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {lessons.map((lesson, idx) => (
                <div
                  key={lesson.slug}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={(e) => onDragOver(e, idx)}
                  onDragEnd={onDragEnd}
                  className={`group bg-[#161b2e] border rounded-2xl p-5 flex items-center gap-4 transition-all cursor-grab active:cursor-grabbing ${
                    dragIdx === idx
                      ? 'border-violet-500/50 bg-violet-500/5 scale-[1.01]'
                      : 'border-white/5 hover:border-white/10'
                  }`}
                >
                  <GripVertical size={18} className="text-slate-600 group-hover:text-slate-400 shrink-0 transition-colors" />

                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600/30 to-indigo-600/10 border border-violet-500/20 flex items-center justify-center shrink-0">
                    <span className="text-violet-400 font-bold text-sm">{idx + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h2 className="font-semibold text-white text-base truncate">{lesson.title}</h2>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-slate-500 truncate">/{lesson.slug}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{lesson.blocks?.length || 0} blocks</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/lessons/${lesson.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </Link>
                    <button
                      onClick={() => navigate(`/admin/lesson/${lesson.slug}`)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-violet-500/20 hover:text-violet-300 text-slate-300 text-xs font-medium transition-all"
                    >
                      <Edit3 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lesson.slug)}
                      disabled={deleting === lesson.slug}
                      className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                      title="Delete"
                    >
                      {deleting === lesson.slug
                        ? <Loader2 size={16} className="animate-spin" />
                        : <Trash2 size={16} />}
                    </button>
                  </div>
                  <ChevronRight size={16} className="text-slate-700 group-hover:text-slate-500 transition-colors shrink-0" />
                </div>
              ))}
            </div>
          )}

          {/* Stats cards */}
          {lessons.length > 0 && (
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Lessons" value={lessons.length} icon={<BookOpen size={18} />} color="violet" />
              <StatCard label="Total Blocks" value={lessons.reduce((a, l) => a + (l.blocks?.length || 0), 0)} icon={<Sparkles size={18} />} color="indigo" />
              <StatCard label="Code Blocks" value={lessons.reduce((a, l) => a + (l.blocks?.filter(b => b.type === 'code').length || 0), 0)} icon={<Code2 size={18} />} color="emerald" />
              <StatCard 
                label="Audio Clips" 
                value={lessons.reduce((a, l) => a + (l.blocks?.filter(b => b.teachingScript?.audioUrl || b.teachingScript?.uploadedName).length || 0), 0)} 
                icon={<Music size={18} />} 
                color="amber" 
              />
            </div>
          )}
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-2xl animate-in slide-in-from-bottom-4 fade-in ${
          toast.type === 'error' ? 'bg-red-900/90 text-red-200 border border-red-700/50' : 'bg-emerald-900/90 text-emerald-200 border border-emerald-700/50'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}

function SideItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        active
          ? 'bg-violet-500/15 text-violet-300'
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      {icon} {label}
    </button>
  );
}

function StatCard({ label, value, icon, color }) {
  const colors = {
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  };
  return (
    <div className="bg-[#161b2e] border border-white/5 rounded-2xl p-5 flex items-center gap-4 transition-all hover:border-white/10 hover:translate-y-[-2px]">
      <div className={`w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 ${colors[color]}`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-2xl font-bold text-white leading-tight">{value}</p>
        <p className="text-xs text-slate-500 mt-0.5 truncate">{label}</p>
      </div>
    </div>
  );
}

