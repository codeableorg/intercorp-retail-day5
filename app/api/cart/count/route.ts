import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: Request) {
  try {
    // Get session from Authorization header
    const sessionId = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    if (!sessionId) {
      return NextResponse.json({ count: 0 });
    }

    const data = await sql`
      SELECT SUM(quantity) as total FROM cart_items
      JOIN carts ON cart_items.cart_id = carts.id
      WHERE carts.session_id = ${sessionId}
    `;

    return NextResponse.json({ count: Number(data[0]?.total || 0) });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items count." },
      { status: 500 }
    );
  }
}
