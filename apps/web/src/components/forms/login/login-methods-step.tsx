"use client";

import { FingerprintIcon, MailIcon } from "lucide-react";
import { useState } from "react";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { useLoginForm } from "./login-context";
import { StepTransition } from "./step-transition";
import type { SocialProvider } from "./types";

export function LoginMethodsStep() {
  const { goToEmail } = useLoginForm();
  const [loadingProvider, setLoadingProvider] = useState<
    SocialProvider | "passkey" | null
  >(null);

  const isPending = loadingProvider !== null;

  const handleSocialLogin = async (provider: SocialProvider) => {
    setLoadingProvider(provider);
    const { error } = await authClient.signIn.social({
      provider,
      callbackURL: `${window.location.origin}/`,
      errorCallbackURL: `${window.location.origin}/login`,
    });
    setLoadingProvider(null);

    if (error) {
      toast.add({
        type: "error",
        title:
          error.message ??
          error.statusText ??
          `Failed to sign in with ${provider}`,
      });
    }
  };

  const handlePasskeyLogin = async () => {
    setLoadingProvider("passkey");
    const { error } = await authClient.signIn.passkey();
    setLoadingProvider(null);

    if (error) {
      toast.add({
        type: "error",
        title:
          error.message ?? error.statusText ?? "Passkey authentication failed",
      });
      return;
    }

    window.location.href = "/";
  };

  return (
    <StepTransition>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>Hop back in and keep writing.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={goToEmail}
          disabled={isPending}
        >
          <MailIcon data-icon="inline-start" />
          Sign in with Email
        </Button>
        <Separator />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin("google")}
          disabled={isPending}
        >
          {loadingProvider === "google" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GoogleIcon data-icon="inline-start" />
          )}
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => handleSocialLogin("github")}
          disabled={isPending}
        >
          {loadingProvider === "github" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GithubIcon data-icon="inline-start" />
          )}
          Sign in with GitHub
        </Button>
        <Separator />

        <Button
          variant="outline"
          className="w-full"
          onClick={handlePasskeyLogin}
          disabled={isPending}
        >
          {loadingProvider === "passkey" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <FingerprintIcon data-icon="inline-start" />
          )}
          Sign in with Passkey
        </Button>
      </CardContent>
    </StepTransition>
  );
}
