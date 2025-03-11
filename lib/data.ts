import { Category, Product } from "./types";
import { API_BASE_URL } from "./config";

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
  sessionId: string
) {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/cart`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionId}`,
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
export async function fetchCartItemsCount(sessionId: string): Promise<number> {
  try {
    const start = Date.now();

    const response = await fetch(`${API_BASE_URL}/api/cart/count`, {
      headers: {
        Authorization: `Bearer ${sessionId}`,
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
