import { NextResponse } from "next/server";
import postgres from "postgres";
import { Category } from "@/lib/types";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const data = await sql<Category[]>`
      SELECT * FROM categories WHERE slug = ${slug}
    `;

    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category data." },
      { status: 500 }
    );
  }
}
