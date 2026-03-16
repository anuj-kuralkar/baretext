import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export type User = typeof auth.$Infer.Session.user;

export async function getUserMe(): Promise<User | undefined> {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
}
