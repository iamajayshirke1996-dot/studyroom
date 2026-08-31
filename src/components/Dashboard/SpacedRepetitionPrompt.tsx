import React from 'react';
import { Brain, Sparkles, ArrowRight, CheckCheck, Clock } from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { LearningGoal } from '../../types';

export const SpacedRepetitionPrompt: React.FC = () => {
  const { goals, setSelectedSummaryGoal, recordTopicReview, setActiveTab } = useStudy();

  const now = new Date();
  const candidates: { goal: LearningGoal; daysSinceReview: number }[] = [];

  goals.forEach((g) => {
    if (g.summary && g.summary.keyTakeaways && g.summary.keyTakeaways.length > 0) {
      const refDate = g.summary.lastReviewedAt ? new Date(g.summary.lastReviewedAt) : new Date(g.updatedAt);
      const days = Math.floor((now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
      candidates.push({ goal: g, daysSinceReview: days });
    }
  });

  candidates.sort((a, b) => b.daysSinceReview - a.daysSinceReview);
  const featured = candidates[0];

  if (!featured) return null;

  return (
    <div className="rounded-3xl p-5 bg-gradient-to-r from-purple-50 via-indigo-50/50 to-white dark:from-purple-950/70 dark:via-indigo-950/60 dark:to-slate-900 border border-purple-200 dark:border-purple-500/30 relative overflow-hidden shadow-sm dark:shadow-xl mb-6">
      <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-44 h-44 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 shrink-0">
            <Brain className="h-6 w-6" />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                Spaced Repetition & Retention
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Studied {featured.daysSinceReview > 0 ? `${featured.daysSinceReview} days ago` : 'recently'}
              </span>
            </div>

            <h4 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Ready to refresh: <span className="text-purple-600 dark:text-purple-300">{featured.goal.title}</span>?
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              "After a few weeks, retention drops without recall." Check your saved takeaways ({featured.goal.summary.keyTakeaways.length} key concepts, gotchas & code snippets) in under 2 minutes.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-end md:self-center">
          <button
            onClick={() => recordTopicReview(featured.goal.id)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            title="Mark as reviewed today"
          >
            <CheckCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>Mark Reviewed</span>
          </button>

          <button
            onClick={() => setSelectedSummaryGoal(featured.goal)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all hover:scale-[1.02]"
          >
            <span>Review Summary</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1 underline transition-colors"
          >
            All Summaries
          </button>
        </div>
      </div>
    </div>
  );
};
