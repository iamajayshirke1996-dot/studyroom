import React, { useState } from 'react';
import {
  Flame,
  Target,
  Filter,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  Layers,
  Eye,
  RefreshCw,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { MaangWeekCard } from './MaangWeekCard';
import { GoogleSheetSyncModal } from './GoogleSheetSyncModal';

export const MaangRoadmapView: React.FC = () => {
  const { maangWeeks } = useStudy();
  const { currentTheme } = useTheme();

  const [phaseFilter, setPhaseFilter] = useState<'all' | 1 | 2 | 3>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'pending' | 'completed'>('all');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState(false);

  const totalWeeks = maangWeeks.length;
  const completedWeeks = maangWeeks.filter((w) => w.status === 'completed').length;
  const inProgressWeeks = maangWeeks.filter((w) => w.status === 'in_progress').length;

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

  const filteredWeeks = maangWeeks.filter((week) => {
    if (showActiveOnly && week.status !== 'in_progress') return false;
    if (phaseFilter !== 'all' && week.phase !== phaseFilter) return false;
    if (statusFilter !== 'all' && week.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6 pb-16 transition-colors">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-50/90 via-purple-50/80 to-slate-50 dark:from-slate-900 dark:via-indigo-950/60 dark:to-purple-950/50 p-6 sm:p-8 rounded-3xl border border-indigo-200 dark:border-indigo-500/30 relative overflow-hidden shadow-sm">
        <div className="space-y-2 relative z-10">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 flex items-center gap-1.5 shadow-md">
                <Flame className="h-3.5 w-3.5 fill-current" />
                12-Week MAANG Focused Curriculum
              </span>
              <span className="text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-500/15 px-2.5 py-0.5 rounded-full border border-indigo-500/30 font-semibold">
                Synchronized from Google Sheet
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsSyncModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:border-indigo-500/40 transition-colors shadow-2xs"
                title="Synchronize roadmap with live Google Sheet CSV"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Sync with Google Sheet</span>
              </button>

              <a
                href="https://docs.google.com/spreadsheets/d/1Y8Exf6lQTMw1jrabnn6k3EDUEoiqAAH_0bp_8iqWHoM/edit?gid=717153000#gid=717153000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-500/40 transition-colors shadow-2xs"
                title="Open the original Google Sheet roadmap in a new tab"
              >
                <span>Open Sheet</span>
                <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              </a>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Master Advanced JS, 16 DSA Patterns & System Design
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            A structured 3-month roadmap designed for working professionals. Covers deep V8/Event Loop internals, algorithmic patterns, live mock interviews, and system architecture case studies.
          </p>
        </div>

        {/* Top Progress Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800/80 relative z-10">
          <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Weeks Done</span>
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {completedWeeks} <span className="text-sm text-slate-400 font-normal">/ 12</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">In Progress</span>
            <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{inProgressWeeks}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Deliverables Done</span>
            <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
              {completedDeliverables} <span className="text-sm text-slate-400 font-normal">/ {totalDeliverables}</span>
            </span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/90 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 text-center shadow-sm">
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-0.5 font-bold">Overall Progress</span>
            <span className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{deliverablePercent}%</span>
          </div>
        </div>
      </div>

      {/* Filter & View Mode Controls */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => {
              setShowActiveOnly(false);
              setPhaseFilter('all');
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !showActiveOnly && phaseFilter === 'all'
                ? 'text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
            style={!showActiveOnly && phaseFilter === 'all' ? { backgroundColor: currentTheme.primary } : {}}
          >
            All 12 Weeks
          </button>

          <button
            onClick={() => {
              setShowActiveOnly(true);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              showActiveOnly
                ? 'bg-amber-500 text-slate-950 shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 border border-slate-200 dark:border-slate-800'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Active Week Only</span>
          </button>

          <button
            onClick={() => {
              setShowActiveOnly(false);
              setPhaseFilter(1);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !showActiveOnly && phaseFilter === 1
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Phase 1: Foundations (W1-W4)
          </button>

          <button
            onClick={() => {
              setShowActiveOnly(false);
              setPhaseFilter(2);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !showActiveOnly && phaseFilter === 2
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Phase 2: Scalable Systems (W5-W8)
          </button>

          <button
            onClick={() => {
              setShowActiveOnly(false);
              setPhaseFilter(3);
            }}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              !showActiveOnly && phaseFilter === 3
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Phase 3: Speed & Mocks (W9-W12)
          </button>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none shadow-sm"
          >
            <option value="all">All Statuses</option>
            <option value="in_progress">In Progress</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {/* Weeks List */}
      <div className="space-y-6">
        {filteredWeeks.map((week) => (
          <MaangWeekCard key={week.id} week={week} />
        ))}
      </div>

      {/* Google Sheet CSV Sync Modal */}
      <GoogleSheetSyncModal
        isOpen={isSyncModalOpen}
        onClose={() => setIsSyncModalOpen(false)}
      />
    </div>
  );
};
