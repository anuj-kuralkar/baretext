"use client";

import type { Account } from "better-auth";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import { toast } from "@/components/ui/toast";
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

export function SocialProvidersGroup({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLink = (provider: "google" | "github") => {
    startTransition(async () => {
      const { error } = await authClient.linkSocial({
        provider,
        callbackURL: `${window.location.origin}/settings/account`,
      });
      if (error) {
        toast.add({
          type: "error",
          title: error.code ?? error.status,
          description: error.message ?? error.statusText,
        });
      }
    });
  };

  const handleUnlink = (accountId: string) => {
    startTransition(async () => {
      const { error } = await authClient.unlinkAccount({
        accountId,
      });
      if (error) {
        const errCode =
          "code" in error ? String(error.code) : String(error.status);
        toast.add({
          type: "error",
          title: errCode,
          description:
            ("message" in error ? String(error.message) : undefined) ??
            "An unknown error occurred.",
        });
      } else {
        toast.add({
          type: "success",
          title: `Successfully unlinked account`,
        });
        router.refresh();
      }
    });
  };

  return (
    <>
      {SOCIAL_PROVIDERS.map((provider) => {
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
                    onClick={() => handleUnlink(account.id)}
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
            <ItemSeparator />
          </div>
        );
      })}
    </>
  );
}
