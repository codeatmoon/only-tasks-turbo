"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { isSignInWithEmailLink } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react";

export default function VerifyEmailPage() {
  const { signInWithMagicLink, user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyEmailLink = async () => {
      try {
        const emailLink = window.location.href;
        const apiKey = searchParams.get('apiKey');

        // Handle apiKey verification (non-Firebase magic links)
        if (apiKey) {
          try {
            const response = await fetch(`/api/auth/verify?apiKey=${apiKey}`);
            const data = await response.json();
            
            if (!response.ok) {
              throw new Error(data.error || "API key verification failed");
            }

            // If API key is verified successfully, redirect as suggested
            if (data.redirect) {
              router.push(data.redirect);
              return;
            }

            // Default success case - redirect to dashboard for magic link verification
            router.push("/dashboard");
            return;
          } catch (err: unknown) {
            console.error("Error verifying API key:", err);
            setError(err instanceof Error ? err.message : "Failed to verify API key");
            setIsVerifying(false);
            return;
          }
        }

        // Handle Firebase magic links
        if (!auth) {
          throw new Error("Firebase authentication is not properly configured");
        }
        
        // Check if the link is a valid sign-in link
        if (!isSignInWithEmailLink(auth, emailLink)) {
          setError("Invalid sign-in link. Please request a new one.");
          setIsVerifying(false);
          return;
        }

        // Get the email from localStorage or prompt user
        let email = window.localStorage.getItem('emailForSignIn');
        
        if (!email) {
          // If email is not available in localStorage, we can try to get it from URL params
          // or prompt the user to enter it
          email = searchParams.get('email') || '';
          if (!email) {
            setError("Email address is required. Please request a new sign-in link.");
            setIsVerifying(false);
            return;
          }
        }

        // Sign in with the email link
        await signInWithMagicLink(email, emailLink);
        
        // Redirect to dashboard on success
        router.push("/dashboard");
      } catch (err: unknown) {
        console.error("Error verifying email link:", err);
        setError(err instanceof Error ? err.message : "Failed to verify email link");
        setIsVerifying(false);
      }
    };

    // Only run verification if user is not already signed in
    if (!user) {
      verifyEmailLink();
    } else {
      // User is already signed in, redirect to dashboard
      router.push("/dashboard");
    }
  }, [signInWithMagicLink, router, searchParams, user]);

  if (user) {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto p-6">
        <div className="text-center">
          {isVerifying ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4">
                <Loader2 className="h-12 w-12" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verifying your email...
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Please wait while we sign you in.
              </p>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-600 dark:text-red-400 text-xl">✕</span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error}
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => router.push("/signup")}
                  className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Request New Link
                </button>
                <button
                  onClick={() => router.push("/")}
                  className="w-full py-2 px-4 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                >
                  Go Home
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}