import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyBZfRlmxfgJ7nk_04dXyTjRkA1ZIYo4Ch4',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'studyroom-ad520.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'studyroom-ad520',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'studyroom-ad520.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '124383331241',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:124383331241:web:510613a87ed2206e83fab8',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-VHYL5YPTCL',
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
} catch (error) {
  console.error('Failed to initialize Firebase app:', error);
  app = getApps()[0];
  auth = getAuth(app);
  db = getFirestore(app);
}

export const googleAuthProvider = new GoogleAuthProvider();
googleAuthProvider.setCustomParameters({ prompt: 'select_account' });

export { app, auth, db };
export const isFirebaseConfigured = true;
