"use client";
import { MailIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PinInput } from "@/components/ui/pin-input";
import { Separator } from "@/components/ui/separator";
import { loginWithEmail, loginWithOAuth } from "@/module/auth/actions";
import type { LoginWithEmailFormState } from "@/module/auth/types";

function LoginWithOAuthForm() {
  return (
    <div className="flex flex-col gap-4">
      <Button
        className="w-full"
        onClick={() => loginWithOAuth("google")}
        type="button"
        variant="outline"
      >
        <GoogleIcon />
        Continue with Google
      </Button>
      <Button
        className="w-full"
        onClick={() => loginWithOAuth("github")}
        type="button"
        variant="outline"
      >
        <GithubIcon />
        Continue with Github
      </Button>
    </div>
  );
}

export function LoginForm() {
  const [state, action, isPending] = useActionState<
    LoginWithEmailFormState,
    FormData
  >(loginWithEmail, {
    inputs: { email: "", otp: "" },
    errors: { email: [], otp: [] },
    success: false,
  });

  const [invalid, setInvalid] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setInvalid(state.errors?.email?.[0] ? true : undefined);
  }, [state.errors]);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold tracking-tight">
            {state.success ? "Check Your Email" : "Login"}
          </CardTitle>
          {state.success && (
            <p className="text-lg text-muted-foreground">
              We sent a 6-digit code to
              <span className="font-light text-card-foreground">
                {" "}
                {state.inputs.email}
              </span>
            </p>
          )}
        </CardHeader>
        <CardContent>
          {!state.success && (
            <>
              <LoginWithOAuthForm />
              <Separator className="my-4" />
            </>
          )}

          <Form
            action={action}
            className="flex flex-col gap-4 items-center justify-center"
            noValidate
          >
            <Field.Root hidden={state.success} invalid={invalid} required>
              <Field.Label>Email</Field.Label>
              <Field.Input
                defaultValue={state.inputs.email}
                name="email"
                onChange={() => {
                  setInvalid(false);
                }}
                placeholder="me@example.com"
                type="email"
              />
              <Field.ErrorText>
                {state.errors?.email?.join(", ")}
              </Field.ErrorText>
            </Field.Root>

            <Field.Root
              className="mb-4"
              hidden={!state.success}
              invalid={invalid}
            >
              <PinInput.Root
                count={6}
                name="otp"
                onChange={() => setInvalid(false)}
                otp
                required
                size="xl"
              >
                <PinInput.Control className="w-fit mx-auto">
                  {[0, 1, 2, 3, 4, 5].map((id, index) => (
                    <PinInput.Input index={index} key={id} />
                  ))}
                </PinInput.Control>
                <PinInput.HiddenInput />
              </PinInput.Root>
              <Field.ErrorText>{state.errors?.otp?.join(", ")}</Field.ErrorText>
            </Field.Root>

            <Button className="w-full" disabled={isPending} type="submit">
              {state.success ? (
                "Verify OTP"
              ) : (
                <>
                  <MailIcon className="mr-2 h-4 w-4" />
                  Continue With Email
                </>
              )}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
