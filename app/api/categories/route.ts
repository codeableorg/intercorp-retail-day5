import { NextResponse } from "next/server";
import postgres from "postgres";
import { Category } from "@/lib/types";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET() {
  try {
    const data = await sql<Category[]>`SELECT * FROM categories`;
    return NextResponse.json(data);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category data." },
      { status: 500 }
    );
  }
}
