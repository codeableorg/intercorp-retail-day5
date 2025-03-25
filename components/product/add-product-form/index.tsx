"use client";

import { Product } from "@/lib/types";
import { useCart } from "../../cart/cart-context";
import { addItemToCart } from "@/lib/actions";
import styles from "./styles.module.css";
import { Button } from "@/components/ui";
import { useFormStatus } from "react-dom";

export function AddProductForm({ product }: { product: Product }) {
  const { addItem } = useCart();

  async function formAction(formData: FormData) {
    addItem(product, 1);
    addItemToCart(formData);
  }

  return (
    <form action={formAction}>
      <input hidden name="product_id" value={product.id} readOnly />
      <SubmitButton />
    </form>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button size="xl" className={styles.product__button}>
      {pending ? "Agregando..." : "Agregar al Carrito"}
    </Button>
  );
}
