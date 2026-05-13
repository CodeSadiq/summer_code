import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Search, Edit2, Trash2, ChevronRight, ChevronLeft,
  HelpCircle, Code, Bug, Terminal, Loader2, Save, X, BookOpen
} from 'lucide-react';
import { API_URL } from '../config';
import clsx from 'clsx';

export default function AdminPractice() {
  const navigate = useNavigate();
  const { topicId, questionId } = useParams();
  const [topics, setTopics] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    topicId: '',
    lessonId: '',
    type: 'mcq',
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    difficulty: 'easy',
    starterCode: '',
    testCases: [{ input: '', expectedOutput: '' }]
  });

  const selectedTopic = topicId || '';
  const isFormMode = window.location.pathname.includes('/add') || !!questionId;

  useEffect(() => {
    fetchTopics();
    fetchLessons();
    fetchQuestions();
  }, []);

  const fetchLessons = async () => {
    try {
      const res = await fetch(`${API_URL}/api/lessons`);
      const data = await res.json();
      setLessons(data);
    } catch (err) {
      console.error('Error fetching lessons:', err);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [topicId]);

  const resetForm = () => {
    setFormData({
      topicId: topicId || '',
      lessonId: '',
      type: 'mcq',
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      explanation: '',
      difficulty: 'easy',
      starterCode: '',
      testCases: [{ input: '', expectedOutput: '' }]
    });
  };

  useEffect(() => {
    if (questionId && questions.length > 0) {
      const q = questions.find(q => q._id === questionId);
      if (q) setFormData(q);
    } else if (window.location.pathname.endsWith('/add')) {
       resetForm();
    }
  }, [questionId, topicId, questions]);

  const fetchTopics = async () => {
    try {
      const res = await fetch(`${API_URL}/api/topics`);
      const data = await res.json();
      setTopics(data);
    } catch (err) {
      console.error('Error fetching topics:', err);
    }
  };

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/admin/practice`);
      const data = await res.json();
      setQuestions(data);
    } catch (err) {
      console.error('Error fetching questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const url = questionId
      ? `${API_URL}/api/admin/practice/${questionId}`
      : `${API_URL}/api/admin/practice`;
    const method = questionId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        navigate(`/admin/practice/${topicId}`);
        fetchQuestions();
      }
    } catch (err) {
      console.error('Error saving question:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await fetch(`${API_URL}/api/admin/practice/${id}`, { method: 'DELETE' });
      fetchQuestions();
    } catch (err) {
      console.error('Error deleting question:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <button 
              onClick={() => isFormMode ? navigate(`/admin/practice/${topicId}`) : selectedTopic ? navigate('/admin/practice') : navigate('/admin')}
              className="flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold text-[10px] uppercase tracking-widest transition-all group"
            >
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-100 group-hover:border-slate-300 transition-all">
                <ChevronLeft size={14} className="mr-0.5" />
              </div>
              {isFormMode ? 'Back to List' : selectedTopic ? 'Back to Hub' : 'Back to Admin'}
            </button>
            <div className="space-y-1">
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
                {isFormMode ? (questionId ? 'Edit Question' : 'Add Question') : selectedTopic ? `${topics.find(t => t.id === selectedTopic)?.name || selectedTopic} Practice` : 'Practice Management'}
              </h1>
              <p className="text-slate-500 font-medium">
                {isFormMode ? 'Refine your practice content' : selectedTopic ? 'Manage questions for this course' : 'Create and manage topic-based practice questions'}
              </p>
            </div>
          </div>
        </div>

        {/* 1. Hub View: Course Cards */}
        {!selectedTopic && !isFormMode && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topics.map(t => {
              const topicQuestions = questions.filter(q => q.topicId === t.id);
              return (
                <div 
                  key={t.id}
                  onClick={() => navigate(`/admin/practice/${t.id}`)}
                  className="bg-white border border-slate-200 rounded-[2rem] p-8 transition-all duration-300 hover:border-slate-900 hover:shadow-2xl hover:shadow-slate-200/50 cursor-pointer group"
                >
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                      <BookOpen size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 tracking-tight transition-colors">{t.name}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                        {topicQuestions.length} Questions
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 2. List View: Questions List */}
        {selectedTopic && !isFormMode && (
          <div className="space-y-6 animate-entrance">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">
                  Questions List
                </h2>
              </div>
              <button 
                onClick={() => navigate(`/admin/practice/${selectedTopic}/add`)}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
              >
                <Plus size={14} /> Add Question
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="animate-spin text-blue-600" size={48} />
                </div>
              ) : questions.filter(q => q.topicId === selectedTopic).map(q => (
                <div key={q._id} className="bg-white border border-slate-200 rounded-[2rem] p-8 flex items-center justify-between group hover:border-blue-200 transition-all">
                  <div className="flex items-center gap-6">
                    <div className={clsx(
                      "w-12 h-12 rounded-2xl flex items-center justify-center",
                      q.type === 'mcq' && "bg-blue-50 text-blue-600",
                      q.type === 'output' && "bg-amber-50 text-amber-600",
                      q.type === 'debug' && "bg-rose-50 text-rose-600",
                      q.type === 'coding' && "bg-emerald-50 text-emerald-600"
                    )}>
                      {q.type === 'mcq' && <HelpCircle size={24} />}
                      {q.type === 'output' && <Terminal size={24} />}
                      {q.type === 'debug' && <Bug size={24} />}
                      {q.type === 'coding' && <Code size={24} />}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-black text-slate-900 truncate max-w-md">{q.question}</h3>
                        <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full">{q.difficulty}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{q.topicId} • {q.type}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => navigate(`/admin/practice/${selectedTopic}/edit/${q._id}`)} className="p-3 bg-slate-50 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => handleDelete(q._id)} className="p-3 bg-slate-50 text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. Form View: Full Page Editor */}
        {isFormMode && (
          <div className="bg-white rounded-[3rem] p-10 shadow-2xl space-y-8 animate-pop-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
                {questionId ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={() => navigate(`/admin/practice/${topicId}`)} className="p-2 hover:bg-slate-100 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Course Topic</label>
                  <select
                    required
                    value={formData.topicId}
                    onChange={(e) => setFormData({ ...formData, topicId: e.target.value, lessonId: '' })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">Select Topic</option>
                    {topics.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Specific Chapter (Lesson)</label>
                  <select
                    value={formData.lessonId}
                    onChange={(e) => setFormData({ ...formData, lessonId: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="">All Chapters (General)</option>
                    {lessons.filter(l => l.course === formData.topicId).map(l => (
                      <option key={l.id} value={l.id}>{l.title}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Question Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  >
                    <option value="mcq">Multiple Choice (MCQ)</option>
                    <option value="output">Predict Output</option>
                    <option value="debug">Find & Fix Bug</option>
                    <option value="coding">Coding Challenge</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Question Description</label>
                <textarea
                  required
                  placeholder="Describe the problem or question clearly..."
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none transition-all"
                />
              </div>

              {(formData.type === 'mcq' || formData.type === 'output') && (
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Options</label>
                  <div className="grid grid-cols-2 gap-4">
                    {formData.options.map((opt, i) => (
                      <input
                        key={i}
                        placeholder={`Option ${i + 1}`}
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...formData.options];
                          newOpts[i] = e.target.value;
                          setFormData({ ...formData, options: newOpts });
                        }}
                        className="bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Correct Answer</label>
                  <input
                    required
                    value={formData.correctAnswer}
                    onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                    placeholder="Exact text match"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Difficulty</label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {(formData.type === 'coding' || formData.type === 'debug') && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Starter / Buggy Code</label>
                      <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded">Monospace Editor</span>
                    </div>
                    <textarea
                      value={formData.starterCode}
                      onChange={(e) => setFormData({ ...formData, starterCode: e.target.value })}
                      className="w-full bg-slate-900 text-emerald-400 font-mono p-6 rounded-3xl outline-none h-64 shadow-inner resize-none"
                      placeholder="// Write your starter code here..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Test Cases (for Validation)</label>
                      <button 
                        type="button"
                        onClick={() => setFormData({ ...formData, testCases: [...formData.testCases, { input: '', expectedOutput: '' }] })}
                        className="text-[10px] font-black text-blue-600 hover:text-blue-700 uppercase tracking-widest flex items-center gap-1"
                      >
                        <Plus size={12} /> Add Case
                      </button>
                    </div>
                    <div className="space-y-3">
                      {formData.testCases.map((tc, index) => (
                        <div key={index} className="flex gap-4 items-start bg-slate-50 p-4 rounded-2xl border border-slate-100">
                          <div className="flex-1 space-y-2">
                            <input 
                              placeholder="Input (Optional)"
                              value={tc.input}
                              onChange={(e) => {
                                const newCases = [...formData.testCases];
                                newCases[index].input = e.target.value;
                                setFormData({ ...formData, testCases: newCases });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          <div className="flex-1 space-y-2">
                            <input 
                              required
                              placeholder="Expected Output"
                              value={tc.expectedOutput}
                              onChange={(e) => {
                                const newCases = [...formData.testCases];
                                newCases[index].expectedOutput = e.target.value;
                                setFormData({ ...formData, testCases: newCases });
                              }}
                              className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold outline-none focus:ring-1 focus:ring-blue-500"
                            />
                          </div>
                          {formData.testCases.length > 1 && (
                            <button 
                              type="button"
                              onClick={() => {
                                const newCases = formData.testCases.filter((_, i) => i !== index);
                                setFormData({ ...formData, testCases: newCases });
                              }}
                              className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Explanation / Hint</label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain the solution or provide a hint for the user..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 font-bold outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none transition-all"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate(`/admin/practice/${topicId}`)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={18} /> {questionId ? 'Update Question' : 'Save Question'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
