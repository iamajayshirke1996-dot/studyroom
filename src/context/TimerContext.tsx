import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

export type TimerMode = 'focus' | 'short_break' | 'long_break';

export const DEFAULT_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  short_break: 5 * 60,
  long_break: 15 * 60,
};

interface ModeState {
  timeLeft: number;
  duration: number;
}

export interface TimerContextType {
  mode: TimerMode;
  timeLeft: number;
  duration: number;
  isRunning: boolean;
  targetGoalId: string;
  sessionCompletedPrompt: boolean;
  formattedTime: string;
  progressPercent: number;
  startTimer: () => void;
  pauseTimer: () => void;
  resetTimer: () => void;
  switchMode: (mode: TimerMode, force?: boolean) => void;
  setCustomMinutes: (minutes: number) => void;
  adjustSeconds: (deltaSeconds: number) => void;
  setTargetGoalId: (id: string) => void;
  setSessionCompletedPrompt: (show: boolean) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<TimerMode>('focus');

  // Independent state per mode so switching NEVER resets your work!
  const [modeStates, setModeStates] = useState<Record<TimerMode, ModeState>>({
    focus: { timeLeft: DEFAULT_DURATIONS.focus, duration: DEFAULT_DURATIONS.focus },
    short_break: { timeLeft: DEFAULT_DURATIONS.short_break, duration: DEFAULT_DURATIONS.short_break },
    long_break: { timeLeft: DEFAULT_DURATIONS.long_break, duration: DEFAULT_DURATIONS.long_break },
  });

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [targetGoalId, setTargetGoalId] = useState<string>('');
  const [sessionCompletedPrompt, setSessionCompletedPrompt] = useState<boolean>(false);

  const targetEndTimeRef = useRef<number | null>(null);

  const currentModeState = modeStates[mode];
  const timeLeft = currentModeState.timeLeft;
  const duration = currentModeState.duration;

  // Web Audio chime helper
  const playChime = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 1.2);

      osc.start();
      setTimeout(() => {
        osc.stop();
        audioCtx.close().catch(() => {});
      }, 1300);
    } catch {
      // Audio context blocked or unavailable
    }
  };

  // Background timer engine with timestamp sync (immune to tab sleep)
  useEffect(() => {
    let interval: any = null;

    if (isRunning) {
      if (!targetEndTimeRef.current) {
        targetEndTimeRef.current = Date.now() + timeLeft * 1000;
      }

      interval = setInterval(() => {
        if (!targetEndTimeRef.current) return;
        const now = Date.now();
        const diff = Math.ceil((targetEndTimeRef.current - now) / 1000);

        if (diff <= 0) {
          // Timer finished
          setIsRunning(false);
          targetEndTimeRef.current = null;
          setModeStates((prev) => ({
            ...prev,
            [mode]: { ...prev[mode], timeLeft: 0 },
          }));
          playChime();
          confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
          if (mode === 'focus') {
            setSessionCompletedPrompt(true);
          }
        } else {
          setModeStates((prev) => ({
            ...prev,
            [mode]: { ...prev[mode], timeLeft: diff },
          }));
        }
      }, 500);
    } else {
      targetEndTimeRef.current = null;
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, mode, timeLeft]);

  // Update browser tab document title with live remaining focus time
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const m = Math.floor(timeLeft / 60);
      const s = timeLeft % 60;
      const formatted = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
      document.title = `(${formatted}) ${mode === 'focus' ? 'Focus' : 'Break'} • StudyPulse`;
    } else {
      document.title = 'StudyPulse - Personal Study Room';
    }
  }, [isRunning, timeLeft, mode]);

  const startTimer = () => {
    if (timeLeft <= 0) {
      const resetTime = duration;
      setModeStates((prev) => ({
        ...prev,
        [mode]: { ...prev[mode], timeLeft: resetTime },
      }));
      targetEndTimeRef.current = Date.now() + resetTime * 1000;
    } else {
      targetEndTimeRef.current = Date.now() + timeLeft * 1000;
    }
    setIsRunning(true);
  };

  const pauseTimer = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
  };

  // Explicit reset only
  const resetTimer = () => {
    setIsRunning(false);
    targetEndTimeRef.current = null;
    setModeStates((prev) => ({
      ...prev,
      [mode]: { ...prev[mode], timeLeft: prev[mode].duration },
    }));
    setSessionCompletedPrompt(false);
  };

  // Safe mode switch: prompts if running and NEVER destroys progress
  const switchMode = (newMode: TimerMode, force: boolean = false) => {
    if (newMode === mode) return;

    if (isRunning && !force) {
      const minutesLeft = Math.floor(timeLeft / 60);
      const secondsLeft = timeLeft % 60;
      const timeStr = `${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`;
      const modeLabel = mode === 'focus' ? 'Focus' : 'Break';
      const targetLabel = newMode === 'focus' ? 'Focus' : newMode === 'short_break' ? 'Short Break' : 'Long Break';

      const confirmed = window.confirm(
        `A ${modeLabel} session is currently running with ${timeStr} left.\n\nSwitch to ${targetLabel}? Your current timer will be safely paused without resetting.`
      );
      if (!confirmed) return;
    }

    setIsRunning(false);
    targetEndTimeRef.current = null;
    setMode(newMode);
    setSessionCompletedPrompt(false);
  };

  // Editable custom minutes (e.g. 15, 30, 45, 60, or any typed number)
  const setCustomMinutes = (minutes: number) => {
    const validMinutes = Math.max(1, Math.min(180, Math.round(minutes)));
    const newSeconds = validMinutes * 60;
    setModeStates((prev) => ({
      ...prev,
      [mode]: { duration: newSeconds, timeLeft: newSeconds },
    }));
    if (isRunning) {
      targetEndTimeRef.current = Date.now() + newSeconds * 1000;
    }
  };

  // Incremental adjust (+5m, -5m)
  const adjustSeconds = (deltaSeconds: number) => {
    setModeStates((prev) => {
      const current = prev[mode];
      const updated = Math.max(60, current.timeLeft + deltaSeconds);
      return {
        ...prev,
        [mode]: {
          timeLeft: updated,
          duration: Math.max(updated, current.duration),
        },
      };
    });
    if (isRunning) {
      const updated = Math.max(60, timeLeft + deltaSeconds);
      targetEndTimeRef.current = Date.now() + updated * 1000;
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const progressPercent = duration > 0 ? Math.min(100, Math.max(0, ((duration - timeLeft) / duration) * 100)) : 0;

  return (
    <TimerContext.Provider
      value={{
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
      }}
    >
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};
