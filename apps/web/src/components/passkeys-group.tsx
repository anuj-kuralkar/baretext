"use client";

import { getAuthenticatorName } from "@better-auth/passkey";
import { FingerprintIcon } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";

export function PasskeysGroup() {
  const { data: passkeys, isPending: isLoadingPasskeys } =
    authClient.useListPasskeys();
  const [isPending, startTransition] = useTransition();

  const handleAddPasskey = () => {
    startTransition(async () => {
      const { data, error } = await authClient.passkey.addPasskey();
      if (error) {
        toast.add({ type: "error", title: error.message });
      }
      if (data) {
        toast.add({ type: "success", title: "Passkey added successfully" });
      }
    });
  };

  const handleDeletePasskey = (id: string) => {
    startTransition(async () => {
      const { data, error } = await authClient.passkey.deletePasskey({
        id,
      });
      if (error) {
        toast.add({ type: "error", title: error.message });
      }
      if (data) {
        toast.add({ type: "success", title: "Passkey deleted successfully" });
      }
    });
  };

  return (
    <Item>
      <ItemMedia variant={"icon"}>
        <FingerprintIcon />
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="flex items-center gap-2">Passkeys</ItemTitle>
        <ItemDescription>
          Use your device&apos;s fingerprint, face recognition, or a security
          key to sign in.
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddPasskey}
          disabled={isPending}
        >
          Add passkey
        </Button>
      </ItemActions>
      <ItemGroup className="pl-3.5">
        {isLoadingPasskeys ? (
          <Item>
            <ItemContent>
              <Skeleton className="h-4 w-28" />
              <Skeleton className="mt-1.5 h-3.5 w-44" />
            </ItemContent>
            <ItemActions>
              <Skeleton className="h-7 w-16 rounded-md" />
            </ItemActions>
          </Item>
        ) : (
          passkeys?.map((passkey) => (
            <Item key={passkey.id}>
              <ItemContent>
                <ItemTitle>
                  {passkey.name ||
                    getAuthenticatorName(passkey.aaguid) ||
                    "Passkey"}
                </ItemTitle>
                <ItemDescription>
                  {passkey.createdAt
                    ? `Added on ${new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      }).format(new Date(passkey.createdAt))}`
                    : "Added previously"}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeletePasskey(passkey.id)}
                  disabled={isPending}
                >
                  Remove
                </Button>
              </ItemActions>
            </Item>
          ))
        )}
      </ItemGroup>
    </Item>
  );
}
