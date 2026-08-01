"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";

export function LogoutCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      const { error } = await authClient.signOut();
      if (error) {
        toast.error(error.code ?? error.status, {
          description: error.message ?? error.statusText,
        });
      } else {
        router.push("/login");
      }
    });
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle>Log out</CardTitle>
        <CardDescription>
          Securely log out of Baretext on this device. Your offline changes are
          already synced to your browser, but logging out will clear your active
          session.
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
