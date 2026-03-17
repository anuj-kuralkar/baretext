"use server";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function loginWithOAuth(provider: "google" | "github") {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
    },
  });

  if (url) {
    redirect(url);
  }
}
