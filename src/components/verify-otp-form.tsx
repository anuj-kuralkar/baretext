"use client";

import { useActionState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";

import { verifyOtp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormControl, FormItem, FormMessage } from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

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
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a 6-digit verification code to{" "}
          <span className="text-foreground">{email}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={action} noValidate>
          <div className="grid gap-y-6">
            <input type="hidden" name="email" value={email} required />
            <FormItem className="justify-center">
              <FormControl>
                <InputOTP maxLength={6} name="otp" required>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="h-10 w-10" />
                    <InputOTPSlot index={1} className="h-10 w-10" />
                    <InputOTPSlot index={2} className="h-10 w-10" />
                    <InputOTPSlot index={3} className="h-10 w-10" />
                    <InputOTPSlot index={4} className="h-10 w-10" />
                    <InputOTPSlot index={5} className="h-10 w-10" />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              {state.errors.otp && (
                <FormMessage>{state.errors.otp.join(", ")}</FormMessage>
              )}
            </FormItem>
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
  );
}
