import { headers } from "next/headers";
import { LogoutCard } from "@/components/logout-card";
import { SignInMethods } from "@/components/sign-in-methods";
import { auth } from "@/lib/auth/server";

export default async function Page() {
  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-8">
      <SignInMethods accounts={accounts} />
      <LogoutCard />
    </div>
  );
}
