import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/dataService";
import { hashPassword, verifyPassword, generateUserId } from "@/lib/auth";
import { isValidEmail } from "@/lib/auth";
import { AuthLogger } from "@/lib/auth-logger";

const dataService = new DataService();

export async function POST(request: NextRequest) {
  const logContext = AuthLogger.createRequestContext(request, 'auth-signup');
  
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Log signup attempt
    AuthLogger.logRequest(logContext, { 
      email, 
      hasPassword: Boolean(password),
      passwordLength: password?.length,
      hasName: Boolean(name)
    });

    if (!email || !isValidEmail(email)) {
      const errorDetails = { email, error: "Valid email is required", statusCode: 400 };
      AuthLogger.logError(logContext, errorDetails, "Signup failed: Invalid email");
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    if (!password || password.length < 6) {
      const errorDetails = { email, error: "Password too short", statusCode: 400, passwordLength: password?.length };
      AuthLogger.logError(logContext, errorDetails, "Signup failed: Password too short");
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 },
      );
    }

    // Check if user already exists
    const existingUser = await dataService.getGlobalUserByEmail(email);
    if (existingUser) {
      const errorDetails = { email, error: "User already exists", statusCode: 409 };
      AuthLogger.logWarning(logContext, errorDetails, "Signup failed: User already exists");
      return NextResponse.json(
        { error: "User already exists" },
        { status: 409 },
      );
    }

    // Create new user
    const userId = generateUserId();
    const passwordHash = await hashPassword(password);

    const user = await dataService.createGlobalUser({
      id: userId,
      email,
      password_hash: passwordHash,
      name,
    });

    // Log successful signup
    AuthLogger.logSuccess(logContext, { 
      email, 
      uid: user.id, 
      statusCode: 200,
      hasName: Boolean(name)
    }, "User signup successful");

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    AuthLogger.logError(logContext, { 
      error: errorMessage, 
      statusCode: 500 
    }, `Signup failed: ${errorMessage}`);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const logContext = AuthLogger.createRequestContext(request, 'auth-login');
  
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const password = searchParams.get("password");

    // Log login attempt
    AuthLogger.logRequest(logContext, { 
      email: email || "undefined", 
      hasPassword: Boolean(password),
      passwordLength: password?.length
    });

    if (!email || !password) {
      const errorDetails = { 
        email: email || "undefined", 
        error: "Email and password are required", 
        statusCode: 400,
        missingEmail: !email,
        missingPassword: !password
      };
      AuthLogger.logError(logContext, errorDetails, "Login failed: Missing credentials");
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    const user = await dataService.getGlobalUserByEmail(email);
    if (!user || !user.password_hash) {
      const errorDetails = { 
        email, 
        error: "Invalid credentials", 
        statusCode: 401,
        userExists: Boolean(user),
        hasPasswordHash: Boolean(user?.password_hash)
      };
      AuthLogger.logWarning(logContext, errorDetails, "Login failed: User not found or no password");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);
    if (!isValidPassword) {
      const errorDetails = { 
        email, 
        uid: user.id,
        error: "Invalid credentials", 
        statusCode: 401,
        passwordValid: false
      };
      AuthLogger.logWarning(logContext, errorDetails, "Login failed: Invalid password");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Log successful login
    AuthLogger.logSuccess(logContext, { 
      email, 
      uid: user.id, 
      statusCode: 200,
      hasName: Boolean(user.name)
    }, "User login successful");

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    AuthLogger.logError(logContext, { 
      error: errorMessage, 
      statusCode: 500 
    }, `Login failed: ${errorMessage}`);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 },
    );
  }
}
