import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  getDocs,
  writeBatch,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { LearningGoal, StudySession, MaangWeek, DailySteps } from '../types';

/**
 * Remove undefined fields recursively because Firestore rejects undefined values
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof obj === 'object' && !(obj instanceof Date)) {
    const cleaned: Record<string, any> = {};
    for (const key of Object.keys(obj as Record<string, any>)) {
      const val = (obj as Record<string, any>)[key];
      if (val !== undefined) {
        cleaned[key] = cleanFirestoreData(val);
      }
    }
    return cleaned as T;
  }
  return obj;
}

function isCloudEligibleUser(userId: string | null | undefined): boolean {
  if (!userId) return false;
  if (userId.startsWith('guest_') || userId.startsWith('demo_')) return false;
  return true;
}

/**
 * Sync user profile doc upon login
 */
export async function syncUserProfile(user: {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}) {
  if (!db || !isCloudEligibleUser(user.uid)) return;
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(
      userRef,
      {
        uid: user.uid,
        email: user.email || null,
        displayName: user.displayName || 'Learner',
        photoURL: user.photoURL || null,
        lastActiveAt: serverTimestamp(),
      },
      { merge: true }
    );
  } catch (err) {
    console.warn('Could not sync user profile to Firestore:', err);
  }
}

/**
 * Subscribe to realtime updates for a user's goals
 */
