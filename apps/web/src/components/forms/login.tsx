"use client";

import { FingerprintIcon } from "lucide-react";
import { useTransition } from "react";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";

export function LoginForm() {
  const [isPending, startTransition] = useTransition();

  const handlePasskeyLogin = () => {
    startTransition(async () => {
      const { error } = await authClient.signIn.passkey();
      if (error) {
        toast.add({ type: "error", title: error.message });
        return;
      }
      toast.add({ type: "success", title: "Logged in with Passkey" });
    });
  };

  const handleLogin = (provider: "google" | "github") => {
    startTransition(async () => {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: "/",
        errorCallbackURL: "/login",
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

  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription className="text-sm">
          Hop back in and keep writing.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleLogin("google")}
          disabled={isPending}
        >
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GoogleIcon data-icon="inline-start" />
          )}
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleLogin("github")}
          disabled={isPending}
        >
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GithubIcon data-icon="inline-start" />
          )}
          Sign in with GitHub
        </Button>
        <div className="flex items-center justify-center gap-2">
          <Separator />
          <span className="text-muted-foreground text-xs">Or</span>
          <Separator />
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={handlePasskeyLogin}
          disabled={isPending}
        >
          {isPending ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <FingerprintIcon data-icon="inline-start" />
          )}
          Sign in with Passkey
        </Button>
      </CardContent>
    </Card>
  );
}
