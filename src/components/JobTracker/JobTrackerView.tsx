import React, { useState } from 'react';
import {
  Briefcase,
  Flame,
  Plus,
  Search,
  Filter,
  Kanban,
  Table as TableIcon,
  Globe,
  Mail,
  UserCheck,
  CheckCircle2,
  Trash2,
  Edit2,
  ExternalLink,
  Target,
  TrendingUp,
  Award,
  Clock,
  Sparkles,
  Zap,
} from 'lucide-react';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { JobOutreach, OutreachPlatform, OutreachStatus } from '../../types';

export const JobTrackerView: React.FC = () => {
  const {
    jobOutreaches,
    outreachStats,
    setIsLogOutreachOpen,
    setEditingOutreach,
    updateJobOutreach,
    deleteJobOutreach,
    setOutreachDailyGoal,
  } = useStudy();

  const { currentTheme } = useTheme();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedPlatformFilter, setSelectedPlatformFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoalInput, setNewGoalInput] = useState(outreachStats.dailyGoal.toString());

  const handleOpenAddModal = () => {
    setEditingOutreach(null);
    setIsLogOutreachOpen(true);
  };

  const handleEditItem = (item: JobOutreach) => {
    setEditingOutreach(item);
    setIsLogOutreachOpen(true);
  };

  const handleSaveGoal = () => {
    const parsed = parseInt(newGoalInput, 10);
    if (!isNaN(parsed) && parsed > 0) {
      setOutreachDailyGoal(parsed);
    }
    setIsEditingGoal(false);
  };

  // Filter items
  const filteredOutreaches = jobOutreaches.filter((item) => {
    const matchesSearch =
      item.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.contactName && item.contactName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform =
      selectedPlatformFilter === 'all' || item.platform === selectedPlatformFilter;

    return matchesSearch && matchesPlatform;
  });

  const getPlatformBadge = (platform: OutreachPlatform) => {
    switch (platform) {
      case 'linkedin':
        return { label: 'LinkedIn', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' };
      case 'cold_email':
        return { label: 'Cold Email', color: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30' };
      case 'twitter':
        return { label: 'Twitter / X', color: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30' };
      case 'wellfound':
        return { label: 'Wellfound', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' };
      case 'yc':
        return { label: 'YC Startups', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' };
      case 'referral':
        return { label: 'Referral', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/20' };
      case 'careers_portal':
        return { label: 'Careers Site', color: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-500/30' };
      default:
        return { label: 'Other', color: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30' };
    }
  };

  const getStatusBadge = (status: OutreachStatus) => {
    switch (status) {
      case 'applied':
        return { label: 'Applied', color: 'bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30' };
      case 'replied':
        return { label: 'Replied 💬', color: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30' };
      case 'interviewing':
        return { label: 'Interviewing 🎯', color: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30' };
      case 'offer':
        return { label: 'Offer 🎉', color: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30' };
      case 'rejected':
        return { label: 'Rejected', color: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30' };
    }
  };

  const statusColumns: { status: OutreachStatus; title: string; count: number; color: string }[] = [
    {
      status: 'applied',
      title: 'Applied / Sent',
      count: filteredOutreaches.filter((j) => j.status === 'applied').length,
      color: 'border-slate-300 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-900/60',
    },
    {
      status: 'replied',
      title: 'Replied / Connected',
      count: filteredOutreaches.filter((j) => j.status === 'replied').length,
      color: 'border-blue-500/40 bg-blue-500/5',
    },
    {
      status: 'interviewing',
      title: 'Interview Scheduled',
      count: filteredOutreaches.filter((j) => j.status === 'interviewing').length,
      color: 'border-amber-500/40 bg-amber-500/5',
    },
    {
      status: 'offer',
      title: 'Offer Received 🎉',
      count: filteredOutreaches.filter((j) => j.status === 'offer').length,
      color: 'border-emerald-500/40 bg-emerald-500/5',
    },
    {
      status: 'rejected',
      title: 'Rejected / Closed',
      count: filteredOutreaches.filter((j) => j.status === 'rejected').length,
      color: 'border-rose-500/30 bg-rose-500/5',
    },
  ];

  const todayPercent = Math.min(
    100,
    Math.round((outreachStats.todayCount / outreachStats.dailyGoal) * 100)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Header & Stats */}
      <div className="glass-panel rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl text-white flex items-center justify-center shadow-lg"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                  Job & Cold Outreach Tracker
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
                  <Flame className="h-3.5 w-3.5 text-amber-500 fill-current" />
                  <span>v2.0 Active</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Track job applications, cold emails, DMs, response rates & daily outreach momentum
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAddModal}
              className="px-5 py-2.5 rounded-2xl text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
              style={{ backgroundColor: currentTheme.primary }}
            >
              <Plus className="h-4 w-4" />
              <span>Log Application / Outreach</span>
            </button>
          </div>
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Today Progress */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">TODAY'S TARGET</span>
              <button
                onClick={() => setIsEditingGoal(!isEditingGoal)}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline font-semibold"
              >
                {isEditingGoal ? 'Cancel' : 'Edit Goal'}
              </button>
            </div>

            {isEditingGoal ? (
              <div className="flex items-center gap-1.5 pt-1">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={newGoalInput}
                  onChange={(e) => setNewGoalInput(e.target.value)}
                  className="w-16 px-2 py-1 bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold text-slate-900 dark:text-white"
                />
                <button
                  onClick={handleSaveGoal}
                  className="px-2 py-1 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <div className="flex items-baseline justify-between">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {outreachStats.todayCount} <span className="text-sm font-semibold text-slate-400">/ {outreachStats.dailyGoal}</span>
                  </p>
                  <span className="text-xs font-bold text-emerald-500">{todayPercent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                    style={{ width: `${todayPercent}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Streak Flame */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">APPLICATION STREAK</span>
              <Flame className="h-4 w-4 text-amber-500 fill-current animate-pulse" />
            </div>
            <p className="text-2xl font-black text-amber-500">{outreachStats.currentStreak} Days</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Active consecutive outreach momentum</p>
          </div>

          {/* Card 3: Total Applications */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">TOTAL LOGGED</span>
              <Target className="h-4 w-4 text-indigo-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{outreachStats.totalApplications}</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Applications & cold outreaches</p>
          </div>

          {/* Card 4: Response Rate */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">RESPONSE RATE</span>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-2xl font-black text-emerald-500">{outreachStats.responseRate}%</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {outreachStats.repliedCount + outreachStats.interviewingCount + outreachStats.offerCount} positive responses
            </p>
          </div>

          {/* Card 5: Interviews & Offers */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">INTERVIEWS & OFFERS</span>
              <Award className="h-4 w-4 text-purple-500" />
            </div>
            <p className="text-2xl font-black text-purple-500">
              {outreachStats.interviewingCount} <span className="text-sm font-normal text-slate-400">Int / {outreachStats.offerCount} Offer</span>
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Pipeline conversion stage</p>
          </div>
        </div>
      </div>

      {/* Filter & View Switcher Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 glass-panel p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        {/* Left: Platform Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-semibold scrollbar-none">
          {[
            { id: 'all', label: 'All Platforms' },
            { id: 'linkedin', label: 'LinkedIn' },
            { id: 'cold_email', label: 'Cold Email' },
            { id: 'twitter', label: 'Twitter/X' },
            { id: 'wellfound', label: 'Wellfound' },
            { id: 'referral', label: 'Referrals' },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() => setSelectedPlatformFilter(filter.id)}
              className={`px-3 py-1.5 rounded-xl transition-all whitespace-nowrap ${
                selectedPlatformFilter === filter.id
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Right: Search & View Switcher */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-64">
            <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search company or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 shadow-xs"
            />
          </div>

          {/* Kanban / Table Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 shrink-0">
            <button
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                viewMode === 'kanban'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Kanban Pipeline Board"
            >
              <Kanban className="h-4 w-4" />
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                viewMode === 'table'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
              title="Table View"
            >
              <TableIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area: Kanban or Table */}
      {viewMode === 'kanban' ? (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
          {statusColumns.map((column) => {
            const colItems = filteredOutreaches.filter((j) => j.status === column.status);

            return (
              <div
                key={column.status}
                className={`rounded-2xl p-3 border ${column.color} flex flex-col min-h-[500px] shadow-sm`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800">
                  <h3 className="text-xs font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {column.title}
                  </h3>
                  <span className="w-5 h-5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-extrabold flex items-center justify-center">
                    {colItems.length}
                  </span>
                </div>

                {/* Column Items */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[70vh]">
                  {colItems.length === 0 ? (
                    <div className="text-center py-8 text-xs text-slate-400 italic border border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                      No applications
                    </div>
                  ) : (
                    colItems.map((item) => {
                      const platformBadge = getPlatformBadge(item.platform);

                      return (
                        <div
                          key={item.id}
                          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all space-y-2.5 group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${platformBadge.color}`}>
                              {platformBadge.label}
                            </span>
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => handleEditItem(item)}
                                className="p-1 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400"
                                title="Edit outreach details"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => deleteJobOutreach(item.id)}
                                className="p-1 text-slate-400 hover:text-rose-500"
                                title="Delete"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-extrabold text-slate-900 dark:text-white text-sm leading-tight">
                              {item.companyName}
                            </h4>
                            <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-0.5">
                              {item.role}
                            </p>
                          </div>

                          {item.contactName && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                              👤 {item.contactName} {item.contactHandle ? `(${item.contactHandle})` : ''}
                            </p>
                          )}

                          {item.notes && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 bg-slate-50 dark:bg-slate-950 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                              {item.notes}
                            </p>
                          )}

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{item.appliedDate}</span>
                            </span>

                            {/* Move Status Quick Selector */}
                            <select
                              value={item.status}
                              onChange={(e) => updateJobOutreach(item.id, { status: e.target.value as OutreachStatus })}
                              className="text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700 focus:outline-none"
                            >
                              <option value="applied">Applied</option>
                              <option value="replied">Replied</option>
                              <option value="interviewing">Interviewing</option>
                              <option value="offer">Offer 🎉</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="glass-panel rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-200">
              <thead className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase text-slate-500">
                <tr>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Platform</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredOutreaches.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-xs text-slate-400 italic">
                      No outreach records match your filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOutreaches.map((item) => {
                    const platformBadge = getPlatformBadge(item.platform);
                    const statusBadge = getStatusBadge(item.status);

                    return (
                      <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                          {item.companyName}
                        </td>
                        <td className="py-3 px-4 font-medium">{item.role}</td>
                        <td className="py-3 px-4">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded border ${platformBadge.color}`}>
                            {platformBadge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={item.status}
                            onChange={(e) => updateJobOutreach(item.id, { status: e.target.value as OutreachStatus })}
                            className={`text-xs font-bold px-2 py-1 rounded-xl border ${statusBadge.color} focus:outline-none cursor-pointer`}
                          >
                            <option value="applied">Applied</option>
                            <option value="replied">Replied 💬</option>
                            <option value="interviewing">Interviewing 🎯</option>
                            <option value="offer">Offer 🎉</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                          {item.contactName || item.contactHandle ? (
                            <span>{item.contactName} <span className="font-mono text-[10px]">{item.contactHandle}</span></span>
                          ) : (
                            <span className="italic text-slate-400">-</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{item.appliedDate}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleEditItem(item)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Edit"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => deleteJobOutreach(item.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
