import React, { useState } from 'react';
import { useStudy } from '../../context/StudyContext';
import { YoutubeShort, ShortPlatform, ContentStatus } from '../../types';
import { LogShortModal } from './LogShortModal';
import { getLocalDateString } from '../../utils/storage';
import {
  Video,
  Flame,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  ChevronRight,
  Eye,
  ThumbsUp,
  Target,
  Sparkles,
  LayoutGrid,
  List,
  CheckCircle2,
  Film,
} from 'lucide-react';

const STAGES: { key: ContentStatus; label: string; icon: string; color: string }[] = [
  { key: 'idea', label: 'Idea Concept', icon: '💡', color: 'border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400' },
  { key: 'scripted', label: 'Scripted', icon: '📝', color: 'border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400' },
  { key: 'recorded', label: 'Recorded', icon: '🎥', color: 'border-purple-500/40 bg-purple-500/10 text-purple-600 dark:text-purple-400' },
  { key: 'edited', label: 'Edited', icon: '✂️', color: 'border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' },
  { key: 'uploaded', label: 'Uploaded 🎉', icon: '🚀', color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' },
];

export const YoutubeShortsView: React.FC = () => {
  const {
    youtubeShorts,
    shortsStats,
    isLogShortOpen,
    setIsLogShortOpen,
    editingShort,
    setEditingShort,
    updateYoutubeShort,
    deleteYoutubeShort,
    setShortsDailyGoal,
  } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [newGoalValue, setNewGoalValue] = useState(shortsStats.dailyGoal);

  const filteredShorts = youtubeShorts.filter((short) => {
    const matchesSearch =
      short.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (short.niche && short.niche.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (short.notes && short.notes.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform =
      selectedPlatform === 'all' || short.platform === selectedPlatform;

    return matchesSearch && matchesPlatform;
  });

  const handleAdvanceStage = (short: YoutubeShort) => {
    const stageOrder: ContentStatus[] = ['idea', 'scripted', 'recorded', 'edited', 'uploaded'];
    const currentIndex = stageOrder.indexOf(short.status);
    if (currentIndex < stageOrder.length - 1) {
      const nextStatus = stageOrder[currentIndex + 1];
      const updates: Partial<YoutubeShort> = { status: nextStatus };
      if (nextStatus === 'uploaded') {
        updates.uploadDate = getLocalDateString();
      }
      updateYoutubeShort(short.id, updates);
    }
  };

  const handleOpenEdit = (short: YoutubeShort) => {
    setEditingShort(short);
    setIsLogShortOpen(true);
  };

  const handleOpenNew = () => {
    setEditingShort(null);
    setIsLogShortOpen(true);
  };

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShortsDailyGoal(newGoalValue);
    setIsGoalModalOpen(false);
  };

  const getPlatformBadge = (platform: ShortPlatform) => {
    switch (platform) {
      case 'youtube_shorts':
        return (
          <span className="px-2 py-0.5 bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[10px] font-bold rounded-md inline-flex items-center gap-1 border border-red-200 dark:border-red-800/40">
            🔴 YouTube Shorts
          </span>
        );
      case 'reels':
        return (
          <span className="px-2 py-0.5 bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-[10px] font-bold rounded-md inline-flex items-center gap-1 border border-pink-200 dark:border-pink-800/40">
            📸 IG Reels
          </span>
        );
      case 'tiktok':
        return (
          <span className="px-2 py-0.5 bg-cyan-100 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold rounded-md inline-flex items-center gap-1 border border-cyan-200 dark:border-cyan-800/40">
            🎵 TikTok
          </span>
        );
      case 'linkedin_video':
        return (
          <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-[10px] font-bold rounded-md inline-flex items-center gap-1 border border-blue-200 dark:border-blue-800/40">
            💼 LinkedIn
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Top Banner Stats Header */}
      <div className="bg-gradient-to-r from-pink-900 via-slate-900 to-rose-950 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-pink-800/40">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 border border-pink-400/30 rounded-full text-pink-300 text-xs font-semibold uppercase tracking-wider">
              <Film className="w-4 h-4 text-pink-400" /> Content Creation Pipeline
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              YouTube Shorts & Reels Consistency Dashboard 🎬
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Track video content ideas, scripts, recordings, edits & daily upload streaks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setNewGoalValue(shortsStats.dailyGoal);
                setIsGoalModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium rounded-xl text-sm transition-all"
            >
              <Target className="w-4 h-4 text-pink-400" /> Target: {shortsStats.dailyGoal}/day
            </button>

            <button
              onClick={handleOpenNew}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-semibold rounded-xl shadow-lg shadow-pink-500/25 transition-all text-sm"
            >
              <Plus className="w-4 h-4" /> Log Content Short
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-pink-500/20">
          {/* Upload Streak */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Flame className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {shortsStats.currentStreak} <span className="text-sm font-normal text-amber-400">Days</span>
              </div>
              <div className="text-xs text-slate-400">Upload Streak 🔥</div>
            </div>
          </div>

          {/* Today's Target Progress */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-pink-500/20 text-pink-400 rounded-xl">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {shortsStats.todayCount} / {shortsStats.dailyGoal}
              </div>
              <div className="text-xs text-slate-400">Today's Upload Target</div>
            </div>
          </div>

          {/* Total Uploaded */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {shortsStats.totalUploaded}
              </div>
              <div className="text-xs text-slate-400">Total Videos Uploaded 🎉</div>
            </div>
          </div>

          {/* Total Views */}
          <div className="bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-3">
            <div className="p-3 bg-indigo-500/20 text-indigo-400 rounded-xl">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">
                {shortsStats.totalViews.toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">Total Accumulated Views 👁️</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and View Controls Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800/80 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search content short..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
            />
          </div>

          {/* Platform Filter */}
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="w-full sm:w-48 px-3 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500/50"
          >
            <option value="all">All Platforms 🌐</option>
            <option value="youtube_shorts">YouTube Shorts 🔴</option>
            <option value="reels">Instagram Reels 📸</option>
            <option value="tiktok">TikTok 🎵</option>
            <option value="linkedin_video">LinkedIn Video 💼</option>
          </select>
        </div>

        {/* View Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'kanban'
                ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" /> Pipeline Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'list'
                ? 'bg-white dark:bg-slate-800 text-pink-600 dark:text-pink-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <List className="w-3.5 h-3.5" /> List View
          </button>
        </div>
      </div>

      {/* Main Board View (Kanban) */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
          {STAGES.map((stage) => {
            const itemsInStage = filteredShorts.filter((s) => s.status === stage.key);

            return (
              <div
                key={stage.key}
                className="bg-slate-50/70 dark:bg-slate-800/40 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 p-4 space-y-4 min-h-[500px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{stage.icon}</span>
                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">
                      {stage.label}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full">
                    {itemsInStage.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3">
                  {itemsInStage.length === 0 ? (
                    <div className="py-8 text-center border-2 border-dashed border-slate-200 dark:border-slate-700/60 rounded-xl text-slate-400 text-xs">
                      No items in {stage.label}
                    </div>
                  ) : (
                    itemsInStage.map((short) => (
                      <div
                        key={short.id}
                        className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700/70 shadow-sm hover:shadow-md transition-all space-y-3 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug">
                            {short.title}
                          </h4>
                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleOpenEdit(short)}
                              className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => deleteYoutubeShort(short.id)}
                              className="p-1 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-400 hover:text-red-600 dark:hover:text-red-400 rounded"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                          {getPlatformBadge(short.platform)}
                          {short.niche && (
                            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              #{short.niche}
                            </span>
                          )}
                        </div>

                        {short.notes && (
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-100 dark:border-slate-800">
                            {short.notes}
                          </p>
                        )}

                        {/* Views & Video Link */}
                        {short.status === 'uploaded' && (
                          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100 dark:border-slate-700/60">
                            <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                              {short.views !== undefined && (
                                <span className="flex items-center gap-1">
                                  <Eye className="w-3.5 h-3.5 text-indigo-500" /> {short.views}
                                </span>
                              )}
                              {short.likes !== undefined && (
                                <span className="flex items-center gap-1">
                                  <ThumbsUp className="w-3.5 h-3.5 text-pink-500" /> {short.likes}
                                </span>
                              )}
                            </div>

                            {short.videoUrl && (
                              <a
                                href={short.videoUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 text-xs font-semibold"
                              >
                                Watch <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        )}

                        {/* Stage Advance Button */}
                        {short.status !== 'uploaded' && (
                          <button
                            onClick={() => handleAdvanceStage(short)}
                            className="w-full py-1.5 bg-slate-100 hover:bg-pink-50 dark:bg-slate-700/50 dark:hover:bg-pink-950/40 text-slate-700 hover:text-pink-600 dark:text-slate-300 dark:hover:text-pink-400 text-xs font-semibold rounded-lg flex items-center justify-center gap-1 transition-colors"
                          >
                            Advance Pipeline <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed List View */
        <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700/60">
                  <th className="py-4 px-6 font-semibold">Title & Concept</th>
                  <th className="py-4 px-6 font-semibold">Platform</th>
                  <th className="py-4 px-6 font-semibold">Status Stage</th>
                  <th className="py-4 px-6 font-semibold">Upload Date</th>
                  <th className="py-4 px-6 font-semibold text-center">Metrics</th>
                  <th className="py-4 px-6 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
                {filteredShorts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500 dark:text-slate-400">
                      No video shorts logged yet. Click "Log Content Short" to get started!
                    </td>
                  </tr>
                ) : (
                  filteredShorts.map((short) => (
                    <tr
                      key={short.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="font-semibold text-slate-800 dark:text-white">
                          {short.title}
                        </div>
                        {short.notes && (
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs mt-0.5">
                            {short.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">{getPlatformBadge(short.platform)}</td>
                      <td className="py-4 px-6">
                        <span className="capitalize text-xs font-semibold px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                          {short.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-400 text-xs">
                        {short.uploadDate}
                      </td>
                      <td className="py-4 px-6 text-center text-xs text-slate-600 dark:text-slate-400">
                        {short.status === 'uploaded' ? (
                          <div className="flex items-center justify-center gap-3">
                            <span>👁️ {short.views || 0}</span>
                            <span>👍 {short.likes || 0}</span>
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {short.videoUrl && (
                            <a
                              href={short.videoUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-950/40 rounded-lg"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                          <button
                            onClick={() => handleOpenEdit(short)}
                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteYoutubeShort(short.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Log/Edit Modal */}
      <LogShortModal
        isOpen={isLogShortOpen}
        onClose={() => setIsLogShortOpen(false)}
        initialShort={editingShort}
      />

      {/* Goal Modal */}
      {isGoalModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-sm w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-4 animate-scaleUp">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Target className="w-5 h-5 text-pink-500" /> Daily Upload Target
            </h3>

            <form onSubmit={handleGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">
                  Daily Upload Goal (Videos per day)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={newGoalValue}
                  onChange={(e) => setNewGoalValue(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 font-bold text-center text-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsGoalModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-pink-600 hover:bg-pink-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Save Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
