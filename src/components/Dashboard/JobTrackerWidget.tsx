import React from 'react';
import { Briefcase, Flame, Plus, ArrowRight, Target, TrendingUp, Send } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { OutreachPlatform } from '../../types';

export const JobTrackerWidget: React.FC = () => {
  const {
    jobOutreaches,
    outreachStats,
    setActiveTab,
    setIsLogOutreachOpen,
    setEditingOutreach,
  } = useStudy();

  const { currentTheme } = useTheme();

  const handleOpenLogModal = () => {
    setEditingOutreach(null);
    setIsLogOutreachOpen(true);
  };

  const getPlatformLabel = (platform: OutreachPlatform) => {
    switch (platform) {
      case 'linkedin':
        return 'LinkedIn';
      case 'cold_email':
        return 'Cold Email';
      case 'twitter':
        return 'Twitter/X';
      case 'wellfound':
        return 'Wellfound';
      case 'yc':
        return 'YC Startups';
      case 'referral':
        return 'Referral';
      default:
        return 'Other';
    }
  };

  const recentItems = jobOutreaches.slice(0, 3);
  const todayProgressPercent = Math.min(
    100,
    Math.round((outreachStats.todayCount / outreachStats.dailyGoal) * 100)
  );

  return (
    <div className="glass-panel rounded-3xl p-5 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl text-white flex items-center justify-center shadow-sm shrink-0"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Briefcase className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight flex items-center gap-1.5">
              <span>Job & Cold Outreach</span>
              <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/15 text-amber-600 dark:text-amber-300">
                <Flame className="h-3 w-3 fill-current text-amber-500" />
                <span>{outreachStats.currentStreak}d streak</span>
              </span>
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Applications, cold emails & daily outreach streak
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenLogModal}
          className="px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm transition-transform hover:scale-105 flex items-center gap-1 shrink-0"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Log</span>
        </button>
      </div>

      {/* Progress Bar & Compact KPIs */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-600 dark:text-slate-300">
            Today: <strong className="text-slate-900 dark:text-white font-extrabold">{outreachStats.todayCount} / {outreachStats.dailyGoal}</strong> applied
          </span>
          <span className="font-bold text-emerald-500">{todayProgressPercent}%</span>
        </div>

        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
            style={{ width: `${todayProgressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>Total: <strong className="text-slate-800 dark:text-slate-200">{outreachStats.totalApplications}</strong></span>
          <span>Response Rate: <strong className="text-emerald-500">{outreachStats.responseRate}%</strong></span>
          <span>Interviews: <strong className="text-purple-500">{outreachStats.interviewingCount}</strong></span>
        </div>
      </div>

      {/* Recent Applications List */}
      <div className="space-y-2">
        {recentItems.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">
            No job applications logged yet. Click '+ Log' to start your streak!
          </p>
        ) : (
          recentItems.map((item) => (
            <div
              key={item.id}
              className="p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 text-xs shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="font-extrabold text-slate-900 dark:text-white truncate">
                    {item.companyName}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold shrink-0">
                    {getPlatformLabel(item.platform)}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                  {item.role}
                </p>
              </div>

              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase shrink-0 ${
                  item.status === 'offer'
                    ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                    : item.status === 'interviewing'
                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30'
                    : item.status === 'replied'
                    ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                {item.status}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Footer Link */}
      <button
        onClick={() => setActiveTab('jobs')}
        className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
      >
        <span>Open Job Tracker & Kanban Board</span>
        <ArrowRight className="h-3.5 w-3.5 text-indigo-500" />
      </button>
    </div>
  );
};
