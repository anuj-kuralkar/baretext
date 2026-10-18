import { auth } from "@baretext/auth";
import { cacheLife } from "next/cache";
import { headers } from "next/headers";
import { Suspense } from "react";
import { LogoutCard } from "@/components/logout-card";
import { SignInMethods } from "@/components/sign-in-methods";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function listUserAccounts() {
  "use cache: private";
  cacheLife("minutes");

  const accounts = await auth.api.listUserAccounts({
    headers: await headers(),
  });
  return accounts ?? [];
}

async function UserAccounts() {
  const accounts = await listUserAccounts();
  return <SignInMethods accounts={accounts} />;
}

function SignInMethodsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Authentication Methods</CardTitle>
        <CardDescription>
          Manage the accounts you use to securely sign in and keep your access
          up to date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3.5 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3.5 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-16 rounded-lg" />
          </div>
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-3">
              <Skeleton className="size-5 rounded-md" />
              <div className="space-y-1.5">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3.5 w-48" />
              </div>
            </div>
            <Skeleton className="h-8 w-24 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Page() {
  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-6 md:p-8">
      <Suspense fallback={<SignInMethodsSkeleton />}>
        <UserAccounts />
      </Suspense>
      <LogoutCard />
    </div>
  );
}
