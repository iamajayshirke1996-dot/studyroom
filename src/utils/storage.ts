import { LearningGoal, StudySession, MaangWeek, DailySteps } from '../types';
import { INITIAL_GOALS, INITIAL_STUDY_SESSIONS } from './initialData';
import { INITIAL_MAANG_WEEKS } from './maangData';

const GOALS_STORAGE_KEY = 'studypulse_goals_v2';
const SESSIONS_STORAGE_KEY = 'studypulse_sessions_v2';
const MAANG_STORAGE_KEY = 'studypulse_maang_weeks_v2';
const STEPS_STORAGE_KEY = 'studypulse_steps_v1';
const STEP_HISTORY_STORAGE_KEY = 'studypulse_step_history_v1';

export function loadGoalsFromStorage(): LearningGoal[] {
  try {
    const raw = localStorage.getItem(GOALS_STORAGE_KEY);
    if (!raw) return INITIAL_GOALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_GOALS;
  } catch (err) {
    console.error('Failed to parse goals from storage:', err);
    return INITIAL_GOALS;
  }
}

export function saveGoalsToStorage(goals: LearningGoal[]): void {
  try {
    localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(goals));
  } catch (err) {
    console.error('Failed to save goals to storage:', err);
  }
}

export function loadSessionsFromStorage(): StudySession[] {
  try {
    const raw = localStorage.getItem(SESSIONS_STORAGE_KEY);
    if (!raw) return INITIAL_STUDY_SESSIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_STUDY_SESSIONS;
  } catch (err) {
    console.error('Failed to parse sessions from storage:', err);
    return INITIAL_STUDY_SESSIONS;
  }
}

export function saveSessionsToStorage(sessions: StudySession[]): void {
  try {
    localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (err) {
    console.error('Failed to save sessions to storage:', err);
  }
}

export function loadMaangWeeksFromStorage(): MaangWeek[] {
  try {
    const raw = localStorage.getItem(MAANG_STORAGE_KEY);
    if (!raw) return INITIAL_MAANG_WEEKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_MAANG_WEEKS;
  } catch (err) {
    console.error('Failed to parse MAANG weeks from storage:', err);
    return INITIAL_MAANG_WEEKS;
  }
}

export function saveMaangWeeksToStorage(weeks: MaangWeek[]): void {
  try {
    localStorage.setItem(MAANG_STORAGE_KEY, JSON.stringify(weeks));
  } catch (err) {
    console.error('Failed to save MAANG weeks to storage:', err);
  }
}

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function loadDailyStepsFromStorage(): DailySteps {
  const todayStr = getLocalDateString();
  try {
    const raw = localStorage.getItem(STEPS_STORAGE_KEY);
    if (!raw) {
      return { date: todayStr, steps: 0, goal: 8000, source: 'apple_health', deviceName: 'Apple Health (Realme Watch)', distanceKm: 0, caloriesBurned: 0, activeMinutes: 0 };
    }
    const parsed = JSON.parse(raw);
    if (parsed.date !== todayStr) {
      // Archive previous day's steps into step history if they had steps
      if (parsed.date && parsed.steps > 0) {
        try {
          const history = loadStepHistoryFromStorage();
          history[parsed.date] = {
            ...parsed,
            distanceKm: Math.round(parsed.steps * 0.00076 * 100) / 100,
            caloriesBurned: Math.round(parsed.steps * 0.04),
            activeMinutes: Math.round(parsed.steps / 100),
          };
          saveStepHistoryToStorage(history);
        } catch (e) {
          console.warn('Auto archive previous day failed:', e);
        }
      }
      // New day starts fresh at 0!
      const freshDay: DailySteps = {
        date: todayStr,
        steps: 0,
        goal: parsed.goal || 8000,
        source: 'apple_health',
        deviceName: 'Apple Health (Realme Watch)',
        distanceKm: 0,
        caloriesBurned: 0,
        activeMinutes: 0,
      };
      saveDailyStepsToStorage(freshDay);
      return freshDay;
    }
    return parsed;
  } catch {
    return { date: todayStr, steps: 0, goal: 8000, source: 'apple_health', deviceName: 'Apple Health (Realme Watch)', distanceKm: 0, caloriesBurned: 0, activeMinutes: 0 };
  }
}

export function saveDailyStepsToStorage(steps: DailySteps): void {
  try {
    localStorage.setItem(STEPS_STORAGE_KEY, JSON.stringify(steps));
  } catch (err) {
    console.error('Failed to save steps to storage:', err);
  }
}

export function getInitialStepHistory(): Record<string, DailySteps> {
  const result: Record<string, DailySteps> = {};
  const today = new Date();
  
  // Create last 7 days of realistic history
  // Day 0 is today (starts at 0 for new day), Day 1 is yesterday (Aug 30: 5149 steps)
  const stepSamples = [0, 5149, 7420, 8910, 6150, 9400, 7850];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const dateStr = getLocalDateString(d);
    const steps = stepSamples[i % stepSamples.length];
    result[dateStr] = {
      date: dateStr,
      steps,
      goal: 8000,
      source: i <= 1 ? 'apple_health' : 'realme_watch',
      deviceName: 'Apple Health (Realme Watch)',
      distanceKm: Math.round(steps * 0.00076 * 100) / 100,
      caloriesBurned: Math.round(steps * 0.04),
      activeMinutes: Math.round(steps / 100),
      lastSyncedAt: d.toISOString(),
    };
  }
  return result;
}

export function loadStepHistoryFromStorage(): Record<string, DailySteps> {
  try {
    const raw = localStorage.getItem(STEP_HISTORY_STORAGE_KEY);
    if (!raw) {
      const initial = getInitialStepHistory();
      saveStepHistoryToStorage(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : getInitialStepHistory();
  } catch {
    return getInitialStepHistory();
  }
}

export function saveStepHistoryToStorage(history: Record<string, DailySteps>): void {
  try {
    localStorage.setItem(STEP_HISTORY_STORAGE_KEY, JSON.stringify(history));
  } catch (err) {
    console.error('Failed to save step history to storage:', err);
  }
}

export function exportAppState(
  goals: LearningGoal[],
  sessions: StudySession[],
  maangWeeks: MaangWeek[]
): void {
  const data = {
    version: '2.0',
    exportDate: new Date().toISOString(),
    goals,
    sessions,
    maangWeeks,
  };
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `studypulse_maang_backup_${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importAppState(jsonStr: string): {
  goals: LearningGoal[];
  sessions: StudySession[];
  maangWeeks: MaangWeek[];
} {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || !Array.isArray(parsed.goals)) {
    throw new Error('Invalid backup file format');
  }
  return {
    goals: parsed.goals,
    sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
    maangWeeks: Array.isArray(parsed.maangWeeks) ? parsed.maangWeeks : INITIAL_MAANG_WEEKS,
  };
}
