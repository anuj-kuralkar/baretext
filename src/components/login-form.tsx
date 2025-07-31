"use client";

import { useActionState, useEffect, useState } from "react";
import { Envelope, Github, Google } from "react-bootstrap-icons";

import { loginWithEmail, loginWithOAuth } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FieldErrorText,
  FieldInput,
  FieldLabel,
  FieldRoot,
} from "@/components/ui/field";
import { VerifyOtpForm } from "@/components/verify-otp-form";

function LoginWithOAuthForm() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-full"
        onClick={() => loginWithOAuth("google")}
        type="button"
        variant="outline"
      >
        <Google />
        Login with Google
      </Button>
      <Button
        className="w-full"
        onClick={() => loginWithOAuth("github")}
        type="button"
        variant="outline"
      >
        <Github />
        Login with Github
      </Button>
    </div>
  );
}

function LoginWithEmailForm({
  onSuccess,
}: {
  onSuccess: (email: string) => void;
}) {
  const initialState = {
    inputs: { email: "" },
    errors: { email: [] },
    success: false,
  };
  const [state, action, isPending] = useActionState(
    loginWithEmail,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onSuccess(state.inputs.email);
    }
  }, [state.success, state.inputs.email, onSuccess]);

  return (
    <form action={action} noValidate>
      <div className="grid gap-4">
        <FieldRoot invalid={!!state.errors.email?.length} required>
          <FieldLabel>Email</FieldLabel>
          <FieldInput name="email" placeholder="me@example.com" type="email" />
          <FieldErrorText>{state.errors.email?.join(", ")}</FieldErrorText>
        </FieldRoot>
        <Button className="w-full" disabled={isPending} type="submit">
          <Envelope />
          Login with Email
        </Button>
      </div>
    </form>
  );
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [isEmailSubmitted, setIsEmailSubmitted] = useState(false);
  return (
    <>
      {!isEmailSubmitted ? (
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <LoginWithOAuthForm />
                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                  <span className="bg-card text-muted-foreground relative z-10 px-2">
                    Or
                  </span>
                </div>
                <LoginWithEmailForm
                  onSuccess={(email) => {
                    setIsEmailSubmitted(true);
                    setEmail(email);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <VerifyOtpForm
          email={email}
          onBack={() => setIsEmailSubmitted(false)}
        />
      )}
    </>
  );
}
