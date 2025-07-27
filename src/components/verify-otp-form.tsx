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
import { FieldErrorText, FieldRoot } from "@/components/ui/field";
import {
  PinInputControl,
  PinInputHiddenInput,
  PinInputInput,
  PinInputRoot,
} from "@/components/ui/pin-input";

export function VerifyOtpForm({
  email,
  onBack,
}: {
  email: string;
  onBack: () => void;
}) {
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
            <input name="email" required type="hidden" value={email} />
            <FieldRoot
              className="justify-center"
              invalid={!!state.errors.otp?.length}
            >
              <PinInputRoot count={6} name="otp" otp required>
                <PinInputControl>
                  {[0, 1, 2, 3, 4, 5].map((id, index) => (
                    <PinInputInput index={index} key={id} />
                  ))}
                </PinInputControl>
                <PinInputHiddenInput />
              </PinInputRoot>
              <FieldErrorText>{state.errors.otp?.join(", ")}</FieldErrorText>
            </FieldRoot>
            <Button className="w-full" disabled={isPending} type="submit">
              Confirm
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={onBack} variant="link">
          <ArrowLeft />
          Back
        </Button>
      </CardFooter>
    </Card>
  );
}
