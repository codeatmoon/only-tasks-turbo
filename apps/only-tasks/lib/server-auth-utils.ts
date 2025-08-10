import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";

export interface AuthenticatedUser {
  uid: string;
  email: string;
  name?: string;
}

/**
 * Verify Firebase ID token from request headers (server-side only)
 * @param request NextRequest object
 * @returns Promise<AuthenticatedUser | null> - User data if valid, null if invalid
 */
export async function verifyFirebaseToken(request: NextRequest): Promise<AuthenticatedUser | null> {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      return null;
    }

    if (!adminAuth) {
      console.error("Firebase Admin Auth is not initialized");
      return null;
    }

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    return {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name,
    };
  } catch (error) {
    console.error("Error verifying Firebase token:", error);
    return null;
  }
}