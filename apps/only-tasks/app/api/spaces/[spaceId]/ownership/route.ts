import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/dataService";
import { verifyFirebaseToken } from "@/lib/server-auth-utils";

const dataService = new DataService();

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ spaceId: string }> }
) {
  try {
    const { spaceId } = await params;
    
    // Verify Firebase token and get user
    const user = await verifyFirebaseToken(request);
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if space exists
    const space = await dataService.getSpace(spaceId);
    if (!space) {
      return NextResponse.json(
        { error: "Space not found" },
        { status: 404 }
      );
    }

    // Get or create global user record for this Firebase user
    let globalUser = await dataService.getGlobalUserByEmail(user.email);
    if (!globalUser) {
      // Create a global user record for this Firebase user
      const userId = user.uid; // Use Firebase UID as user ID
      globalUser = await dataService.createGlobalUser({
        id: userId,
        email: user.email,
        name: user.name || user.email.split("@")[0],
        firebase_uid: user.uid,
      });
    }

    // Check ownership - compare Firebase UID with space owner
    const owns = space.owner_id === globalUser.id || space.owner_id === user.uid;

    return NextResponse.json({ owns });
  } catch (error) {
    console.error("Error checking space ownership:", error);
    return NextResponse.json(
      { error: "Failed to check ownership" },
      { status: 500 }
    );
  }
}