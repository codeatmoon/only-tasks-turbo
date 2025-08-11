import { NextRequest, NextResponse } from "next/server";
import { AuthLogger } from "@/lib/auth-logger";

export async function GET(request: NextRequest) {
  const logContext = AuthLogger.createRequestContext(request, 'firebase-verify');
  
  try {
    const { searchParams } = new URL(request.url);
    const authDetails = AuthLogger.extractAuthDetailsFromParams(searchParams);
    
    // Log incoming request
    AuthLogger.logRequest(logContext, authDetails);
    
    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
      const errorDetails = { ...authDetails, error: "API key is required", statusCode: 400 };
      AuthLogger.logError(logContext, errorDetails, "Authentication failed: Missing API key");
      AuthLogger.logResponse(logContext, errorDetails, false);
      
      return NextResponse.json(
        { error: "API key is required" },
        { status: 400 }
      );
    }

    // Check if this is a valid Firebase API key by comparing with environment
    const expectedApiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    
    if (!expectedApiKey) {
      // Firebase is not configured, but we still got an apiKey verification request
      // This might be from an old email or a different auth system
      // Let's provide a helpful response
      const errorDetails = { 
        ...authDetails, 
        error: "Authentication system is not fully configured", 
        statusCode: 503 
      };
      AuthLogger.logWarning(logContext, errorDetails, "Firebase not configured but received verification request");
      AuthLogger.logResponse(logContext, errorDetails, false);
      
      return NextResponse.json(
        { 
          error: "Authentication system is not fully configured. Please sign up again.",
          redirect: "/signup?error=reauth_needed",
          suggestion: "It looks like you're trying to verify an authentication link, but the system configuration has changed. Please request a new verification link."
        },
        { status: 503 }
      );
    }

    if (apiKey !== expectedApiKey) {
      const errorDetails = { 
        ...authDetails, 
        error: "Invalid or expired verification link", 
        statusCode: 401,
        expectedApiKeyExists: Boolean(expectedApiKey),
        apiKeyMatch: false
      };
      AuthLogger.logError(logContext, errorDetails, "API key mismatch during verification");
      AuthLogger.logResponse(logContext, errorDetails, false);
      
      return NextResponse.json(
        { 
          error: "This verification link is invalid or expired",
          redirect: "/signup?error=invalid_link",
          suggestion: "Please request a new verification link from the sign up page."
        },
        { status: 401 }
      );
    }

    // If the API key matches, this might be a magic link verification
    // We should return success and let the frontend handle the authentication flow
    const successDetails = { 
      ...authDetails, 
      statusCode: 200,
      apiKeyMatch: true,
      isFirebaseMagicLink: true
    };
    AuthLogger.logFirebaseEvent(
      logContext,
      { ...successDetails, firebaseAction: 'magic-link-verify' },
      true,
      "Magic link verification successful"
    );
    AuthLogger.logResponse(logContext, successDetails, true);
    
    return NextResponse.json({
      success: true,
      message: "Verification link is valid",
      redirect: "/dashboard"
    });

  } catch (error) {
    const errorDetails = { 
      ...AuthLogger.extractAuthDetailsFromParams(new URL(request.url).searchParams),
      error: error instanceof Error ? error.message : "Unknown error",
      statusCode: 500
    };
    AuthLogger.logError(logContext, errorDetails, `Unexpected error in verification: ${error}`);
    AuthLogger.logResponse(logContext, errorDetails, false);
    
    return NextResponse.json(
      { 
        error: "Verification failed",
        redirect: "/signup?error=verify_failed"
      },
      { status: 500 }
    );
  }
}