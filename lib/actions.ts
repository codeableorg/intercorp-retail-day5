"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart,
  fetchCart,
  fetchCartItemsCount,
  removeCartItem,
  updateCartItemQuantity,
} from "./data";
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

export async function changeItemQuantity(
  itemId: number,
  quantityChange: number
) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("cart_session_id")?.value;

    if (!sessionId) {
      throw new Error("No session found");
    }

    // First, get the current item to know its quantity
    const cart = await fetchCart(sessionId);

    const item = cart?.items?.find((item) => item.id === itemId);

    if (!item) {
      throw new Error("Item not found");
    }

    const newQuantity = item.quantity + quantityChange;

    if (newQuantity < 1) {
      return; // Don't allow quantity below 1
    }

    // Update the item quantity
    await updateCartItemQuantity(itemId, newQuantity, sessionId);

    // Revalidate the cart page
    revalidatePath("/cart");
  } catch (error) {
    console.error("Error changing quantity:", error);
    throw new Error("Failed to change item quantity");
  }
}

export async function removeItem(itemId: number) {
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("cart_session_id")?.value;

    if (!sessionId) {
      throw new Error("No session found");
    }

    // Remove the item
    await removeCartItem(itemId, sessionId);

    // Revalidate the cart page and layout
    revalidatePath("/cart");
    // revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error removing item:", error);
    throw new Error("Failed to remove item");
  }
}
