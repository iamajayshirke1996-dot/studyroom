import React from 'react';
import {
  BookOpen,
  Video,
  Code2,
  ListTodo,
  Plus,
  Search,
  Filter,
  ArrowUpDown,
  GraduationCap,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { TopicType, GoalStatus, Priority } from '../../types';
import { UdemyCourseCard } from './UdemyCourseCard';
import { YouTubePlaylistCard } from './YouTubePlaylistCard';
import { DsaRoadmapView } from './DsaRoadmapView';
import { CustomTopicCard } from './CustomTopicCard';

export const TopicsListView: React.FC = () => {
  const {
    goals,
    filterOptions,
    setFilterOptions,
    setIsAddGoalOpen,
  } = useStudy();

  const { currentTheme } = useTheme();

  const udemyCount = goals.filter((g) => g.type === 'udemy').length;
  const youtubeCount = goals.filter((g) => g.type === 'youtube').length;
  const dsaCount = goals.filter((g) => g.type === 'dsa').length;
  const customCount = goals.filter((g) => g.type === 'custom').length;

  // Filter & sort logic
  const filteredGoals = goals.filter((goal) => {
    // Search query
    if (filterOptions.search.trim()) {
      const q = filterOptions.search.toLowerCase();
      const matchTitle = goal.title.toLowerCase().includes(q);
      const matchDesc = goal.description.toLowerCase().includes(q);
      const matchCat = goal.category.toLowerCase().includes(q);
      const matchInstructor = goal.instructor?.toLowerCase().includes(q);
      const matchChannel = goal.channelName?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchCat && !matchInstructor && !matchChannel) {
        return false;
      }
    }

    // Type filter
    if (filterOptions.type !== 'all' && goal.type !== filterOptions.type) {
      return false;
    }

    // Status filter
    if (filterOptions.status !== 'all' && goal.status !== filterOptions.status) {
      return false;
    }

    // Priority filter
    if (filterOptions.priority !== 'all' && goal.priority !== filterOptions.priority) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (filterOptions.sortBy === 'deadline') {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    }
    if (filterOptions.sortBy === 'progress') {
      const getP = (g: typeof a) => {
        if (g.type === 'udemy') return g.totalLectures ? (g.completedLectures || 0) / g.totalLectures : 0;
        if (g.type === 'youtube') return g.totalVideos ? (g.completedVideos || 0) / g.totalVideos : 0;
        if (g.type === 'dsa') return g.dsaProblems?.length ? (g.dsaProblems.filter(p => p.solved).length) / g.dsaProblems.length : 0;
        return g.milestones?.length ? (g.milestones.filter(m => m.completed).length) / g.milestones.length : 0;
      };
      return getP(b) - getP(a);
    }
    if (filterOptions.sortBy === 'priority') {
      const weights: Record<Priority, number> = { urgent: 4, high: 3, medium: 2, low: 1 };
      return weights[b.priority] - weights[a.priority];
    }
    // updated
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return (
    <div className="space-y-6 pb-12 transition-colors">
      {/* Top Banner / Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/90 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Courses & Study Topics
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Organized tracking for Udemy, YouTube, DSA Roadmaps, and custom milestone deadlines.
          </p>
        </div>

        <button
          onClick={() => setIsAddGoalOpen(true)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md transition-all flex items-center gap-1.5 self-start sm:self-center hover:scale-[1.02]"
          style={{ backgroundColor: currentTheme.primary }}
        >
          <Plus className="h-4 w-4" />
          <span>Add Learning Goal</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'all' }))}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            filterOptions.type === 'all'
              ? 'text-white shadow-sm font-bold'
              : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 border border-slate-200 dark:border-slate-800'
          }`}
          style={filterOptions.type === 'all' ? { backgroundColor: currentTheme.primary } : {}}
        >
          <span>All Resources</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {goals.length}
          </span>
        </button>

        <button
          onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'udemy' }))}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            filterOptions.type === 'udemy'
              ? 'bg-purple-600 text-white shadow-sm font-bold'
              : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <BookOpen className="h-3.5 w-3.5" />
          <span>Udemy Courses</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-purple-500/15 text-purple-700 dark:text-purple-300">
            {udemyCount}
          </span>
        </button>

        <button
          onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'youtube' }))}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            filterOptions.type === 'youtube'
              ? 'bg-rose-600 text-white shadow-sm font-bold'
              : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Video className="h-3.5 w-3.5" />
          <span>YouTube Playlists</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500/15 text-rose-700 dark:text-rose-300">
            {youtubeCount}
          </span>
        </button>

        <button
          onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'dsa' }))}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            filterOptions.type === 'dsa'
              ? 'bg-blue-600 text-white shadow-sm font-bold'
              : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Code2 className="h-3.5 w-3.5" />
          <span>DSA Roadmaps</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/15 text-blue-700 dark:text-blue-300">
            {dsaCount}
          </span>
        </button>

        <button
          onClick={() => setFilterOptions((prev) => ({ ...prev, type: 'custom' }))}
          className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            filterOptions.type === 'custom'
              ? 'bg-emerald-600 text-white shadow-sm font-bold'
              : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-300 border border-slate-200 dark:border-slate-800'
          }`}
        >
          <ListTodo className="h-3.5 w-3.5" />
          <span>Custom Goals</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
            {customCount}
          </span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by topic, instructor, channel, or concept..."
            value={filterOptions.search}
            onChange={(e) => setFilterOptions((prev) => ({ ...prev, search: e.target.value }))}
            className="w-full bg-transparent text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterOptions.status}
              onChange={(e) => setFilterOptions((prev) => ({ ...prev, status: e.target.value as any }))}
              className="bg-transparent focus:outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="all">All Statuses</option>
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="reviewing">Reviewing</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 shadow-sm">
            <ArrowUpDown className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={filterOptions.sortBy}
              onChange={(e) => setFilterOptions((prev) => ({ ...prev, sortBy: e.target.value as any }))}
              className="bg-transparent focus:outline-none text-slate-800 dark:text-slate-200"
            >
              <option value="deadline">Sort by Deadline</option>
              <option value="progress">Sort by Progress %</option>
              <option value="priority">Sort by Priority</option>
              <option value="updated">Recently Updated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Course Cards */}
      {filteredGoals.length === 0 ? (
        <div className="glass-panel rounded-3xl p-12 text-center">
          <GraduationCap className="h-12 w-12 text-slate-400 mx-auto mb-3 opacity-60" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1">No learning tracks found</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search query or filters, or create a new goal.
          </p>
          <button
            onClick={() => setIsAddGoalOpen(true)}
            className="px-4 py-2 text-white text-xs font-bold rounded-xl shadow-md"
            style={{ backgroundColor: currentTheme.primary }}
          >
            Create New Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredGoals.map((goal) => {
            if (goal.type === 'udemy') {
              return <UdemyCourseCard key={goal.id} goal={goal} />;
            }
            if (goal.type === 'youtube') {
              return <YouTubePlaylistCard key={goal.id} goal={goal} />;
            }
            if (goal.type === 'dsa') {
              return <DsaRoadmapView key={goal.id} goal={goal} />;
            }
            return <CustomTopicCard key={goal.id} goal={goal} />;
          })}
        </div>
      )}
    </div>
  );
};
