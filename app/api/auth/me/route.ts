import postgres from "postgres";
import { NextRequest, NextResponse } from "next/server";
import { verify } from "jsonwebtoken";

export const dynamic = "force-dynamic";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// api/auth/me
// Get current user
export async function GET(request: NextRequest) {
  try {
    // Get auth token from Authorization header
    const authToken = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    if (!authToken) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Decode JWT token
    const decoded = verify(authToken, JWT_SECRET) as {
      userId: number;
      email: string;
    };
    if (!decoded) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Get user from database
    const users = await sql`
      SELECT * FROM users WHERE id = ${decoded.userId}
    `;
    if (users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const user = users[0];
    return NextResponse.json({
      id: user.id,
      email: user.email,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}
