import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import type { User } from "./types";

export async function getUserMe(): Promise<User | undefined> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
