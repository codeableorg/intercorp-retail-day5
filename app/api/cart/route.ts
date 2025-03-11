import { NextResponse } from "next/server";
import postgres from "postgres";
import { Cart } from "@/lib/types";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Get cart by session ID in Authorization header
export async function GET(request: Request) {
  try {
    // Get session from Authorization header
    const sessionId = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get cart by session ID
    const data = await sql<Cart[]>`
      SELECT * FROM carts WHERE session_id = ${sessionId}
    `;

    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart data." },
      { status: 500 }
    );
  }
}

// Create cart or add items with session ID in Authorization header
export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json();

    // Get session from Authorization header
    const sessionId = request.headers
      .get("Authorization")
      ?.replace("Bearer ", "");

    if (!sessionId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get or create cart
    let cart;
    const existingCart = await sql<Cart[]>`
      SELECT * FROM carts WHERE session_id = ${sessionId}
    `;

    if (existingCart.length === 0) {
      const newCart = await sql<Cart[]>`
        INSERT INTO carts (user_id, session_id)
        VALUES (NULL, ${sessionId})
        RETURNING *`;
      cart = newCart[0];
    } else {
      cart = existingCart[0];
    }

    // Add item to cart if product details provided
    if (productId && quantity) {
      await sql`
        INSERT INTO cart_items (cart_id, product_id, quantity)
        VALUES (${cart.id}, ${productId}, ${quantity})
        ON CONFLICT (cart_id, product_id) 
        DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity
      `;
    }

    return NextResponse.json({ success: true, cart });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to update cart." },
      { status: 500 }
    );
  }
}
