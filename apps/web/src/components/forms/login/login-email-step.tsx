"use client";

import type * as React from "react";
import { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth/client";
import { useLogin } from "./login-context";

const emailSchema = z.email("Please enter a valid email address");

export function LoginEmailStep() {
  const { email, setEmail, goToMethods, goToOtp } = useLogin();
  const [emailInput, setEmailInput] = useState(email);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmed = emailInput.trim();
    const result = emailSchema.safeParse(trimmed);
    if (!result.success) {
      setEmailError(
        result.error.issues[0]?.message ?? "Please enter a valid email address",
      );
      return;
    }

    setEmailError(null);
    setIsSending(true);

    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: result.data,
      type: "sign-in",
    });

    setIsSending(false);

    if (error) {
      setEmailError(
        error.message ?? error.statusText ?? "Failed to send verification code",
      );
      return;
    }

    setEmail(result.data);
    goToOtp(result.data);
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Sign in with email
        </CardTitle>
        <CardDescription>
          We'll send a 6-digit verification code to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="email-input">Email address</FieldLabel>
            <Input
              id="email-input"
              type="email"
              placeholder="name@example.com"
              value={emailInput}
              onChange={(e) => {
                setEmailInput(e.target.value);
                if (emailError) setEmailError(null);
              }}
              autoFocus
              autoComplete="email"
              disabled={isSending}
              aria-invalid={!!emailError}
            />
            {emailError && <FieldError>{emailError}</FieldError>}
          </Field>
          <Button
            type="submit"
            className="w-full"
            disabled={isSending || !emailInput.trim()}
          >
            {isSending ? (
              <>
                <Spinner data-icon="inline-start" />
                Sending code...
              </>
            ) : (
              "Continue with code"
            )}
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={goToMethods}
            disabled={isSending}
          >
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
