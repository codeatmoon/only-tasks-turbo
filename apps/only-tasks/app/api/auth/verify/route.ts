import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const apiKey = searchParams.get("apiKey");

    if (!apiKey) {
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
    return NextResponse.json({
      success: true,
      message: "Verification link is valid",
      redirect: "/signup?verified=true"
    });

  } catch (error) {
    console.error("Error in API key verification:", error);
    return NextResponse.json(
      { 
        error: "Verification failed",
        redirect: "/signup?error=verify_failed"
      },
      { status: 500 }
    );
  }
}