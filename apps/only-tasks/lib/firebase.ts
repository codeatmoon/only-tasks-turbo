import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Firebase client configuration - handle missing env vars gracefully
const firebaseConfig = {
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project",
  authDomain: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "demo-project"}.firebaseapp.com`,
  // Add other config fields as needed
};

// Initialize Firebase client-side app only if we have a valid project ID
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let googleProvider: GoogleAuthProvider | null = null;

try {
  if (process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    
    // Configure Google provider
    googleProvider = new GoogleAuthProvider();
    googleProvider.addScope('email');
    googleProvider.addScope('profile');
  }
} catch (error) {
  console.warn('Firebase initialization failed:', error);
}

export { auth, googleProvider };
export default app;