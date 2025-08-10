"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import FormPanel from "@/components/ui/FormPanel";
import InputField from "@/components/ui/InputField";
import PasswordField from "@/components/ui/PasswordField";
import Button from "@/components/ui/Button";

export default function CreateSpacePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form states for new space creation
  const [spaceName, setSpaceName] = useState("");
  const [emailCreate, setEmailCreate] = useState("");
  const [passwordCreate, setPasswordCreate] = useState("");

  // Form states for existing account login
  const [emailExisting, setEmailExisting] = useState("");

  // Email verification states
  const [pin, setPin] = useState("");
  const [step, setStep] = useState<"form" | "verify">("form");
  const [verificationId, setVerificationId] = useState("");

  // UI states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Get space name from URL parameters
    const spaceParam = searchParams.get("space");
    if (spaceParam) {
      setSpaceName(spaceParam);
    }
  }, [searchParams]);

  const handleCreateSpace = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!spaceName.trim()) {
      setError("Please enter a space name.");
      return;
    }

    if (!emailCreate.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!passwordCreate) {
      setError("Please create a password.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/spaces", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: spaceName.trim(),
          name: spaceName.trim(),
          email: emailCreate.trim(),
          password: passwordCreate,
          verificationId: verificationId || undefined,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.requiresVerification) {
          // User doesn't exist, send verification email
          await handleSendVerificationPin();
          return;
        } else {
          throw new Error(responseData.error || "Failed to create space");
        }
      }

      // Redirect to the created space
      router.push(`/${spaceName.trim()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create space");
    } finally {
      setLoading(false);
    }
  };

  const handleSendVerificationPin = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailCreate.trim(),
          spaceData: {
            id: spaceName.trim(),
            name: spaceName.trim(),
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send verification email");
      }

      setStep("verify");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to send verification email",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError("PIN is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailCreate.trim(),
          pin: pin.trim(),
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || "Failed to verify PIN");
      }

      // PIN verified, now create the space
      setVerificationId(responseData.spaceData?.id || "verified");
      setStep("form");

      // Automatically submit the form with verification
      setTimeout(() => {
        handleCreateSpace(e);
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to verify PIN");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToForm = () => {
    setStep("form");
    setPin("");
    setError("");
  };

  const handleSendLoginLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!emailExisting.trim()) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: emailExisting.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send login link");
      }

      setError("");
      alert("Login link sent to your email!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send login link",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSpaceName("");
    setEmailCreate("");
    setPasswordCreate("");
    setError("");
  };

  const handleCancel = () => {
    setEmailExisting("");
    setError("");
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
            {step === "verify"
              ? "Verify Your Email"
              : "Create or Access Your Space"}
          </h1>
          <p
            className="text-base"
            style={{ color: "var(--createspace-muted)" }}
          >
            {step === "verify"
              ? `We've sent a 6-digit PIN to ${emailCreate}. Please enter it below to verify your email address.`
              : "Set up your new space or log in to an existing one — all in a single page."}
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

        {step === "verify" ? (
          /* PIN Verification Section */
          <section className="max-w-md mx-auto">
            <FormPanel
              title="Email Verification"
              subtitle="Enter the 6-digit PIN we sent to your email address to continue."
              onSubmit={handleVerifyPin}
            >
              <div className="flex-1">
                <div className="mb-4">
                  <label
                    htmlFor="pin"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >
                    Verification PIN
                  </label>
                  <input
                    type="text"
                    id="pin"
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg 
                               bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100
                               focus:ring-2 focus:ring-blue-500 focus:border-transparent
                               placeholder-slate-500 dark:placeholder-slate-400 text-center text-xl tracking-widest"
                    placeholder="000000"
                    maxLength={6}
                    disabled={loading}
                    autoFocus
                  />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 text-center">
                    PIN expires in 15 minutes
                  </p>
                </div>

                <div className="text-center mb-4">
                  <button
                    type="button"
                    onClick={handleSendVerificationPin}
                    disabled={loading}
                    className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-medium"
                  >
                    Didn&apos;t receive the PIN? Send again
                  </button>
                </div>
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
                  onClick={handleBackToForm}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button
                  variant="blue"
                  type="submit"
                  disabled={loading || pin.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify & Continue"
                  )}
                </Button>
              </div>
            </FormPanel>
          </section>
        ) : (
          /* Original Main Layout */
          <section
            className="grid grid-cols-1 lg:grid-cols-[1fr_1px_1fr] items-stretch"
            style={{ gap: "var(--createspace-gap)" }}
            aria-label="Create or access"
          >
            {/* Left Panel: New Space */}
            <FormPanel
              title="New Space"
              subtitle="Create a new space and an account to manage it."
              onSubmit={handleCreateSpace}
              className="lg:col-start-1"
            >
              <div className="flex-1">
                <InputField
                  id="spaceName"
                  name="spaceName"
                  value={spaceName}
                  onChange={setSpaceName}
                  label="Space Name"
                  placeholder="e.g. marketing, product-team"
                  required
                  disabled={loading}
                />

                <InputField
                  id="emailCreate"
                  name="emailCreate"
                  type="email"
                  value={emailCreate}
                  onChange={setEmailCreate}
                  label="Email Address"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />

                <div className="mb-4">
                  <label
                    htmlFor="passwordCreate"
                    className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2"
                  >
                    Password
                  </label>
                  <PasswordField
                    id="passwordCreate"
                    name="passwordCreate"
                    value={passwordCreate}
                    onChange={setPasswordCreate}
                    placeholder="Create a secure password"
                    required
                    disabled={loading}
                    showStrengthIndicator
                    aria-describedby="pwHelp"
                  />
                  <div
                    id="pwHelp"
                    className="text-xs text-slate-500 dark:text-slate-400 mt-1"
                  >
                    Use at least 8 characters, mix letters and numbers.
                  </div>
                </div>
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
                  onClick={handleReset}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  variant="blue"
                  type="submit"
                  disabled={
                    loading ||
                    !spaceName.trim() ||
                    !emailCreate.trim() ||
                    !passwordCreate
                  }
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Space"
                  )}
                </Button>
              </div>
            </FormPanel>

            {/* Divider */}
            {/* <div
              className="hidden lg:block w-px"
              style={{ backgroundColor: "var(--createspace-border)" }}
              role="separator"
              aria-hidden="true"
            /> */}

            {/* Right Panel: Existing Account */}
            <FormPanel
              title="Existing Account"
              subtitle="Send a secure login link to access an existing space — no password required."
              onSubmit={handleSendLoginLink}
              className="lg:col-start-3"
            >
              <div className="flex-1">
                <InputField
                  id="emailExisting"
                  name="emailExisting"
                  type="email"
                  value={emailExisting}
                  onChange={setEmailExisting}
                  label="Email Address"
                  placeholder="your@email.com"
                  required
                  disabled={loading}
                />

                <div
                  className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800"
                  role="region"
                  aria-label="secure login explanation"
                >
                  <div className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                    Secure Login
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    We&apos;ll email a one-time secure login link. Links expire
                    shortly for your protection.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div
                className="mt-auto pt-4 flex gap-3 items-center"
                style={{
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                  borderTopColor: "var(--createspace-border-soft)",
                }}
              >
                <Button
                  variant="rose"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant="amber"
                  type="submit"
                  disabled={loading || !emailExisting.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Sending...
                    </>
                  ) : (
                    "Send Login Link"
                  )}
                </Button>
              </div>
            </FormPanel>
          </section>
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
            <p className="text-red-600 dark:text-red-400 text-sm font-medium">
              {error}
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
