import React from 'react';
import {
  Footprints,
  Flame,
  MapPin,
  Clock,
  Watch,
  Plus,
  Sparkles,
  ChevronRight,
  ShieldAlert,
  CheckCircle2,
  Heart,
  Edit2,
  Check,
  X,
  TrendingUp,
  BarChart2,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { calculateStepMetrics } from '../../services/realmeWatchSync';

export const StepsTrackerWidget: React.FC = () => {
  const {
    dailySteps,
    stepHistory,
    updateDailySteps,
    setIsWatchSyncModalOpen,
    setIsHealthDashboardOpen,
  } = useStudy();
  const { currentTheme } = useTheme();

  const [isEditingInline, setIsEditingInline] = React.useState(false);
  const [inlineStepValue, setInlineStepValue] = React.useState(dailySteps.steps);

  React.useEffect(() => {
    setInlineStepValue(dailySteps.steps);
  }, [dailySteps.steps]);

  const handleInlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateDailySteps(inlineStepValue, 'apple_health', 'Apple Health (Realme Watch)');
    setIsEditingInline(false);
  };

  const metrics = calculateStepMetrics(dailySteps.steps);
  const percent = Math.min(100, Math.round((dailySteps.steps / (dailySteps.goal || 8000)) * 100));

  const last7Days = Object.values(stepHistory)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-7);

  return (
    <div className="glass-panel p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden space-y-4">
      {/* Widget Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shrink-0 shadow-xs">
            <Footprints className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white leading-tight">
                Steps & Health
              </h3>
              {dailySteps.source === 'apple_health' ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/25 shrink-0 whitespace-nowrap">
                  <Heart className="h-2.5 w-2.5 fill-current text-rose-500" />
                  <span>Apple Health</span>
                </span>
              ) : dailySteps.source ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shrink-0 whitespace-nowrap">
                  {dailySteps.deviceName || (dailySteps.source === 'realme_watch' ? 'realme Watch' : 'Manual')}
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 truncate">
              Daily pedometer & active study balance
            </p>
          </div>
        </div>

        {/* Action Buttons: Unified capsule */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shrink-0">
          <button
            onClick={() => setIsHealthDashboardOpen(true)}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all shadow-2xs"
            title="View 7-day trends & full health history"
          >
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </button>
          <button
            onClick={() => setIsWatchSyncModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 transition-all shadow-2xs"
            title="Sync with Realme Watch / Apple Health"
          >
            <Watch className="h-3.5 w-3.5 text-rose-500" />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* Hero Step Counter Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-rose-50/30 dark:from-slate-900 dark:via-slate-900/80 dark:to-rose-950/20 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        {/* Top: Large Step Count + Quick Action Steppers */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 block mb-1">
              TODAY'S STEPS
            </span>

            {isEditingInline ? (
              <form onSubmit={handleInlineSubmit} className="flex items-center gap-1.5">
                <input
                  type="number"
                  min={0}
                  max={100000}
                  value={inlineStepValue}
                  onChange={(e) => setInlineStepValue(parseInt(e.target.value) || 0)}
                  className="w-28 px-2.5 py-1 text-2xl font-black font-mono bg-white dark:bg-slate-950 border-2 border-rose-500 rounded-xl text-slate-900 dark:text-white focus:outline-none shadow-sm"
                  autoFocus
                />
                <button
                  type="submit"
                  className="p-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold shadow-xs"
                  title="Save Steps"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingInline(false)}
                  className="p-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700"
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </button>
              </form>
            ) : (
              <div
                className="flex items-baseline gap-2 cursor-pointer group select-none"
                onClick={() => {
                  setInlineStepValue(dailySteps.steps);
                  setIsEditingInline(true);
                }}
                title="Click to edit steps directly"
              >
                <span className="text-3xl sm:text-4xl font-black font-mono text-slate-900 dark:text-white tracking-tight group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                  {dailySteps.steps.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-slate-400">
                  / {dailySteps.goal.toLocaleString()}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-rose-500">
                  <Edit2 className="h-3 w-3" />
                </span>
              </div>
            )}
          </div>

          {/* Quick Increment Steppers */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200/80 dark:border-slate-700/60 shadow-2xs">
            <button
              onClick={() => updateDailySteps(dailySteps.steps + 500, dailySteps.source)}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Add 500 steps"
            >
              +500
            </button>
            <span className="w-px h-3 bg-slate-200 dark:bg-slate-700" />
            <button
              onClick={() => updateDailySteps(dailySteps.steps + 1000, dailySteps.source)}
              className="px-2 py-1 rounded-lg text-[11px] font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
              title="Add 1,000 steps"
            >
              +1,000
            </button>
          </div>
        </div>

        {/* Progress Bar & Goal Status */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              {percent >= 100 ? (
                <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Goal reached! Superb stamina
                </span>
              ) : (
                <span className="text-slate-500 dark:text-slate-400">
                  {Math.max(0, dailySteps.goal - dailySteps.steps).toLocaleString()} steps left to target
                </span>
              )}
            </span>
            <span className="font-mono font-extrabold text-slate-700 dark:text-slate-300">
              {percent}%
            </span>
          </div>

          {/* Smooth Gradient Progress Bar */}
          <div className="w-full h-2 rounded-full bg-slate-200/80 dark:bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percent >= 100
                  ? 'bg-emerald-500'
                  : 'bg-gradient-to-r from-rose-500 to-pink-500'
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Distance, Calories, Active Minutes */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1 mb-0.5">
            <MapPin className="h-3 w-3 text-blue-500" /> Distance
          </span>
          <span className="font-extrabold text-slate-900 dark:text-white font-mono">
            {metrics.distanceKm} km
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1 mb-0.5">
            <Flame className="h-3 w-3 text-amber-500" /> Burned
          </span>
          <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">
            {metrics.caloriesBurned} kcal
          </span>
        </div>

        <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80">
          <span className="text-[10px] font-semibold text-slate-400 flex items-center justify-center gap-1 mb-0.5">
            <Clock className="h-3 w-3 text-indigo-500" /> Active Walk
          </span>
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 font-mono">
            {metrics.activeWalkMinutes} min
          </span>
        </div>
      </div>

      {/* 7-Day Mini Sparkline Strip */}
      <div
        onClick={() => setIsHealthDashboardOpen(true)}
        className="p-3 rounded-2xl bg-slate-50/80 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors cursor-pointer group"
      >
        <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-400 mb-2">
          <span className="flex items-center gap-1.5 text-[11px]">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>7-Day Activity Monitor</span>
          </span>
          <span className="text-[10px] text-slate-400 group-hover:text-rose-500 flex items-center gap-0.5 transition-colors">
            <span>Full History & Trends</span>
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>

        <div className="flex items-end justify-between gap-1.5 h-10">
          {last7Days.map((day) => {
            const isToday = day.date === new Date().toISOString().slice(0, 10);
            const isGoalMet = day.steps >= (day.goal || 8000);
            const height = Math.min(100, Math.max(15, Math.round((day.steps / 10000) * 100)));
            const dName = new Date(day.date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'narrow' });

            return (
              <div
                key={day.date}
                className="flex-1 flex flex-col items-center gap-1 h-full justify-end"
                title={`${day.date}: ${day.steps.toLocaleString()} steps`}
              >
                <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-sm h-full flex flex-col justify-end overflow-hidden">
                  <div
                    className={`w-full rounded-sm transition-all ${
                      isGoalMet ? 'bg-emerald-500' : isToday ? 'bg-rose-500' : 'bg-indigo-400'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span
                  className={`text-[9px] font-mono ${
                    isToday ? 'font-bold text-rose-500' : 'text-slate-400'
                  }`}
                >
                  {dName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
