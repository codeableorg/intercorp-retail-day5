"use client";

import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { removeItem } from "@/lib/actions";

export function RemoveButton({ itemId }: { itemId: number }) {
  return (
    <Button
      type="submit"
      size="sm-icon"
      variant="outline"
      onClick={() => removeItem(itemId)}
    >
      <Trash2 />
    </Button>
  );
}
