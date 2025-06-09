"use client";

import { useActionState, useEffect, useState } from "react";
import { Envelope, Github, Google } from "react-bootstrap-icons";

import { loginWithEmail } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VerifyOtpForm } from "@/components/verify-otp-form";

function LoginWithOAuthForm() {
  return (
    <form>
      <div className="flex flex-col gap-4">
        <Button
          type="submit"
          name="provider"
          value="google"
          variant="outline"
          className="w-full"
        >
          <Google />
          Login with Google
        </Button>
        <Button
          type="submit"
          name="provider"
          value="github"
          variant="outline"
          className="w-full"
        >
          <Github />
          Login with Github
        </Button>
      </div>
    </form>
  );
}

function LoginWithEmailForm({
  onSuccess,
}: { onSuccess: (email: string) => void }) {
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
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="me@example.com"
            type="email"
            required
          />
          {state.errors.email && (
            <p className="text-xs text-red-600">
              {state.errors.email.join(", ")}
            </p>
          )}
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
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
