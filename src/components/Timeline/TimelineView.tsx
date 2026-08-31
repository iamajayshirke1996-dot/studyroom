import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  CheckCircle2,
  AlertCircle,
  Brain,
  BookOpen,
  Video,
  Code2,
  ListTodo,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { LearningGoal, TopicType } from '../../types';

interface TimelineItem {
  id: string;
  goalId: string;
  title: string;
  description: string;
  type: TopicType;
  date: Date;
  daysRemaining: number;
  completed: boolean;
  isMilestone: boolean;
  parentGoalTitle?: string;
  progressPercent: number;
  goal: LearningGoal;
}

export const TimelineView: React.FC = () => {
  const {
    goals,
    setIsAddGoalOpen,
    setSelectedSummaryGoal,
    setActiveGoalForLog,
    setIsLogStudyOpen,
    toggleMilestone,
    updateGoal,
  } = useStudy();

  const { currentTheme } = useTheme();

  const [typeFilter, setTypeFilter] = useState<'all' | TopicType>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const now = new Date();

  // Aggregate timeline items
  const items: TimelineItem[] = [];

  goals.forEach((goal) => {
    // Goal itself deadline
    if (goal.deadline) {
      const d = new Date(goal.deadline);
      const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      let progress = 0;
      if (goal.type === 'udemy') {
        progress = goal.totalLectures ? Math.round(((goal.completedLectures || 0) / goal.totalLectures) * 100) : 0;
      } else if (goal.type === 'youtube') {
        progress = goal.totalVideos ? Math.round(((goal.completedVideos || 0) / goal.totalVideos) * 100) : 0;
      } else if (goal.type === 'dsa') {
        const solved = goal.dsaProblems?.filter((p) => p.solved).length || 0;
        const total = goal.dsaProblems?.length || 1;
        progress = Math.round((solved / total) * 100);
      } else {
        const done = goal.milestones?.filter((m) => m.completed).length || 0;
        const total = goal.milestones?.length || 1;
        progress = Math.round((done / total) * 100);
      }

      items.push({
        id: `goal-${goal.id}`,
        goalId: goal.id,
        title: goal.title,
        description: goal.description,
        type: goal.type,
        date: d,
        daysRemaining: diffDays,
        completed: goal.status === 'completed',
        isMilestone: false,
        progressPercent: progress,
        goal,
      });
    }

    // Sub-milestones
    goal.milestones?.forEach((m) => {
      if (m.dueDate) {
        const d = new Date(m.dueDate);
        const diffDays = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        items.push({
          id: `m-${m.id}`,
          goalId: goal.id,
          title: m.title,
          description: `Milestone checkpoint for ${goal.title}`,
          type: goal.type,
          date: d,
          daysRemaining: diffDays,
          completed: m.completed,
          isMilestone: true,
          parentGoalTitle: goal.title,
          progressPercent: m.completed ? 100 : 0,
          goal,
        });
      }
    });
  });

  // Sort chronologically
  items.sort((a, b) => a.date.getTime() - b.date.getTime());

  // Filter
  const filtered = items.filter((item) => {
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (statusFilter === 'pending' && item.completed) return false;
    if (statusFilter === 'completed' && !item.completed) return false;
    return true;
  });

  // Group items by timeframe
  const overdue = filtered.filter((i) => !i.completed && i.daysRemaining < 0);
  const thisWeek = filtered.filter((i) => !i.completed && i.daysRemaining >= 0 && i.daysRemaining <= 7);
  const thisMonth = filtered.filter((i) => !i.completed && i.daysRemaining > 7 && i.daysRemaining <= 30);
  const future = filtered.filter((i) => !i.completed && i.daysRemaining > 30);
  const completed = filtered.filter((i) => i.completed);

  const renderSection = (title: string, subtitle: string, sectionItems: TimelineItem[], badgeColor: string) => {
    if (sectionItems.length === 0) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${badgeColor}`}>
            {title} ({sectionItems.length})
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{subtitle}</span>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-300 dark:border-slate-800 space-y-6">
          {sectionItems.map((item) => {
            const isUrgent = !item.completed && item.daysRemaining <= 3;
            const formattedDate = item.date.toLocaleDateString(undefined, {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div key={item.id} className="relative group">
                {/* Node indicator */}
                <div
                  className={`absolute -left-[31px] top-4 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-950 transition-transform group-hover:scale-125 ${
                    item.completed
                      ? 'border-emerald-500 bg-emerald-500'
                      : isUrgent
                      ? 'border-rose-500 animate-ping'
                      : item.type === 'udemy'
                      ? 'border-purple-500'
                      : item.type === 'youtube'
                      ? 'border-rose-500'
                      : item.type === 'dsa'
                      ? 'border-blue-500'
                      : 'border-emerald-500'
                  }`}
                />

                <div
                  className={`p-5 rounded-2xl border transition-all shadow-sm ${
                    item.completed
                      ? 'bg-slate-50/70 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/60 opacity-85'
                      : 'bg-white dark:bg-slate-900/80 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                          item.type === 'udemy'
                            ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                            : item.type === 'youtube'
                            ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                            : item.type === 'dsa'
                            ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                            : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                        }`}
                      >
                        {item.type}
                      </span>

                      {item.isMilestone && (
                        <span className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-medium">
                          Checkpoint
                        </span>
                      )}

                      <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">{formattedDate}</span>
                    </div>

                    {/* Days Left Badge */}
                    <div>
                      {item.completed ? (
                        <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-500/15 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Done
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                            item.daysRemaining < 0
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40 animate-pulse'
                              : item.daysRemaining <= 3
                              ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/40'
                              : item.daysRemaining <= 7
                              ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/40'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          {item.daysRemaining < 0
                            ? `${Math.abs(item.daysRemaining)} days overdue`
                            : item.daysRemaining === 0
                            ? 'Due Today!'
                            : `${item.daysRemaining} days remaining`}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Title & Parent Goal */}
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                  {item.isMilestone && item.parentGoalTitle && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Part of course: <strong className="text-slate-700 dark:text-slate-300">{item.parentGoalTitle}</strong>
                    </p>
                  )}
                  {!item.isMilestone && item.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{item.description}</p>
                  )}

                  {/* Progress bar on goal items */}
                  {!item.isMilestone && (
                    <div className="space-y-1 mb-3">
                      <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                        <span>Overall Track Progress</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.progressPercent}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full"
                          style={{ width: `${item.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-800/80">
                    {item.isMilestone ? (
                      <button
                        onClick={() => toggleMilestone(item.goalId, item.id.replace('m-', ''))}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
                          item.completed
                            ? 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                            : 'bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>{item.completed ? 'Mark Incomplete' : 'Mark Milestone Done'}</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedSummaryGoal(item.goal)}
                        className="px-3 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/20 text-xs font-bold flex items-center gap-1.5 shadow-sm"
                      >
                        <Brain className="h-3.5 w-3.5" />
                        <span>View Takeaways</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setActiveGoalForLog(item.goal);
                        setIsLogStudyOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm"
                    >
                      <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Log Session</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 bg-amber-500/15 px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Interactive Roadmap
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Learning Timeline & Milestones
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Track scheduled target dates, course deadlines, and checkpoint milestones chronologically.
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center hover:scale-[1.02]"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Deadline Target</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Filter Source:</span>
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'all'
                ? 'text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
            style={typeFilter === 'all' ? { backgroundColor: currentTheme.primary } : {}}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('udemy')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'udemy'
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Udemy
          </button>
          <button
            onClick={() => setTypeFilter('youtube')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'youtube'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setTypeFilter('dsa')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'dsa'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            DSA
          </button>
          <button
            onClick={() => setTypeFilter('custom')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'custom'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Custom
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none shadow-sm"
          >
            <option value="all">All Items</option>
            <option value="pending">Pending Deadlines</option>
            <option value="completed">Completed Milestones</option>
          </select>
        </div>
      </div>

      {/* Timeline Section Feed */}
      <div className="space-y-8">
        {renderSection(
          'Overdue Targets',
          'Past due date - prioritize wrapping these up',
          overdue,
          'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
        )}
        {renderSection(
          'Due This Week',
          'Immediate targets for the next 7 days',
          thisWeek,
          'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
        )}
        {renderSection(
          'Coming Up This Month',
          'Milestones scheduled within 30 days',
          thisMonth,
          'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30'
        )}
        {renderSection(
          'Later Roadmaps',
          'Long-range objectives & future sprints',
          future,
          'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-300 dark:border-slate-700'
        )}
        {renderSection(
          'Completed Milestones',
          'Accomplished checkpoints & achieved deadlines',
          completed,
          'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
        )}

        {filtered.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 text-center">
            <CalendarDays className="h-12 w-12 text-slate-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No timeline milestones match</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
              Add deadlines to your courses or create milestone checkpoints to see them on the timeline.
            </p>
            <button
              onClick={() => setIsAddGoalOpen(true)}
              className="px-4 py-2 text-white text-xs font-bold rounded-xl shadow-md"
              style={{ backgroundColor: currentTheme.primary }}
            >
              Add New Deadline
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
