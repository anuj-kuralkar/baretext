"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "./login-context";
import { LoginHeader } from "./login-header";

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
    <div className="flex flex-col p-8">
      <LoginHeader
        title="Sign in with email"
        description="We'll send a 6-digit verification code to your email."
        onBack={goToMethods}
        backLabel="Back to sign-in options"
      />
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
        <Field className="gap-2">
          <FieldLabel
            htmlFor="email-input"
            className="font-medium text-foreground text-sm"
          >
            Email address
          </FieldLabel>
          <Input
            id="email-input"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
            autoComplete="email"
            disabled={isSendingOtp}
            className="h-10 px-3.5 text-sm"
            aria-invalid={!!emailError}
          />
          {emailError && (
            <FieldError className="text-destructive text-xs">
              {emailError}
            </FieldError>
          )}
        </Field>
        <Button
          type="submit"
          size="lg"
          className="h-10 w-full font-medium text-sm"
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
      </form>
    </div>
  );
}
