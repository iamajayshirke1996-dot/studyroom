import React, { useState } from 'react';
import {
  Clock,
  Flame,
  BookOpen,
  Plus,
  Brain,
  Video,
  Code2,
  ListTodo,
  ChevronRight,
  Sparkles,
  HelpCircle,
  X,
  Target,
  CheckCircle2,
  Calendar,
  Edit3,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { StatCard } from './StatCard';
import { DsaSummaryWidget } from './DsaSummaryWidget';
import { UpcomingDeadlinesWidget } from './UpcomingDeadlinesWidget';
import { RecentActivityWidget } from './RecentActivityWidget';
import { SpacedRepetitionPrompt } from './SpacedRepetitionPrompt';
import { MaangDashboardWidget } from './MaangDashboardWidget';
import { StepsTrackerWidget } from './StepsTrackerWidget';

export const DashboardView: React.FC = () => {
  const {
    goals,
    stats,
    setActiveTab,
    setFilterOptions,
    setIsAddGoalOpen,
    setIsLogStudyOpen,
    incrementProgress,
    setSelectedSummaryGoal,
    setActiveGoalForLog,
    openEditGoalModal,
  } = useStudy();

  const { currentTheme } = useTheme();

  // User-friendly view mode
  const [dashboardFocus, setDashboardFocus] = useState<'all' | 'maang' | 'dsa' | 'recap'>('all');
  const [showGuide, setShowGuide] = useState(() => {
    return localStorage.getItem('studypulse_hide_guide') !== 'true';
  });

  const dismissGuide = () => {
    setShowGuide(false);
    localStorage.setItem('studypulse_hide_guide', 'true');
  };

  const activeGoals = goals.filter((g) => g.status === 'in_progress' || g.status === 'reviewing');

  const navigateToType = (type: 'all' | 'udemy' | 'youtube' | 'dsa' | 'custom') => {
    setFilterOptions((prev) => ({ ...prev, type }));
    setActiveTab('topics');
  };

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Friendly Quick-Start Guide Banner */}
      {showGuide && (
        <div className="rounded-3xl p-5 bg-gradient-to-r from-indigo-50/90 via-blue-50/80 to-purple-50/90 dark:from-indigo-950/40 dark:via-slate-900 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-500/30 shadow-sm relative animate-in fade-in duration-200">
          <button
            onClick={dismissGuide}
            className="absolute right-3.5 top-3.5 p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            title="Dismiss guide"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3 mb-3">
            <div
              className="p-2 rounded-xl text-white shadow-sm shrink-0"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <HelpCircle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
                Welcome to your Personal Study Room! 3 Simple Steps:
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                Everything is designed to make learning systematic and retention effortless.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="font-bold text-indigo-600 dark:text-indigo-400 block mb-1">
                1. Pick Your Track 🎯
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Track Udemy courses, YouTube playlists, DSA patterns, or follow your 12-Week MAANG sprint.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-1">
                2. Focus & Log Daily ⏱️
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                Hit <strong>Focus</strong> for 25-minute Pomodoro sessions or click <strong>+1 Lecture/Video</strong> to maintain momentum.
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800 shadow-sm">
              <span className="font-bold text-purple-600 dark:text-purple-400 block mb-1">
                3. Never Forget ("What I Learnt") 🧠
              </span>
              <p className="text-slate-600 dark:text-slate-400">
                When you return after weeks, access cheat-sheets, gotchas, and test yourself with flashcards!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Welcome & Quick Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span
              className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${currentTheme.primary}15`,
                borderColor: `${currentTheme.primary}30`,
                color: currentTheme.primary,
              }}
            >
              Study Dashboard
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 font-medium">
              <Sparkles className="h-3.5 w-3.5 text-emerald-500" />
              Active Momentum
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learn with Focus, Retain for Life
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-xl">
            Keep track of courses, DSA problem roadmaps, and your 12-week MAANG prep with automated revision summaries.
          </p>
        </div>

        <div className="flex items-center gap-2.5 relative z-10">
          <button
            onClick={() => setIsLogStudyOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Clock className="h-4 w-4" style={{ color: currentTheme.primary }} />
            <span>Log Study</span>
          </button>

          <button
            onClick={() => setIsAddGoalOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 hover:scale-[1.02]"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Plus className="h-4 w-4" />
            <span>New Goal</span>
          </button>
        </div>
      </div>

      {/* Segmented View Filter - Makes Dashboard Super Clean & Intuitive */}
      <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto text-xs font-semibold scrollbar-none">
        <button
          onClick={() => setDashboardFocus('all')}
          className={`px-3.5 py-1.5 rounded-xl transition-all ${
            dashboardFocus === 'all'
              ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          🌟 All Overview
        </button>

        <button
          onClick={() => setDashboardFocus('maang')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            dashboardFocus === 'maang'
              ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-slate-950 font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-300'
          }`}
        >
          <Flame className="h-3.5 w-3.5 fill-current" />
          <span>MAANG 3-Month Sprint</span>
        </button>

        <button
          onClick={() => setDashboardFocus('dsa')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            dashboardFocus === 'dsa'
              ? 'bg-blue-600 text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>DSA & Patterns</span>
        </button>

        <button
          onClick={() => setDashboardFocus('recap')}
          className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
            dashboardFocus === 'recap'
              ? 'bg-purple-600 text-white font-bold shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300'
          }`}
        >
          <Brain className="h-3.5 w-3.5 text-purple-400" />
          <span>Retention & Summaries</span>
        </button>
      </div>

      {/* MAANG Sprint Widget (Shown on 'all' and 'maang') */}
      {(dashboardFocus === 'all' || dashboardFocus === 'maang') && <MaangDashboardWidget />}

      {/* Spaced Repetition Prompt (Shown on 'all' and 'recap') */}
      {(dashboardFocus === 'all' || dashboardFocus === 'recap') && <SpacedRepetitionPrompt />}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Time Studied"
          value={`${stats.totalHours} hrs`}
          subtitle={`Across ${stats.totalSessions} study sessions`}
          icon={Clock}
          gradient="bg-indigo-500"
          iconColor="text-indigo-500"
          badgeText="Verified"
          badgeColor="bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30"
          onClick={() => setIsLogStudyOpen(true)}
        />

        <StatCard
          title="Study Streak"
          value={`${stats.currentStreak} Days`}
          subtitle="Daily consistency momentum"
          icon={Flame}
          gradient="bg-amber-500"
          iconColor="text-amber-500"
          badgeText="On Fire 🔥"
          badgeColor="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30"
        />

        <StatCard
          title="Active Goals"
          value={`${stats.inProgressGoals}`}
          subtitle={`${stats.completedGoals} completed so far`}
          icon={BookOpen}
          gradient="bg-purple-500"
          iconColor="text-purple-500"
          badgeText={`${stats.totalGoals} Total`}
          badgeColor="bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30"
          onClick={() => setActiveTab('topics')}
        />

        <StatCard
          title="DSA Solved"
          value={`${stats.dsaSolvedTotal}`}
          subtitle={`${stats.dsaEasySolved}E · ${stats.dsaMediumSolved}M · ${stats.dsaHardSolved}H`}
          icon={Code2}
          gradient="bg-blue-500"
          iconColor="text-blue-500"
          badgeText="Patterns"
          badgeColor="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30"
          onClick={() => navigateToType('dsa')}
        />
      </div>

      {/* Quick Active Learning Tracks */}
      {(dashboardFocus === 'all' || dashboardFocus === 'dsa') && (
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
                Active Learning Tracks
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quick-increment progress or jump to topic takeaways
              </p>
            </div>
            <button
              onClick={() => setActiveTab('topics')}
              className="text-xs font-bold flex items-center gap-1 hover:underline"
              style={{ color: currentTheme.primary }}
            >
              <span>View All ({goals.length})</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          {activeGoals.length === 0 ? (
            <div className="text-center py-10 px-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
              <BookOpen className="h-10 w-10 text-slate-400 mx-auto mb-2 opacity-60" />
              <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
                No active learning goals yet
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                Add your Udemy courses, YouTube playlists, DSA patterns, or custom roadmap goals to start tracking.
              </p>
              <button
                onClick={() => setIsAddGoalOpen(true)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-md inline-flex items-center gap-1.5 hover:scale-105 transition-transform"
                style={{ backgroundColor: currentTheme.primary }}
              >
                <Plus className="h-4 w-4" />
                <span>Add Your First Goal</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.slice(0, 3).map((goal) => {
                let progressPercent = 0;
                if (goal.type === 'udemy') {
                  progressPercent = goal.totalLectures
                    ? Math.round(((goal.completedLectures || 0) / goal.totalLectures) * 100)
                    : 0;
                } else if (goal.type === 'youtube') {
                  progressPercent = goal.totalVideos
                    ? Math.round(((goal.completedVideos || 0) / goal.totalVideos) * 100)
                    : 0;
                } else if (goal.type === 'dsa') {
                  const solved = goal.dsaProblems?.filter((p) => p.solved).length || 0;
                  const total = goal.dsaProblems?.length || 1;
                  progressPercent = Math.round((solved / total) * 100);
                } else if (goal.type === 'custom') {
                  const done = goal.milestones?.filter((m) => m.completed).length || 0;
                  const total = goal.milestones?.length || 1;
                  progressPercent = Math.round((done / total) * 100);
                }

                return (
                  <div
                    key={goal.id}
                    className="bg-white dark:bg-slate-900/80 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 shadow-sm transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                            goal.type === 'udemy'
                              ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                              : goal.type === 'youtube'
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                              : goal.type === 'dsa'
                              ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                              : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {goal.type === 'udemy' && 'Udemy'}
                          {goal.type === 'youtube' && 'YouTube'}
                          {goal.type === 'dsa' && 'DSA'}
                          {goal.type === 'custom' && 'Custom'}
                        </span>

                        <span className="text-xs font-bold text-slate-800 dark:text-white">
                          {progressPercent}%
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm line-clamp-1 mb-1">
                        {goal.title}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {goal.description || 'No description added.'}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium mb-3">
                        {goal.type === 'udemy' && (
                          <span>
                            Lectures: {goal.completedLectures || 0} / {goal.totalLectures || 0}
                          </span>
                        )}
                        {goal.type === 'youtube' && (
                          <span>
                            Videos: {goal.completedVideos || 0} / {goal.totalVideos || 0}
                          </span>
                        )}
                        {goal.type === 'dsa' && (
                          <span>
                            Problems: {goal.dsaProblems?.filter((p) => p.solved).length || 0} /{' '}
                            {goal.dsaProblems?.length || 0}
                          </span>
                        )}
                        {goal.type === 'custom' && (
                          <span>
                            Milestones: {goal.milestones?.filter((m) => m.completed).length || 0} /{' '}
                            {goal.milestones?.length || 0}
                          </span>
                        )}

                        <span>{goal.spentHours}h spent</span>
                      </div>
                    </div>

                    {/* Card Action Buttons */}
                    <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/80">
                      {goal.type === 'udemy' && (
                        <button
                          onClick={() => incrementProgress(goal.id, 1)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          title="Mark next lecture complete"
                        >
                          <span>+1 Lecture</span>
                        </button>
                      )}

                      {goal.type === 'youtube' && (
                        <button
                          onClick={() => incrementProgress(goal.id, 1)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 text-xs font-bold transition-colors flex items-center justify-center gap-1"
                          title="Mark next video complete"
                        >
                          <span>+1 Video</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedSummaryGoal(goal)}
                        className="flex-1 py-1.5 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1"
                        title="View topic summary & takeaways"
                      >
                        <Brain className="h-3.5 w-3.5 text-purple-500" />
                        <span>Summary</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveGoalForLog(goal);
                          setIsLogStudyOpen(true);
                        }}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                        title="Log study minutes"
                      >
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      </button>

                      <button
                        onClick={() => openEditGoalModal(goal)}
                        className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"
                        title="Edit goal details"
                      >
                        <Edit3 className="h-3.5 w-3.5 text-slate-500" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Main 2-Column Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DsaSummaryWidget />
            <UpcomingDeadlinesWidget />
          </div>

          {/* Quick Category Jump Bar */}
          <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Quick Filters:</span>
            <div className="flex items-center flex-wrap gap-2">
              <button
                onClick={() => navigateToType('udemy')}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1.5 shadow-sm"
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Udemy Courses</span>
              </button>
              <button
                onClick={() => navigateToType('youtube')}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1.5 shadow-sm"
              >
                <Video className="h-3.5 w-3.5" />
                <span>YouTube Playlists</span>
              </button>
              <button
                onClick={() => navigateToType('dsa')}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1.5 shadow-sm"
              >
                <Code2 className="h-3.5 w-3.5" />
                <span>DSA Roadmaps</span>
              </button>
              <button
                onClick={() => navigateToType('custom')}
                className="px-3 py-1 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm"
              >
                <ListTodo className="h-3.5 w-3.5" />
                <span>Custom Deadlines</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right 1 Column: Steps & Recent Activity Feed */}
        <div className="lg:col-span-1 space-y-6">
          <StepsTrackerWidget />
          <RecentActivityWidget />
        </div>
      </div>
    </div>
  );
};
