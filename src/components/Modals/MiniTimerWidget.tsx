import React from 'react';
import { Play, Pause, Maximize2, Timer } from 'lucide-react';
import { useTimer } from '../../context/TimerContext';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';

export const MiniTimerWidget: React.FC = () => {
  const {
    isRunning,
    formattedTime,
    mode,
    pauseTimer,
    startTimer,
    progressPercent,
  } = useTimer();

  const { isPomodoroOpen, setIsPomodoroOpen } = useStudy();
  const { currentTheme } = useTheme();

  // Only show floating mini player if timer is active/running and the full modal is closed
  if (!isRunning || isPomodoroOpen) return null;

  return (
    <aside
      aria-label="Background focus timer"
      className="fixed bottom-6 right-6 z-40 animate-in fade-in slide-in-from-bottom-4 duration-200"
    >
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-2.5 flex items-center gap-3 pr-3 text-xs">
        {/* Pulsing icon */}
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center text-white shrink-0 shadow-sm"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Timer className="h-4 w-4 animate-pulse" />
        </div>

        {/* Time display & mode */}
        <div className="cursor-pointer" onClick={() => setIsPomodoroOpen(true)}>
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-sm font-mono text-slate-900 dark:text-white tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400">
              {mode === 'focus' ? 'Focus' : 'Break'}
            </span>
          </div>
          <div className="w-20 bg-slate-100 dark:bg-slate-800 h-1 rounded-full overflow-hidden mt-1">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: currentTheme.primary,
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={isRunning ? pauseTimer : startTimer}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={isRunning ? 'Pause Timer' : 'Resume Timer'}
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setIsPomodoroOpen(true)}
            className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Expand Full Timer"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
