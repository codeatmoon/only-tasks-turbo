"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FormPanel from "@/components/ui/FormPanel";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";

interface LoginFormProps {
  spaceId: string;
  onSuccess?: () => void;
}

export default function LoginForm({ spaceId, onSuccess }: LoginFormProps) {
  const { signInWithEmail, signInWithGoogle, resetPassword } = useAuth();
  
  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignIn, setIsSignIn] = useState(true);
  const [showResetPassword, setShowResetPassword] = useState(false);
  
  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (showResetPassword) {
      // Handle password reset
      setLoading(true);
      setError("");
      
      try {
        await resetPassword(email);
        setSuccessMessage("Password reset email sent! Check your inbox.");
        setShowResetPassword(false);
      } catch (err: any) {
        setError(err.message || "Failed to send password reset email");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await signInWithEmail(email, password);
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");

    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Failed to sign in with Google");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setEmail("");
    setPassword("");
    setError("");
    setSuccessMessage("");
    setShowResetPassword(false);
  };

  return (
    <div
      className="min-h-screen flex items-start justify-center p-12 gap-6"
      style={{
        backgroundColor: "var(--createspace-bg)",
        color: "var(--createspace-text)",
      }}
    >
      <div
        className="w-full"
        style={{ maxWidth: "var(--createspace-max-width)" }}
      >
        {/* Header Section */}
        <header className="text-left mb-7 relative">
          <h1 className="text-4xl font-bold mb-3 tracking-tight">
            {showResetPassword 
              ? "Reset Your Password"
              : `Access ${spaceId}`
            }
          </h1>
          <p
            className="text-base"
            style={{ color: "var(--createspace-muted)" }}
          >
            {showResetPassword
              ? "Enter your email address and we'll send you a password reset link."
              : "Sign in to access your tasks and collaborate with your team."
            }
          </p>

          {/* Theme toggle button */}
          <div className="absolute top-0 right-0">
            <button
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700
                         rounded-full px-3 py-2 text-xs font-medium
                         hover:border-blue-500 dark:hover:border-blue-400
                         transition-colors duration-200 shadow-sm"
              onClick={() => {
                const themeToggle = document.querySelector(
                  ".icon-btn",
                ) as HTMLButtonElement;
                if (themeToggle) themeToggle.click();
              }}
              aria-label="Toggle theme"
            >
              🌙
            </button>
          </div>
        </header>

        {/* Main Content */}
        <section
          className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] items-stretch"
          style={{ gap: "var(--createspace-gap)" }}
          aria-label="Sign in options"
        >
          {/* Left Panel: Email Authentication */}
          <FormPanel
            title={showResetPassword ? "Reset Password" : "Email Sign In"}
            subtitle={showResetPassword 
              ? "We'll send you a link to reset your password."
              : "Sign in with your email and password."
            }
            onSubmit={handleEmailAuth}
            className="lg:col-start-1"
          >
            <div className="flex-1">
              <InputField
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={setEmail}
                label="Email Address"
                placeholder="your@email.com"
                required
                disabled={loading}
              />

              {!showResetPassword && (
                <div className="mb-4">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >
                    Password
                  </label>
                  <PasswordField
                    id="password"
                    name="password"
                    value={password}
                    onChange={setPassword}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>
              )}

              {!showResetPassword && (
                <div className="text-center mb-4">
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(true)}
                    disabled={loading}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Forgot your password?
                  </button>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className="mt-auto pt-4 flex gap-3 items-center"
              style={{
                borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                borderTopColor: "var(--createspace-border-soft)",
              }}
            >
              <Button
                variant="slate"
                onClick={showResetPassword ? () => setShowResetPassword(false) : handleReset}
                disabled={loading}
              >
                {showResetPassword ? "Back" : "Reset"}
              </Button>
              <Button
                variant="blue"
                type="submit"
                disabled={loading || !email.trim() || (!showResetPassword && !password)}
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    {showResetPassword ? "Sending..." : "Signing in..."}
                  </>
                ) : (
                  showResetPassword ? "Send Reset Link" : "Sign In"
                )}
              </Button>
            </div>
          </FormPanel>

          {/* Right Panel: Google Authentication */}
          {!showResetPassword && (
            <FormPanel
              title="Google Sign In"
              subtitle="Sign in quickly and securely with your Google account."
              onSubmit={(e) => {
                e.preventDefault();
                handleGoogleAuth();
              }}
              className="lg:col-start-3"
            >
              <div className="flex-1">
                <div
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
                  role="region"
                  aria-label="Google sign in explanation"
                >
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Quick & Secure
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    Use your Google account to sign in instantly. No need to remember another password.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="mt-auto pt-4 flex gap-3 items-center justify-end"
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  borderTopColor: "var(--createspace-border-soft)",
                }}
              >
                <Button
                  variant="amber"
                  type="submit"
                  disabled={loading}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </Button>
              </div>
            </FormPanel>
          )}
        </section>

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
            </p>
          </div>
        )}

        {/* Success Display */}
        {successMessage && (
          <div className="mt-6 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
            <p className="text-green-600 dark:text-green-400 text-sm font-medium">
              {successMessage}
            </p>
          </div>
        )}

        {/* Hidden ThemeToggle for functionality */}
        <div className="hidden">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}