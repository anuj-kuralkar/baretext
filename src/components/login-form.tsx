"use client";
import { MailIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { PinInput } from "@/components/ui/pin-input";
import {
  loginWithOAuth,
  sendOtpEmail,
  verifyOtpEmail,
} from "@/module/auth/actions";
import type {
  SendOtpEmailFormState,
  VerifyOtpEmailFormState,
} from "@/module/auth/types";

function LoginOptionsForm() {
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
      <Button className="w-full" variant="outline">
        <MailIcon />
        Continue with Email
      </Button>
    </div>
  );
}

function SendOtpEmailForm() {
  const [state, action, isPending] = useActionState<
    SendOtpEmailFormState,
    FormData
  >(sendOtpEmail, {
    inputs: { email: "" },
    errors: { email: [] },
    success: false,
  });

  const [invalid, setInvalid] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setInvalid(state.errors?.email?.[0] ? true : undefined);
  }, [state.errors]);

  return (
    <Form
      action={action}
      className="flex flex-col gap-4 items-center justify-center"
      noValidate
    >
      <Field.Root invalid={invalid} required>
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
        <Field.ErrorText>{state.errors?.email?.join(", ")}</Field.ErrorText>
      </Field.Root>
      <Button className="w-full" disabled={isPending} type="submit">
        Send OTP
      </Button>
    </Form>
  );
}

function VerifyOtpEmailForm() {
  const [state, action, isPending] = useActionState<
    VerifyOtpEmailFormState,
    FormData
  >(verifyOtpEmail, {
    inputs: { otp: "" },
    errors: { otp: [] },
  });

  const [invalid, setInvalid] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setInvalid(state.errors?.otp?.[0] ? true : undefined);
  }, [state.errors]);

  return (
    <Form
      action={action}
      className="flex flex-col gap-4 items-center justify-center"
      noValidate
    >
      <Field.Root className="w-fit" invalid={invalid}>
        <PinInput.Root
          count={6}
          name="otp"
          onChange={() => setInvalid(false)}
          otp
          required
          size="xl"
        >
          <PinInput.Control>
            {[0, 1, 2, 3, 4, 5].map((id, index) => (
              <PinInput.Input index={index} key={id} />
            ))}
          </PinInput.Control>
          <PinInput.HiddenInput />
        </PinInput.Root>
        <Field.ErrorText>{state.errors?.otp?.join(", ")}</Field.ErrorText>
      </Field.Root>
      <Button className="w-full" disabled={isPending} type="submit">
        Verify OTP
      </Button>
    </Form>
  );
}

export function LoginForm() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginOptionsForm />
        </CardContent>
      </Card>
    </div>
  );
}
