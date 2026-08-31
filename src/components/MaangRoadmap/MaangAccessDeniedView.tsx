import React from 'react';
import { Lock, Flame, ShieldAlert, LogIn, ArrowLeft, CheckCircle2, KeyRound } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useStudy } from '../../context/StudyContext';
import { useTheme } from '../../context/ThemeContext';
import { ALLOWED_MAANG_EMAILS } from '../../utils/authPermissions';

export const MaangAccessDeniedView: React.FC = () => {
  const { user, signInWithGoogle, logout } = useAuth();
  const { setActiveTab } = useStudy();
  const { currentTheme } = useTheme();

  const primaryEmail = ALLOWED_MAANG_EMAILS[0] || 'iamajayshirke1996@gmail.com';

  const handleSwitchAccount = async () => {
    try {
      await logout();
      await signInWithGoogle();
    } catch (err) {
      console.error('Failed to switch Google account:', err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 animate-in fade-in duration-300">
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl text-center space-y-6 relative overflow-hidden">
        {/* Background Decorative Blur */}
        <div
          className="absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: currentTheme.primary }}
        />

        {/* Lock Icon Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-3xl text-white flex items-center justify-center shadow-lg transform -rotate-3"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <Flame className="h-10 w-10" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-amber-500 text-slate-950 p-2 rounded-2xl shadow-md border-2 border-white dark:border-slate-900">
            <Lock className="h-5 w-5" />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-2 max-w-xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/30">
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Restricted Feature • Specific Email Access</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            MAANG 12-Week Roadmap Unlocks for Authorized Accounts
          </h2>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
            This intensive 12-Week Preparation Roadmap (Advanced JS, System Design, & 16 Algorithmic DSA Patterns) is configured to be accessible for authorized emails such as <strong className="text-slate-900 dark:text-white font-mono">{primaryEmail}</strong>.
          </p>
        </div>

        {/* Current Account Status Box */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 max-w-md mx-auto space-y-2 text-xs text-left">
          <span className="font-semibold text-slate-400 block uppercase tracking-wider text-[10px]">
            Your Current Login Status:
          </span>

          {user ? (
            <div className="flex items-center gap-3 pt-1">
              {user.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={user.displayName || 'User'}
                  className="w-9 h-9 rounded-full border border-slate-300 dark:border-slate-700"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 font-bold flex items-center justify-center text-slate-700 dark:text-slate-300">
                  {user.email?.[0].toUpperCase() || 'U'}
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold text-slate-900 dark:text-white truncate">
                  {user.displayName || 'Signed In User'}
                </p>
                <p className="text-slate-500 dark:text-slate-400 font-mono truncate">
                  {user.email}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 dark:text-slate-400 italic">
              Not signed in (Guest mode).
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
          <button
            onClick={handleSwitchAccount}
            className="w-full sm:w-auto px-6 py-3 rounded-2xl text-white font-bold text-xs shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            style={{ backgroundColor: currentTheme.primary }}
          >
            <LogIn className="h-4 w-4" />
            <span>Sign In as {primaryEmail}</span>
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
