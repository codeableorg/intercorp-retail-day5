"use client";

import { Product } from "@/lib/types";
import { useCart } from "../../cart/cart-context";
import { addItemToCart } from "@/lib/actions";
import styles from "./styles.module.css";
import { Button } from "@/components/ui";
import { useTransition } from "react";

export function AddProductForm({ product }: { product: Product }) {
  const { addItem, cart } = useCart();
  const [isPending, startTransition] = useTransition();
  const count = cart?.items.reduce((acc, item) => acc + item.quantity, 0) ?? 0;
  async function formAction(formData: FormData) {
    addItem(product, 1);
    startTransition(async () => {
      await addItemToCart(formData);
    });
  }

  return (
    <form action={formAction}>
      <input hidden name="product_id" value={product.id} readOnly />
      <Button size="xl" className={styles.product__button}>
        {isPending ? "Agregando..." : "Agregar al Carrito"}
      </Button>
      {count}
    </form>
  );
}
