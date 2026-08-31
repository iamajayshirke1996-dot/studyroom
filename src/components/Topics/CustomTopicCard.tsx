import React, { useState } from 'react';
import {
  ListTodo,
  Brain,
  Clock,
  Plus,
  MoreVertical,
  CheckCircle2,
  Circle,
  Calendar,
  AlertCircle,
  Edit3,
  Trash2,
} from 'lucide-react';
import { LearningGoal, Milestone } from '../../types';
import { useStudy } from '../../context/StudyContext';

interface Props {
  goal: LearningGoal;
}

export const CustomTopicCard: React.FC<Props> = ({ goal }) => {
  const {
    toggleMilestone,
    setSelectedSummaryGoal,
    openEditGoalModal,
    deleteGoal,
    updateGoal,
    setIsLogStudyOpen,
    setActiveGoalForLog,
  } = useStudy();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showAddMilestone, setShowAddMilestone] = useState(false);
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('');
  const [newMilestoneDate, setNewMilestoneDate] = useState('');

  const milestones = goal.milestones || [];
  const completedCount = milestones.filter((m) => m.completed).length;
  const totalCount = milestones.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const deadlineDate = goal.deadline ? new Date(goal.deadline) : null;
  const daysLeft = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMilestoneTitle.trim()) return;

    const newM: Milestone = {
      id: `m-${Date.now()}`,
      title: newMilestoneTitle.trim(),
      dueDate: newMilestoneDate || new Date(Date.now() + 7 * 86400000).toISOString(),
      completed: false,
    };

    updateGoal(goal.id, {
      milestones: [...milestones, newM],
    });

    setNewMilestoneTitle('');
    setNewMilestoneDate('');
    setShowAddMilestone(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/40 shadow-sm transition-all flex flex-col justify-between relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ListTodo className="h-3 w-3" />
              Custom Topic
            </span>

            <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
              {goal.category}
            </span>

            <span
              className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${
                goal.priority === 'urgent'
                  ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                  : goal.priority === 'high'
                  ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
              }`}
            >
              {goal.priority}
            </span>

            {goal.status === 'completed' && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Done
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
                className="absolute right-0 mt-1 w-36 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl p-1 z-30 animate-in fade-in zoom-in-95 duration-100"
                onClick={() => setMenuOpen(false)}
              >
                <button
                  onClick={() => openEditGoalModal(goal)}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg flex items-center gap-2"
                >
                  <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Edit Topic</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this custom topic?')) deleteGoal(goal.id);
                  }}
                  className="w-full text-left px-2.5 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg flex items-center gap-2"
                >
                  <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-200 transition-colors">
          {goal.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3 leading-relaxed">{goal.description}</p>

        {/* Deadline Indicator */}
        {deadlineDate && (
          <div className="flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 mb-3">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              Final Deadline:
            </span>
            <span
              className={`font-semibold text-[11px] flex items-center gap-1 ${
                daysLeft !== null && daysLeft <= 3
                  ? 'text-rose-600 dark:text-rose-400 font-bold'
                  : daysLeft !== null && daysLeft <= 7
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-emerald-600 dark:text-emerald-300'
              }`}
            >
              {daysLeft !== null && daysLeft <= 3 && <AlertCircle className="h-3 w-3" />}
              {deadlineDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
              {daysLeft !== null && ` (${daysLeft > 0 ? `${daysLeft}d left` : 'Due today'})`}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Checkpoints: {completedCount} / {totalCount}
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-300">{percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-600 to-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{totalCount - completedCount} milestones pending</span>
            <span>{goal.spentHours} hrs logged</span>
          </div>
        </div>

        {/* Milestones Checklist */}
        <div className="mb-4">
          <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800/80 mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Milestone Deadlines</span>
            <button
              onClick={() => setShowAddMilestone(!showAddMilestone)}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-0.5 font-semibold"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Checkpoint</span>
            </button>
          </div>

          {showAddMilestone && (
            <form
              onSubmit={handleAddMilestone}
              className="p-3 mb-2 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-emerald-200 dark:border-emerald-500/30 space-y-2 text-xs shadow-sm"
            >
              <input
                type="text"
                placeholder="Checkpoint title (e.g. Finish Section 3)"
                value={newMilestoneTitle}
                onChange={(e) => setNewMilestoneTitle(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                required
              />
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={newMilestoneDate}
                  onChange={(e) => setNewMilestoneDate(e.target.value)}
                  className="flex-1 px-2.5 py-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-sm"
                >
                  Add
                </button>
              </div>
            </form>
          )}

          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {milestones.map((m) => {
              const mDate = new Date(m.dueDate);
              return (
                <div
                  key={m.id}
                  className={`p-2 rounded-xl border flex items-center justify-between gap-2 text-xs transition-all ${
                    m.completed
                      ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-400'
                      : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => toggleMilestone(goal.id, m.id)}
                      className="text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                    >
                      {m.completed ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      ) : (
                        <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                      )}
                    </button>
                    <span className={`truncate ${m.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-200'}`}>
                      {m.title}
                    </span>
                  </div>

                  <span className="text-[10px] text-slate-500 dark:text-slate-400 shrink-0">
                    {mDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => setSelectedSummaryGoal(goal)}
          className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
          title="View what you learned in this topic"
        >
          <Brain className="h-3.5 w-3.5 text-emerald-500" />
          <span>What I Learnt</span>
        </button>

        <button
          onClick={() => {
            setActiveGoalForLog(goal);
            setIsLogStudyOpen(true);
          }}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
          title="Log study minutes"
        >
          <Clock className="h-3.5 w-3.5 text-indigo-500" />
        </button>
      </div>
    </div>
  );
};
