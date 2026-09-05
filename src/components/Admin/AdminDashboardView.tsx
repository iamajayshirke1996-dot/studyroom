import React, { useState, useEffect } from 'react';
import { useStudy } from '../../context/StudyContext';
import { useAuth } from '../../context/AuthContext';
import { isAdminEmail, getDefaultPermissions } from '../../utils/featureFlags';
import { UserFeaturePermissions } from '../../types';
import { subscribeToAllUsers, UserProfileInfo } from '../../services/firestoreService';
import {
  ShieldAlert,
  ShieldCheck,
  UserPlus,
  Search,
  CheckCircle2,
  XCircle,
  Sparkles,
  Lock,
  Video,
  Briefcase,
  Activity,
  Code2,
  RefreshCw,
  Users,
  Trash2,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const { user } = useAuth();
  const { userPermissionsMap, updateUserPermissions, deleteUserPermissions } = useStudy();

  const [searchQuery, setSearchQuery] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [cloudUsers, setCloudUsers] = useState<UserProfileInfo[]>([]);

  const currentUserEmail = user?.email || 'iamajayshirke1996@gmail.com';
  useEffect(() => {
    const unsub = subscribeToAllUsers((users) => {
      setCloudUsers(users);
    });
    return () => unsub();
  }, []);

  const isAdmin = isAdminEmail(currentUserEmail);

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
          Access Restricted
        </h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
          The Admin Control Panel is reserved for platform administrators (<code className="text-indigo-600 dark:text-indigo-400">iamajayshirke1996@gmail.com</code>).
        </p>
      </div>
    );
  }

  // Completely dynamic list: Real authenticated users from Firestore users collection + appPermissions collection + current admin
  const allUserEmails = Array.from(
    new Set([
      ...(currentUserEmail ? [currentUserEmail] : []),
      ...cloudUsers.map((u) => u.email!).filter((email) => Boolean(email && email.includes('@'))),
      ...Object.keys(userPermissionsMap).filter((email) => Boolean(email && email.includes('@'))),
    ])
  );

  const filteredEmails = allUserEmails.filter((email) =>
    email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getPermsForEmail = (email: string): UserFeaturePermissions => {
    const existing = userPermissionsMap[email.toLowerCase()];
    if (existing) return existing;
    return getDefaultPermissions(email);
  };

  const handleToggleFeature = (
    email: string,
    featureKey: keyof UserFeaturePermissions['features']
  ) => {
    const current = getPermsForEmail(email);
    const updated: UserFeaturePermissions = {
      ...current,
      features: {
        ...current.features,
        [featureKey]: !current.features[featureKey],
      },
      updatedAt: new Date().toISOString(),
    };
    updateUserPermissions(updated);
    showTempSuccess(`Updated permissions for ${email}`);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const emailToSave = newEmail.trim().toLowerCase();
    if (!emailToSave || !emailToSave.includes('@')) return;

    const initial = getPermsForEmail(emailToSave);
    updateUserPermissions(initial);
    setNewEmail('');
    setIsAddUserOpen(false);
    showTempSuccess(`Added ${emailToSave} to user permissions directory`);
  };

  const handleDeleteUser = (email: string) => {
    if (confirm(`Remove permissions profile for ${email}?`)) {
      deleteUserPermissions(email);
      showTempSuccess(`Removed ${email} from directory`);
    }
  };

  const showTempSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3500);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden border border-indigo-800/40">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Super Admin Control Panel
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              User Feature Access & Permissions ⚙️
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Assign and control which users can view specific modules like MAANG Prep, Health Steps, Job Application Tracker, or YouTube Shorts Dashboard.
            </p>
          </div>

          <button
            onClick={() => setIsAddUserOpen(true)}
            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all text-sm whitespace-nowrap"
          >
            <UserPlus className="w-4 h-4" /> Grant User Access
          </button>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl text-emerald-300 text-sm flex items-center gap-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            {successMsg}
          </div>
        )}
      </div>

      {/* Access Rules Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              MAANG Prep 🚀
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Universal access enabled for all users. Custom permissions can hide/show.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              Job Application Tracker 💼
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Track job applications, cold emails, DMs & outreach streaks per account.
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 rounded-xl">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
              YouTube Shorts Upload 🎬
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Shorts consistency dashboard for video creators & build-in-public devs.
            </p>
          </div>
        </div>
      </div>

      {/* Main Permissions Table Card */}
      <div className="bg-white dark:bg-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-700/60 shadow-xl overflow-hidden">
        {/* Table Search & Controls Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Registered User Permissions Directory
              <span className="px-2.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-semibold rounded-full">
                {filteredEmails.length} Accounts
              </span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Toggle feature switches for each registered account. Admin emails override all locks.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <form onSubmit={handleAddUser} className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="email"
                placeholder="Add user email to list..."
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="px-3.5 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
              <button
                type="submit"
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-sm transition-colors whitespace-nowrap"
              >
                + Add Email
              </button>
            </form>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              />
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50/70 dark:bg-slate-900/40 text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider border-b border-slate-200 dark:border-slate-700/60">
                <th className="py-4 px-6 font-semibold">User Email</th>
                <th className="py-4 px-6 font-semibold">Role</th>
                <th className="py-4 px-6 font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Code2 className="w-3.5 h-3.5 text-indigo-500" /> MAANG Prep
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-emerald-500" /> Steps & Health
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Briefcase className="w-3.5 h-3.5 text-purple-500" /> Job Tracker
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Video className="w-3.5 h-3.5 text-pink-500" /> YouTube Shorts
                  </div>
                </th>
                <th className="py-4 px-6 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/40">
              {filteredEmails.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 dark:text-slate-400">
                    No users matching "{searchQuery}" found.
                  </td>
                </tr>
              ) : (
                filteredEmails.map((email) => {
                  const perms = getPermsForEmail(email);
                  const isUserAdmin = isAdminEmail(email);
                  const cloudUser = cloudUsers.find(
                    (u) => u.email?.toLowerCase() === email.toLowerCase()
                  );

                  return (
                    <tr
                      key={email}
                      className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          {cloudUser?.photoURL ? (
                            <img
                              src={cloudUser.photoURL}
                              alt="Avatar"
                              className="w-8 h-8 rounded-full object-cover shrink-0 border border-slate-200 dark:border-slate-700"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">
                              {cloudUser?.displayName?.charAt(0).toUpperCase() ||
                                email.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div>
                            <div className="font-medium text-slate-800 dark:text-white flex items-center gap-2">
                              {email}
                              {email.toLowerCase() === currentUserEmail.toLowerCase() && (
                                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            {cloudUser?.displayName && (
                              <div className="text-xs text-slate-500 dark:text-slate-400">
                                {cloudUser.displayName}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-6">
                        {isUserAdmin ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-semibold rounded-full">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-500" /> Super Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium rounded-full">
                            Standard User
                          </span>
                        )}
                      </td>

                      {/* MAANG Prep Switch */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleFeature(email, 'maangPrep')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            perms.features.maangPrep
                              ? 'bg-indigo-600'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`Toggle MAANG Prep for ${email}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              perms.features.maangPrep ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Steps Tracker Switch */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleFeature(email, 'stepsTracker')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            perms.features.stepsTracker
                              ? 'bg-emerald-600'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`Toggle Steps & Health for ${email}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              perms.features.stepsTracker ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Job Tracker Switch */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleFeature(email, 'jobTracker')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            perms.features.jobTracker
                              ? 'bg-purple-600'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`Toggle Job Tracker for ${email}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              perms.features.jobTracker ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      {/* YouTube Shorts Switch */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => handleToggleFeature(email, 'youtubeShorts')}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                            perms.features.youtubeShorts
                              ? 'bg-pink-600'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                          title={`Toggle YouTube Shorts for ${email}`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              perms.features.youtubeShorts ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      </td>

                      {/* Delete / Remove Action */}
                      <td className="py-4 px-6 text-right">
                        {!isUserAdmin && email.toLowerCase() !== currentUserEmail.toLowerCase() && (
                          <button
                            onClick={() => handleDeleteUser(email)}
                            className="p-1.5 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors"
                            title={`Remove ${email} from directory`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full border border-slate-200 dark:border-slate-700 shadow-2xl space-y-5 animate-scaleUp">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-indigo-500" /> Register User Access
              </h3>
              <button
                onClick={() => setIsAddUserOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 dark:text-slate-400 mb-1">
                  User Google Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. user@gmail.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <p className="text-xs text-slate-500 dark:text-slate-400">
                Adding a user email enables you to individually toggle feature access for their account.
              </p>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddUserOpen(false)}
                  className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
