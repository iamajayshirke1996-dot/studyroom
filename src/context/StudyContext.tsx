import React, { createContext, useContext, useState, useEffect, useMemo, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  LearningGoal,
  StudySession,
  FilterOptions,
  StudyStats,
  TopicSummary,
  TopicType,
  MaangWeek,
  DailySteps,
  JobOutreach,
  OutreachStats,
  YoutubeShort,
  ShortsStats,
  UserFeaturePermissions,
} from '../types';
import {
  loadGoalsFromStorage,
  saveGoalsToStorage,
  loadSessionsFromStorage,
  saveSessionsToStorage,
  loadMaangWeeksFromStorage,
  saveMaangWeeksToStorage,
  loadDailyStepsFromStorage,
  saveDailyStepsToStorage,
  loadStepHistoryFromStorage,
  saveStepHistoryToStorage,
  getLocalDateString,
  loadJobOutreachesFromStorage,
  saveJobOutreachesToStorage,
  loadOutreachDailyGoalFromStorage,
  saveOutreachDailyGoalToStorage,
  loadShortsFromStorage,
  saveShortsToStorage,
  loadShortsDailyGoalFromStorage,
  saveShortsDailyGoalToStorage,
  loadUserPermissionsFromStorage,
  saveUserPermissionsToStorage,
  exportAppState,
  importAppState,
} from '../utils/storage';
import { INITIAL_GOALS, INITIAL_STUDY_SESSIONS } from '../utils/initialData';
import { INITIAL_MAANG_WEEKS } from '../utils/maangData';
import { useAuth } from './AuthContext';
import { getDefaultPermissions } from '../utils/featureFlags';
import {
  subscribeToGoals,
  saveGoalToFirestore,
  deleteGoalFromFirestore,
  subscribeToSessions,
  saveSessionToFirestore,
  subscribeToMaangWeeks,
  saveMaangWeekToFirestore,
  saveDailyStepsToFirestore,
  subscribeToStepHistory,
  saveJobOutreachToFirestore,
  deleteJobOutreachFromFirestore,
  subscribeToJobOutreaches,
  saveShortToFirestore,
  deleteShortFromFirestore,
  subscribeToShorts,
  saveUserPermissionsToFirestore,
  deleteUserPermissionsFromFirestore,
  subscribeToAllPermissions,
  migrateLocalDataToCloud,
  checkUserHasCloudData,
} from '../services/firestoreService';
import { fetchAndSyncFromGoogleSheet } from '../services/googleSheetSync';

interface StudyContextType {
  goals: LearningGoal[];
  sessions: StudySession[];
  maangWeeks: MaangWeek[];
  stats: StudyStats;
  activeTab: 'dashboard' | 'topics' | 'timeline' | 'summary' | 'maang' | 'jobs' | 'shorts' | 'admin';
  setActiveTab: (tab: 'dashboard' | 'topics' | 'timeline' | 'summary' | 'maang' | 'jobs' | 'shorts' | 'admin') => void;
  filterOptions: FilterOptions;
  setFilterOptions: React.Dispatch<React.SetStateAction<FilterOptions>>;
  selectedGoalForModal: LearningGoal | null;
  setSelectedGoalForModal: (goal: LearningGoal | null) => void;
  isAddGoalOpen: boolean;
  setIsAddGoalOpen: (open: boolean) => void;
  isLogStudyOpen: boolean;
  setIsLogStudyOpen: (open: boolean) => void;
  activeGoalForLog: LearningGoal | null;
  setActiveGoalForLog: (goal: LearningGoal | null) => void;
  selectedSummaryGoal: LearningGoal | null;
  setSelectedSummaryGoal: (goal: LearningGoal | null) => void;
  isPomodoroOpen: boolean;
  setIsPomodoroOpen: (open: boolean) => void;
  openEditGoalModal: (goal: LearningGoal) => void;

  // Cloud sync states
  isSyncing: boolean;
  syncLocalToCloud: () => Promise<number>;

  // Actions
  addGoal: (goalData: Partial<LearningGoal> & { title: string; type: TopicType }) => LearningGoal;
  updateGoal: (id: string, updates: Partial<LearningGoal>) => void;
  deleteGoal: (id: string) => void;
  incrementProgress: (goalId: string, amount?: number) => void;
  toggleDsaProblem: (goalId: string, problemId: string) => void;
  toggleMilestone: (goalId: string, milestoneId: string) => void;
  updateSummary: (goalId: string, summaryUpdates: Partial<TopicSummary>) => void;
  recordTopicReview: (goalId: string) => void;
  logStudySession: (sessionData: Omit<StudySession, 'id'>) => void;
  exportData: () => void;
  importData: (file: File) => Promise<boolean>;
  resetToDefaultData: () => void;

  // MAANG 12-Week Roadmap Actions
  toggleMaangDeliverable: (weekId: string, deliverableId: string) => void;
  toggleMaangReviewCheck: (weekId: string) => void;
  updateMaangWeekStatus: (weekId: string, status: 'in_progress' | 'pending' | 'completed') => void;
  saveMaangNotes: (weekId: string, notes: string) => void;
  syncMaangFromGoogleSheet: (sheetOrCsvUrl?: string) => Promise<number>;