export function subscribeToGoals(
  userId: string,
  onData: (goals: LearningGoal[]) => void,
  onError?: (err: Error) => void
) {
  if (!db || !isCloudEligibleUser(userId)) return () => {};

  const goalsRef = collection(db, 'users', userId, 'goals');
  return onSnapshot(
    goalsRef,
    (snapshot) => {
      const goals: LearningGoal[] = [];
      snapshot.forEach((docSnap) => {
        goals.push(docSnap.data() as LearningGoal);
      });
      onData(goals);
    },
    (err) => {
      console.warn('Firestore goals subscription warning (rules may be strict):', err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Save or update a single goal
 */
export async function saveGoalToFirestore(userId: string, goal: LearningGoal) {
  if (!db || !isCloudEligibleUser(userId)) return;
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goal.id);
    const cleaned = cleanFirestoreData(goal);
    await setDoc(goalRef, cleaned, { merge: true });
  } catch (err) {
    console.warn('Could not save goal to Firestore:', err);
  }
}

/**
 * Delete a goal
 */
export async function deleteGoalFromFirestore(userId: string, goalId: string) {
  if (!db || !isCloudEligibleUser(userId)) return;
  try {
    const goalRef = doc(db, 'users', userId, 'goals', goalId);
    await deleteDoc(goalRef);
  } catch (err) {
    console.warn('Could not delete goal from Firestore:', err);
  }
}

/**
 * Subscribe to realtime study sessions
 */
export function subscribeToSessions(
  userId: string,
  onData: (sessions: StudySession[]) => void,
  onError?: (err: Error) => void
) {
  if (!db || !isCloudEligibleUser(userId)) return () => {};

  const sessionsRef = collection(db, 'users', userId, 'sessions');
  const q = query(sessionsRef, orderBy('date', 'desc'));

  return onSnapshot(
    q,
    (snapshot) => {
      const sessions: StudySession[] = [];
      snapshot.forEach((docSnap) => {
        sessions.push(docSnap.data() as StudySession);
      });
      onData(sessions);
    },
    (err) => {
      console.warn('Firestore sessions subscription warning:', err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Save a study session
 */
export async function saveSessionToFirestore(userId: string, session: StudySession) {
  if (!db || !isCloudEligibleUser(userId)) return;
  try {
    const sessionRef = doc(db, 'users', userId, 'sessions', session.id);
    const cleaned = cleanFirestoreData(session);
    await setDoc(sessionRef, cleaned, { merge: true });
  } catch (err) {
    console.warn('Could not save session to Firestore:', err);
  }
}

/**
 * Subscribe to realtime MAANG 12-week roadmap states
 */
export function subscribeToMaangWeeks(
  userId: string,
  onData: (weeks: MaangWeek[]) => void,
  onError?: (err: Error) => void
) {
  if (!db || !isCloudEligibleUser(userId)) return () => {};

  const maangRef = collection(db, 'users', userId, 'maangWeeks');
  return onSnapshot(
    maangRef,
    (snapshot) => {
      const weeks: MaangWeek[] = [];
      snapshot.forEach((docSnap) => {
        weeks.push(docSnap.data() as MaangWeek);
      });
      if (weeks.length > 0) {
        weeks.sort((a, b) => a.weekNumber - b.weekNumber);
        onData(weeks);
      }
    },
    (err) => {
      console.warn('Firestore MAANG roadmap subscription warning:', err.message);
      if (onError) onError(err);
    }
  );
}

/**
 * Save a MAANG week state
 */
export async function saveMaangWeekToFirestore(userId: string, week: MaangWeek) {
  if (!db || !isCloudEligibleUser(userId)) return;
  try {
    const weekRef = doc(db, 'users', userId, 'maangWeeks', week.id);
    const cleaned = cleanFirestoreData(week);
    await setDoc(weekRef, cleaned, { merge: true });
  } catch (err) {
    console.warn('Could not save week to Firestore:', err);
  }
}

/**
 * Check if the user already has goals in Cloud Firestore
 */
export async function checkUserHasCloudData(userId: string): Promise<boolean> {
  if (!db || !isCloudEligibleUser(userId)) return false;
  try {
    const goalsRef = collection(db, 'users', userId, 'goals');
    const snap = await getDocs(goalsRef);
    return !snap.empty;
  } catch (err) {
    console.warn('Could not check user cloud data:', err);
    return false;
  }
}

/**
 * Batch migrate local data to Cloud Firestore under users/{userId}/
 */
export async function migrateLocalDataToCloud(
  userId: string,
  goals: LearningGoal[],
  sessions: StudySession[],
  maangWeeks: MaangWeek[]
): Promise<number> {
  if (!db || !isCloudEligibleUser(userId)) return 0;

  try {
    const batch = writeBatch(db);
    let count = 0;

    goals.forEach((goal) => {
      const ref = doc(db, 'users', userId, 'goals', goal.id);
      batch.set(ref, cleanFirestoreData(goal), { merge: true });
      count++;
    });

    sessions.forEach((session) => {
      const ref = doc(db, 'users', userId, 'sessions', session.id);
      batch.set(ref, cleanFirestoreData(session), { merge: true });
      count++;
    });

    maangWeeks.forEach((week) => {
      const ref = doc(db, 'users', userId, 'maangWeeks', week.id);
      batch.set(ref, cleanFirestoreData(week), { merge: true });
      count++;
    });

    await batch.commit();
    return count;
  } catch (err) {
    console.warn('Batch migration to Firestore skipped or failed:', err);
    return 0;
  }
}

export async function saveDailyStepsToFirestore(userId: string, steps: DailySteps): Promise<void> {
  if (!isCloudEligibleUser(userId)) return;
  try {
    const todayDocRef = doc(db, 'users', userId, 'health', steps.date);
    await setDoc(todayDocRef, cleanFirestoreData(steps), { merge: true });
  } catch (error) {
    console.warn('Could not save steps to Firestore:', error);
  }
}

export function subscribeToStepHistory(
  userId: string,
  onUpdate: (history: Record<string, DailySteps>) => void
): () => void {
  if (!isCloudEligibleUser(userId)) return () => {};

  const colRef = collection(db, 'users', userId, 'health');
  return onSnapshot(
    colRef,
    (snapshot) => {
      const records: Record<string, DailySteps> = {};
      snapshot.forEach((d) => {
        records[d.id] = d.data() as DailySteps;
      });
      onUpdate(records);
    },
    (err) => {
      console.warn('Firestore step history sync error:', err);
    }
  );
}
