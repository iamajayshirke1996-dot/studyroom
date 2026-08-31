import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  Star,
  CheckCircle2,
  Clock,
  Code,
  AlertTriangle,
  RotateCw,
  Download,
  Search,
  ExternalLink,
  BookOpen,
  Video,
  Code2,
  ListTodo,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { TopicType, LearningGoal } from '../../types';
import { FlashcardReviewModal } from './FlashcardReviewModal';

export const SummaryHubView: React.FC = () => {
  const {
    goals,
    setSelectedSummaryGoal,
    recordTopicReview,
  } = useStudy();

  const { currentTheme } = useTheme();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | TopicType>('all');
  const [isFlashcardOpen, setIsFlashcardOpen] = useState(false);

  const now = new Date();

  // Filter goals
  const summarizedGoals = goals.filter((g) => {
    if (typeFilter !== 'all' && g.type !== typeFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchTitle = g.title.toLowerCase().includes(q);
      const matchCat = g.category.toLowerCase().includes(q);
      const matchTakeaways = g.summary?.keyTakeaways?.some((t) => t.toLowerCase().includes(q));
      const matchGotchas = g.summary?.gotchas?.some((gt) => gt.toLowerCase().includes(q));
      if (!matchTitle && !matchCat && !matchTakeaways && !matchGotchas) return false;
    }
    return true;
  });

  // Calculate retention stats
  let totalTakeaways = 0;
  let totalConfidence = 0;
  let topicsNeedingReview = 0;

  goals.forEach((g) => {
    const takeawaysCount = g.summary?.keyTakeaways?.length || 0;
    totalTakeaways += takeawaysCount;
    totalConfidence += g.summary?.confidenceLevel || 3;

    if (takeawaysCount > 0) {
      const refDate = g.summary?.lastReviewedAt ? new Date(g.summary.lastReviewedAt) : new Date(g.updatedAt);
      const days = Math.floor((now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
      if (days >= 14) topicsNeedingReview++;
    }
  });

  const avgConfidence = goals.length > 0 ? (totalConfidence / goals.length).toFixed(1) : '4.0';

  const exportAllSummariesMarkdown = () => {
    let fullMd = `# StudyPulse - Complete Knowledge Base & Retention Summaries\n`;
    fullMd += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

    goals.forEach((goal, idx) => {
      fullMd += `## ${idx + 1}. ${goal.title}\n`;
      fullMd += `- **Type:** ${goal.type.toUpperCase()} | **Category:** ${goal.category}\n`;
      fullMd += `- **Confidence:** ${goal.summary?.confidenceLevel || 3}/5 stars\n\n`;
      fullMd += `### Core Concepts & Takeaways:\n`;
      goal.summary?.keyTakeaways?.forEach((t) => {
        fullMd += `- ${t}\n`;
      });
      if (goal.summary?.cheatSheetCode) {
        fullMd += `\n### Cheat Sheet Code / Syntax:\n\`\`\`\n${goal.summary.cheatSheetCode}\n\`\`\`\n`;
      }
      if (goal.summary?.gotchas && goal.summary.gotchas.length > 0) {
        fullMd += `\n### Gotchas & Pitfalls to Remember:\n`;
        goal.summary.gotchas.forEach((gt) => {
          fullMd += `- ⚠️ ${gt}\n`;
        });
      }
      fullMd += `\n---\n\n`;
    });

    const blob = new Blob([fullMd], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `studypulse_all_summaries_${new Date().toISOString().slice(0, 10)}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-purple-50 via-indigo-50/70 to-slate-50 dark:from-purple-950/70 dark:via-indigo-950/50 dark:to-slate-900 p-6 rounded-3xl border border-purple-200 dark:border-purple-500/30 shadow-sm relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300 bg-purple-500/15 px-2.5 py-0.5 rounded-full border border-purple-500/30 flex items-center gap-1">
              <Brain className="h-3 w-3" />
              What I Learnt & Retention Center
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Long-Term Knowledge Recap
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl leading-relaxed">
            Never forget what you studied. Return after weeks or months and instantly review your key takeaways, syntax cheat-sheets, and tricky edge cases.
          </p>
        </div>

        <div className="flex items-center gap-3 relative z-10">
          <button
            onClick={() => setIsFlashcardOpen(true)}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/20 transition-all flex items-center gap-2 hover:scale-[1.02]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Active Recall Quiz</span>
          </button>

          <button
            onClick={exportAllSummariesMarkdown}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors flex items-center gap-1.5 shadow-sm"
            title="Download all topic summaries as Markdown"
          >
            <Download className="h-4 w-4 text-indigo-500" />
            <span>Export Notes (.md)</span>
          </button>
        </div>
      </div>

      {/* Retention Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Topics Summarized</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white">{goals.length}</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Concepts & Takeaways</span>
          <span className="text-2xl font-extrabold text-purple-600 dark:text-purple-300">{totalTakeaways}</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Need Revision (&gt;14d)</span>
          <span className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{topicsNeedingReview}</span>
        </div>

        <div className="glass-card rounded-2xl p-4 text-center">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">Avg Topic Mastery</span>
          <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
            <span>{avgConfidence}</span>
            <Star className="h-4 w-4 fill-current text-amber-400" />
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-panel rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Filter Source:</span>
          <button
            onClick={() => setTypeFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'all'
                ? 'text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
            style={typeFilter === 'all' ? { backgroundColor: currentTheme.primary } : {}}
          >
            All
          </button>
          <button
            onClick={() => setTypeFilter('udemy')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'udemy'
                ? 'bg-purple-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Udemy
          </button>
          <button
            onClick={() => setTypeFilter('youtube')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'youtube'
                ? 'bg-rose-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            YouTube
          </button>
          <button
            onClick={() => setTypeFilter('dsa')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'dsa'
                ? 'bg-blue-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            DSA Patterns
          </button>
          <button
            onClick={() => setTypeFilter('custom')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold ${
              typeFilter === 'custom'
                ? 'bg-emerald-600 text-white shadow-sm font-bold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Custom Topics
          </button>
        </div>

        <div className="relative w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search takeaways, code, gotchas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      {/* Summaries Grid */}
      {summarizedGoals.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <Brain className="h-12 w-12 text-purple-500 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">
            No topic takeaways recorded yet
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            When you complete lectures, watch videos, or solve DSA problems, click "Summary" to write down core concepts and tricky gotchas. They will appear here for long-term retention.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {summarizedGoals.map((goal) => {
            const refDate = goal.summary?.lastReviewedAt
              ? new Date(goal.summary.lastReviewedAt)
              : new Date(goal.updatedAt);
            const daysSince = Math.floor((now.getTime() - refDate.getTime()) / (1000 * 60 * 60 * 24));
            const needsReview = daysSince >= 14;

            return (
              <div
                key={goal.id}
                className={`rounded-3xl p-6 border transition-all flex flex-col justify-between shadow-sm ${
                  needsReview
                    ? 'bg-white dark:bg-slate-900/90 border-amber-300 dark:border-amber-500/40 ring-1 ring-amber-400/20'
                    : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-purple-300 dark:hover:border-purple-500/30'
                }`}
              >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${
                        goal.type === 'udemy'
                          ? 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30'
                          : goal.type === 'youtube'
                          ? 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30'
                          : goal.type === 'dsa'
                          ? 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30'
                          : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {goal.type}
                    </span>

                    <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {goal.category}
                    </span>
                  </div>

                  {/* Confidence Stars */}
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3.5 w-3.5 ${
                          s <= (goal.summary?.confidenceLevel || 3)
                            ? 'text-amber-400 fill-current'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white mb-2">{goal.title}</h3>

                {/* Review status badge */}
                <div className="flex items-center gap-2 mb-4 text-xs">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[11px] font-bold ${
                      needsReview
                        ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30'
                        : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/25'
                    }`}
                  >
                    <Clock className="h-3 w-3" />
                    {daysSince === 0
                      ? 'Reviewed Today'
                      : daysSince === 1
                      ? 'Reviewed yesterday'
                      : `Reviewed ${daysSince} days ago`}
                  </span>

                  <span className="text-slate-500 dark:text-slate-400 text-[11px] font-medium">
                    {goal.summary?.reviewCount || 0} lifetime reviews
                  </span>
                </div>

                {/* Key Takeaways Preview */}
                <div className="space-y-2 mb-4">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-purple-500" />
                    <span>What You Learned (Key Takeaways):</span>
                  </p>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300 pl-1">
                    {goal.summary?.keyTakeaways?.slice(0, 3).map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-purple-500 font-bold">•</span>
                        <span className="line-clamp-2 leading-relaxed">{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                  {goal.summary?.keyTakeaways && goal.summary.keyTakeaways.length > 3 && (
                    <p className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold pl-3">
                      +{goal.summary.keyTakeaways.length - 3} more concepts in full summary
                    </p>
                  )}
                </div>

                {/* Code / Syntax preview */}
                {goal.summary?.cheatSheetCode && (
                  <div className="mb-4">
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 mb-1.5">
                      <Code className="h-3.5 w-3.5 text-indigo-500" />
                      <span>Cheat-Sheet Preview:</span>
                    </p>
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-indigo-800 dark:text-indigo-200 line-clamp-3 overflow-hidden whitespace-pre">
                      {goal.summary.cheatSheetCode}
                    </div>
                  </div>
                )}

                {/* Gotchas preview */}
                {goal.summary?.gotchas && goal.summary.gotchas.length > 0 && (
                  <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-xs text-amber-900 dark:text-amber-200 mb-4">
                    <p className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300 mb-1">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>Watch Out:</span>
                    </p>
                    <p className="line-clamp-2 leading-relaxed">⚠️ {goal.summary.gotchas[0]}</p>
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-800/80">
                <button
                  onClick={() => recordTopicReview(goal.id)}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>Mark Reviewed</span>
                </button>

                <button
                  onClick={() => setSelectedSummaryGoal(goal)}
                  className="flex-1 py-2 px-3 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Brain className="h-3.5 w-3.5 text-purple-500" />
                  <span>Full Summary Sheet</span>
                </button>
              </div>
            </div>
          );
        })}
        </div>
      )}

      {/* Flashcard Quiz Modal */}
      <FlashcardReviewModal isOpen={isFlashcardOpen} onClose={() => setIsFlashcardOpen(false)} />
    </div>
  );
};
