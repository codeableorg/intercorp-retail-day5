import { NextResponse } from "next/server";
import postgres from "postgres";
import { getUserFromToken } from "../utils";

export const dynamic = "force-dynamic";

const sql = postgres(process.env.POSTGRES_URL!, { ssl: "require" });

export async function POST(request: Request) {
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
      cartQuery = sql`SELECT * FROM carts WHERE user_id = ${user.id}`;
    } else {
      // No user, try to get cart by session ID
      cartQuery = sql`SELECT * FROM carts WHERE session_id = ${token}`;
    }
    const cartData = await cartQuery;

    if (cartData.length === 0) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    const cart = cartData[0];

    // Get cart items with product details
    const cartItems = await sql`
      SELECT ci.*, p.title, p.price, p.img_src
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.cart_id = ${cart.id}
    `;

    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Calculate total amount
    const totalAmount = cartItems.reduce((sum, item) => {
      return sum + Number(item.price) * item.quantity;
    }, 0);

    // Get order details from the request body
    const {
      email,
      firstName,
      lastName,
      company,
      address,
      city,
      country,
      region,
      zip,
      phone,
    } = await request.json();

    // Create the order
    const [order] = await sql`
      INSERT INTO orders (
        user_id, email, total_amount, 
        first_name, last_name, company, address, 
        city, country, region, zip, phone
      ) VALUES (
        ${cart.user_id}, ${email}, ${totalAmount}, 
        ${firstName}, ${lastName}, ${company || null}, ${address},
        ${city}, ${country}, ${region}, ${zip}, ${phone}
      )
      RETURNING *
    `;

    // Create order items
    for (const item of cartItems) {
      await sql`
        INSERT INTO order_items (
          order_id, product_id, quantity, 
          title, price, img_src
        ) VALUES (
          ${order.id}, ${item.product_id}, ${item.quantity},
          ${item.title}, ${item.price}, ${item.img_src}
        )
      `;
    }

    // Clear the cart after successful order creation
    await sql`DELETE FROM cart_items WHERE cart_id = ${cart.id}`;

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        total: totalAmount,
      },
    });
  } catch (error) {
    console.error("Database Error:", error);
    return NextResponse.json(
      { error: "Failed to create order." },
      { status: 500 }
    );
  }
}
