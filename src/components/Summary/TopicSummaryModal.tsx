import React, { useState, useEffect } from 'react';
import {
  X,
  Brain,
  Star,
  CheckCircle2,
  Code,
  AlertTriangle,
  Link as LinkIcon,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Download,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { LearningGoal, TopicSummary } from '../../types';

export const TopicSummaryModal: React.FC = () => {
  const {
    selectedSummaryGoal,
    setSelectedSummaryGoal,
    updateSummary,
    recordTopicReview,
  } = useStudy();

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states for editing
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [newTakeaway, setNewTakeaway] = useState('');
  const [codeSnippet, setCodeSnippet] = useState('');
  const [gotchas, setGotchas] = useState<string[]>([]);
  const [newGotcha, setNewGotcha] = useState('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(4);

  useEffect(() => {
    if (selectedSummaryGoal) {
      setTakeaways(selectedSummaryGoal.summary?.keyTakeaways || []);
      setCodeSnippet(selectedSummaryGoal.summary?.cheatSheetCode || '');
      setGotchas(selectedSummaryGoal.summary?.gotchas || []);
      setConfidence(selectedSummaryGoal.summary?.confidenceLevel || 4);
      setIsEditing(false);
    }
  }, [selectedSummaryGoal]);

  if (!selectedSummaryGoal) return null;

  const handleSave = () => {
    updateSummary(selectedSummaryGoal.id, {
      keyTakeaways: takeaways,
      cheatSheetCode: codeSnippet,
      gotchas,
      confidenceLevel: confidence,
    });
    setIsEditing(false);
  };

  const handleAddTakeaway = () => {
    if (newTakeaway.trim()) {
      setTakeaways([...takeaways, newTakeaway.trim()]);
      setNewTakeaway('');
    }
  };

  const handleRemoveTakeaway = (index: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== index));
  };

  const handleAddGotcha = () => {
    if (newGotcha.trim()) {
      setGotchas([...gotchas, newGotcha.trim()]);
      setNewGotcha('');
    }
  };

  const handleRemoveGotcha = (index: number) => {
    setGotchas(gotchas.filter((_, i) => i !== index));
  };

  const copyCode = () => {
    if (codeSnippet) {
      navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const downloadMarkdown = () => {
    const md = `# ${selectedSummaryGoal.title} - Knowledge Summary\n\n` +
      `**Category:** ${selectedSummaryGoal.category} | **Type:** ${selectedSummaryGoal.type}\n` +
      `**Confidence:** ${confidence}/5 stars | **Last Reviewed:** ${new Date().toLocaleDateString()}\n\n` +
      `## Key Takeaways & Core Concepts\n` +
      takeaways.map((t) => `- ${t}`).join('\n') +
      `\n\n## Cheat Sheet & Code Snippets\n\`\`\`\n${codeSnippet}\n\`\`\`\n\n` +
      `## Common Gotchas & Edge Cases to Avoid\n` +
      gotchas.map((g) => `- ⚠️ ${g}`).join('\n');

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedSummaryGoal.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_summary.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const lastReviewedDate = selectedSummaryGoal.summary?.lastReviewedAt
    ? new Date(selectedSummaryGoal.summary.lastReviewedAt).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Never';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-purple-500/15 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                  {selectedSummaryGoal.type}
                </span>
                <span className="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                  {selectedSummaryGoal.category}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Last Reviewed: <strong className="text-slate-800 dark:text-slate-200">{lastReviewedDate}</strong>
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{selectedSummaryGoal.title}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Retention Summary · Reviewed {selectedSummaryGoal.summary?.reviewCount || 0} times
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-sm ${
                isEditing
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {isEditing ? 'Cancel Edit' : 'Edit Takeaways'}
            </button>

            <button
              onClick={() => setSelectedSummaryGoal(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-200">
          {/* Confidence Mastery Rating */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Your Topic Confidence / Mastery</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                How well do you remember this topic after weeks?
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  disabled={!isEditing}
                  onClick={() => setConfidence(star as any)}
                  className={`p-1 transition-colors ${
                    star <= confidence ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
                  } ${isEditing ? 'hover:scale-125 cursor-pointer' : 'cursor-default'}`}
                >
                  <Star className="h-5 w-5 fill-current" />
                </button>
              ))}
            </div>
          </div>

          {/* Key Takeaways Section */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <span>Key Takeaways & Core Concepts</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{takeaways.length} concepts recorded</span>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a core mental model, concept, or formula..."
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTakeaway()}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-sm"
                />
                <button
                  onClick={handleAddTakeaway}
                  className="px-3 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            )}

            <div className="space-y-2">
              {takeaways.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No takeaways written yet. Click 'Edit Takeaways' to add some!</p>
              ) : (
                takeaways.map((takeaway, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800/80 flex items-start justify-between gap-3 text-xs leading-relaxed shadow-sm"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-slate-800 dark:text-slate-200">{takeaway}</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveTakeaway(index)}
                        className="text-slate-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Cheat-Sheet & Code Snippets */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="h-4 w-4 text-indigo-500" />
                <span>Cheat-Sheet & Code Snippets</span>
              </h3>
              {codeSnippet && !isEditing && (
                <button
                  onClick={copyCode}
                  className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                </button>
              )}
            </div>

            {isEditing ? (
              <textarea
                rows={5}
                placeholder="Paste quick reference code, boilerplate, CLI commands, or regex..."
                value={codeSnippet}
                onChange={(e) => setCodeSnippet(e.target.value)}
                className="w-full p-3 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl font-mono text-xs text-slate-900 dark:text-indigo-200 focus:outline-none focus:border-indigo-500 shadow-sm"
              />
            ) : codeSnippet ? (
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs text-indigo-900 dark:text-indigo-200 overflow-x-auto whitespace-pre leading-relaxed shadow-sm">
                {codeSnippet}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No code snippets saved for this topic.</p>
            )}
          </div>

          {/* Common Gotchas & Edge Cases */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>Common Gotchas & Tricky Pitfalls</span>
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">{gotchas.length} warnings</span>
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Remember to clean up event listeners to avoid memory leaks..."
                  value={newGotcha}
                  onChange={(e) => setNewGotcha(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddGotcha()}
                  className="flex-1 px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
                />
                <button
                  onClick={handleAddGotcha}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add</span>
                </button>
              </div>
            )}

            <div className="space-y-2">
              {gotchas.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No gotchas added yet.</p>
              ) : (
                gotchas.map((gotcha, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 flex items-start justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed shadow-sm"
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-amber-500 shrink-0">⚠️</span>
                      <p>{gotcha}</p>
                    </div>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveGotcha(index)}
                        className="text-amber-400 hover:text-rose-500 p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-indigo-500" />
            <span>Download .md</span>
          </button>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={() => {
                  recordTopicReview(selectedSummaryGoal.id);
                  setSelectedSummaryGoal(null);
                }}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all"
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>Mark Reviewed & Close</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
