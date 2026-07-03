import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { auth } from "@/lib/auth/server";

export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

export const requireSession = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/auth/login");
  }
  return session;
};
