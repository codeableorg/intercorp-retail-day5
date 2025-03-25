import { NextResponse } from "next/server";
import postgres from "postgres";
import { Cart } from "@/lib/types";
import { getUserFromToken } from "@/app/api/utils";

export const dynamic = "force-dynamic";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Update cart item quantity
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = Number(params.id);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quantity } = await request.json();

    if (typeof quantity !== "number" || quantity < 1) {
      return NextResponse.json(
        { error: "Quantity must be a positive number" },
        { status: 400 }
      );
    }

    let cartQuery;

    const user = await getUserFromToken(token);

    if (user) {
      cartQuery = sql<Cart[]>`
      SELECT c.* FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.user_id = ${user.id} AND ci.id = ${itemId}
    `;
    } else {
      cartQuery = sql<Cart[]>`
      SELECT c.* FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.session_id = ${token} AND ci.id = ${itemId}
    `;
    }

    // Verify item belongs to user's cart
    const cartData = await cartQuery;

    if (cartData.length === 0) {
      return NextResponse.json(
        { error: "Item not found in your cart" },
        { status: 404 }
      );
    }

    // Update item quantity
    await sql`
      UPDATE cart_items
      SET quantity = ${quantity}
      WHERE id = ${itemId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to update cart item." },
      { status: 500 }
    );
  }
}

// Delete cart item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const itemId = Number(params.id);
    if (isNaN(itemId)) {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    // Get token from Authorization header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await getUserFromToken(token);

    let cartQuery;
    if (user) {
      cartQuery = sql<Cart[]>`
      SELECT c.* FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.user_id = ${user.id} AND ci.id = ${itemId}
    `;
    } else {
      cartQuery = sql<Cart[]>`
      SELECT c.* FROM carts c
      JOIN cart_items ci ON c.id = ci.cart_id
      WHERE c.session_id = ${token} AND ci.id = ${itemId}
    `;
    }

    // Verify item belongs to user's cart
    const cartData = await cartQuery;

    if (cartData.length === 0) {
      return NextResponse.json(
        { error: "Item not found in your cart" },
        { status: 404 }
      );
    }

    // Delete the item
    await sql`
      DELETE FROM cart_items
      WHERE id = ${itemId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to remove cart item." },
      { status: 500 }
    );
  }
}
