import React, { useState, useEffect } from 'react';
import { X, Clock, Sparkles, BookOpen, Video, Code2, ListTodo } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';

export const LogStudyModal: React.FC = () => {
  const {
    isLogStudyOpen,
    setIsLogStudyOpen,
    activeGoalForLog,
    setActiveGoalForLog,
    goals,
    logStudySession,
  } = useStudy();

  const { currentTheme } = useTheme();

  const [selectedGoalId, setSelectedGoalId] = useState<string>('');
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [notes, setNotes] = useState<string>('');
  const [itemsDone, setItemsDone] = useState<number>(1);

  useEffect(() => {
    if (activeGoalForLog) {
      setSelectedGoalId(activeGoalForLog.id);
    } else if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[0].id);
    }
  }, [activeGoalForLog, goals, isLogStudyOpen]);

  if (!isLogStudyOpen) return null;

  const currentGoal = goals.find((g) => g.id === selectedGoalId) || goals[0];

  const handleClose = () => {
    setIsLogStudyOpen(false);
    setActiveGoalForLog(null);
    setNotes('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentGoal) return;

    logStudySession({
      goalId: currentGoal.id,
      goalTitle: currentGoal.title,
      goalType: currentGoal.type,
      date: new Date().toISOString(),
      durationMinutes: Number(durationMinutes),
      notes: notes.trim() || `Studied ${currentGoal.title} for ${durationMinutes} minutes`,
      lecturesDone: currentGoal.type === 'udemy' ? Number(itemsDone) : undefined,
      videosWatched: currentGoal.type === 'youtube' ? Number(itemsDone) : undefined,
      problemsSolved: currentGoal.type === 'dsa' ? Number(itemsDone) : undefined,
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden text-slate-900 dark:text-slate-100">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div
              className="p-2.5 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">Log Study Session</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Record study minutes, notes, and progress</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Select Goal */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Which topic did you study?
            </label>
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="w-full px-3 py-2.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-sm"
            >
              {goals.map((g) => (
                <option key={g.id} value={g.id}>
                  [{g.type.toUpperCase()}] {g.title}
                </option>
              ))}
            </select>
          </div>

          {/* Duration Presets & Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Study Duration
            </label>
            <div className="flex items-center gap-2 mb-2">
              {[25, 45, 60, 90, 120].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
                    durationMinutes === mins
                      ? 'text-white'
                      : 'bg-slate-100 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  style={durationMinutes === mins ? { backgroundColor: currentTheme.primary, borderColor: currentTheme.primary } : {}}
                >
                  {mins}m
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="5"
                max="600"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-28 px-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white shadow-sm"
              />
              <span className="text-slate-500 dark:text-slate-400 font-medium">minutes</span>
            </div>
          </div>

          {/* Type-Specific Increment */}
          {currentGoal && (currentGoal.type === 'udemy' || currentGoal.type === 'youtube' || currentGoal.type === 'dsa') && (
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-2 shadow-sm">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                {currentGoal.type === 'udemy' && 'How many lectures did you complete?'}
                {currentGoal.type === 'youtube' && 'How many videos did you watch?'}
                {currentGoal.type === 'dsa' && 'How many problems did you solve?'}
              </span>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={itemsDone}
                  onChange={(e) => setItemsDone(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white shadow-sm"
                />
                <span className="text-slate-500 dark:text-slate-400 text-xs">
                  {currentGoal.type === 'udemy' && `lectures (currently ${currentGoal.completedLectures || 0}/${currentGoal.totalLectures || 0})`}
                  {currentGoal.type === 'youtube' && `videos (currently ${currentGoal.completedVideos || 0}/${currentGoal.totalVideos || 0})`}
                  {currentGoal.type === 'dsa' && `problems solved`}
                </span>
              </div>
            </div>
          )}

          {/* Session Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Session Notes / What did you practice or learn?
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Worked through section on async operations, solved 2 edge cases with timeouts..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 shadow-sm"
            />
          </div>

          {/* Submit */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105"
              style={{ backgroundColor: currentTheme.primary }}
            >
              Save Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
