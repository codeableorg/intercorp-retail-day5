import { NextResponse } from "next/server";
import postgres from "postgres";
import { Product } from "@/lib/types";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);

    if (isNaN(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    const data = await sql<Product[]>`SELECT * FROM products WHERE id = ${id}`;

    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product data." },
      { status: 500 }
    );
  }
}
