"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { changeItemQuantity } from "@/lib/actions";
import styles from "./styles.module.css";
import { useCart } from "../cart-context";
import { startTransition } from "react";

export function QuantityControl({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}) {
  const { updateQuantity } = useCart();

  return (
    <div className={styles.quantity}>
      <Button
        type="submit"
        variant="outline"
        size="sm-icon"
        disabled={quantity <= 1}
        onClick={() => {
          startTransition(() => {
            if (quantity <= 1) return;
            updateQuantity(itemId, quantity - 1);
            changeItemQuantity(itemId, -1);
          });
        }}
      >
        <Minus />
      </Button>
      <span className={styles.display}>{quantity}</span>

      <Button
        type="submit"
        variant="outline"
        size="sm-icon"
        onClick={() => {
          startTransition(() => {
            updateQuantity(itemId, quantity + 1);
            changeItemQuantity(itemId, 1);
          });
        }}
      >
        <Plus />
      </Button>
    </div>
  );
}
