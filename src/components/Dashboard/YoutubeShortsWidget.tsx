import React from 'react';
import { useStudy } from '../../context/StudyContext';
import { Video, Flame, Plus, ChevronRight, Eye, Sparkles, CheckCircle2 } from 'lucide-react';

export const YoutubeShortsWidget: React.FC = () => {
  const { shortsStats, setActiveTab, setIsLogShortOpen, setEditingShort } = useStudy();

  const progressPercent = Math.min(
    100,
    Math.round((shortsStats.todayCount / Math.max(1, shortsStats.dailyGoal)) * 100)
  );

  return (
    <div className="bg-white dark:bg-slate-800/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all space-y-4 relative overflow-hidden group">
      <div className="absolute right-0 top-0 translate-x-6 -translate-y-6 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Title Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-400 rounded-xl">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 dark:text-white text-base flex items-center gap-2">
              Shorts 🎬
              {shortsStats.currentStreak > 0 && (
                <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-extrabold rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" /> {shortsStats.currentStreak}d Streak
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Content Upload & Video Consistency
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setEditingShort(null);
            setIsLogShortOpen(true);
          }}
          className="p-2 bg-pink-50 dark:bg-pink-950/50 hover:bg-pink-100 text-pink-600 dark:text-pink-400 rounded-xl transition-colors text-xs font-semibold flex items-center gap-1"
        >
          <Plus className="w-4 h-4" /> Log Short
        </button>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5 relative z-10">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-600 dark:text-slate-400 font-medium">
            Today's Target ({shortsStats.todayCount}/{shortsStats.dailyGoal})
          </span>
          <span className="font-bold text-pink-600 dark:text-pink-400">
            {progressPercent}%
          </span>
        </div>

        <div className="w-full bg-slate-100 dark:bg-slate-700/60 h-2.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-pink-500 to-rose-600 h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Quick Metrics & View More */}
      <div className="pt-2 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs relative z-10">
        <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400 font-medium">
          <span>🎉 <b>{shortsStats.totalUploaded}</b> Uploaded</span>
          <span>👁️ <b>{shortsStats.totalViews.toLocaleString()}</b> Views</span>
        </div>

        <button
          onClick={() => setActiveTab('shorts')}
          className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:text-pink-700 flex items-center gap-0.5 hover:underline"
        >
          Pipeline <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
