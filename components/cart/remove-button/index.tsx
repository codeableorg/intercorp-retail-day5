"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { removeItem as removeItemAction } from "@/lib/actions";
import { useCart } from "../cart-context";
import { startTransition } from "react";

export function RemoveButton({ itemId }: { itemId: number }) {
  const { removeItem } = useCart();

  function clientAction() {
    startTransition(() => {
      removeItem(itemId);
      removeItemAction(itemId);
    });
  }

  return (
    <Button
      type="submit"
      size="sm-icon"
      variant="outline"
      onClick={clientAction}
    >
      <Trash2 />
    </Button>
  );
}
