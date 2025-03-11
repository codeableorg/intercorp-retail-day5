"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { changeItemQuantity } from "@/lib/actions";
import styles from "./styles.module.css";

export function QuantityControl({
  itemId,
  quantity,
}: {
  itemId: number;
  quantity: number;
}) {
  return (
    <div className={styles.quantity}>
      <Button
        type="submit"
        variant="outline"
        size="sm-icon"
        disabled={quantity <= 1}
        onClick={() => {
          changeItemQuantity(itemId, -1);
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
          changeItemQuantity(itemId, 1);
        }}
      >
        <Plus />
      </Button>
    </div>
  );
}
