"use client";

import { Button } from "@/components/ui";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import styles from "./styles.module.css";
import { useCart } from "@/components/cart/cart-context";

export default function CartCount() {
  const { cart } = useCart();
  const count = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;

  return (
    <Button
      size="xl-icon"
      variant="ghost"
      aria-label="Carrito de compras"
      asChild
      className={styles["cart-count__cart"]}
    >
      <Link href="/cart">
        <ShoppingCart />
        {count > 0 && (
          <span className={styles["cart-count__cart-badge"]}>{count}</span>
        )}
      </Link>
    </Button>
  );
}
