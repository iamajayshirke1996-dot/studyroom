import React, { useState } from 'react';
import {
  X,
  RotateCw,
  CheckCircle,
  AlertCircle,
  Brain,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Star,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { LearningGoal } from '../../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const FlashcardReviewModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { goals, recordTopicReview } = useStudy();

  // Filter goals that have summaries
  const eligibleGoals = goals.filter(
    (g) => g.summary && g.summary.keyTakeaways && g.summary.keyTakeaways.length > 0
  );

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  if (!isOpen || eligibleGoals.length === 0) return null;

  const currentGoal: LearningGoal = eligibleGoals[currentIndex] || eligibleGoals[0];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % eligibleGoals.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + eligibleGoals.length) % eligibleGoals.length);
  };

  const handleRemembered = () => {
    recordTopicReview(currentGoal.id);
    handleNext();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-purple-500/15 text-purple-600 dark:text-purple-300">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-sm">Active Recall & Retention Quiz</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Card {currentIndex + 1} of {eligibleGoals.length}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Card Content Area */}
        <div className="p-6 flex-1 overflow-y-auto flex flex-col justify-center min-h-[360px]">
          {!isFlipped ? (
            /* Front of card (Question & Prompt) */
            <div
              onClick={() => setIsFlipped(true)}
              className="bg-slate-50 dark:bg-slate-900/60 rounded-3xl p-8 text-center cursor-pointer hover:border-purple-400 transition-all space-y-4 border-2 border-dashed border-slate-300 dark:border-slate-700/80 my-auto shadow-sm"
            >
              <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                {currentGoal.type} · {currentGoal.category}
              </span>

              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-2">
                {currentGoal.title}
              </h2>

              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                Before flipping, mentally recall:
                <br />
                <span className="text-slate-800 dark:text-slate-200 font-semibold">
                  What are the core concepts, syntax patterns, and edge cases you recorded for this topic?
                </span>
              </p>

              <div className="pt-4">
                <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-md shadow-purple-600/20 inline-flex items-center gap-2 hover:scale-105 transition-transform">
                  <RotateCw className="h-3.5 w-3.5" />
                  <span>Click or Tap to Reveal Takeaways</span>
                </button>
              </div>
            </div>
          ) : (
            /* Back of card (Revealed Summary) */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-base">{currentGoal.title}</h3>
                <button
                  onClick={() => setIsFlipped(false)}
                  className="text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 font-semibold flex items-center gap-1"
                >
                  <RotateCw className="h-3 w-3" />
                  <span>Flip back</span>
                </button>
              </div>

              {/* Takeaways */}
              <div className="space-y-1.5">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-300">Core Takeaways:</p>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 pl-2">
                  {currentGoal.summary.keyTakeaways.map((t, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Code snippet if any */}
              {currentGoal.summary.cheatSheetCode && (
                <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-[11px] text-indigo-900 dark:text-indigo-200 overflow-x-auto whitespace-pre">
                  {currentGoal.summary.cheatSheetCode}
                </div>
              )}

              {/* Gotchas if any */}
              {currentGoal.summary.gotchas && currentGoal.summary.gotchas.length > 0 && (
                <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 space-y-1 text-xs text-amber-900 dark:text-amber-200">
                  <p className="font-bold flex items-center gap-1 text-amber-800 dark:text-amber-300">
                    <AlertCircle className="h-3.5 w-3.5" />
                    <span>Watch Out For:</span>
                  </p>
                  {currentGoal.summary.gotchas.map((g, i) => (
                    <p key={i}>⚠️ {g}</p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Previous card"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
              title="Next card"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNext}
              className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold"
            >
              Need to review again
            </button>

            <button
              onClick={handleRemembered}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              <span>Remembered Well!</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
