"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  onAuthStateChanged, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup, 
  signOut,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  signInWithEmailLink
} from "firebase/auth";
import { auth, googleProvider } from "./firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendMagicLink: (email: string) => Promise<void>;
  signInWithMagicLink: (email: string, emailLink: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      // If Firebase is not configured, set loading to false immediately
      setLoading(false);
      return;
    }
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithEmail = async (email: string, password: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not properly configured");
      }
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error signing in with email:", error);
      throw error;
    }
  };

  const signUpWithEmail = async (email: string, password: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not properly configured");
      }
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error creating user with email:", error);
      throw error;
    }
  };

  const sendMagicLink = async (email: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not properly configured");
      }
      
      const actionCodeSettings = {
        url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001'}/auth/verify`,
        handleCodeInApp: true,
      };
      
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Save the email locally so we can retrieve it after the user clicks the link
      if (typeof window !== 'undefined') {
        window.localStorage.setItem('emailForSignIn', email);
      }
    } catch (error) {
      console.error("Error sending magic link:", error);
      throw error;
    }
  };

  const signInWithMagicLink = async (email: string, emailLink: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not properly configured");
      }
      
      await signInWithEmailLink(auth, email, emailLink);
      
      // Clear the email from local storage
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('emailForSignIn');
      }
    } catch (error) {
      console.error("Error signing in with magic link:", error);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      if (!auth || !googleProvider) {
        throw new Error("Firebase authentication is not properly configured");
      }
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not properly configured");
      }
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      if (!auth) {
        throw new Error("Firebase authentication is not properly configured");
      }
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Error sending password reset email:", error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    signInWithEmail,
    signUpWithEmail,
    sendMagicLink,
    signInWithMagicLink,
    signInWithGoogle,
    logout,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}