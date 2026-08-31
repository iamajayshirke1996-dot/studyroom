import React, { useState } from 'react';
import {
  GraduationCap,
  Sparkles,
  Code2,
  Flame,
  Brain,
  Timer,
  CheckCircle2,
  ArrowRight,
  Sun,
  Moon,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

export const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInAsGuest, loading, error, isFirebaseConfigured } = useAuth();
  const { isDark, toggleLightDark, currentTheme } = useTheme();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleClick = async () => {
    setIsSigningIn(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white transition-colors">
      {/* Top Bar with Brand & Theme Toggle */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="h-10 w-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                StudyPulse
              </span>
              <span
                className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded border"
                style={{
                  backgroundColor: `${currentTheme.primary}15`,
                  borderColor: `${currentTheme.primary}30`,
                  color: currentTheme.primary,
                }}
              >
                Cloud
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={toggleLightDark}
          className="p-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? (
            <Sun className="h-4 w-4 text-amber-400" />
          ) : (
            <Moon className="h-4 w-4 text-indigo-600" />
          )}
        </button>
      </header>

      {/* Main Hero & Sign-in Box */}
      <main className="max-w-4xl mx-auto px-4 py-8 flex flex-col items-center text-center">
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-200/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-800 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
          <span>Personalized Study Room · Single-Click SSO Cloud Sync</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-2xl leading-tight">
          Track Your Learning.{' '}
          <span
            className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          >
            Never Forget What You Learn.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-4 max-w-xl leading-relaxed">
          The all-in-one workspace for tech interviews, Udemy courses, YouTube playlists, and spaced repetition summaries.
        </p>

        {/* Single Click SSO Card */}
        <div className="mt-8 w-full max-w-md bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Sign In to Your Study Room
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              One click to access your Firestore goals, timetable, and summaries.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs font-medium flex items-center gap-2 text-left">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 1-Click Google SSO Button */}
          <button
            onClick={handleGoogleClick}
            disabled={isSigningIn || loading}
            className="w-full py-3.5 px-4 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-800 dark:text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
          >
            {/* Google SVG Icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSigningIn ? 'Signing in with Google...' : 'Continue with Google SSO'}</span>
          </button>

          {/* Alternative Demo / Guest Access */}
          <div className="pt-2">
            <button
              onClick={signInAsGuest}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors inline-flex items-center gap-1 font-medium"
            >
              <span>Or explore as guest student</span>
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Secure per-user data isolation via Firebase Firestore</span>
          </div>
        </div>

        {/* 4 Feature Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12 w-full text-left">
          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-2xl bg-amber-500/15 text-amber-600 dark:text-amber-400 w-fit mb-3">
              <Flame className="h-5 w-5 fill-current" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              12-Week MAANG Blueprint
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Curated roadmap with daily 9-to-5 timetable, deliverables, and weekly milestones.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-2xl bg-blue-500/15 text-blue-600 dark:text-blue-400 w-fit mb-3">
              <Code2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              DSA Patterns Checklist
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Pattern-based problems (Two Pointers, Sliding Window, DP) with time/space complexities.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-400 w-fit mb-3">
              <Brain className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              "What I Learnt" Summaries
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Review core takeaways, cheat-sheets, and tricky gotchas weeks later with spaced recall.
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 w-fit mb-3">
              <Timer className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Pomodoro & Study Logs
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              25-minute deep focus sprints that automatically log your study sessions to your goal.
            </p>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200 dark:border-slate-900">
        <p>StudyPulse © 2026 · Cloud-native study planner for focused engineers</p>
      </footer>
    </div>
  );
};
