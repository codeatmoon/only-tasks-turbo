/**
 * Extract Firebase ID token from the client-side Firebase auth state
 * This should be used on the client side to get the token to send to API routes
 */
export async function getFirebaseToken(): Promise<string | null> {
  if (typeof window === "undefined") return null;

  try {
    const { auth } = await import("./firebase");
    if (!auth) return null;

    const user = auth.currentUser;
    if (!user) return null;

    return await user.getIdToken();
  } catch (error) {
    console.error("Error getting Firebase token:", error);
    return null;
  }
}

/**
 * Create authenticated fetch function that automatically includes Firebase token
 */
export function createAuthenticatedFetch() {
  return async (url: string, options: RequestInit = {}) => {
    const token = await getFirebaseToken();

    // Normalize URL to absolute same-origin to avoid nested route relative fetch issues
    const absoluteUrl = (() => {
      if (/^https?:\/\//i.test(url)) return url;
      const base = typeof window !== 'undefined' ? window.location.origin : '';
      const path = url.startsWith('/') ? url : `/${url}`;
      return `${base}${path}`;
    })();

    const headers = {
      ...options.headers,
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    return fetch(absoluteUrl, {
      ...options,
      headers,
    });
  };
}