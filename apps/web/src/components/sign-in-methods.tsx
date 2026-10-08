"use client";

import type { Account } from "better-auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ItemGroup } from "@/components/ui/item";
import { PasskeysGroup } from "./passkeys-group";
import { SocialProvidersGroup } from "./social-providers-group";

export function SignInMethods({ accounts }: { accounts: Account[] }) {
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
        <ItemGroup>
          <SocialProvidersGroup accounts={accounts} />
          <PasskeysGroup />
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
