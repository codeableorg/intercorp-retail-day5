import { CartWithItems, Category, Product, User } from "./types";
import { API_BASE_URL } from "./config";
import { cookies } from "next/headers";

// Helper function to get the appropriate authorization token
export function getAuthorizationToken() {
  const cookiesStore = cookies();
  const authToken = cookiesStore.get("auth_token")?.value;

  if (authToken) {
    // If user is logged in, use the auth token
    return authToken;
  } else {
    // No user, use the cart session ID
    return cookiesStore.get("cart_session_id")?.value;
  }
}

export async function fetchCategories(): Promise<Category[]> {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/categories`);

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();

    const end = Date.now();
    const time = end - start;

    console.log(`Categories data fetched in ${time}ms`);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch category data.");
  }
}

// Fetch Category by Slug
export async function fetchCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const start = Date.now();

    const response = await fetch(
      `${API_BASE_URL}/api/categories/${encodeURIComponent(slug)}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch category");
    }

    const data = await response.json();

    const end = Date.now();
    const time = end - start;

    console.log(`Category data fetched in ${time}ms`);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch category data.");
  }
}

// Fetch products by category slug
export async function fetchProductsByCategorySlug(
  slug: string,
  minPrice: number = 0,
  maxPrice: number = 999999
): Promise<Product[]> {
  try {
    const start = Date.now();

    const queryParams = new URLSearchParams({
      minPrice: minPrice?.toString() || "0",
      maxPrice: maxPrice?.toString() || "999999",
    });

    const response = await fetch(
      `${API_BASE_URL}/api/categories/${encodeURIComponent(
        slug
      )}/products?${queryParams}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();

    const end = Date.now();
    const time = end - start;

    console.log(`Products data fetched in ${time}ms`);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch product data.");
  }
}

// Fetch product by id
export async function fetchProductById(id: number): Promise<Product | null> {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/products/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }

    const data = await response.json();

    const end = Date.now();
    const time = end - start;

    console.log(`Product data fetched in ${time}ms`);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch product data.");
  }
}

// Create or Update cart item
export async function addToCart(
  productId: number,
  quantity: number,
  token: string
) {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId, quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to add item to cart");
    }

    const end = Date.now();
    const time = end - start;

    console.log(`Item added to cart in ${time}ms`);

    return await response.json(); // Return the result which includes the cart
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to add item to cart");
  }
}

// fetch cart items count by session id
export async function fetchCartItemsCount(token: string): Promise<number> {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/cart/count`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart count");
    }

    const data = await response.json();

    const end = Date.now();
    const time = end - start;

    console.log(`Cart count fetched in ${time}ms`);

    return data.count;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch cart items count.");
  }
}

export async function fetchCart(): Promise<CartWithItems | null> {
  try {
    const start = Date.now();

    const token = getAuthorizationToken();

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch cart");
    }

    const data = (await response.json()) as CartWithItems | null;

    const end = Date.now();
    const time = end - start;

    console.log(`Cart with items fetched in ${time}ms`);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to fetch cart data.");
  }
}

export async function updateCartItemQuantity(
  itemId: number,
  quantity: number,
  token: string
) {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity }),
    });

    if (!response.ok) {
      throw new Error("Failed to update cart item quantity");
    }

    const end = Date.now();
    const time = end - start;

    console.log(`Cart item quantity updated in ${time}ms`);

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to update cart item quantity");
  }
}

export async function removeCartItem(itemId: number, token: string) {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/cart/items/${itemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to remove cart item");
    }

    const end = Date.now();
    const time = end - start;

    console.log(`Cart item removed in ${time}ms`);

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to remove cart item");
  }
}

export async function createOrder(
  orderData: {
    email: string;
    firstName: string;
    lastName: string;
    company?: string;
    address: string;
    city: string;
    country: string;
    region: string;
    zip: string;
    phone: string;
  },
  token: string
) {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to create order");
    }

    const data = await response.json();

    const end = Date.now();
    const time = end - start;

    console.log(`Order created in ${time}ms`);

    return data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Failed to create order");
  }
}

export async function registerUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data;
}

export async function loginUser(email: string, password: string) {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Login failed");
  }

  return data;
}

export async function getCurrentUser(token?: string): Promise<User | null> {
  if (!token) return null;

  const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  return data;
}
