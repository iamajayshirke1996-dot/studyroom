import React, { useState, useEffect } from 'react';
import {
  X,
  Brain,
  Star,
  CheckCircle2,
  Code,
  AlertTriangle,
  Plus,
  Trash2,
  Copy,
  Check,
  Sparkles,
  Download,
  Edit2,
  ChevronUp,
  ChevronDown,
  Save,
  FileCode2,
  Zap,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { LearningGoal } from '../../types';

// Built-in starter code templates for 1-click insertion
const CODE_PRESETS = [
  {
    name: 'Closure & Scope',
    code: `// 1. Compilation Phase (Global scope declaration)
// 2. Execution Phase (Closure preserves lexical scope reference)
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    getValue: () => count,
  };
}
const counter = createCounter();
console.log(counter.increment()); // 1`,
  },
  {
    name: 'Sliding Window',
    code: `// Sliding Window DSA Pattern
function maxSubArraySum(arr, k) {
  let maxSum = 0, windowSum = 0;
  for (let i = 0; i < arr.length; i++) {
    windowSum += arr[i];
    if (i >= k - 1) {
      maxSum = Math.max(maxSum, windowSum);
      windowSum -= arr[i - (k - 1)];
    }
  }
  return maxSum;
}`,
  },
  {
    name: 'Async Polyfill',
    code: `// Promise / Async-Await Robust Pattern
async function safeFetch(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
    return await res.json();
  } catch (err) {
    console.error('Fetch Failed:', err.message);
    return null;
  }
}`,
  },
];

export const TopicSummaryModal: React.FC = () => {
  const {
    selectedSummaryGoal,
    setSelectedSummaryGoal,
    updateSummary,
    recordTopicReview,
  } = useStudy();

  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  // Takeaways state
  const [takeaways, setTakeaways] = useState<string[]>([]);
  const [editingTakeawayIdx, setEditingTakeawayIdx] = useState<number | null>(null);
  const [editingTakeawayText, setEditingTakeawayText] = useState('');
  const [newTakeaway, setNewTakeaway] = useState('');

  // Code Snippet & Gotchas state
  const [codeSnippet, setCodeSnippet] = useState('');
  const [gotchas, setGotchas] = useState<string[]>([]);
  const [editingGotchaIdx, setEditingGotchaIdx] = useState<number | null>(null);
  const [editingGotchaText, setEditingGotchaText] = useState('');
  const [newGotcha, setNewGotcha] = useState('');
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5>(4);

  useEffect(() => {
    if (selectedSummaryGoal) {
      setTakeaways(selectedSummaryGoal.summary?.keyTakeaways || []);
      setCodeSnippet(selectedSummaryGoal.summary?.cheatSheetCode || '');
      setGotchas(selectedSummaryGoal.summary?.gotchas || []);
      setConfidence(selectedSummaryGoal.summary?.confidenceLevel || 4);
      setIsEditing(false);
      setEditingTakeawayIdx(null);
      setEditingGotchaIdx(null);
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
    setEditingTakeawayIdx(null);
    setEditingGotchaIdx(null);
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  // Takeaways handlers
  const handleAddTakeaway = () => {
    if (newTakeaway.trim()) {
      setTakeaways([...takeaways, newTakeaway.trim()]);
      setNewTakeaway('');
    }
  };

  const handleRemoveTakeaway = (index: number) => {
    setTakeaways(takeaways.filter((_, i) => i !== index));
    if (editingTakeawayIdx === index) setEditingTakeawayIdx(null);
  };

  const handleStartEditTakeaway = (index: number) => {
    setEditingTakeawayIdx(index);
    setEditingTakeawayText(takeaways[index]);
  };

  const handleSaveTakeawayEdit = (index: number) => {
    if (editingTakeawayText.trim()) {
      const updated = [...takeaways];
      updated[index] = editingTakeawayText.trim();
      setTakeaways(updated);
    }
    setEditingTakeawayIdx(null);
  };

  const handleMoveTakeaway = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= takeaways.length) return;
    const updated = [...takeaways];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setTakeaways(updated);
  };

  // Gotchas handlers
  const handleAddGotcha = () => {
    if (newGotcha.trim()) {
      setGotchas([...gotchas, newGotcha.trim()]);
      setNewGotcha('');
    }
  };

  const handleRemoveGotcha = (index: number) => {
    setGotchas(gotchas.filter((_, i) => i !== index));
    if (editingGotchaIdx === index) setEditingGotchaIdx(null);
  };

  const handleStartEditGotcha = (index: number) => {
    setEditingGotchaIdx(index);
    setEditingGotchaText(gotchas[index]);
  };

  const handleSaveGotchaEdit = (index: number) => {
    if (editingGotchaText.trim()) {
      const updated = [...gotchas];
      updated[index] = editingGotchaText.trim();
      setGotchas(updated);
    }
    setEditingGotchaIdx(null);
  };

  const copyCode = () => {
    if (codeSnippet) {
      navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const insertPresetCode = (presetCode: string) => {
    if (!codeSnippet) {
      setCodeSnippet(presetCode);
    } else {
      setCodeSnippet(codeSnippet + '\n\n' + presetCode);
    }
  };

  const downloadMarkdown = () => {
    const md = `# ${selectedSummaryGoal.title} - Knowledge Summary & Cheat Sheet\n\n` +
      `**Category:** ${selectedSummaryGoal.category} | **Type:** ${selectedSummaryGoal.type}\n` +
      `**Confidence:** ${confidence}/5 stars | **Last Reviewed:** ${new Date().toLocaleDateString()}\n\n` +
      `## Key Takeaways & Core Concepts\n` +
      takeaways.map((t, i) => `${i + 1}. ${t}`).join('\n') +
      `\n\n## Cheat Sheet & Code Snippets\n\`\`\`js\n${codeSnippet}\n\`\`\`\n\n` +
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

  // Format code snippet with line numbers
  const codeLines = codeSnippet ? codeSnippet.split('\n') : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-800 dark:text-slate-100 relative">
        
        {/* Floating Save Toast Notification */}
        {saveToast && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="h-4 w-4" />
            <span>Summary & Cheat Sheet Saved!</span>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between gap-4 bg-slate-50 dark:bg-slate-950/60">
          <div className="flex items-start gap-3">
            <div className="p-3 rounded-2xl bg-purple-500/15 text-purple-600 dark:text-purple-300 border border-purple-500/30 shrink-0">
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

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 ${
                isEditing
                  ? 'bg-purple-600 text-white shadow-purple-600/30'
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>{isEditing ? 'Editing Mode' : 'Edit Takeaways'}</span>
            </button>

            <button
              onClick={() => setSelectedSummaryGoal(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-slate-700 dark:text-slate-200">
          
          {/* Confidence Mastery Rating */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 shadow-sm">
            <div>
              <p className="text-xs font-bold text-slate-900 dark:text-white">Topic Confidence / Mastery Level</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click stars to update how well you retain this concept
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => {
                    setConfidence(star as any);
                    setIsEditing(true);
                  }}
                  className={`p-1 transition-transform hover:scale-125 ${
                    star <= confidence ? 'text-amber-400' : 'text-slate-300 dark:text-slate-700'
                  }`}
                  title={`Set confidence level ${star}/5`}
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

            {/* Quick Add Takeaway Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add core concept, mental model, or takeaway... (Press Enter)"
                value={newTakeaway}
                onChange={(e) => setNewTakeaway(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddTakeaway()}
                className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 shadow-sm"
              />
              <button
                onClick={handleAddTakeaway}
                className="px-3.5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Interactive Takeaways List */}
            <div className="space-y-2">
              {takeaways.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No takeaways written yet. Type above to add core concepts!</p>
              ) : (
                takeaways.map((takeaway, index) => {
                  const isEditingThis = editingTakeawayIdx === index;

                  return (
                    <div
                      key={index}
                      className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 text-xs leading-relaxed shadow-sm ${
                        isEditingThis
                          ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/40 ring-1 ring-purple-500/30'
                          : 'bg-slate-50 dark:bg-slate-950/60 border-slate-200 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          {index + 1}
                        </span>

                        {isEditingThis ? (
                          <div className="flex-1 space-y-2">
                            <textarea
                              rows={2}
                              value={editingTakeawayText}
                              onChange={(e) => setEditingTakeawayText(e.target.value)}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-purple-500/50 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveTakeawayEdit(index)}
                                className="px-2.5 py-1 bg-purple-600 text-white text-[11px] font-bold rounded-lg"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingTakeawayIdx(null)}
                                className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            onClick={() => handleStartEditTakeaway(index)}
                            className="text-slate-800 dark:text-slate-200 cursor-pointer hover:text-purple-600 dark:hover:text-purple-300 transition-colors flex-1"
                            title="Click to edit takeaway"
                          >
                            {takeaway}
                          </p>
                        )}
                      </div>

                      {/* Action buttons (Move Up/Down, Edit, Delete) */}
                      {!isEditingThis && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleMoveTakeaway(index, 'up')}
                            disabled={index === 0}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                            title="Move Up"
                          >
                            <ChevronUp className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleMoveTakeaway(index, 'down')}
                            disabled={index === takeaways.length - 1}
                            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30"
                            title="Move Down"
                          >
                            <ChevronDown className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleStartEditTakeaway(index)}
                            className="p-1 text-slate-400 hover:text-purple-600 dark:hover:text-purple-300"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveTakeaway(index)}
                            className="p-1 text-slate-400 hover:text-rose-500"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Interactive Cheat-Sheet & Code Snippets Studio */}
          <div className="space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Code className="h-4 w-4 text-indigo-500" />
                <span>Cheat-Sheet & Code Snippets</span>
              </h3>

              <div className="flex items-center gap-2">
                {/* 1-Click Code Preset Templates */}
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-[10px] text-slate-400 font-semibold uppercase flex items-center gap-0.5">
                    <Zap className="h-3 w-3 text-amber-500" /> Insert:
                  </span>
                  {CODE_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => insertPresetCode(preset.code)}
                      className="px-2 py-0.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border border-indigo-500/20 text-[10px] font-bold transition-colors"
                      title={`Append ${preset.name} starter snippet`}
                    >
                      +{preset.name}
                    </button>
                  ))}
                </div>

                {codeSnippet && (
                  <button
                    onClick={copyCode}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-semibold text-indigo-600 dark:text-indigo-400 transition-colors"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                )}
              </div>
            </div>

            {/* Code Studio Editor & Line-Numbered Display */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-950 text-indigo-100 shadow-md">
              {/* Code Bar Header */}
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                <div className="flex items-center gap-2">
                  <FileCode2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>cheat_sheet.js</span>
                </div>
                <span className="text-[11px] text-slate-500">{codeLines.length} lines</span>
              </div>

              {/* Monospace Code Editor Area */}
              <div className="p-3">
                <textarea
                  rows={Math.max(6, Math.min(14, codeLines.length + 2))}
                  placeholder="Paste or write code snippets, line notes, formulas, or CLI commands here..."
                  value={codeSnippet}
                  onChange={(e) => setCodeSnippet(e.target.value)}
                  className="w-full bg-transparent font-mono text-xs text-indigo-200 focus:outline-none resize-y leading-relaxed"
                  style={{ fontFamily: 'Fira Code, Consolas, Monaco, monospace' }}
                />
              </div>
            </div>
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

            {/* Add Gotcha Input Bar */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Memory leak: remember to unregister event listeners on unmount..."
                value={newGotcha}
                onChange={(e) => setNewGotcha(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddGotcha()}
                className="flex-1 px-3.5 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500 shadow-sm"
              />
              <button
                onClick={handleAddGotcha}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add</span>
              </button>
            </div>

            {/* Gotchas List */}
            <div className="space-y-2">
              {gotchas.length === 0 ? (
                <p className="text-xs text-slate-400 italic py-2">No gotchas added yet. Add edge cases or common bugs to watch out for!</p>
              ) : (
                gotchas.map((gotcha, index) => {
                  const isEditingThis = editingGotchaIdx === index;

                  return (
                    <div
                      key={index}
                      className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-500/30 flex items-start justify-between gap-3 text-xs text-amber-900 dark:text-amber-200 leading-relaxed shadow-sm"
                    >
                      <div className="flex items-start gap-2 flex-1 min-w-0">
                        <span className="text-amber-500 shrink-0 mt-0.5">⚠️</span>
                        {isEditingThis ? (
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={editingGotchaText}
                              onChange={(e) => setEditingGotchaText(e.target.value)}
                              className="w-full p-2 bg-white dark:bg-slate-900 border border-amber-500 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveGotchaEdit(index)}
                                className="px-2.5 py-1 bg-amber-600 text-white text-[11px] font-bold rounded-lg"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setEditingGotchaIdx(null)}
                                className="px-2.5 py-1 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold rounded-lg"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            onClick={() => handleStartEditGotcha(index)}
                            className="cursor-pointer hover:underline flex-1"
                            title="Click to edit warning"
                          >
                            {gotcha}
                          </p>
                        )}
                      </div>

                      {!isEditingThis && (
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => handleStartEditGotcha(index)}
                            className="p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300"
                            title="Edit"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleRemoveGotcha(index)}
                            className="p-1 text-amber-400 hover:text-rose-500"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950/70">
          <button
            onClick={downloadMarkdown}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Download className="h-3.5 w-3.5 text-indigo-500" />
            <span>Download .md</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>

            <button
              onClick={() => {
                handleSave();
                recordTopicReview(selectedSummaryGoal.id);
                setSelectedSummaryGoal(null);
              }}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-md shadow-purple-600/30 transition-all hover:scale-105"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark Reviewed & Close</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

