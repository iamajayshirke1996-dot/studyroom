import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudyProvider, useStudy } from './context/StudyContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/Auth/LoginPage';
import { DashboardView } from './components/Dashboard/DashboardView';
import { TopicsListView } from './components/Topics/TopicsListView';
import { TimelineView } from './components/Timeline/TimelineView';
import { SummaryHubView } from './components/Summary/SummaryHubView';
import { MaangRoadmapView } from './components/MaangRoadmap/MaangRoadmapView';
import { JobTrackerView } from './components/JobTracker/JobTrackerView';
import { LogOutreachModal } from './components/JobTracker/LogOutreachModal';
import { AddEditGoalModal } from './components/Modals/AddEditGoalModal';
import { LogStudyModal } from './components/Modals/LogStudyModal';
import { TopicSummaryModal } from './components/Summary/TopicSummaryModal';
import { PomodoroModal } from './components/Modals/PomodoroModal';
import { ThemeCustomizerModal } from './components/Theme/ThemeCustomizerModal';
import { MiniTimerWidget } from './components/Modals/MiniTimerWidget';
import { RealmeWatchSyncModal } from './components/Modals/RealmeWatchSyncModal';
import { HealthAnalyticsModal } from './components/Modals/HealthAnalyticsModal';
import { MaangAccessDeniedView } from './components/MaangRoadmap/MaangAccessDeniedView';
import { canAccessMaangPrep } from './utils/authPermissions';
import { TimerProvider } from './context/TimerContext';
import { GraduationCap } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const { activeTab } = useStudy();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 font-semibold">Opening your study room...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated, show Single-Click Google SSO Login page
  if (!user) {
    return <LoginPage />;
  }

  // If user is authenticated, render their personal study room
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {activeTab === 'dashboard' && <DashboardView />}
        {activeTab === 'topics' && <TopicsListView />}
        {activeTab === 'timeline' && <TimelineView />}
        {activeTab === 'jobs' && <JobTrackerView />}
        {activeTab === 'maang' && (
          canAccessMaangPrep(user?.email) ? <MaangRoadmapView /> : <MaangAccessDeniedView />
        )}
        {activeTab === 'summary' && <SummaryHubView />}
      </main>

      {/* Global Modals */}
      <AddEditGoalModal />
      <LogStudyModal />
      <TopicSummaryModal />
      <PomodoroModal />
      <ThemeCustomizerModal />
      <MiniTimerWidget />
      <RealmeWatchSyncModal />
      <HealthAnalyticsModal />
      <LogOutreachModal />

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 py-6 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            <span className="font-bold text-slate-700 dark:text-slate-300">StudyPulse</span>
            <span>— Personalized Study Room & Retention Engine</span>
          </div>

          <p className="flex items-center gap-1 text-slate-500">
            Keep your knowledge fresh with spaced repetition & structured takeaways.
          </p>
        </div>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StudyProvider>
          <TimerProvider>
            <AppContent />
          </TimerProvider>
        </StudyProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
