import React from 'react';
import { Code2, CheckCircle2, ArrowRight } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';

export const DsaSummaryWidget: React.FC = () => {
  const { goals, stats, setActiveTab, setFilterOptions } = useStudy();

  const dsaGoals = goals.filter((g) => g.type === 'dsa');
  let totalDsaProblems = 0;
  let easyTotal = 0;
  let mediumTotal = 0;
  let hardTotal = 0;

  dsaGoals.forEach((g) => {
    g.dsaProblems?.forEach((p) => {
      totalDsaProblems++;
      if (p.difficulty === 'easy') easyTotal++;
      if (p.difficulty === 'medium') mediumTotal++;
      if (p.difficulty === 'hard') hardTotal++;
    });
  });

  const percentSolved = totalDsaProblems > 0 ? Math.round((stats.dsaSolvedTotal / totalDsaProblems) * 100) : 0;

  const navigateToDsa = () => {
    setFilterOptions((prev) => ({ ...prev, type: 'dsa' }));
    setActiveTab('topics');
  };

  return (
    <div className="glass-panel rounded-3xl p-6 relative overflow-hidden flex flex-col justify-between transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/25">
              <Code2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">DSA & Problem Solving</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">16 Core Patterns & Roadmaps</p>
            </div>
          </div>
          <button
            onClick={navigateToDsa}
            className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            <span>View All</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Progress Bar & Percentage */}
        <div className="space-y-2 mb-5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Total Solved</span>
            <span className="font-bold text-slate-900 dark:text-white">
              {stats.dsaSolvedTotal} / {totalDsaProblems}{' '}
              <span className="text-blue-600 dark:text-blue-400 font-medium">({percentSolved}%)</span>
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden flex">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${totalDsaProblems ? (stats.dsaEasySolved / totalDsaProblems) * 100 : 0}%` }}
              title={`Easy: ${stats.dsaEasySolved}`}
            />
            <div
              className="bg-amber-500 h-full transition-all duration-500"
              style={{ width: `${totalDsaProblems ? (stats.dsaMediumSolved / totalDsaProblems) * 100 : 0}%` }}
              title={`Medium: ${stats.dsaMediumSolved}`}
            />
            <div
              className="bg-rose-500 h-full transition-all duration-500"
              style={{ width: `${totalDsaProblems ? (stats.dsaHardSolved / totalDsaProblems) * 100 : 0}%` }}
              title={`Hard: ${stats.dsaHardSolved}`}
            />
          </div>
        </div>

        {/* Difficulty Breakdown Badges */}
        <div className="grid grid-cols-3 gap-2.5 mb-4">
          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 block mb-1">Easy</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.dsaEasySolved}
              <span className="text-xs text-slate-400 font-normal">/{easyTotal}</span>
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400 block mb-1">Medium</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.dsaMediumSolved}
              <span className="text-xs text-slate-400 font-normal">/{mediumTotal}</span>
            </span>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 text-center">
            <span className="text-[11px] font-bold text-rose-600 dark:text-rose-400 block mb-1">Hard</span>
            <span className="text-lg font-bold text-slate-900 dark:text-white">
              {stats.dsaHardSolved}
              <span className="text-xs text-slate-400 font-normal">/{hardTotal}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Active Pattern Groups */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">Active Topic Tracks:</p>
        <div className="space-y-1.5">
          {dsaGoals.slice(0, 2).map((dg) => {
            const solved = dg.dsaProblems?.filter((p) => p.solved).length || 0;
            const total = dg.dsaProblems?.length || 0;
            return (
              <div
                key={dg.id}
                onClick={navigateToDsa}
                className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-800 cursor-pointer transition-colors"
              >
                <span className="text-slate-800 dark:text-slate-200 truncate max-w-[200px] font-medium">
                  {dg.title}
                </span>
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  {solved}/{total}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
