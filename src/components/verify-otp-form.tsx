"use client";

import { useActionState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

import { verifyOtp } from "@/actions/auth";

export function VerifyOtpForm({
  email,
  onBack,
}: { email: string; onBack: () => void }) {
  const initialState = {
    inputs: { otp: "" },
    errors: { otp: [] },
  };
  const [state, action, isPending] = useActionState(verifyOtp, initialState);
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a 6-digit verification code to{" "}
            <span className="text-foreground">me@example.com</span>.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={action} noValidate>
            <div className="grid gap-6">
              <input type="hidden" name="email" value={email} required />
              <div className="mx-auto">
                <InputOTP maxLength={6} name="otp" required>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {state.errors.otp && (
                <p className="text-xs text-red-600">
                  {state.errors.otp.join(", ")}
                </p>
              )}
              <Button type="submit" disabled={isPending} className="w-full">
                Confirm
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="link" onClick={onBack}>
            <ArrowLeft />
            Back
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
