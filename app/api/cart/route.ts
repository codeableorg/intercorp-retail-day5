import { NextResponse } from "next/server";
import postgres from "postgres";
import { Cart, CartWithItems } from "@/lib/types";
import { getUserFromToken } from "../utils";

export const dynamic = "force-dynamic";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

// Get cart by session ID in Authorization header
export async function GET(request: Request) {
  try {
    // Get session from Authorization header
    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let cartQuery;

    // Try to get user from token first
    const user = await getUserFromToken(token);

    if (user) {
      // User is authenticated, get their cart
      cartQuery = sql<Cart[]>`SELECT * FROM carts WHERE user_id = ${user.id}`;
    } else {
      // No user, try to get cart by session ID
      cartQuery = sql<Cart[]>`SELECT * FROM carts WHERE session_id = ${token}`;
    }

    const cartData = await cartQuery;

    if (cartData.length === 0) {
      return NextResponse.json(null);
    }

    const cart = cartData[0];

    // Get cart items with product details
    const items = await sql`
      SELECT ci.id, ci.cart_id, ci.product_id, ci.quantity, ci.created_at, 
             p.id AS "product.id", p.title AS "product.title", 
             p.img_src AS "product.img_src", p.alt AS "product.alt", 
             p.price AS "product.price", p.description AS "product.description", 
             p.category_id AS "product.category_id", p.is_on_sale AS "product.is_on_sale", 
             p.features AS "product.features", p.created_at AS "product.created_at"
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ${cart.id}
    `;

    // Calculate total
    let total = 0;
    const formattedItems = items.map((item) => {
      const product = {
        id: item["product.id"],
        title: item["product.title"],
        img_src: item["product.img_src"],
        alt: item["product.alt"],
        price: item["product.price"],
        description: item["product.description"],
        category_id: item["product.category_id"],
        is_on_sale: item["product.is_on_sale"],
        features: item["product.features"],
        created_at: item["product.created_at"],
      };

      total += Number(product.price) * item.quantity;

      return {
        id: item.id,
        cart_id: item.cart_id,
        product_id: item.product_id,
        quantity: item.quantity,
        created_at: item.created_at,
        product,
      };
    });

    const cartWithItems: CartWithItems = {
      ...cart,
      items: formattedItems,
      total,
    };

    return NextResponse.json(cartWithItems);
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart items." },
      { status: 500 }
    );
  }
}

// Create cart or add items with session ID in Authorization header
export async function POST(request: Request) {
  try {
    const { productId, quantity } = await request.json();

    const token = request.headers.get("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let cartQuery;

    // Try to get user from token first
    const user = await getUserFromToken(token);

    // Get or create cart
    let cart;
    if (user) {
      cartQuery = sql`SELECT * FROM carts WHERE user_id = ${user.id}`;
    } else {
      cartQuery = sql`SELECT * FROM carts WHERE session_id = ${token}`;
    }

    const existingCart = await cartQuery;

    if (existingCart.length === 0) {
      if (user) {
        // Create a new cart for the user
        const newCart = await sql<Cart[]>`
          INSERT INTO carts (user_id, session_id)
          VALUES (${user.id}, NULL)
          RETURNING *`;
        cart = newCart[0];
      } else {
        const newCart = await sql<Cart[]>`
          INSERT INTO carts (user_id, session_id)
          VALUES (NULL, ${token})
          RETURNING *`;
        cart = newCart[0];
      }
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
