import React, { useState } from 'react';
import {
  Code2,
  CheckCircle2,
  Circle,
  ExternalLink,
  Brain,
  Clock,
  Plus,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  Tag,
  Zap,
  Edit3,
  Trash2,
} from 'lucide-react';
import { LearningGoal, DsaProblem, DsaDifficulty } from '../../types';
import { useStudy } from '../../context/StudyContext';

interface Props {
  goal: LearningGoal;
}

export const DsaRoadmapView: React.FC<Props> = ({ goal }) => {
  const {
    toggleDsaProblem,
    setSelectedSummaryGoal,
    openEditGoalModal,
    deleteGoal,
    updateGoal,
    setIsLogStudyOpen,
    setActiveGoalForLog,
  } = useStudy();

  const [menuOpen, setMenuOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddProblem, setShowAddProblem] = useState(false);

  // New problem form states
  const [newTitle, setNewTitle] = useState('');
  const [newDiff, setNewDiff] = useState<DsaDifficulty>('medium');
  const [newPattern, setNewPattern] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTimeComp, setNewTimeComp] = useState('O(N)');
  const [newSpaceComp, setNewSpaceComp] = useState('O(1)');
  const [newNotes, setNewNotes] = useState('');

  const problems = goal.dsaProblems || [];
  const solvedCount = problems.filter((p) => p.solved).length;
  const totalCount = problems.length;
  const percent = totalCount > 0 ? Math.round((solvedCount / totalCount) * 100) : 0;

  const handleAddProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProb: DsaProblem = {
      id: `p-${Date.now()}`,
      title: newTitle.trim(),
      difficulty: newDiff,
      pattern: newPattern.trim() || 'General Algorithm',
      solved: false,
      url: newUrl.trim() || undefined,
      timeComplexity: newTimeComp.trim() || undefined,
      spaceComplexity: newSpaceComp.trim() || undefined,
      notes: newNotes.trim() || undefined,
    };

    updateGoal(goal.id, {
      dsaProblems: [...problems, newProb],
    });

    // Reset form
    setNewTitle('');
    setNewPattern('');
    setNewUrl('');
    setNewNotes('');
    setShowAddProblem(false);
  };

  return (
    <div className="bg-white dark:bg-slate-900/80 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 hover:border-blue-500/40 shadow-sm transition-all flex flex-col justify-between relative group">
      <div>
        {/* Top Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30 flex items-center gap-1">
              <Code2 className="h-3 w-3" />
              DSA Roadmap
            </span>
            {goal.dsaTopicGroup && (
              <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                {goal.dsaTopicGroup}
              </span>
            )}
            {goal.status === 'completed' && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                All Solved
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
                  <span>Edit Track</span>
                </button>
                <button
                  onClick={() => {
                    if (confirm('Delete this DSA track?')) deleteGoal(goal.id);
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
        <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-200 transition-colors">
          {goal.title}
        </h3>
        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">{goal.description}</p>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">
              Solved: {solvedCount} / {totalCount}
            </span>
            <span className="font-bold text-blue-600 dark:text-blue-300">{percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-600 to-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>{totalCount - solvedCount} problems to master</span>
            <span>{goal.spentHours} hrs logged</span>
          </div>
        </div>

        {/* Problems Checklist */}
        <div className="mb-4">
          <div className="flex items-center justify-between py-1 border-b border-slate-200 dark:border-slate-800/80 mb-2">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <span>Problem Set ({totalCount})</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddProblem(!showAddProblem)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-0.5 font-semibold"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Problem</span>
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Add Problem Inline Form */}
          {showAddProblem && (
            <form
              onSubmit={handleAddProblem}
              className="p-3 mb-3 bg-slate-50 dark:bg-slate-950/80 rounded-2xl border border-blue-200 dark:border-blue-500/30 space-y-2 text-xs shadow-sm"
            >
              <p className="font-bold text-slate-900 dark:text-white">Add New Problem to Track</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Problem Title (e.g. 3Sum)"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                  required
                />
                <select
                  value={newDiff}
                  onChange={(e) => setNewDiff(e.target.value as DsaDifficulty)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Pattern (e.g. Two Pointers)"
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                />
                <input
                  type="text"
                  placeholder="Problem Link (LeetCode URL)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Time (e.g. O(N))"
                  value={newTimeComp}
                  onChange={(e) => setNewTimeComp(e.target.value)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Space (e.g. O(1))"
                  value={newSpaceComp}
                  onChange={(e) => setNewSpaceComp(e.target.value)}
                  className="px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white"
                />
              </div>

              <input
                type="text"
                placeholder="Key insight or edge cases..."
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400"
              />

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddProblem(false)}
                  className="px-3 py-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-sm"
                >
                  Save Problem
                </button>
              </div>
            </form>
          )}

          {/* List of Problems */}
          {isExpanded && (
            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {problems.map((prob) => (
                <div
                  key={prob.id}
                  className={`p-2.5 rounded-2xl border transition-all flex flex-col gap-1.5 text-xs ${
                    prob.solved
                      ? 'bg-slate-50/50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 text-slate-400'
                      : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:border-slate-300 dark:hover:border-slate-700 shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <button
                        onClick={() => toggleDsaProblem(goal.id, prob.id)}
                        className="text-slate-400 hover:text-emerald-500 transition-colors shrink-0"
                        title={prob.solved ? 'Mark unsolved' : 'Mark solved'}
                      >
                        {prob.solved ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                        )}
                      </button>

                      <span
                        className={`font-semibold truncate ${
                          prob.solved ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'
                        }`}
                      >
                        {prob.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                          prob.difficulty === 'easy'
                            ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30'
                            : prob.difficulty === 'medium'
                            ? 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30'
                        }`}
                      >
                        {prob.difficulty}
                      </span>

                      {prob.url && (
                        <a
                          href={prob.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 p-0.5"
                          title="Open in LeetCode"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Pattern & Complexities */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 flex-wrap pl-6">
                    {prob.pattern && (
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-400 font-medium">
                        <Tag className="h-2.5 w-2.5 text-blue-500" />
                        {prob.pattern}
                      </span>
                    )}
                    {prob.timeComplexity && (
                      <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px] text-indigo-600 dark:text-indigo-300">
                        Time: {prob.timeComplexity}
                      </span>
                    )}
                    {prob.spaceComplexity && (
                      <span className="px-1.5 py-0.2 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded font-mono text-[10px] text-indigo-600 dark:text-indigo-300">
                        Space: {prob.spaceComplexity}
                      </span>
                    )}
                  </div>

                  {/* Approach notes if available */}
                  {prob.notes && (
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-900/50 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800/60 pl-2">
                      💡 {prob.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800/80">
        <button
          onClick={() => setSelectedSummaryGoal(goal)}
          className="flex-1 py-2 px-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
          title="View key patterns, template code & edge cases"
        >
          <Brain className="h-3.5 w-3.5 text-blue-500" />
          <span>DSA Cheatsheet & Takeaways</span>
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
