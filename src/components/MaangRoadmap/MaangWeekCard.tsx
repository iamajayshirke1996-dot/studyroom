import React, { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Brain,
  Code2,
  CheckSquare,
  FileCheck2,
  Calendar,
} from 'lucide-react';
import { MaangWeek } from '../../types';
import { useStudy } from '../../context/StudyContext';

interface Props {
  week: MaangWeek;
}

export const MaangWeekCard: React.FC<Props> = ({ week }) => {
  const {
    toggleMaangDeliverable,
    toggleMaangReviewCheck,
    updateMaangWeekStatus,
    saveMaangNotes,
    setIsLogStudyOpen,
  } = useStudy();

  const [notesExpanded, setNotesExpanded] = useState(false);
  const [localNotes, setLocalNotes] = useState(week.notes || '');

  const totalItems = week.deliverables.length + 1; // deliverables + review check
  const completedItems = week.deliverables.filter((d) => d.completed).length + (week.weeklyReviewCompleted ? 1 : 0);
  const percentComplete = Math.round((completedItems / totalItems) * 100);

  const handleNotesBlur = () => {
    saveMaangNotes(week.id, localNotes);
  };

  return (
    <div
      className={`rounded-3xl p-6 border transition-all duration-200 shadow-sm ${
        week.status === 'completed'
          ? 'bg-slate-50/70 dark:bg-slate-900/40 border-emerald-300 dark:border-emerald-500/30'
          : week.status === 'in_progress'
          ? 'bg-white dark:bg-slate-900/90 border-indigo-400 dark:border-indigo-500/50 shadow-md ring-2 ring-indigo-400/20 dark:ring-indigo-500/20'
          : 'bg-white/80 dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
      }`}
    >
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-slate-800/80">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm ${
              week.status === 'completed'
                ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                : week.status === 'in_progress'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
            }`}
          >
            W{week.weekNumber}
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Week {week.weekNumber} <span className="text-slate-500 dark:text-slate-400 font-normal">({week.dateRange})</span>
              </h3>
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                Phase {week.phase}
              </span>
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-300 font-semibold">{week.phaseTitle}</p>
          </div>
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <select
            value={week.status}
            onChange={(e) => updateMaangWeekStatus(week.id, e.target.value as any)}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-colors cursor-pointer shadow-sm ${
              week.status === 'completed'
                ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                : week.status === 'in_progress'
                ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}
          >
            <option value="in_progress">➔ In Progress</option>
            <option value="pending">Pending</option>
            <option value="completed">✓ Completed</option>
          </select>
        </div>
      </div>

      {/* Main 2-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 py-5">
        {/* Left Column: Core Focus Areas */}
        <div className="space-y-4">
          {/* JavaScript & System Design Focus */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1.5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" />
              Advanced JS & System Design Focus
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {week.jsSystemDesignFocus}
            </p>
          </div>

          {/* DSA Mastery Focus */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-1.5 shadow-sm">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
              <Code2 className="h-3.5 w-3.5" />
              DSA Mastery & Algorithmic Patterns
            </span>
            <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {week.dsaMasteryFocus}
            </p>
          </div>
        </div>

        {/* Right Column: Deliverables & Weekly Check */}
        <div className="space-y-4">
          {/* Deliverables Checklist */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 space-y-2 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <CheckSquare className="h-3.5 w-3.5" />
                LeetCode Goals & Deliverables
              </span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                {completedItems}/{totalItems} items ({percentComplete}%)
              </span>
            </div>

            <div className="space-y-1.5">
              {week.deliverables.map((del) => (
                <div
                  key={del.id}
                  onClick={() => toggleMaangDeliverable(week.id, del.id)}
                  className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs cursor-pointer transition-all ${
                    del.completed
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-500/30 text-slate-500 dark:text-slate-400'
                      : 'bg-white dark:bg-slate-900/60 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm'
                  }`}
                >
                  <button className="text-slate-400 hover:text-emerald-500 shrink-0 mt-0.5">
                    {del.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    ) : (
                      <Circle className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                    )}
                  </button>
                  <span className={del.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'font-medium'}>
                    {del.text}
                  </span>
                </div>
              ))}

              {/* Weekly Review Check */}
              <div
                onClick={() => toggleMaangReviewCheck(week.id)}
                className={`p-2.5 rounded-xl border flex items-start gap-2.5 text-xs cursor-pointer transition-all ${
                  week.weeklyReviewCompleted
                    ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-500/30 text-slate-500 dark:text-slate-400'
                    : 'bg-purple-500/10 dark:bg-purple-950/10 border-purple-300 dark:border-purple-500/20 hover:border-purple-400 dark:hover:border-purple-500/40 text-purple-900 dark:text-purple-200 shadow-sm'
                }`}
              >
                <button className="text-purple-600 dark:text-purple-400 hover:text-purple-700 shrink-0 mt-0.5">
                  {week.weeklyReviewCompleted ? (
                    <CheckCircle2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  ) : (
                    <FileCheck2 className="h-4 w-4 text-purple-500 dark:text-purple-400/70" />
                  )}
                </button>
                <div>
                  <span className="text-[10px] font-bold text-purple-700 dark:text-purple-400 block uppercase">
                    Weekly Review Milestone Check:
                  </span>
                  <span className={week.weeklyReviewCompleted ? 'line-through text-slate-400 dark:text-slate-500' : 'font-medium'}>
                    {week.weeklyReviewCheck}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 9-to-5 Timetable Strip */}
      <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/90 border border-slate-200 dark:border-slate-800/80 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-2 text-amber-700 dark:text-amber-300 text-xs font-bold">
          <Briefcase className="h-3.5 w-3.5" />
          <span>9-to-5 Working Professional Timetable</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Mon – Fri</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{week.workerTimetable.weekday}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Saturday</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{week.workerTimetable.saturday}</span>
          </div>
          <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 shadow-sm">
            <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 block mb-0.5">Sunday</span>
            <span className="text-slate-800 dark:text-slate-200 font-medium">{week.workerTimetable.sunday}</span>
          </div>
        </div>
      </div>

      {/* Bottom Notes & Action Footer */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => setNotesExpanded(!notesExpanded)}
          className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 flex items-center gap-1 font-semibold"
        >
          {notesExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          <span>{notesExpanded ? 'Hide Notes' : week.notes ? 'View Week Notes & Reflections' : '+ Add Notes / Mistakes Log'}</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLogStudyOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30 text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Clock className="h-3.5 w-3.5" />
            <span>Log Study Time</span>
          </button>
        </div>
      </div>

      {/* Expanded Notes Form */}
      {notesExpanded && (
        <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-800/60 animate-in fade-in duration-150">
          <textarea
            rows={3}
            placeholder="Write your reflections, problems you struggled with, or concepts to remember for this week..."
            value={localNotes}
            onChange={(e) => setLocalNotes(e.target.value)}
            onBlur={handleNotesBlur}
            className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1">Notes are automatically saved when you click away.</p>
        </div>
      )}
    </div>
  );
};
