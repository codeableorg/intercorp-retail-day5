import { hash } from "bcrypt";
import postgres from "postgres";
import { NextRequest, NextResponse } from "next/server";
import { sign } from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/config";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUsers = await sql`
      SELECT * FROM users WHERE email = ${email}
    `;

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(password, 10);

    // Insert the user
    const user = await sql`
      INSERT INTO users (email, password)
      VALUES (${email}, ${hashedPassword})
      RETURNING id, email
    `;

    // Generate JWT token
    const token = sign(
      { userId: user[0].id, email: user[0].email },
      JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return NextResponse.json(
      {
        user: { id: user[0].id, email: user[0].email },
        token,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}
