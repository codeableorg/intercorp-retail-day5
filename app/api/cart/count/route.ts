import { NextResponse } from "next/server";
import postgres from "postgres";
import { getUserFromToken } from "../../utils";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function GET(request: Request) {
  try {
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ count: 0 });
    }

    let countQuery;

    const user = await getUserFromToken(token);

    if (user) {
      // User is authenticated, get their cart
      countQuery = sql`SELECT SUM(quantity) as total FROM cart_items
          JOIN carts ON cart_items.cart_id = carts.id
          WHERE carts.user_id = ${user.id}`;
    } else {
      // No user, try to get cart by session ID
      countQuery = sql`SELECT SUM(quantity) as total FROM cart_items
          JOIN carts ON cart_items.cart_id = carts.id
          WHERE carts.session_id = ${token}`;
    }

    const data = await countQuery;

    return NextResponse.json({ count: Number(data[0]?.total || 0) });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items count." },
      { status: 500 }
    );
  }
}
