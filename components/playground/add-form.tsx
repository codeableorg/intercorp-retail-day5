"use client";
import { useOptimistic } from "react";
import { Button } from "../ui";
import { updateCountAction } from "@/lib/actions";

function countReducer(
  prevCount: number,
  action: { type: string; payload: number }
) {
  switch (action.type) {
    case "increment":
      return prevCount + 1;
    case "decrement":
      return prevCount - 1;
    case "change":
      return prevCount + action.payload;
    default:
      throw new Error("Unknown action type");
  }
}

export function AddForm({ count }: { count: number }) {
  const [optimisticCount, updateOptimisticCount] = useOptimistic(
    count,
    countReducer
  );

  return (
    <form
      action={async (formData) => {
        const type = formData.get("type") as string;

        if (type === "increment") {
          updateOptimisticCount({ type: "increment", payload: 1 });
        } else if (type === "decrement") {
          updateOptimisticCount({ type: "decrement", payload: 1 });
        }
        try {
          await updateCountAction(formData);
        } catch (error) {
          console.error("Error updating count:", error);
        }
      }}
    >
      <Button type="submit" name="type" value="increment">
        Increment
      </Button>
      <Button type="submit" name="type" value="decrement">
        Decrement
      </Button>
      <p>{optimisticCount}</p>
    </form>
  );
}
