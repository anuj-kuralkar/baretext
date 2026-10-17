"use client";

import { LogOut } from "lucide-react";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { clearAllNotesIndexedDb } from "@/lib/indexeddb";

export function LogoutCard() {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await clearAllNotesIndexedDb();
      const { error } = await authClient.signOut();
      if (error) {
        toast.add({
          type: "error",
          title: error.code ?? error.status,
          description: error.message ?? error.statusText,
        });
      } else {
        window.location.href = "/login";
      }
    });
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle>Log out</CardTitle>
        <CardDescription>
          Securely log out of Baretext on this device. Offline note caches and
          IndexedDB data are cleared from this browser, and your active session
          is ended.
        </CardDescription>
      </CardHeader>
      <CardFooter className="justify-end">
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={isPending}
        >
          {isPending ? (
            <Spinner className="mr-2 size-4" />
          ) : (
            <LogOut className="mr-2 size-4" />
          )}
          {isPending ? "Logging out..." : "Log out"}
        </Button>
      </CardFooter>
    </Card>
  );
}
