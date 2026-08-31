import React, { useState } from 'react';
import { Video, ExternalLink, Brain, Clock, MoreVertical, Plus, CheckCircle2, Tv, Edit3, Trash2 } from 'lucide-react';
import { LearningGoal } from '../../types';
import { useStudy } from '../../context/StudyContext';

interface Props {
  goal: LearningGoal;
}

export const YouTubePlaylistCard: React.FC<Props> = ({ goal }) => {
  const {
    incrementProgress,
    setSelectedSummaryGoal,
    openEditGoalModal,
    deleteGoal,
    setIsLogStudyOpen,
    setActiveGoalForLog,
  } = useStudy();

  const [menuOpen, setMenuOpen] = useState(false);

  const total = goal.totalVideos || 1;
  const completed = goal.completedVideos || 0;
  const percent = Math.min(100, Math.round((completed / total) * 100));

  const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-rose-500/40 shadow-sm transition-all flex flex-col justify-between relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-500/15 text-rose-700 dark:text-rose-300 border border-rose-500/30 flex items-center gap-1">
              <Video className="h-3 w-3" />
              YouTube Playlist
            </span>
            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {goal.category}
            </span>
            {goal.status === 'completed' && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Finished
              </span>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="h-4 w-4" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-40 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => openEditGoalModal(goal)}
                  className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Delete "${goal.title}"?`)) deleteGoal(goal.id);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Delete Playlist</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title & Channel Name */}
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug mb-1">
          {goal.title}
        </h3>

        {goal.channelName && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
            <Tv className="h-3.5 w-3.5 text-rose-500" />
            <span>Channel: {goal.channelName}</span>
          </div>
        )}

        <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {goal.description}
        </p>

        {/* Current Video Watching */}
        {goal.currentVideoTitle && (
          <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 mb-3">
            <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 block mb-0.5">
              Next / Current Video:
            </span>
            <p className="text-xs text-slate-800 dark:text-slate-200 font-medium truncate">
              {goal.currentVideoTitle}
            </p>
          </div>
        )}

        {/* Video Progress Bar */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Watched Videos</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {completed} / {total} <span className="text-rose-600 dark:text-rose-400 font-normal">({percent}%)</span>
            </span>
          </div>
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-500 to-red-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-0.5">
            <span>Remaining: {Math.max(0, total - completed)} videos</span>
            <span>{goal.spentHours} hrs spent</span>
          </div>
        </div>

        {/* Target Deadline Badge */}
        {deadlineDate && (
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 mb-4 text-xs">
            <span className="text-slate-500 dark:text-slate-400">Target Date:</span>
            <span
              className={`font-semibold ${
                daysLeft !== null && daysLeft <= 3
                  ? 'text-rose-600 dark:text-rose-400'
                  : daysLeft !== null && daysLeft <= 7
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              {daysLeft !== null && ` (${daysLeft}d left)`}
            </span>
          </div>
        )}
      </div>

      {/* Footer Action Buttons */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
        {/* +1 Video Quick Action */}
        <button
          onClick={() => incrementProgress(goal.id, 1)}
          className="flex-1 py-2 px-3 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-500/20 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          title="Mark next video watched"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>+1 Video</span>
        </button>

        {/* View Summary / Notes */}
        <button
          onClick={() => setSelectedSummaryGoal(goal)}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm"
          title="Open structured takeaways & cheat-sheet"
        >
          <Brain className="h-3.5 w-3.5 text-rose-500" />
          <span>Takeaways</span>
        </button>

        {/* Log Session Minutes */}
        <button
          onClick={() => {
            setActiveGoalForLog(goal);
            setIsLogStudyOpen(true);
          }}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          title="Log study time"
        >
          <Clock className="h-3.5 w-3.5 text-indigo-500" />
        </button>

        {/* External Link */}
        {goal.youtubeUrl && (
          <a
            href={goal.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            title="Open playlist in YouTube"
          >
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
