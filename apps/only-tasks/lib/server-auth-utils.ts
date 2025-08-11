import { NextRequest } from "next/server";
import { adminAuth } from "./firebaseAdmin";
import { AuthLogger } from "./auth-logger";

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
  const logContext = AuthLogger.createRequestContext(request, 'firebase-token-verify');
  
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      AuthLogger.logWarning(logContext, { 
        error: "Missing or invalid authorization header",
        hasAuthHeader: Boolean(authHeader),
        authHeaderFormat: authHeader?.substring(0, 20) || 'none'
      }, "Token verification failed: No valid Bearer token");
      return null;
    }

    const idToken = authHeader.split("Bearer ")[1];
    if (!idToken) {
      AuthLogger.logWarning(logContext, { 
        error: "Empty ID token after Bearer",
        authHeaderLength: authHeader.length
      }, "Token verification failed: Empty token");
      return null;
    }

    if (!adminAuth) {
      AuthLogger.logError(logContext, { 
        error: "Firebase Admin Auth is not initialized",
        hasAdminAuth: Boolean(adminAuth)
      }, "Token verification failed: Admin Auth not available");
      return null;
    }

    // Log the token verification attempt (without logging the actual token for security)
    AuthLogger.logRequest(logContext, {
      tokenLength: idToken.length,
      tokenPrefix: idToken.substring(0, 10) + '...',
      provider: 'firebase'
    });

    const decodedToken = await adminAuth.verifyIdToken(idToken);
    
    const userDetails = {
      uid: decodedToken.uid,
      email: decodedToken.email || "",
      name: decodedToken.name,
    };

    // Log successful verification
    AuthLogger.logFirebaseEvent(
      logContext,
      {
        uid: userDetails.uid,
        email: userDetails.email,
        firebaseAction: 'token-verify',
        tokenExpiry: new Date(decodedToken.exp * 1000).toISOString(),
        tokenIssued: new Date(decodedToken.iat * 1000).toISOString(),
        audience: decodedToken.aud,
        issuer: decodedToken.iss
      },
      true,
      "ID token verification successful"
    );
    
    return userDetails;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    AuthLogger.logError(logContext, {
      error: errorMessage,
      errorType: error instanceof Error ? error.constructor.name : typeof error,
      provider: 'firebase'
    }, `Token verification failed: ${errorMessage}`);
    return null;
  }
}