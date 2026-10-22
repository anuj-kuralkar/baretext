"use client";

import { FingerprintIcon, MailIcon } from "lucide-react";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "./login-context";
import { LoginHeader } from "./login-header";

export function LoginMethodsStep() {
  const {
    goToEmail,
    loginWithSocial,
    loginWithPasskey,
    loadingProvider,
    emailError,
  } = useLogin();

  const isPending = loadingProvider !== null;

  return (
    <div className="flex flex-col p-8">
      <LoginHeader
        title="Welcome back"
        description="Hop back in and keep writing."
      />
      <div className="mt-6 flex flex-col gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-10 w-full justify-center gap-2 font-medium"
          onClick={goToEmail}
          disabled={isPending}
        >
          <MailIcon className="size-4" />
          Sign in with Email
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-10 w-full justify-center gap-2 font-medium"
          onClick={() => loginWithSocial("google")}
          disabled={isPending}
        >
          {loadingProvider === "google" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GoogleIcon className="size-4" />
          )}
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-10 w-full justify-center gap-2 font-medium"
          onClick={() => loginWithSocial("github")}
          disabled={isPending}
        >
          {loadingProvider === "github" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GithubIcon className="size-4" />
          )}
          Sign in with GitHub
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-10 w-full justify-center gap-2 font-medium"
          onClick={loginWithPasskey}
          disabled={isPending}
        >
          {loadingProvider === "passkey" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <FingerprintIcon className="size-4" />
          )}
          Sign in with Passkey
        </Button>

        {emailError && (
          <p className="mt-1 text-center font-medium text-destructive text-xs">
            {emailError}
          </p>
        )}
      </div>
    </div>
  );
}
