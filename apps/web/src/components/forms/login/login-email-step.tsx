"use client";

import type * as React from "react";
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
import { useLogin } from "./login-context";

export function LoginEmailStep() {
  const {
    email,
    setEmail,
    emailError,
    isSendingOtp,
    submitEmail,
    goToMethods,
  } = useLogin();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    await submitEmail();
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              autoComplete="email"
              disabled={isSendingOtp}
              aria-invalid={!!emailError}
            />
            {emailError && <FieldError>{emailError}</FieldError>}
          </Field>
          <Button
            type="submit"
            className="w-full"
            disabled={isSendingOtp || !email.trim()}
          >
            {isSendingOtp ? (
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
            disabled={isSendingOtp}
          >
            Back
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
