import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, ArrowRight, Lock, ShieldAlert, Loader2, User, Mail, Sparkles, KeyRound } from 'lucide-react';
import { API_URL } from '../config';
import clsx from 'clsx';

import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [mode, setMode] = useState('login'); // 'login', 'signup', 'forgot', 'reset'
  const [formData, setFormData] = useState({ name: '', email: '', password: '', newPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('studentToken', data.token);
        localStorage.setItem('studentData', JSON.stringify(data.user));
        navigate('/');
      } else {
        setError(data.error || 'Google Login Failed');
      }
    } catch (err) {
      setError('Connection failed during Google Login');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    let endpoint = '';
    let body = {};

    switch(mode) {
      case 'login':
        endpoint = '/api/auth/login';
        body = { email: formData.email, password: formData.password };
        break;
      case 'signup':
        endpoint = '/api/auth/signup';
        body = formData;
        break;
      case 'forgot':
        endpoint = '/api/auth/forgot-password';
        body = { email: formData.email };
        break;
      case 'reset':
        endpoint = '/api/auth/reset-password';
        body = { email: formData.email, newPassword: formData.newPassword };
        break;
      default: break;
    }
    
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();

      if (data.success) {
        if (mode === 'login') {
          localStorage.setItem('studentToken', data.token);
          localStorage.setItem('studentData', JSON.stringify(data.user));
          navigate('/');
        } else if (mode === 'signup') {
          setSuccess('Account created! Please login now.');
          setMode('login');
        } else if (mode === 'forgot') {
          setSuccess('Reset simulation: You can now enter a new password.');
          setMode('reset');
        } else if (mode === 'reset') {
          setSuccess('Password updated! Please login.');
          setMode('login');
        }
      } else {
        setError(data.error || 'Authentication failed');
      }
    } catch (err) {
      setError('Connection failed. Check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-500/10 dark:bg-blue-600/5 blur-[120px] rounded-full animate-float-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-600/5 blur-[140px] rounded-full animate-float-slow" style={{ animationDelay: '-4s' }} />

      <div className="w-full max-w-[440px] relative z-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
            {mode === 'forgot' || mode === 'reset' ? 'Account Recovery' : 'Student Portal'}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
             {mode === 'forgot' ? 'Apna account wapas payein' : 'Seekhna shuru karein Hinglish mein'}
          </p>
        </div>

        <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
          
          <form onSubmit={handleAction} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Name"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-5 py-4 rounded-2xl font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'signup' || mode === 'forgot' || mode === 'reset') && (
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-5 py-4 rounded-2xl font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
            )}

            {(mode === 'login' || mode === 'signup') && (
              <div className="space-y-2 group">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button 
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-5 py-4 rounded-2xl font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
            )}

            {mode === 'reset' && (
              <div className="space-y-2 group">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 ml-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                  placeholder="Enter new password"
                  className="w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-5 py-4 rounded-2xl font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/5 transition-all"
                />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 p-4 rounded-2xl text-[13px] font-medium animate-in fade-in slide-in-from-top-1 border border-red-100 dark:border-red-900/20">
                <ShieldAlert size={18} className="shrink-0" />
                {error}
              </div>
            )}

            {success && (
              <div className="flex items-center gap-3 bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-2xl text-[13px] font-medium animate-in fade-in slide-in-from-top-1 border border-emerald-100 dark:border-emerald-900/20">
                <Sparkles size={18} className="shrink-0 text-amber-500" />
                {success}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-slate-950 dark:bg-blue-600 text-white py-4 rounded-2xl font-bold text-base transition-all hover:bg-slate-900 dark:hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 mt-2 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  {mode === 'signup' ? 'Create Account' : mode === 'forgot' ? 'Verify Email' : mode === 'reset' ? 'Reset Password' : 'Start Learning'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            {(mode === 'login' || mode === 'signup') && (
              <>
                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">OR</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
                </div>

                <div className="flex justify-center transition-opacity hover:opacity-90">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => setError('Google Login Initialization Failed')}
                    useOneTap
                    theme="filled_blue"
                    shape="pill"
                    text="continue_with"
                    width="100%"
                  />
                </div>
              </>
            )}

            <p className="text-center text-[13px] font-medium text-slate-500 dark:text-slate-400 pt-2">
              {mode === 'login' ? (
                <>Don't have an account? <button type="button" onClick={() => setMode('signup')} className="text-blue-600 font-bold hover:underline underline-offset-4">Sign up</button></>
              ) : mode === 'signup' ? (
                <>Already have an account? <button type="button" onClick={() => setMode('login')} className="text-blue-600 font-bold hover:underline underline-offset-4">Login</button></>
              ) : (
                <button type="button" onClick={() => setMode('login')} className="text-blue-600 font-bold hover:underline underline-offset-4">Back to Login</button>
              )}
            </p>
          </form>
        </div>

        <div className="mt-8 text-center">
            <button 
                onClick={() => navigate('/')}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors text-xs font-bold uppercase tracking-[0.2em]"
            >
                Back to Home
            </button>
        </div>
      </div>
    </div>
  );
}
