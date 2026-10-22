"use client";

import type * as React from "react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { LoginHeader } from "./login-header";

export interface LoginEmailStepProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  isSending: boolean;
  error: string | null;
}

export function LoginEmailStep({
  email,
  onEmailChange,
  onSubmit,
  onBack,
  isSending,
  error,
}: LoginEmailStepProps) {
  return (
    <>
      <LoginHeader
        title="Sign in with email"
        description="We'll send a 6-digit verification code to your email."
        onBack={onBack}
        backLabel="Back to sign-in options"
      />
      <CardContent>
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="email-input">Email address</FieldLabel>
            <Input
              id="email-input"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              autoFocus
              autoComplete="email"
              disabled={isSending}
              aria-invalid={!!error}
            />
            {error && <FieldError>{error}</FieldError>}
          </Field>
          <Button
            type="submit"
            className="w-full"
            disabled={isSending || !email.trim()}
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
        </form>
      </CardContent>
    </>
  );
}