  // Health & Smart Watch Step Tracker
  dailySteps: DailySteps;
  stepHistory: Record<string, DailySteps>;
  updateDailySteps: (steps: number, source?: DailySteps['source'], deviceName?: string) => void;
  logPastSteps: (date: string, steps: number, goal?: number, source?: DailySteps['source']) => void;
  setDailyStepGoal: (goal: number) => void;
  isWatchSyncModalOpen: boolean;
  setIsWatchSyncModalOpen: (open: boolean) => void;
  isHealthDashboardOpen: boolean;
  setIsHealthDashboardOpen: (open: boolean) => void;

  // Job Application & Cold Outreach Tracker
  jobOutreaches: JobOutreach[];
  outreachDailyGoal: number;
  outreachStats: OutreachStats;
  isLogOutreachOpen: boolean;
  setIsLogOutreachOpen: (open: boolean) => void;
  editingOutreach: JobOutreach | null;
  setEditingOutreach: (outreach: JobOutreach | null) => void;
  addJobOutreach: (outreachData: Omit<JobOutreach, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateJobOutreach: (id: string, updates: Partial<JobOutreach>) => void;
  deleteJobOutreach: (id: string) => void;
  setOutreachDailyGoal: (goal: number) => void;

  // YouTube Shorts Upload Dashboard
  youtubeShorts: YoutubeShort[];
  shortsDailyGoal: number;
  shortsStats: ShortsStats;
  isLogShortOpen: boolean;
  setIsLogShortOpen: (open: boolean) => void;
  editingShort: YoutubeShort | null;
  setEditingShort: (short: YoutubeShort | null) => void;
  addYoutubeShort: (shortData: Omit<YoutubeShort, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateYoutubeShort: (id: string, updates: Partial<YoutubeShort>) => void;
  deleteYoutubeShort: (id: string) => void;
  setShortsDailyGoal: (goal: number) => void;

  // Access Control & User Permissions
  userPermissionsMap: Record<string, UserFeaturePermissions>;
  currentUserPermissions: UserFeaturePermissions;
  updateUserPermissions: (perms: UserFeaturePermissions) => void;
  deleteUserPermissions: (email: string) => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

export const StudyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const isRealCloudUser = Boolean(user && !user.uid.startsWith('guest_') && !user.uid.startsWith('demo_'));

  const [goals, setGoals] = useState<LearningGoal[]>(() => loadGoalsFromStorage());
  const [sessions, setSessions] = useState<StudySession[]>(() => loadSessionsFromStorage());
  const [maangWeeks, setMaangWeeks] = useState<MaangWeek[]>(() => loadMaangWeeksFromStorage());
  const [activeTab, setActiveTab] = useState<'dashboard' | 'topics' | 'timeline' | 'summary' | 'maang' | 'jobs' | 'shorts' | 'admin'>('dashboard');

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    search: '',
    type: 'all',
    status: 'all',
    priority: 'all',
    sortBy: 'deadline',
  });

  // Modal controls
  const [selectedGoalForModal, setSelectedGoalForModal] = useState<LearningGoal | null>(null);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [isLogStudyOpen, setIsLogStudyOpen] = useState(false);
  const [activeGoalForLog, setActiveGoalForLog] = useState<LearningGoal | null>(null);
  const [selectedSummaryGoal, setSelectedSummaryGoal] = useState<LearningGoal | null>(null);
  const [isPomodoroOpen, setIsPomodoroOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isWatchSyncModalOpen, setIsWatchSyncModalOpen] = useState(false);
  const [isHealthDashboardOpen, setIsHealthDashboardOpen] = useState(false);

  // Health Step Tracker State
  const [dailySteps, setDailySteps] = useState<DailySteps>(() => loadDailyStepsFromStorage());
  const [stepHistory, setStepHistory] = useState<Record<string, DailySteps>>(() => loadStepHistoryFromStorage());

  // Job Application & Cold Outreach State
  const [jobOutreaches, setJobOutreaches] = useState<JobOutreach[]>(() => loadJobOutreachesFromStorage());
  const [outreachDailyGoal, setOutreachDailyGoalState] = useState<number>(() => loadOutreachDailyGoalFromStorage());
  const [isLogOutreachOpen, setIsLogOutreachOpen] = useState(false);
  const [editingOutreach, setEditingOutreach] = useState<JobOutreach | null>(null);

  // YouTube Shorts State
  const [youtubeShorts, setYoutubeShorts] = useState<YoutubeShort[]>(() => loadShortsFromStorage());
  const [shortsDailyGoal, setShortsDailyGoalState] = useState<number>(() => loadShortsDailyGoalFromStorage());
  const [isLogShortOpen, setIsLogShortOpen] = useState(false);
  const [editingShort, setEditingShort] = useState<YoutubeShort | null>(null);

  // User Permissions State
  const [userPermissionsMap, setUserPermissionsMap] = useState<Record<string, UserFeaturePermissions>>(() => loadUserPermissionsFromStorage());

