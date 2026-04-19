import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Clock, Award, ChevronRight, LogOut, CheckCircle2 } from 'lucide-react';
import { API_URL } from '../config';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const studentData = JSON.parse(localStorage.getItem('studentData'));
    if (!studentData) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, lessonsRes] = await Promise.all([
          fetch(`${API_URL}/api/student/profile/${studentData.email}`),
          fetch(`${API_URL}/api/lessons`)
        ]);

        const profileData = await profileRes.json();
        const lessonsData = await lessonsRes.json();

        if (profileData.success) {
          setUser(profileData.user);
        }
        setLessons(lessonsData);
      } catch (err) {
        console.error('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    localStorage.removeItem('studentData');
    navigate('/');
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf9] dark:bg-slate-950 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const completedLessonsData = lessons.filter(l => user?.completedLessons?.includes(l.slug));
  const progressPercentage = lessons.length > 0 ? Math.round((completedLessonsData.length / lessons.length) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-slate-950 p-6 md:p-12 font-sans">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-white/10 shadow-xl shadow-black/5">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {user?.name || 'Student'}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                Hinglish Learner <span className="w-1 h-1 bg-slate-400 rounded-full" /> {user?.email}
              </p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-100 dark:hover:bg-red-500/20 transition-all active:scale-95 border border-red-100 dark:border-red-500/10"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-lg shadow-black/5">
            <BookOpen className="text-blue-500 mb-4" size={32} />
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {completedLessonsData.length}
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Lessons Completed</p>
          </div>
          
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-lg shadow-black/5">
            <Award className="text-amber-500 mb-4" size={32} />
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {progressPercentage}%
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Overall Progress</p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-lg shadow-black/5">
            <Clock className="text-indigo-500 mb-4" size={32} />
            <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                {lessons.length - completedLessonsData.length}
            </div>
            <p className="text-slate-400 font-bold text-[10px] uppercase tracking-[0.2em]">Lessons Remaining</p>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-white/10 overflow-hidden shadow-2xl shadow-black/5">
          <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Your Journey</h2>
            <div className="text-[10px] font-black text-blue-500 uppercase tracking-widest bg-blue-50 dark:bg-blue-500/10 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-500/10">
              Recent Activity
            </div>
          </div>
          
          <div className="p-4 md:p-8">
            {completedLessonsData.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400 font-medium mb-6">Aapne abhi tak koi lesson complete nahi kiya hai.</p>
                <button 
                  onClick={() => navigate('/courses')}
                  className="bg-slate-900 dark:bg-blue-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform"
                >
                  Start Learning Now
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedLessonsData.slice(0, 5).reverse().map((lesson) => (
                  <div 
                    key={lesson.slug}
                    onClick={() => navigate(`/lessons/${lesson.slug}`)}
                    className="flex items-center justify-between p-6 bg-slate-50 dark:bg-white/5 rounded-3xl hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                            {lesson.title}
                        </h3>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {lesson.course} Course
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="text-center">
            <button 
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-xs font-bold uppercase tracking-[0.4em]"
            >
                PREVIEW SITE
            </button>
        </div>

      </div>
    </div>
  );
}
