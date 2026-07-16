"use client";

import type { Account } from "better-auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/lib/auth/client";

type SocialProviderConfig = {
  id: "google" | "github";
  name: string;
  icon: React.ComponentType<{ className?: string }>;
};

const SOCIAL_PROVIDERS: SocialProviderConfig[] = [
  {
    id: "google",
    name: "Google",
    icon: GoogleIcon,
  },
  {
    id: "github",
    name: "GitHub",
    icon: GithubIcon,
  },
];

export function SignInMethods({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLink = (provider: "google" | "github") => {
    startTransition(async () => {
      const { error } = await authClient.linkSocial({
        provider,
        callbackURL: "/settings/account",
      });
      if (error) {
        toast.error(error.code ?? error.status, {
          description: error.message ?? error.statusText,
        });
      }
    });
  };

  const handleUnlink = (providerId: "google" | "github") => {
    startTransition(async () => {
      const { error } = await authClient.unlinkAccount({
        providerId,
      });
      if (error) {
        toast.error(error.code ?? error.status, {
          description: error.message ?? error.statusText,
        });
      } else {
        toast.success(`Successfully unlinked ${providerId}`);
        router.refresh();
      }
    });
  };

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
          {SOCIAL_PROVIDERS.map((provider, index) => {
            const account = accounts.find((a) => a.providerId === provider.id);

            return (
              <div key={provider.id}>
                <Item>
                  <ItemMedia variant={"icon"}>
                    <provider.icon />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{provider.name}</ItemTitle>
                    <ItemDescription>
                      {account
                        ? `Connected on ${new Intl.DateTimeFormat("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          }).format(new Date(account.createdAt))}`
                        : `Connect your ${provider.name} account`}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    {account ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUnlink(provider.id)}
                        disabled={isPending}
                      >
                        Disconnect
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLink(provider.id)}
                        disabled={isPending}
                      >
                        Connect
                      </Button>
                    )}
                  </ItemActions>
                </Item>
                {index < SOCIAL_PROVIDERS.length - 1 && <ItemSeparator />}
              </div>
            );
          })}
        </ItemGroup>
      </CardContent>
    </Card>
  );
}
