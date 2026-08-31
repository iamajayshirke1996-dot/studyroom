import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth, googleAuthProvider, isFirebaseConfigured } from '../services/firebase';
import { syncUserProfile } from '../services/firestoreService';

export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isFirebaseConfigured: boolean;
  error: string | null;
  signInWithGoogle: () => Promise<void>;
  signInAsGuest: () => void;
  logout: () => Promise<void>;
}

const GUEST_STORAGE_KEY = 'studypulse_active_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If Firebase Auth is initialized, listen to live auth state
    if (auth && isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          const appUser: AppUser = {
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          };
          setUser(appUser);
          localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(appUser));

          try {
            await syncUserProfile({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
            });
          } catch (err) {
            console.error('Failed to sync profile to firestore:', err);
          }
        } else {
          // If signed out of Firebase, check if there was a guest user
          const cached = localStorage.getItem(GUEST_STORAGE_KEY);
          if (cached) {
            try {
              const parsed = JSON.parse(cached);
              if (parsed.uid.startsWith('guest_')) {
                setUser(parsed);
              } else {
                setUser(null);
              }
            } catch {
              setUser(null);
            }
          } else {
            setUser(null);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    } else {
      // Fallback: If Firebase keys are not in .env yet, check localStorage for existing session
      const cached = localStorage.getItem(GUEST_STORAGE_KEY);
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      }
      setLoading(false);
    }
  }, []);

  const handleSignInWithGoogle = async () => {
    setError(null);

    // If Firebase credentials are in .env, use real Firebase SSO popup
    if (auth && isFirebaseConfigured) {
      try {
        setLoading(true);
        await signInWithPopup(auth, googleAuthProvider);
      } catch (err: any) {
        console.error('Google Sign-In failed:', err);
        let message = err.message || 'Failed to sign in with Google';
        if (err.code === 'auth/popup-closed-by-user') {
          message = 'Sign-in cancelled';
        } else if (err.code === 'auth/unauthorized-domain') {
          message = 'Domain not authorized in Firebase Console (Authentication > Settings > Authorized domains).';
        }
        setError(message);
      } finally {
        setLoading(false);
      }
      return;
    }

    // If Firebase isn't configured in .env yet, simulate an instant 1-click Google sign-in demo
    // so developer/tester can experience the post-login study room immediately
    const demoUser: AppUser = {
      uid: 'demo_user_google_sso',
      email: 'alex.learner@gmail.com',
      displayName: 'Alex Learner',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    };
    setUser(demoUser);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(demoUser));
  };

  const handleSignInAsGuest = () => {
    const guestUser: AppUser = {
      uid: `guest_${Date.now()}`,
      email: null,
      displayName: 'Guest Student',
      photoURL: null,
    };
    setUser(guestUser);
    localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(guestUser));
  };

  const handleLogout = async () => {
    setError(null);
    if (auth && isFirebaseConfigured) {
      try {
        await signOut(auth);
      } catch (err: any) {
        console.error('Sign-out error:', err);
      }
    }
    setUser(null);
    localStorage.removeItem(GUEST_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isFirebaseConfigured,
        error,
        signInWithGoogle: handleSignInWithGoogle,
        signInAsGuest: handleSignInAsGuest,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
