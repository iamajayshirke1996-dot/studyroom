export type TopicType = 'udemy' | 'youtube' | 'dsa' | 'custom';

export type GoalStatus = 'not_started' | 'in_progress' | 'reviewing' | 'completed';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type DsaDifficulty = 'easy' | 'medium' | 'hard';

export interface DsaProblem {
  id: string;
  title: string;
  difficulty: DsaDifficulty;
  pattern: string;
  url?: string;
  solved: boolean;
  solvedAt?: string;
  notes?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

export interface Milestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  completedAt?: string;
}

export interface TopicSummary {
  keyTakeaways: string[];
  cheatSheetCode?: string;
  gotchas: string[];
  confidenceLevel: 1 | 2 | 3 | 4 | 5;
  lastReviewedAt?: string;
  reviewCount: number;
  resourceLinks?: { title: string; url: string }[];
}

export interface LearningGoal {
  id: string;
  title: string;
  type: TopicType;
  description: string;
  category: string;
  status: GoalStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  estimatedHours?: number;
  spentHours: number;

  // Udemy Course fields
  udemyUrl?: string;
  instructor?: string;
  totalLectures?: number;
  completedLectures?: number;
  totalSections?: number;
  completedSections?: number;

  // YouTube Playlist fields
  youtubeUrl?: string;
  channelName?: string;
  totalVideos?: number;
  completedVideos?: number;
  currentVideoTitle?: string;

  // DSA Topics & Roadmap
  dsaProblems?: DsaProblem[];
  dsaTopicGroup?: string;

  // Custom & Checkpoint Milestones
  milestones?: Milestone[];

  // Long-term Retention ("What I learnt")
  summary: TopicSummary;
}

export interface StudySession {
  id: string;
  goalId: string;
  goalTitle: string;
  goalType: TopicType;
  date: string;
  durationMinutes: number;
  notes: string;
  lecturesDone?: number;
  videosWatched?: number;
  problemsSolved?: number;
}

export interface FilterOptions {
  search: string;
  type: 'all' | TopicType;
  status: 'all' | GoalStatus;
  priority: 'all' | Priority;
  sortBy: 'deadline' | 'progress' | 'updated' | 'priority';
}

export interface StudyStats {
  totalHours: number;
  totalSessions: number;
  currentStreak: number;
  completedGoals: number;
  inProgressGoals: number;
  totalGoals: number;
  dsaSolvedTotal: number;
  dsaEasySolved: number;
  dsaMediumSolved: number;
  dsaHardSolved: number;
  upcomingDeadlinesCount: number;
}

export interface MaangDeliverable {
  id: string;
  text: string;
  completed: boolean;
}

export interface MaangWeek {
  id: string;
  weekNumber: number;
  dateRange: string;
  phase: 1 | 2 | 3;
  phaseTitle: string;
  status: 'in_progress' | 'pending' | 'completed';
  jsSystemDesignFocus: string;
  dsaMasteryFocus: string;
  deliverables: MaangDeliverable[];
  weeklyReviewCheck: string;
  weeklyReviewCompleted: boolean;
  workerTimetable: {
    weekday: string;
    saturday: string;
    sunday: string;
  };
  notes?: string;
}

export interface DailySteps {
  date: string; // YYYY-MM-DD
  steps: number;
  goal: number;
  lastSyncedAt?: string;
  source?: 'realme_watch' | 'google_fit' | 'apple_health' | 'manual' | 'bluetooth';
  deviceName?: string;
  distanceKm?: number;
  caloriesBurned?: number;
  activeMinutes?: number;
}
