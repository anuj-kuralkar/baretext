"use client";

import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useLoginForm } from "./login-context";
import { StepTransition } from "./step-transition";

export function LoginEmailStep() {
  const { state, prev, setValue, submit } = useLoginForm();
  if (state.step !== "email") return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <StepTransition>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Sign in with email
        </CardTitle>
        <CardDescription>
          We'll send a 6-digit verification code to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <Field data-invalid={Boolean(state.error)}>
            <FieldLabel htmlFor="email-input">Email address</FieldLabel>
            <Input
              id="email-input"
              type="email"
              placeholder="name@example.com"
              value={state.email}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              autoComplete="email"
              disabled={state.isPending}
              aria-invalid={Boolean(state.error)}
              aria-describedby={state.error ? "email-error" : undefined}
            />
            {state.error && (
              <FieldError id="email-error">{state.error}</FieldError>
            )}
          </Field>

          <Button
            type="submit"
            className="w-full"
            disabled={state.isPending || !state.email.trim()}
          >
            {state.isPending ? (
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
            onClick={prev}
            disabled={state.isPending}
          >
            Back
          </Button>
        </form>
      </CardContent>
    </StepTransition>
  );
}
