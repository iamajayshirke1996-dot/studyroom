import React from 'react';
import { Target, ArrowRight, Flame, Briefcase } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const MaangDashboardWidget: React.FC = () => {
  const { maangWeeks, setActiveTab } = useStudy();

  const activeWeek = maangWeeks.find((w) => w.status === 'in_progress') || maangWeeks[0];

  const totalWeeks = maangWeeks.length;
  const completedWeeks = maangWeeks.filter((w) => w.status === 'completed').length;

  let totalDeliverables = 0;
  let completedDeliverables = 0;
  maangWeeks.forEach((w) => {
    w.deliverables.forEach((d) => {
      totalDeliverables++;
      if (d.completed) completedDeliverables++;
    });
    if (w.weeklyReviewCheck) {
      totalDeliverables++;
      if (w.weeklyReviewCompleted) completedDeliverables++;
    }
  });
  const deliverablePercent = totalDeliverables > 0 ? Math.round((completedDeliverables / totalDeliverables) * 100) : 0;

  return (
    <div className="rounded-3xl p-6 bg-gradient-to-r from-indigo-50/90 via-purple-50/70 to-white dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 border border-indigo-200 dark:border-indigo-500/30 relative overflow-hidden shadow-sm dark:shadow-xl mb-6 transition-all">
      <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Info */}
        <div className="space-y-2.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 flex items-center gap-1 shadow-sm">
              <Flame className="h-3.5 w-3.5 fill-current" />
              MAANG 3-Month Focused Sprint
            </span>

            <span className="text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-semibold">
              {activeWeek.phaseTitle}
            </span>

            <span className="text-xs text-slate-500 dark:text-slate-400">
              Week {activeWeek.weekNumber} of 12 ({activeWeek.dateRange})
            </span>
          </div>

          <div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Active Focus: <span className="text-indigo-600 dark:text-indigo-300">Week {activeWeek.weekNumber} — {activeWeek.dateRange}</span>
            </h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 line-clamp-1">
              <strong>JS Focus:</strong> {activeWeek.jsSystemDesignFocus}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
              <strong>DSA Focus:</strong> {activeWeek.dsaMasteryFocus}
            </p>
          </div>

          {/* Today's 9-to-5 Timetable Pill */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white/90 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <Briefcase className="h-4 w-4 text-amber-500 shrink-0" />
            <span className="text-amber-600 dark:text-amber-300 font-bold shrink-0">Daily Schedule:</span>
            <span className="truncate">{activeWeek.workerTimetable.weekday}</span>
          </div>
        </div>

        {/* Right: Metrics & CTA */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3 text-center">
            <div className="bg-white/90 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Sprint Weeks</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">
                {completedWeeks} <span className="text-xs text-slate-400 font-normal">/ 12</span>
              </span>
            </div>

            <div className="bg-white/90 dark:bg-slate-950/60 p-3 rounded-2xl border border-slate-200 dark:border-slate-800/80 shadow-sm">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-0.5 font-medium">Deliverables</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                {completedDeliverables} <span className="text-xs text-slate-400 font-normal">/ {totalDeliverables} ({deliverablePercent}%)</span>
              </span>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('maang')}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <Target className="h-4 w-4" />
            <span>Open 12-Week MAANG Plan</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