  const currentUserPermissions = useMemo(() => {
    const email = user?.email || '';
    if (email && userPermissionsMap[email.toLowerCase()]) {
      return userPermissionsMap[email.toLowerCase()];
    }
    return getDefaultPermissions(email);
  }, [user, userPermissionsMap]);

  const updateUserPermissions = (perms: UserFeaturePermissions) => {
    if (!perms.email) return;
    const emailKey = perms.email.toLowerCase();
    const updatedMap = {
      ...userPermissionsMap,
      [emailKey]: perms,
    };
    setUserPermissionsMap(updatedMap);
    saveUserPermissionsToStorage(updatedMap);
    saveUserPermissionsToFirestore(perms).catch(console.error);
  };

  const deleteUserPermissions = (email: string) => {
    if (!email) return;
    const emailKey = email.toLowerCase();
    setUserPermissionsMap((prev) => {
      const copy = { ...prev };
      delete copy[emailKey];
      saveUserPermissionsToStorage(copy);
      return copy;
    });
    deleteUserPermissionsFromFirestore(email).catch(console.error);
  };

  const addYoutubeShort = (shortData: Omit<YoutubeShort, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newShort: YoutubeShort = {
      ...shortData,
      id: `short-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };

    setYoutubeShorts((prev) => {
      const next = [newShort, ...prev];
      saveShortsToStorage(next);
      return next;
    });

    if (isRealCloudUser && user) {
      saveShortToFirestore(user.uid, newShort).catch(console.error);
    }
  };

  const updateYoutubeShort = (id: string, updates: Partial<YoutubeShort>) => {
    setYoutubeShorts((prev) => {
      const next = prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates, updatedAt: new Date().toISOString() };
          if (isRealCloudUser && user) {
            saveShortToFirestore(user.uid, updated).catch(console.error);
          }
          return updated;
        }
        return s;
      });
      saveShortsToStorage(next);
      return next;
    });
  };

  const deleteYoutubeShort = (id: string) => {
    setYoutubeShorts((prev) => {
      const next = prev.filter((s) => s.id !== id);
      saveShortsToStorage(next);
      return next;
    });

    if (isRealCloudUser && user) {
      deleteShortFromFirestore(user.uid, id).catch(console.error);
    }
  };

  const setShortsDailyGoal = (goal: number) => {
    const validGoal = Math.max(1, Math.round(goal));
    setShortsDailyGoalState(validGoal);
    saveShortsDailyGoalToStorage(validGoal);
  };

  // Shorts Stats Calculation
  const shortsStats = useMemo<ShortsStats>(() => {
    const todayStr = getLocalDateString();
    const uploaded = youtubeShorts.filter((s) => s.status === 'uploaded');
    const todayCount = uploaded.filter((s) => s.uploadDate === todayStr).length;
    const totalUploaded = uploaded.length;
    const totalViews = youtubeShorts.reduce((acc, s) => acc + (s.views || 0), 0);

    const datesWithUploaded = new Set(uploaded.map((s) => s.uploadDate));
    let streak = 0;
    const checkDate = new Date();

    const todayHasUploaded = datesWithUploaded.has(getLocalDateString(checkDate));
    if (!todayHasUploaded) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (datesWithUploaded.has(getLocalDateString(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      currentStreak: streak,
      todayCount,
      dailyGoal: shortsDailyGoal,
      totalUploaded,
      totalViews,
    };
  }, [youtubeShorts, shortsDailyGoal]);

  const updateDailySteps = (steps: number, source: DailySteps['source'] = 'manual', deviceName?: string) => {
    const todayStr = getLocalDateString();
    const stepsNum = Math.max(0, Math.round(steps));
    const distanceKm = Math.round((stepsNum * 0.00076) * 100) / 100;
    const caloriesBurned = Math.round(stepsNum * 0.04);
    const activeMinutes = Math.round(stepsNum / 100);

    const updated: DailySteps = {
      date: todayStr,
      steps: stepsNum,
      goal: dailySteps.goal || 8000,
      lastSyncedAt: new Date().toISOString(),
      source,
      deviceName: deviceName || (source === 'apple_health' ? 'Apple Health (Realme Watch)' : source === 'realme_watch' ? 'realme Watch' : undefined),
      distanceKm,
      caloriesBurned,
      activeMinutes,
    };

    setDailySteps(updated);
    saveDailyStepsToStorage(updated);

    setStepHistory((prev) => {
      const nextHistory = { ...prev, [todayStr]: updated };
      saveStepHistoryToStorage(nextHistory);
      return nextHistory;
    });

    if (isRealCloudUser && user) {
      saveDailyStepsToFirestore(user.uid, updated).catch(console.error);
    }
  };

  const logPastSteps = (date: string, steps: number, goal = 8000, source: DailySteps['source'] = 'apple_health') => {
    const stepsNum = Math.max(0, Math.round(steps));
    const distanceKm = Math.round((stepsNum * 0.00076) * 100) / 100;
    const caloriesBurned = Math.round(stepsNum * 0.04);
    const activeMinutes = Math.round(stepsNum / 100);

    const record: DailySteps = {
      date,
      steps: stepsNum,
      goal,
      lastSyncedAt: new Date().toISOString(),
      source,
      deviceName: source === 'apple_health' ? 'Apple Health (Realme Watch)' : 'Manual',
      distanceKm,
      caloriesBurned,
      activeMinutes,
    };

    setStepHistory((prev) => {
      const nextHistory = { ...prev, [date]: record };
      saveStepHistoryToStorage(nextHistory);
      return nextHistory;
    });

    const todayStr = getLocalDateString();
    if (date === todayStr) {
      setDailySteps(record);
      saveDailyStepsToStorage(record);
    }

    if (isRealCloudUser && user) {
      saveDailyStepsToFirestore(user.uid, record).catch(console.error);
    }
  };

  const setDailyStepGoal = (goal: number) => {
    const todayStr = getLocalDateString();
    const updated: DailySteps = {
      ...dailySteps,
      goal: Math.max(1000, Math.round(goal)),
    };
    setDailySteps(updated);
    saveDailyStepsToStorage(updated);
    setStepHistory((prev) => {
      const current = prev[todayStr] || updated;
      const nextHistory = { ...prev, [todayStr]: { ...current, goal: updated.goal } };
      saveStepHistoryToStorage(nextHistory);
      return nextHistory;
    });
    if (isRealCloudUser && user) {
      saveDailyStepsToFirestore(user.uid, updated).catch(console.error);
    }
  };

  // Automatic day rollover check (e.g. past midnight)
  useEffect(() => {
    const checkMidnightRollover = () => {
      const todayStr = getLocalDateString();
      if (dailySteps.date !== todayStr) {
        const fresh = loadDailyStepsFromStorage();
        setDailySteps(fresh);
        setStepHistory(loadStepHistoryFromStorage());
        if (isRealCloudUser && user) {
          saveDailyStepsToFirestore(user.uid, fresh).catch(console.error);
        }
      }
    };

    checkMidnightRollover();
    window.addEventListener('focus', checkMidnightRollover);
    const interval = setInterval(checkMidnightRollover, 15000);

    return () => {
      window.removeEventListener('focus', checkMidnightRollover);
      clearInterval(interval);
    };
  }, [dailySteps.date, isRealCloudUser, user]);

  // Job Application & Outreach Actions
  const addJobOutreach = (outreachData: Omit<JobOutreach, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newRecord: JobOutreach = {
      ...outreachData,
      id: `job-${Date.now()}`,
      appliedDate: outreachData.appliedDate || getLocalDateString(),
      createdAt: now,
      updatedAt: now,
    };

    const updated = [newRecord, ...jobOutreaches];
    setJobOutreaches(updated);
    saveJobOutreachesToStorage(updated);

    if (isRealCloudUser && user) {
      saveJobOutreachToFirestore(user.uid, newRecord).catch(console.error);
    }
  };

  const updateJobOutreach = (id: string, updates: Partial<JobOutreach>) => {
    const updated = jobOutreaches.map((item) => {
      if (item.id === id) {
        const merged = { ...item, ...updates, updatedAt: new Date().toISOString() };
        if (isRealCloudUser && user) {
          saveJobOutreachToFirestore(user.uid, merged).catch(console.error);
        }
        return merged;
      }
      return item;
    });

    setJobOutreaches(updated);
    saveJobOutreachesToStorage(updated);
  };

  const deleteJobOutreach = (id: string) => {
    const updated = jobOutreaches.filter((item) => item.id !== id);
    setJobOutreaches(updated);
    saveJobOutreachesToStorage(updated);

    if (isRealCloudUser && user) {
      deleteJobOutreachFromFirestore(user.uid, id).catch(console.error);
    }
  };

  const setOutreachDailyGoal = (goal: number) => {
    const val = Math.max(1, Math.round(goal));
    setOutreachDailyGoalState(val);
    saveOutreachDailyGoalToStorage(val);
  };

  // Outreach Stats & Streak Calculation
  const outreachStats = useMemo<OutreachStats>(() => {
    const todayStr = getLocalDateString();
    const todayCount = jobOutreaches.filter((j) => j.appliedDate === todayStr).length;
    const totalApplications = jobOutreaches.length;
    const repliedCount = jobOutreaches.filter((j) => j.status === 'replied').length;
    const interviewingCount = jobOutreaches.filter((j) => j.status === 'interviewing').length;
    const offerCount = jobOutreaches.filter((j) => j.status === 'offer').length;

    const positiveResponses = repliedCount + interviewingCount + offerCount;
    const responseRate = totalApplications > 0 ? Math.round((positiveResponses / totalApplications) * 100) : 0;

    // Calculate Outreach Streak (consecutive days with >= 1 job application / cold outreach)
    const datesWithOutreach = new Set(jobOutreaches.map((j) => j.appliedDate));
    let streak = 0;
    const checkDate = new Date();

    const todayHasOutreach = datesWithOutreach.has(getLocalDateString(checkDate));
    if (!todayHasOutreach) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    while (datesWithOutreach.has(getLocalDateString(checkDate))) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    return {
      currentStreak: streak,
      todayCount,
      dailyGoal: outreachDailyGoal,
      totalApplications,
      repliedCount,
      interviewingCount,
      offerCount,
      responseRate,
    };
  }, [jobOutreaches, outreachDailyGoal]);

  const openEditGoalModal = (goal: LearningGoal) => {
    setSelectedGoalForModal(goal);
    setIsAddGoalOpen(true);
  };

  // Track initial migration per user
  const initialMigrationDone = useRef<string | null>(null);

  // Sync to local storage always (offline fallback cache)
  useEffect(() => {
    saveGoalsToStorage(goals);
  }, [goals]);

  useEffect(() => {
    saveSessionsToStorage(sessions);
  }, [sessions]);

  useEffect(() => {
    saveMaangWeeksToStorage(maangWeeks);
  }, [maangWeeks]);

  // Cloud Firestore subscriptions only when user is genuinely logged into Firebase Auth
  useEffect(() => {
    if (!isRealCloudUser || !user) return;

    // Check if cloud data exists; if not, migrate local data automatically
    const checkAndMigrate = async () => {
      if (initialMigrationDone.current === user.uid) return;
      initialMigrationDone.current = user.uid;

      try {
        const hasData = await checkUserHasCloudData(user.uid);
        if (!hasData && (goals.length > 0 || maangWeeks.length > 0)) {
          setIsSyncing(true);
          await migrateLocalDataToCloud(user.uid, goals, sessions, maangWeeks);
          setIsSyncing(false);
        }
      } catch (err) {
        console.warn('Cloud migration check notice (Firestore rules may be strict):', err);
        setIsSyncing(false);
      }
    };

    checkAndMigrate();

    // Subscribe to Firestore collections
    const unsubGoals = subscribeToGoals(user.uid, (cloudGoals) => {
      if (cloudGoals && cloudGoals.length > 0) {
        setGoals(cloudGoals);
      }
    });

    const unsubSessions = subscribeToSessions(user.uid, (cloudSessions) => {
      if (cloudSessions && cloudSessions.length > 0) {
        setSessions(cloudSessions);
      }
    });

    const unsubWeeks = subscribeToMaangWeeks(user.uid, (cloudWeeks) => {
      if (cloudWeeks && cloudWeeks.length > 0) {
        setMaangWeeks(cloudWeeks);
      }
    });

    const unsubSteps = subscribeToStepHistory(user.uid, (cloudHistory) => {
      if (cloudHistory && Object.keys(cloudHistory).length > 0) {
        setStepHistory((prev) => {
          const merged = { ...prev, ...cloudHistory };
          saveStepHistoryToStorage(merged);
          return merged;
        });
        const todayStr = new Date().toISOString().slice(0, 10);
        if (cloudHistory[todayStr]) {
          setDailySteps(cloudHistory[todayStr]);
          saveDailyStepsToStorage(cloudHistory[todayStr]);
        }
      }
    });

    const unsubJobs = subscribeToJobOutreaches(user.uid, (cloudJobs) => {
      if (cloudJobs && cloudJobs.length > 0) {
        setJobOutreaches(cloudJobs);
        saveJobOutreachesToStorage(cloudJobs);
      }
    });

    const unsubShorts = subscribeToShorts(user.uid, (cloudShorts) => {
      if (cloudShorts && cloudShorts.length > 0) {
        setYoutubeShorts(cloudShorts);
        saveShortsToStorage(cloudShorts);
      }
    });

    return () => {
      unsubGoals();
      unsubSessions();
      unsubWeeks();
      unsubSteps();
      unsubJobs();
      unsubShorts();
    };
  }, [isRealCloudUser, user]);

  // Realtime subscription for global permissions
  useEffect(() => {
    const unsub = subscribeToAllPermissions((cloudMap) => {
      if (cloudMap && Object.keys(cloudMap).length > 0) {
        setUserPermissionsMap((prev) => {
          const merged = { ...prev, ...cloudMap };
          saveUserPermissionsToStorage(merged);
          return merged;
        });
      }
    });
    return () => unsub();
  }, []);

  // Compute overall stats
  const stats = useMemo<StudyStats>(() => {
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const totalHours = Math.round((totalMinutes / 60) * 10) / 10;
    const completedGoals = goals.filter((g) => g.status === 'completed').length;
    const inProgressGoals = goals.filter((g) => g.status === 'in_progress').length;

    // DSA stats
    let dsaSolvedTotal = 0;
    let dsaEasySolved = 0;
    let dsaMediumSolved = 0;
    let dsaHardSolved = 0;

    goals.forEach((g) => {
      if (g.dsaProblems && g.dsaProblems.length > 0) {
        g.dsaProblems.forEach((p) => {
          if (p.solved) {
            dsaSolvedTotal++;
            if (p.difficulty === 'easy') dsaEasySolved++;
            if (p.difficulty === 'medium') dsaMediumSolved++;
            if (p.difficulty === 'hard') dsaHardSolved++;
          }
        });
      }
    });

    // Upcoming deadlines in next 14 days
    const now = new Date();
    const future14Days = new Date();
    future14Days.setDate(now.getDate() + 14);

    const upcomingDeadlinesCount = goals.filter((g) => {
      if (g.status === 'completed' || !g.deadline) return false;
      const d = new Date(g.deadline);
      return d >= now && d <= future14Days;
    }).length;

    // Calculate streak
    const sessionDates = Array.from(
      new Set(
        sessions.map((s) => {
          const d = new Date(s.date);
          return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        })
      )
    ).sort().reverse();

    let streak = 0;
    if (sessionDates.length > 0) {
      const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      const yesterday = new Date();
      yesterday.setDate(now.getDate() - 1);
      const yesterdayStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;

      let checkDate = new Date();
      if (!sessionDates.includes(todayStr)) {
        if (sessionDates.includes(yesterdayStr)) {
          checkDate = yesterday;
        } else {
          checkDate = new Date(0);
        }
      }

      if (checkDate.getTime() > 0) {
        while (true) {
          const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
          if (sessionDates.includes(dateStr)) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
          } else {
            break;
          }
        }
      }
    }

    return {
      totalHours,
      totalSessions: sessions.length,
      currentStreak: streak,
      completedGoals,
      inProgressGoals,
      totalGoals: goals.length,
      dsaSolvedTotal,
      dsaEasySolved,
      dsaMediumSolved,
      dsaHardSolved,
      upcomingDeadlinesCount,
    };
  }, [goals, sessions]);

  // Actions
  const addGoal = (goalData: Partial<LearningGoal> & { title: string; type: TopicType }): LearningGoal => {
    const nowIso = new Date().toISOString();
    const newGoal: LearningGoal = {
      id: `goal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: nowIso,
      updatedAt: nowIso,
      status: 'in_progress',
      category: 'General',
      priority: 'medium',
      description: goalData.description || '',
      estimatedHours: 10,
      spentHours: 0,
      totalLectures: goalData.type === 'udemy' ? 20 : undefined,
      completedLectures: goalData.type === 'udemy' ? 0 : undefined,
      totalVideos: goalData.type === 'youtube' ? 10 : undefined,
      completedVideos: goalData.type === 'youtube' ? 0 : undefined,
      dsaProblems: [],
      milestones: [],
      summary: {
        keyTakeaways: [],
        cheatSheetCode: '',
        gotchas: [],
        confidenceLevel: 3,
        reviewCount: 0,
        resourceLinks: [],
      },
      ...goalData,
    };

    setGoals((prev) => [newGoal, ...prev]);

    if (isRealCloudUser && user) {
      saveGoalToFirestore(user.uid, newGoal).catch(console.error);
    }

    return newGoal;
  };

