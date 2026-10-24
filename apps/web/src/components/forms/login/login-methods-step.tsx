"use client";

import { FingerprintIcon, MailIcon } from "lucide-react";
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
import { useLoginForm } from "./login-context";
import { StepTransition } from "./step-transition";

export function LoginMethodsStep() {
  const { state, next, signInSocial, signInPasskey } = useLoginForm();
  if (state.step !== "methods") return null;

  const isPending = state.loadingProvider !== null;

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
          onClick={next}
          disabled={isPending}
        >
          <MailIcon data-icon="inline-start" />
          Sign in with Email
        </Button>
        <Separator />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signInSocial("google")}
          disabled={isPending}
        >
          {state.loadingProvider === "google" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GoogleIcon data-icon="inline-start" />
          )}
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signInSocial("github")}
          disabled={isPending}
        >
          {state.loadingProvider === "github" ? (
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
          onClick={signInPasskey}
          disabled={isPending}
        >
          {state.loadingProvider === "passkey" ? (
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
