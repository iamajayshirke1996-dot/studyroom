import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Timer,
  Edit2,
  Check,
  CheckCircle2,
  Plus,
  Minus,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTimer, TimerMode } from '../../context/TimerContext';
import { useTheme } from '../../context/ThemeContext';

export const PomodoroModal: React.FC = () => {
  const { isPomodoroOpen, setIsPomodoroOpen, goals, logStudySession } = useStudy();
  const {
    mode,
    timeLeft,
    duration,
    isRunning,
    targetGoalId,
    sessionCompletedPrompt,
    formattedTime,
    progressPercent,
    startTimer,
    pauseTimer,
    resetTimer,
    switchMode,
    setCustomMinutes,
    adjustSeconds,
    setTargetGoalId,
    setSessionCompletedPrompt,
  } = useTimer();

  const { currentTheme } = useTheme();

  const [isEditingMinutes, setIsEditingMinutes] = useState(false);
  const [customInputMinutes, setCustomInputMinutes] = useState<number>(Math.round(duration / 60));

  useEffect(() => {
    setCustomInputMinutes(Math.round(duration / 60));
  }, [duration]);

  // Default target goal
  useEffect(() => {
    if (goals.length > 0 && !targetGoalId) {
      setTargetGoalId(goals[0].id);
    }
  }, [goals, targetGoalId, setTargetGoalId]);

  if (!isPomodoroOpen) return null;

  const currentGoal = goals.find((g) => g.id === targetGoalId) || goals[0];

  const handleSaveCustomMinutes = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (customInputMinutes > 0) {
      setCustomMinutes(customInputMinutes);
      setIsEditingMinutes(false);
    }
  };

  const handleLogAndContinue = () => {
    const elapsedMinutes = Math.max(1, Math.round((duration - timeLeft) / 60) || Math.round(duration / 60));
    if (currentGoal) {
      logStudySession({
        goalId: currentGoal.id,
        goalTitle: currentGoal.title,
        goalType: currentGoal.type,
        date: new Date().toISOString(),
        durationMinutes: elapsedMinutes,
        notes: `Completed ${elapsedMinutes}-minute focused session on ${currentGoal.title}`,
      });
    }
    setSessionCompletedPrompt(false);
    switchMode('short_break');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden text-center text-slate-800 dark:text-slate-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div
              className="p-2 rounded-xl text-white shadow-sm"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Timer className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                Focus Pomodoro Timer
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Deep study sprints & structured breaks
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsPomodoroOpen(false)}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Close modal (timer keeps running in background!)"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Background Running Notice */}
          <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-[11px] flex items-center justify-center gap-2 font-medium">
            <Sparkles className="h-3.5 w-3.5 shrink-0 text-indigo-500" />
            <span>Runs continuously in the background even if you close this window!</span>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            {(['focus', 'short_break', 'long_break'] as TimerMode[]).map((tabMode) => {
              const isActive = mode === tabMode;
              const label =
                tabMode === 'focus'
                  ? 'Focus'
                  : tabMode === 'short_break'
                  ? 'Short Break'
                  : 'Long Break';

              return (
                <button
                  key={tabMode}
                  onClick={() => {
                    switchMode(tabMode);
                    setIsEditingMinutes(false);
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Topic Assignment */}
          {goals.length > 0 && (
            <div className="text-left text-xs">
              <label className="block text-slate-600 dark:text-slate-400 mb-1 font-bold">
                Focusing on topic:
              </label>
              <select
                value={targetGoalId}
                onChange={(e) => setTargetGoalId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs text-xs font-medium"
              >
                {goals.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.title} ({g.type.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Circular Countdown Display with Interactive Click-to-Edit */}
          <div className="relative w-52 h-52 mx-auto flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-200 dark:text-slate-800/80"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="currentColor"
                strokeWidth="5"
                strokeDasharray="276.46"
                strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
                strokeLinecap="round"
                className="transition-all duration-300"
                style={{ color: currentTheme.primary }}
                fill="none"
              />
            </svg>

            {/* Center Content: Editable Timer */}
            <div className="absolute flex flex-col items-center justify-center">
              {isEditingMinutes ? (
                <form onSubmit={handleSaveCustomMinutes} className="flex flex-col items-center gap-1.5">
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min={1}
                      max={180}
                      value={customInputMinutes}
                      onChange={(e) => setCustomInputMinutes(parseInt(e.target.value) || 1)}
                      className="w-20 px-2 py-1 text-2xl font-bold font-mono text-center bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500 rounded-xl text-slate-900 dark:text-white focus:outline-none"
                      autoFocus
                    />
                    <span className="text-xs font-bold text-slate-400">min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="submit"
                      className="p-1 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-xs"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Set</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingMinutes(false)}
                      className="p-1 px-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div
                  className="cursor-pointer group flex flex-col items-center select-none"
                  onClick={() => setIsEditingMinutes(true)}
                  title="Click to edit duration"
                >
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight group-hover:text-indigo-500 transition-colors">
                    {formattedTime}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 group-hover:text-indigo-500 mt-1 transition-colors">
                    <Edit2 className="h-3 w-3" />
                    <span>Click to edit</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Preset Chips & Duration Adjusters */}
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              {[15, 25, 30, 45, 60].map((mins) => {
                const isCurrent = Math.round(duration / 60) === mins;
                return (
                  <button
                    key={mins}
                    onClick={() => {
                      setCustomMinutes(mins);
                      setIsEditingMinutes(false);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {mins}m
                  </button>
                );
              })}

              <div className="w-[1px] h-4 bg-slate-200 dark:bg-slate-800 mx-1" />

              {/* Adjust +/- 5 min buttons */}
              <button
                onClick={() => adjustSeconds(-300)}
                className="p-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                title="Decrease 5 minutes"
              >
                -5m
              </button>
              <button
                onClick={() => adjustSeconds(300)}
                className="p-1 px-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold"
                title="Add 5 minutes"
              >
                +5m
              </button>
            </div>
          </div>

          {/* Session Complete Notice */}
          {sessionCompletedPrompt && (
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2 text-xs animate-in zoom-in-95 shadow-sm">
              <p className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center justify-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                Session Complete! Great Focus!
              </p>
              <button
                onClick={handleLogAndContinue}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-md transition-all"
              >
                Log {Math.round(duration / 60)} Mins to {currentGoal?.title || 'Track'}
              </button>
            </div>
          )}

          {/* Action Buttons: Reset & Start/Pause */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={resetTimer}
              className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-2xs"
              title="Reset Timer"
            >
              <RotateCcw className="h-5 w-5" />
            </button>

            <button
              onClick={isRunning ? pauseTimer : startTimer}
              className="px-8 py-3.5 rounded-2xl text-white font-extrabold flex items-center gap-2 shadow-lg transition-all hover:scale-105 active:scale-95 text-sm"
              style={{ backgroundColor: currentTheme.primary }}
            >
              {isRunning ? (
                <>
                  <Pause className="h-5 w-5 fill-current" />
                  <span>Pause Timer</span>
                </>
              ) : (
                <>
                  <Play className="h-5 w-5 fill-current" />
                  <span>Start {mode === 'focus' ? 'Focus' : 'Break'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
