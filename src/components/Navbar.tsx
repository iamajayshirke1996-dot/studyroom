import React, { useState, useRef, useEffect } from 'react';
import {
  GraduationCap,
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  Flame,
  Brain,
  Timer,
  Plus,
  Sun,
  Moon,
  Palette,
  Download,
  Upload,
  RotateCcw,
  LogOut,
  ChevronDown,
  Lock,
  Briefcase,
  Video,
  ShieldCheck,
} from 'lucide-react';
import { useStudy } from '../context/StudyContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useTimer } from '../context/TimerContext';
import { hasFeatureAccess, isAdminEmail } from '../utils/featureFlags';

export const Navbar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    stats,
    setIsAddGoalOpen,
    setIsPomodoroOpen,
    exportData,
    importData,
    resetToDefaultData,
    currentUserPermissions,
  } = useStudy();

  const { isRunning: isTimerRunning, formattedTime } = useTimer();
  const { isDark, toggleLightDark, setIsCustomizerOpen, currentTheme } = useTheme();
  const { user, logout } = useAuth();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const ok = await importData(file);
      if (ok) {
        alert('Backup successfully imported!');
      } else {
        alert('Failed to import backup. Please verify the JSON file.');
      }
    }
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'topics', label: 'Courses', icon: BookOpen },
    { id: 'timeline', label: 'Timeline', icon: CalendarDays },
    ...(hasFeatureAccess(currentUserPermissions, 'jobTracker', user?.email)
      ? [{ id: 'jobs', label: 'Job Tracker', icon: Briefcase }]
      : []),
    ...(hasFeatureAccess(currentUserPermissions, 'youtubeShorts', user?.email)
      ? [{ id: 'shorts', label: 'Shorts 🎬', icon: Video }]
      : []),
    ...(hasFeatureAccess(currentUserPermissions, 'maangPrep', user?.email)
      ? [{ id: 'maang', label: 'MAANG Prep', icon: Flame }]
      : []),
    { id: 'summary', label: 'Summaries', icon: Brain },
    ...(currentUserPermissions?.isAdmin || isAdminEmail(user?.email)
      ? [{ id: 'admin', label: 'Admin ⚙️', icon: ShieldCheck }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800/80 bg-white/95 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Left: Clean Brand Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer select-none group shrink-0"
            onClick={() => setActiveTab('dashboard')}
          >
            <div
              className="h-9 w-9 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight text-slate-900 dark:text-white">
                StudyPulse
              </span>
              <span className="hidden xl:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Cloud
              </span>
            </div>
          </div>

          {/* Center: Sleek Responsive Tabs (Scrollable if viewport is tight) */}
          <nav
            className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 flex-1 min-w-0 max-w-fit mx-2 overflow-x-auto"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Icon
                    className={`h-3.5 w-3.5 ${
                      isActive && item.id === 'maang' ? 'text-amber-500 fill-current' : ''
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Clean, Unified Utility Hub */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0 ml-auto">
            {/* Minimalist Streak Counter */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold border border-amber-500/20 cursor-default shrink-0"
              title={`Current Streak: ${stats.currentStreak} day(s)`}
            >
              <Flame className="h-4 w-4 text-amber-500 fill-current" />
              <span>{stats.currentStreak}d</span>
            </div>

            {/* Pomodoro Focus Timer Button */}
            <button
              onClick={() => setIsPomodoroOpen(true)}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 ${
                isTimerRunning
                  ? 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-500/40 shadow-xs'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-200 dark:border-slate-800'
              }`}
              title={isTimerRunning ? `Focus session active: ${formattedTime} remaining. Click to open timer.` : 'Open Pomodoro Focus Timer'}
            >
              <Timer className={`h-3.5 w-3.5 ${isTimerRunning ? 'text-amber-500 animate-pulse' : 'text-indigo-500'}`} />
              <span className="font-mono hidden lg:inline">{isTimerRunning ? formattedTime : 'Focus'}</span>
            </button>

            {/* Primary Action: New Goal */}
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform hover:scale-[1.02] active:scale-[0.98] shrink-0"
              style={{ backgroundColor: currentTheme.primary }}
              title="Add a new course, video series, or roadmap goal"
            >
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">New Goal</span>
            </button>

            {/* Dark / Light Mode Toggle */}
            <button
              onClick={toggleLightDark}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 transition-colors shrink-0"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-indigo-600" />
              )}
            </button>

            {/* User Profile Avatar & Dropdown */}
            {user && (
              <div className="relative shrink-0" ref={userMenuRef}>
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-1 p-0.5 rounded-full hover:ring-2 hover:ring-slate-200 dark:hover:ring-slate-800 transition-all focus:outline-none"
                  title="Account and settings"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt="Avatar"
                      className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center"
                      style={{ backgroundColor: currentTheme.primary }}
                    >
                      {user.displayName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                  <ChevronDown className="h-3 w-3 text-slate-400 hidden sm:block mr-0.5" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
                    {/* User Info Header */}
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {user.displayName || 'Learner'}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {user.email || user.uid}
                      </p>
                      <div className="mt-2 inline-flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Cloud Firestore Synced</span>
                      </div>
                    </div>

                    {/* Preferences & Settings */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          setIsCustomizerOpen(true);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left transition-colors"
                      >
                        <Palette className="h-3.5 w-3.5 text-indigo-500" />
                        <span>Theme Color Palette</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          exportData();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left transition-colors"
                      >
                        <Download className="h-3.5 w-3.5 text-emerald-500" />
                        <span>Export Backup</span>
                      </button>

                      <label className="w-full flex items-center gap-2 px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-left cursor-pointer transition-colors">
                        <Upload className="h-3.5 w-3.5 text-blue-500" />
                        <span>Import Backup</span>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={(e) => {
                            setIsUserMenuOpen(false);
                            handleFileUpload(e);
                          }}
                          accept=".json"
                          className="hidden"
                        />
                      </label>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          if (confirm('Reset your study room to initial data?')) {
                            resetToDefaultData();
                          }
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/20 rounded-xl text-left transition-colors"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>Reset Roadmap</span>
                      </button>
                    </div>

                    <div className="my-1 border-t border-slate-100 dark:border-slate-800" />

                    {/* Sign Out */}
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl text-left transition-colors font-bold"
                    >
                      <LogOut className="h-3.5 w-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div
          className="flex md:hidden items-center gap-1.5 py-2 px-1 overflow-x-auto border-t border-slate-200 dark:border-slate-800/80"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex flex-col items-center justify-center shrink-0 px-3 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition-colors min-w-[64px] ${
                  isActive
                    ? 'bg-slate-100 dark:bg-slate-800/80 font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
                style={isActive ? { color: currentTheme.primary } : {}}
              >
                <Icon className="h-4 w-4 mb-0.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
