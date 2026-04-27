import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Clock, Award, ArrowRight, LogOut, CheckCircle2 } from 'lucide-react';
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

  // Calculate course-wise progress
  const coursesProgress = lessons.reduce((acc, lesson) => {
    const courseName = lesson.course || 'Other';
    if (!acc[courseName]) {
      acc[courseName] = { total: 0, completed: 0 };
    }
    acc[courseName].total += 1;
    if (user?.completedLessons?.includes(lesson.slug)) {
      acc[courseName].completed += 1;
    }
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#fafaf9] p-6 md:p-24 font-sans selection:bg-blue-100">
      <div className="max-w-4xl mx-auto space-y-28">

        {/* Header Section - Elegant Cardless */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-16 border-b border-slate-200/80">
          <div className="flex items-center gap-8">
            <div className="w-20 h-20 bg-slate-100 rounded-3xl flex items-center justify-center text-slate-400">
              <User size={40} strokeWidth={1.5} />
            </div>
            <div className="space-y-1">
              <h1 className="text-6xl font-black text-slate-900 tracking-tighter">
                {user?.name || 'Sadique Imam'}
              </h1>
              <p className="text-slate-400 font-medium text-lg italic tracking-tight">
                {user?.email || 'sadiq.imam404@gmail.com'}
              </p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-500 font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:tracking-[0.5em] pb-2 border-b border-transparent hover:border-red-200"
          >
            Logout session
          </button>
        </div>



        {/* Course Progress Dashboard */}
        <div className="pt-12 w-full">
          <div className="space-y-24">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Course Progress</h2>
              <div className="flex-1 h-px bg-slate-200/60" />
            </div>
            
            <div className="space-y-12">
              {Object.entries(coursesProgress).map(([course, data]) => {
                const perc = Math.round((data.completed / data.total) * 100);
                
                // Find next lesson for this course
                const courseLessons = lessons
                  .filter(l => l.course === course)
                  .sort((a, b) => (a.chapterOrder || 0) - (b.chapterOrder || 0));
                
                const nextLesson = courseLessons.find(l => !user?.completedLessons?.includes(l.slug)) || courseLessons[0];

                return (
                  <div key={course} className="group flex items-center justify-between gap-12 py-8 border-b border-slate-100 last:border-0 hover:translate-x-1 transition-all">
                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-end">
                        <div className="space-y-1">
                          <h3 className="text-3xl font-black text-slate-900 tracking-tighter">{course}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{data.completed} of {data.total} units finished</p>
                        </div>
                        <div className="text-right">
                          <span className="text-3xl font-black text-blue-600 tracking-tighter">{perc}%</span>
                        </div>
                      </div>
                      
                      <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-blue-600 transition-all duration-1000 group-hover:bg-blue-500" 
                          style={{ width: `${perc}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/lessons/${nextLesson?.slug}`)}
                      className="shrink-0 bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 hover:shadow-xl transition-all active:scale-[0.98] flex items-center gap-3"
                    >
                      {perc === 100 ? 'Review' : 'Continue'}
                      <ArrowRight size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
