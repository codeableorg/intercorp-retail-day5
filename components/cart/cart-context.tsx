"use client";

import { CartItemWithProduct, CartWithItems, Product } from "@/lib/types";
import React, { createContext, useContext, useOptimistic } from "react";

// Define the available actions
type CartAction =
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number } }
  | { type: "UPDATE_QUANTITY"; payload: { itemId: number; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { itemId: number } }
  | { type: "CLEAR_CART" };

type CartContextType = {
  cart: CartWithItems | null;
  addItem: (product: Product, quantity: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
};

// Create the context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Cart reducer function
function cartReducer(
  state: CartWithItems | null,
  action: CartAction
): CartWithItems {
  const currentCart = state || {
    id: 0,
    user_id: null,
    session_id: null,
    created_at: new Date(),
    items: [],
    total: 0,
  };

  switch (action.type) {
    case "ADD_ITEM": {
      const { product, quantity } = action.payload;
      const existingItemIndex = currentCart.items.findIndex(
        (item) => item.product_id === product.id
      );

      let updatedItems;
      if (existingItemIndex >= 0) {
        // Update existing item
        updatedItems = currentCart.items.map((item, index) => {
          if (index === existingItemIndex) {
            return {
              ...item,
              quantity: item.quantity + quantity,
            };
          }
          return item;
        });
      } else {
        // Add new item (note: this is an optimistic update so we create a temporary id)
        const newItem: CartItemWithProduct = {
          id: Date.now(),
          cart_id: currentCart.id,
          product_id: product.id,
          quantity,
          created_at: new Date(),
          product,
        };
        updatedItems = [...currentCart.items, newItem];
      }

      // Calculate new total
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...currentCart,
        items: updatedItems,
        total: newTotal,
      };
    }

    case "UPDATE_QUANTITY": {
      const { itemId, quantity } = action.payload;

      // Update item quantity
      const updatedItems = currentCart.items.map((item) => {
        if (item.id === itemId) {
          return { ...item, quantity };
        }
        return item;
      });

      // Calculate new total
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...currentCart,
        items: updatedItems,
        total: newTotal,
      };
    }

    case "REMOVE_ITEM": {
      const { itemId } = action.payload;

      // Remove item
      const updatedItems = currentCart.items.filter(
        (item) => item.id !== itemId
      );

      // Calculate new total
      const newTotal = updatedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );

      return {
        ...currentCart,
        items: updatedItems,
        total: newTotal,
      };
    }

    case "CLEAR_CART":
      return {
        ...currentCart,
        items: [],
        total: 0,
      };

    default:
      return currentCart;
  }
}

// CartProvider component
export function CartProvider({
  children,
  initialCart,
}: {
  children: React.ReactNode;
  initialCart: CartWithItems | null;
}) {
  const [optimisticCart, updateOptimisticCart] = useOptimistic(
    initialCart,
    cartReducer
  );

  const addItem = (product: Product, quantity: number) => {
    updateOptimisticCart({ type: "ADD_ITEM", payload: { product, quantity } });
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    updateOptimisticCart({
      type: "UPDATE_QUANTITY",
      payload: { itemId, quantity },
    });
  };

  const removeItem = (itemId: number) => {
    updateOptimisticCart({ type: "REMOVE_ITEM", payload: { itemId } });
  };

  const clearCart = () => {
    updateOptimisticCart({ type: "CLEAR_CART" });
  };

  return (
    <CartContext.Provider
      value={{
        cart: optimisticCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// Custom hook for using the cart context
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
