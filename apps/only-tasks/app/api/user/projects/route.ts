import { NextRequest, NextResponse } from 'next/server';
import { verifyFirebaseToken } from '@/lib/server-auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyFirebaseToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Load user-specific projects from database
    // For now, return empty array to start fresh for authenticated users
    const projects: any[] = [];

    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Error fetching user projects:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await verifyFirebaseToken(request);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const project = await request.json();

    // TODO: Save project to database with user association
    // For now, just return the project as saved
    const savedProject = {
      ...project,
      userId: user.uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({ project: savedProject });
  } catch (error) {
    console.error('Error creating user project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}