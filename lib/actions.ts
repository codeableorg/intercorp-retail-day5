"use server";

import { revalidatePath } from "next/cache";
import {
  addToCart,
  createOrder,
  fetchCart,
  fetchCartItemsCount,
  getAuthorizationToken,
  loginUser,
  registerUser,
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

    let token = getAuthorizationToken();

    if (!token) {
      token = uuidv4();
      const cookieStore = cookies();
      cookieStore.set("cart_session_id", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
    }

    // Single API call that handles cart creation and adding items
    await addToCart(productId, quantity, token);

    // Revalidate related pages
    // revalidatePath("/", "layout");
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw new Error("Failed to add item to cart");
  }
}

export async function getCartItemsCount() {
  const token = getAuthorizationToken();

  if (!token) {
    return 0;
  }

  return fetchCartItemsCount(token);
}

export async function changeItemQuantity(
  itemId: number,
  quantityChange: number
) {
  try {
    const token = getAuthorizationToken();

    if (!token) {
      throw new Error("No token found");
    }

    // First, get the current item to know its quantity
    const cart = await fetchCart();

    const item = cart?.items?.find((item) => item.id === itemId);

    if (!item) {
      throw new Error("Item not found");
    }

    const newQuantity = item.quantity + quantityChange;

    if (newQuantity < 1) {
      return; // Don't allow quantity below 1
    }

    // Update the item quantity
    await updateCartItemQuantity(itemId, newQuantity, token);

    // Revalidate the cart page
    revalidatePath("/cart");
  } catch (error) {
    console.error("Error changing quantity:", error);
    throw new Error("Failed to change item quantity");
  }
}

export async function removeItem(itemId: number) {
  try {
    const token = getAuthorizationToken();

    if (!token) {
      throw new Error("No token found");
    }

    // Remove the item
    await removeCartItem(itemId, token);

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
    const token = getAuthorizationToken();

    if (!token) {
      throw new Error("No token found");
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
    result = await createOrder(orderData, token);

    // After creating the order successfully, redirect to the thank you page
    // And include the order ID in the URL for reference
    revalidatePath("/", "layout"); // Update cart count in layout
  } catch (error) {
    console.error("Error creating order:", error);
    throw new Error("Failed to create order");
  }
  redirect(`/thank-you?order=${result.order.id}`);
}

export async function signUp(prevState: { error: string }, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const data = await registerUser(email, password);

    // Set auth token cookie
    cookies().set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }

  redirect("/");
}

export async function login(prevState: { error: string }, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const data = await loginUser(email, password);

    // Set auth token cookie
    cookies().set("auth_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }

  redirect("/");
}

export async function logout() {
  cookies().delete("auth_token");
  redirect("/");
}
