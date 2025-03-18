"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart,
  createOrder,
  fetchCart,
  fetchCartItemsCount,
  removeCartItem,
  updateCartItemQuantity,
} from "./data";
import { cookies } from "next/headers";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

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

export async function createOrderFromCheckout(formData: FormData) {
  let result;
  try {
    const cookieStore = cookies();
    const sessionId = cookieStore.get("cart_session_id")?.value;

    if (!sessionId) {
      throw new Error("No session found");
    }

    // Extract form data
    const orderData = {
      email: formData.get("email") as string,
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      company: formData.get("company") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      country: formData.get("country") as string,
      region: formData.get("region") as string,
      zip: formData.get("zip") as string,
      phone: formData.get("phone") as string,
    };

    // Validate required fields
    const requiredFields = [
      "email",
      "firstName",
      "lastName",
      "address",
      "city",
      "country",
      "region",
      "zip",
      "phone",
    ];

    for (const field of requiredFields) {
      if (!orderData[field as keyof typeof orderData]) {
        throw new Error(`Field ${field} is required`);
      }
    }

    // Create the order
    result = await createOrder(orderData, sessionId);

    // After creating the order successfully, redirect to the thank you page
    // And include the order ID in the URL for reference
    revalidatePath("/", "layout"); // Update cart count in layout
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
  redirect(`/thank-you?order=${result.order.id}`);
}
