import { NextRequest, NextResponse } from "next/server";
import { DataService } from "@/lib/dataService";
import { generateToken, generateTokenId, createTokenExpiry } from "@/lib/auth";
import { sendLoginTokenEmail } from "@/lib/email";

const dataService = new DataService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, spaceId, token } = body;

    if (token) {
      // Verify login token
      const authToken = await dataService.getAuthToken(token);
      if (!authToken || authToken.type !== "login") {
        return NextResponse.json(
          { error: "Invalid or expired login token" },
          { status: 400 },
        );
      }

      // Get user details
      const user = await dataService.getGlobalUserById(authToken.user_id);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Mark token as used
      await dataService.markTokenUsed(authToken.id);

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } else if (email && spaceId) {
      // Send login token email
      const user = await dataService.getGlobalUserByEmail(email);
      if (!user) {
        // Don't reveal if user exists or not
        return NextResponse.json({ success: true });
      }

      // Generate login token
      const loginToken = generateToken();
      const tokenId = generateTokenId();

      await dataService.createAuthToken({
        id: tokenId,
        user_id: user.id,
        token: loginToken,
        type: "login",
        expires_at: createTokenExpiry(24),
        used: false,
      });

      // Send email
      await sendLoginTokenEmail(email, loginToken, spaceId);

      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "Either email+spaceId or token required" },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error in login token:", error);
    return NextResponse.json({ error: "Login token failed" }, { status: 500 });
  }
}
