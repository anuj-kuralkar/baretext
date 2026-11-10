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

/** Connect/disconnect rows for the supported social providers, driven by the user's linked accounts. */
export function SocialProvidersGroup({ accounts }: { accounts: Account[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * Links the auth provider to the signed-in account, then refreshes the
   * account list. Errors surface as toasts.
   */
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

  /**
   * Unlinks the account. The provider error type only exposes its fields
   * conditionally (hence the `in` narrowing); anything undefined falls back to
   * friendly toast copy.
   */
  const handleUnlink = (accountId: string) => {
    startTransition(async () => {
      const { error } = await authClient.unlinkAccount({
        accountId,
      });
      if (error) {
        const errCode =
          "code" in error && typeof error.code === "string"
            ? error.code
            : undefined;
        const errMessage =
          "message" in error && typeof error.message === "string"
            ? error.message
            : undefined;
        toast.add({
          type: "error",
          title: errCode ?? "Failed to unlink account",
          description: errMessage ?? "An unknown error occurred.",
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
