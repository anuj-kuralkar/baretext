import { auth } from "@baretext/auth";
import { cacheLife } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function getSession() {
  "use cache: private";
  cacheLife("minutes");

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

export const requireSession = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }
  return session;
};
