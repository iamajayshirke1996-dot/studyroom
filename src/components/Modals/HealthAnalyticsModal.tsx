import React, { useState } from 'react';
import {
  X,
  Footprints,
  Flame,
  MapPin,
  Clock,
  Heart,
  TrendingUp,
  Award,
  Calendar,
  Watch,
  Plus,
  Edit2,
  Check,
  Brain,
  Sparkles,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { DailySteps } from '../../types';

export const HealthAnalyticsModal: React.FC = () => {
  const {
    isHealthDashboardOpen,
    setIsHealthDashboardOpen,
    stepHistory,
    dailySteps,
    logPastSteps,
    stats,
    setIsWatchSyncModalOpen,
  } = useStudy();

  const { currentTheme } = useTheme();

  const [editingDate, setEditingDate] = useState<string | null>(null);
  const [editStepValue, setEditStepValue] = useState<number>(0);

  if (!isHealthDashboardOpen) return null;

  // Sort history by date descending (today first)
  const historyArray: DailySteps[] = Object.values(stepHistory).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Last 7 days for the chart (chronological: oldest to newest)
  const last7Days: DailySteps[] = historyArray.slice(0, 7).reverse();

  // Metrics calculations
  const totalSteps7Days = last7Days.reduce((acc, curr) => acc + curr.steps, 0);
  const avgSteps7Days = last7Days.length > 0 ? Math.round(totalSteps7Days / last7Days.length) : 0;
  const totalDistance7Days = Math.round(
    last7Days.reduce((acc, curr) => acc + (curr.distanceKm || curr.steps * 0.00076), 0) * 10
  ) / 10;
  const totalCalories7Days = Math.round(
    last7Days.reduce((acc, curr) => acc + (curr.caloriesBurned || curr.steps * 0.04), 0)
  );
  const daysGoalAchieved = last7Days.filter((d) => d.steps >= (d.goal || 8000)).length;

  const maxStepsIn7Days = Math.max(10000, ...last7Days.map((d) => d.steps));

  const handleSaveEdit = (date: string) => {
    logPastSteps(date, editStepValue, 8000, 'apple_health');
    setEditingDate(null);
  };

  const formatDateLabel = (dateStr: string) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (dateStr === todayStr) return 'Today';
    if (dateStr === yesterdayStr) return 'Yesterday';

    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const getDayName = (dateStr: string) => {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 flex flex-col my-8">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-2xl text-white shadow-md"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Footprints className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Daily Physical Health & Step Activity
                </h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center gap-1">
                  <Heart className="h-3 w-3 fill-current text-rose-500" />
                  <span>Apple Health</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Continuous daily monitoring • Realme Watch ➔ Apple Health sync
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsHealthDashboardOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[75vh]">
          {/* Key 7-Day Performance Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <TrendingUp className="h-3.5 w-3.5 text-blue-500" /> 7-Day Avg
              </span>
              <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                {avgSteps7Days.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">steps / day</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5 text-indigo-500" /> Distance
              </span>
              <p className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white">
                {totalDistance7Days}
              </p>
              <span className="text-[11px] text-slate-500">km walked</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-500" /> Calories
              </span>
              <p className="text-2xl font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {totalCalories7Days.toLocaleString()}
              </p>
              <span className="text-[11px] text-slate-500">kcal burned</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 space-y-1">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-emerald-500" /> Goal Target
              </span>
              <p className="text-2xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {daysGoalAchieved}/7
              </p>
              <span className="text-[11px] text-slate-500">days achieved</span>
            </div>
          </div>

          {/* 7-Day Activity Bar Chart */}
          <div className="p-5 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Weekly Step Activity Trends</span>
                  <span className="text-[11px] text-slate-400 font-normal">
                    (Target: 8,000 steps)
                  </span>
                </h3>
              </div>
              <span className="text-xs font-mono font-bold text-slate-500">Last 7 Days</span>
            </div>

            {/* Visual Bar Chart */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-slate-200 dark:border-slate-800">
              {last7Days.map((day) => {
                const heightPercent = Math.min(100, Math.round((day.steps / maxStepsIn7Days) * 100));
                const isGoalMet = day.steps >= (day.goal || 8000);
                const isToday = day.date === new Date().toISOString().slice(0, 10);

                return (
                  <div key={day.date} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 dark:bg-slate-800 text-white px-2 py-1 rounded-lg text-[10px] font-mono pointer-events-none whitespace-nowrap shadow-lg z-20">
                      {day.steps.toLocaleString()} steps ({day.distanceKm || Math.round(day.steps * 0.00076 * 10) / 10} km)
                    </div>

                    {/* Bar */}
                    <div className="w-full max-w-[36px] bg-slate-200 dark:bg-slate-800 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                      <div
                        className={`w-full rounded-t-xl transition-all duration-500 ${
                          isGoalMet
                            ? 'bg-emerald-500 group-hover:bg-emerald-400'
                            : isToday
                            ? 'bg-rose-500 group-hover:bg-rose-400'
                            : 'bg-indigo-500 group-hover:bg-indigo-400'
                        }`}
                        style={{ height: `${Math.max(10, heightPercent)}%` }}
                      />
                    </div>

                    {/* Day label */}
                    <div className="mt-2 text-center">
                      <span
                        className={`text-xs font-bold block ${
                          isToday
                            ? 'text-rose-600 dark:text-rose-400 underline underline-offset-2'
                            : 'text-slate-500 dark:text-slate-400'
                        }`}
                      >
                        {getDayName(day.date)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 block">
                        {(day.steps / 1000).toFixed(1)}k
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 inline-block" /> Goal Reached (≥8k)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 inline-block" /> Today
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Higher steps promote better cognitive retention</span>
            </div>
          </div>

          {/* Study & Stamina Correlation Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 flex items-start gap-3">
            <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <h4 className="font-bold text-slate-900 dark:text-white">
                Mind & Body Balance Score: High Momentum
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You've logged <strong>{stats.totalHours}h</strong> of focused study time and maintained active physical movement. Taking 5-minute brisk walking breaks between coding modules increases oxygen to the prefrontal cortex, enhancing recursive reasoning and DSA problem solving.
              </p>
            </div>
          </div>

          {/* Day-by-Day Historical Log Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-500" />
                <span>Daily Steps History Log</span>
              </h3>
              <button
                onClick={() => {
                  setIsHealthDashboardOpen(false);
                  setIsWatchSyncModalOpen(true);
                }}
                className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Sync from Watch / Apple Health</span>
              </button>
            </div>

            <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold">
                  <tr>
                    <th className="p-3">Date</th>
                    <th className="p-3">Steps</th>
                    <th className="p-3">Distance & Burn</th>
                    <th className="p-3">Source</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {historyArray.map((record) => {
                    const isGoalMet = record.steps >= (record.goal || 8000);
                    const isEditing = editingDate === record.date;

                    return (
                      <tr key={record.date} className="hover:bg-slate-50/60 dark:hover:bg-slate-900/40">
                        <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">
                          {formatDateLabel(record.date)}
                        </td>

                        <td className="p-3 font-mono">
                          {isEditing ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={editStepValue}
                                onChange={(e) => setEditStepValue(parseInt(e.target.value) || 0)}
                                className="w-24 px-2 py-0.5 rounded-lg border border-rose-500 bg-white dark:bg-slate-900 font-bold"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(record.date)}
                                className="p-1 rounded-md bg-rose-600 text-white font-bold"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button
                                onClick={() => setEditingDate(null)}
                                className="p-1 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <span
                              className={`font-extrabold text-sm ${
                                isGoalMet ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-white'
                              }`}
                            >
                              {record.steps.toLocaleString()}
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-slate-500 dark:text-slate-400 font-mono">
                          {record.distanceKm || Math.round(record.steps * 0.00076 * 10) / 10} km •{' '}
                          {record.caloriesBurned || Math.round(record.steps * 0.04)} kcal
                        </td>

                        <td className="p-3">
                          {record.source === 'apple_health' ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20 inline-flex items-center gap-1">
                              <Heart className="h-2.5 w-2.5 fill-current" />
                              <span>Apple Health</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                              {record.deviceName || 'Realme Watch'}
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setEditingDate(record.date);
                              setEditStepValue(record.steps);
                            }}
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            title="Edit Steps"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/70 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Automatically synced with your Cloud Firestore profile
          </span>
          <button
            onClick={() => setIsHealthDashboardOpen(false)}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
