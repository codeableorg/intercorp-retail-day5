import { JWT_SECRET } from "@/lib/config";
import { verify } from "jsonwebtoken";

export async function getUserFromToken(token: string) {
  try {
    const decoded = verify(token, JWT_SECRET) as {
      userId: number;
      email: string;
    };
    return { id: decoded.userId, email: decoded.email };
  } catch {
    return null;
  }
}
