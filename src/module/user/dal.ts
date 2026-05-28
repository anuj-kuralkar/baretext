import { requireSession } from "@/lib/session";
import type { User } from "./types";

export async function getUserMe(): Promise<User | undefined> {
  const session = await requireSession();
  return session.user;
}
