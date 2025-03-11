import { NextResponse } from "next/server";
import postgres from "postgres";
import { Product } from "@/lib/types";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    const { searchParams } = new URL(request.url);
    const minPrice = Number(searchParams.get("minPrice") || 0);
    const maxPrice = Number(searchParams.get("maxPrice") || 999999);

    const data = await sql<Product[]>`
      SELECT p.*
      FROM products AS p
      LEFT JOIN categories AS c ON p.category_id = c.id
      WHERE c.slug = ${slug} AND p.price BETWEEN ${minPrice} AND ${maxPrice}
    `;

    return NextResponse.json(data);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products data." },
      { status: 500 }
    );
  }
}
