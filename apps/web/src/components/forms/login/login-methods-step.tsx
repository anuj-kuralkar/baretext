"use client";

import { FingerprintIcon, MailIcon } from "lucide-react";
import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "./login-context";

export function LoginMethodsStep() {
  const { goToEmail, loginWithSocial, loginWithPasskey, loadingProvider } =
    useLogin();

  const isPending = loadingProvider !== null;

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>Hop back in and keep writing.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={goToEmail}
          disabled={isPending}
        >
          <MailIcon data-icon="inline-start" />
          Sign in with Email
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => loginWithSocial("google")}
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
          onClick={() => loginWithSocial("github")}
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
          onClick={loginWithPasskey}
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
    </Card>
  );
}
