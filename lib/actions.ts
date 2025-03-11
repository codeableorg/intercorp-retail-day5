"use server";

import { revalidatePath } from "next/cache";
import { addToCart, fetchCartItemsCount } from "./data";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";

export async function addItemToCart(formData: FormData) {
  try {
    // Extract product data from form
    const productId = Number(formData.get("product_id"));
    const quantity = 1;

    if (!productId) {
      throw new Error("Product ID is required");
    }

    const cookieStore = cookies();
    let sessionId = cookieStore.get("cart_session_id")?.value;

    if (!sessionId) {
      sessionId = uuidv4();
      cookieStore.set("cart_session_id", sessionId, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
    }

    // Single API call that handles cart creation and adding items
    await addToCart(productId, quantity, sessionId);

    // Revalidate related pages
    revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Failed to add item to cart");
  }
}

export async function getCartItemsCount() {
  const cookieStore = cookies();
  const sessionId = cookieStore.get("cart_session_id")?.value;

  if (!sessionId) {
    return 0;
  }

  return fetchCartItemsCount(sessionId);
}
