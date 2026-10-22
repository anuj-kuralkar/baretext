"use client";

import { FingerprintIcon, MailIcon } from "lucide-react";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { LoginHeader } from "./login-header";
import type { SocialProvider } from "./types";

export interface LoginMethodsStepProps {
  onSelectEmail: () => void;
  onSelectSocial: (provider: SocialProvider) => void;
  onSelectPasskey: () => void;
  loadingProvider: SocialProvider | "passkey" | null;
}

export function LoginMethodsStep({
  onSelectEmail,
  onSelectSocial,
  onSelectPasskey,
  loadingProvider,
}: LoginMethodsStepProps) {
  const isPending = loadingProvider !== null;

  return (
    <>
      <LoginHeader
        title="Welcome back"
        description="Hop back in and keep writing."
      />
      <CardContent className="flex flex-col gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onSelectSocial("google")}
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
          onClick={() => onSelectSocial("github")}
          disabled={isPending}
        >
          {loadingProvider === "github" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GithubIcon data-icon="inline-start" />
          )}
          Sign in with GitHub
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={onSelectEmail}
          disabled={isPending}
        >
          <MailIcon data-icon="inline-start" />
          Sign in with Email
        </Button>
        <div className="my-1 flex items-center justify-center gap-2">
          <Separator />
          <span className="text-muted-foreground text-xs">Or</span>
          <Separator />
        </div>
        <Button
          variant="outline"
          className="w-full"
          onClick={onSelectPasskey}
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
    </>
  );
}
