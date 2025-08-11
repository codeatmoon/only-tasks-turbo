import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/server-auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyFirebaseToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Load user-specific theme from database
    // For now, return default theme for authenticated users
    const defaultTheme = {
      theme_name: "theme-1",
      mode: "dark" as const,
      brand: null
    };

    return NextResponse.json(defaultTheme);
  } catch (error) {
    console.error('Error fetching user theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyFirebaseToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { theme_name, mode, brand } = body as {
      theme_name: string;
      mode: "light" | "dark";
      brand?: "brand-a" | "brand-b" | null;
    };

    if (!theme_name || !mode) {
      return NextResponse.json(
        { error: "theme_name and mode are required" },
        { status: 400 },
      );
    }

    // TODO: Save user theme to database
    // For now, just return the theme as saved
    const savedTheme = {
      theme_name,
      mode,
      brand,
      userId: user.uid,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ theme: savedTheme });
  } catch (error) {
    console.error('Error saving user theme:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}