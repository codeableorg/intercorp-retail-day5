// User types
export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  password: string;
  created_at: Date;
}

// Category types
export interface Category {
  id: number;
  title: string;
  slug: string;
  img_src: string;
  alt: string | null;
  description: string | null;
  created_at: Date;
}

// Product types
export interface Product {
  id: number;
  title: string;
  img_src: string;
  alt: string | null;
  price: number;
  description: string | null;
  category_id: number | null;
  is_on_sale: boolean;
  features: string[] | null;
  created_at: Date;
}

// Cart types
export interface Cart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  created_at: Date;
}

// Cart Item types
export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
}

export type CartItemWithProduct = CartItem & {
  product: Product;
};

export type CartWithItems = Cart & {
  items: CartItemWithProduct[];
  total: number;
};