  const updateGoal = (id: string, updates: Partial<LearningGoal>) => {
    setGoals((prev) => {
      const updated = prev.map((g) => {
        if (g.id === id) {
          const newGoal = { ...g, ...updates, updatedAt: new Date().toISOString() };
          if (isRealCloudUser && user) {
            saveGoalToFirestore(user.uid, newGoal).catch(console.error);
          }
          return newGoal;
        }
        return g;
      });
      return updated;
    });
  };

  const deleteGoal = (id: string) => {
    setGoals((prev) => prev.filter((g) => g.id !== id));
    if (isRealCloudUser && user) {
      deleteGoalFromFirestore(user.uid, id).catch(console.error);
    }
  };

  const incrementProgress = (goalId: string, amount: number = 1) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;

        let updated = { ...g, updatedAt: new Date().toISOString() };

        if (g.type === 'udemy' && g.totalLectures) {
          const newCompleted = Math.min(g.totalLectures, (g.completedLectures || 0) + amount);
          const isDone = newCompleted >= g.totalLectures;
          updated = {
            ...updated,
            completedLectures: newCompleted,
            status: isDone ? 'completed' : g.status,
          };
          if (isDone) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          }
        } else if (g.type === 'youtube' && g.totalVideos) {
          const newCompleted = Math.min(g.totalVideos, (g.completedVideos || 0) + amount);
          const isDone = newCompleted >= g.totalVideos;
          updated = {
            ...updated,
            completedVideos: newCompleted,
            status: isDone ? 'completed' : g.status,
          };
          if (isDone) {
            confetti({ particleCount: 80, spread: 60, origin: { y: 0.6 } });
          }
        }

        if (isRealCloudUser && user) {
          saveGoalToFirestore(user.uid, updated).catch(console.error);
        }

        return updated;
      })
    );
  };

  const toggleDsaProblem = (goalId: string, problemId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId || !g.dsaProblems) return g;

        let newlySolved = false;
        const newProblems = g.dsaProblems.map((p) => {
          if (p.id === problemId) {
            const updated = !p.solved;
            if (updated) newlySolved = true;
            return {
              ...p,
              solved: updated,
              solvedAt: updated ? new Date().toISOString() : undefined,
            };
          }
          return p;
        });

        const allSolved = newProblems.length > 0 && newProblems.every((p) => p.solved);
        if (newlySolved) {
          confetti({ particleCount: 40, spread: 50, origin: { y: 0.7 } });
        }

        const updatedGoal: LearningGoal = {
          ...g,
          dsaProblems: newProblems,
          status: allSolved ? 'completed' : g.status,
          updatedAt: new Date().toISOString(),
        };

        if (isRealCloudUser && user) {
          saveGoalToFirestore(user.uid, updatedGoal).catch(console.error);
        }

        return updatedGoal;
      })
    );
  };

  const toggleMilestone = (goalId: string, milestoneId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId || !g.milestones) return g;

        let newlyDone = false;
        const newMilestones = g.milestones.map((m) => {
          if (m.id === milestoneId) {
            const updated = !m.completed;
            if (updated) newlyDone = true;
            return {
              ...m,
              completed: updated,
              completedAt: updated ? new Date().toISOString() : undefined,
            };
          }
          return m;
        });

        const allCompleted = newMilestones.length > 0 && newMilestones.every((m) => m.completed);
        if (newlyDone) {
          confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
        }

        const updatedGoal: LearningGoal = {
          ...g,
          milestones: newMilestones,
          status: allCompleted ? 'completed' : g.status,
          updatedAt: new Date().toISOString(),
        };

        if (isRealCloudUser && user) {
          saveGoalToFirestore(user.uid, updatedGoal).catch(console.error);
        }

        return updatedGoal;
      })
    );
  };

  const updateSummary = (goalId: string, summaryUpdates: Partial<TopicSummary>) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const currentSummary = g.summary || {
          keyTakeaways: [],
          cheatSheetCode: '',
          gotchas: [],
          confidenceLevel: 3,
          reviewCount: 0,
          resourceLinks: [],
        };

        const updatedGoal: LearningGoal = {
          ...g,
          summary: {
            ...currentSummary,
            ...summaryUpdates,
            lastReviewedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };

        if (isRealCloudUser && user) {
          saveGoalToFirestore(user.uid, updatedGoal).catch(console.error);
        }

        return updatedGoal;
      })
    );
  };

  const recordTopicReview = (goalId: string) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id !== goalId) return g;
        const currentSummary = g.summary || {
          keyTakeaways: [],
          cheatSheetCode: '',
          gotchas: [],
          confidenceLevel: 3,
          reviewCount: 0,
          resourceLinks: [],
        };

        const updatedGoal: LearningGoal = {
          ...g,
          summary: {
            ...currentSummary,
            reviewCount: (currentSummary.reviewCount || 0) + 1,
            lastReviewedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };

        if (isRealCloudUser && user) {
          saveGoalToFirestore(user.uid, updatedGoal).catch(console.error);
        }

        return updatedGoal;
      })
    );
  };

  const logStudySession = (sessionData: Omit<StudySession, 'id'>) => {
    const newSession: StudySession = {
      id: `sess-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...sessionData,
    };

    setSessions((prev) => [newSession, ...prev]);

    if (isRealCloudUser && user) {
      saveSessionToFirestore(user.uid, newSession).catch(console.error);
    }

    if (sessionData.lecturesDone && sessionData.goalId) {
      incrementProgress(sessionData.goalId, sessionData.lecturesDone);
    } else if (sessionData.videosWatched && sessionData.goalId) {
      incrementProgress(sessionData.goalId, sessionData.videosWatched);
    }

    confetti({ particleCount: 30, spread: 45, origin: { y: 0.8 } });
  };

  // MAANG 12-Week Roadmap Actions
  const toggleMaangDeliverable = (weekId: string, deliverableId: string) => {
    setMaangWeeks((prev) =>
      prev.map((w) => {
        if (w.id !== weekId) return w;
        let checked = false;
        const deliverables = w.deliverables.map((d) => {
          if (d.id === deliverableId) {
            checked = !d.completed;
            return { ...d, completed: checked };
          }
          return d;
        });

        const allDone = deliverables.every((d) => d.completed);
        const updatedWeek: MaangWeek = {
          ...w,
          deliverables,
          status: allDone ? 'completed' : 'in_progress',
        };

        if (checked) {
          confetti({ particleCount: 25, spread: 40, origin: { y: 0.7 } });
        }

        if (isRealCloudUser && user) {
          saveMaangWeekToFirestore(user.uid, updatedWeek).catch(console.error);
        }

        return updatedWeek;
      })
    );
  };

  const toggleMaangReviewCheck = (weekId: string) => {
    setMaangWeeks((prev) =>
      prev.map((w) => {
        if (w.id !== weekId) return w;
        const updatedWeek: MaangWeek = {
          ...w,
          weeklyReviewCompleted: !w.weeklyReviewCompleted,
        };

        if (isRealCloudUser && user) {
          saveMaangWeekToFirestore(user.uid, updatedWeek).catch(console.error);
        }

        return updatedWeek;
      })
    );
  };

  const updateMaangWeekStatus = (weekId: string, status: 'in_progress' | 'pending' | 'completed') => {
    setMaangWeeks((prev) =>
      prev.map((w) => {
        if (w.id !== weekId) return w;
        const updatedWeek: MaangWeek = { ...w, status };
        if (isRealCloudUser && user) {
          saveMaangWeekToFirestore(user.uid, updatedWeek).catch(console.error);
        }
        return updatedWeek;
      })
    );
  };

  const saveMaangNotes = (weekId: string, notes: string) => {
    setMaangWeeks((prev) =>
      prev.map((w) => {
        if (w.id !== weekId) return w;
        const updatedWeek: MaangWeek = { ...w, notes };
        if (isRealCloudUser && user) {
          saveMaangWeekToFirestore(user.uid, updatedWeek).catch(console.error);
        }
        return updatedWeek;
      })
    );
  };

  const syncMaangFromGoogleSheet = async (sheetOrCsvUrl?: string): Promise<number> => {
    setIsSyncing(true);
    try {
      const updatedWeeks = await fetchAndSyncFromGoogleSheet(sheetOrCsvUrl, maangWeeks);
      setMaangWeeks(updatedWeeks);
      saveMaangWeeksToStorage(updatedWeeks);
      if (isRealCloudUser && user) {
        for (const week of updatedWeeks) {
          await saveMaangWeekToFirestore(user.uid, week);
        }
      }
      setIsSyncing(false);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      return updatedWeeks.length;
    } catch (err) {
      setIsSyncing(false);
      throw err;
    }
  };

  // Sync all local data into user's Cloud Firestore
  const syncLocalToCloud = async (): Promise<number> => {
    if (!isRealCloudUser || !user) {
      throw new Error('Please sign in with Google first before syncing to cloud.');
    }
    setIsSyncing(true);
    try {
      const count = await migrateLocalDataToCloud(user.uid, goals, sessions, maangWeeks);
      setIsSyncing(false);
      return count;
    } catch (err) {
      setIsSyncing(false);
      throw err;
    }
  };

  const exportData = () => {
    exportAppState(goals, sessions, maangWeeks);
  };

  const importData = async (file: File): Promise<boolean> => {
    try {
      const text = await file.text();
      const data = importAppState(text);
      if (data) {
        setGoals(data.goals);
        setSessions(data.sessions);
        if (data.maangWeeks) {
          setMaangWeeks(data.maangWeeks);
        }
        if (isRealCloudUser && user) {
          migrateLocalDataToCloud(user.uid, data.goals, data.sessions, data.maangWeeks || maangWeeks).catch(console.error);
        }
        return true;
      }
    } catch (err) {
      console.error('Import failed:', err);
    }
    return false;
  };

  const resetToDefaultData = () => {
    setGoals(INITIAL_GOALS);
    setSessions(INITIAL_STUDY_SESSIONS);
    setMaangWeeks(INITIAL_MAANG_WEEKS);
    if (isRealCloudUser && user) {
      migrateLocalDataToCloud(user.uid, INITIAL_GOALS, INITIAL_STUDY_SESSIONS, INITIAL_MAANG_WEEKS).catch(console.error);
    }
  };

  return (
    <StudyContext.Provider
      value={{
        goals,
        sessions,
        maangWeeks,
        stats,
        activeTab,
        setActiveTab,
        filterOptions,
        setFilterOptions,
        selectedGoalForModal,
        setSelectedGoalForModal,
        isAddGoalOpen,
        setIsAddGoalOpen,
        isLogStudyOpen,
        setIsLogStudyOpen,
        activeGoalForLog,
        setActiveGoalForLog,
        selectedSummaryGoal,
        setSelectedSummaryGoal,
        isPomodoroOpen,
        setIsPomodoroOpen,
        openEditGoalModal,
        isSyncing,
        syncLocalToCloud,
        addGoal,
        updateGoal,
        deleteGoal,
        incrementProgress,
        toggleDsaProblem,
        toggleMilestone,
        updateSummary,
        recordTopicReview,
        logStudySession,
        exportData,
        importData,
        resetToDefaultData,
        toggleMaangDeliverable,
        toggleMaangReviewCheck,
        updateMaangWeekStatus,
        saveMaangNotes,
        syncMaangFromGoogleSheet,
        dailySteps,
        stepHistory,
        updateDailySteps,
        logPastSteps,
        setDailyStepGoal,
        isWatchSyncModalOpen,
        setIsWatchSyncModalOpen,
        isHealthDashboardOpen,
        setIsHealthDashboardOpen,
        jobOutreaches,
        outreachDailyGoal,
        outreachStats,
        isLogOutreachOpen,
        setIsLogOutreachOpen,
        editingOutreach,
        setEditingOutreach,
        addJobOutreach,
        updateJobOutreach,
        deleteJobOutreach,
        setOutreachDailyGoal,
        youtubeShorts,
        shortsDailyGoal,
        shortsStats,
        isLogShortOpen,
        setIsLogShortOpen,
        editingShort,
        setEditingShort,
        addYoutubeShort,
        updateYoutubeShort,
        deleteYoutubeShort,
        setShortsDailyGoal,
        userPermissionsMap,
        currentUserPermissions,
        updateUserPermissions,
        deleteUserPermissions,
      }}
    >
      {children}
    </StudyContext.Provider>
  );
};

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};
