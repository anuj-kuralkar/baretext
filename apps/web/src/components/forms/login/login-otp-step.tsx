"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useCountdown } from "@/hooks/use-countdown";
import { useLoginForm } from "./login-context";
import { StepTransition } from "./step-transition";

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const;

export function LoginOtpStep() {
  const { state, prev, setValue, submit, resend } = useLoginForm();
  const [actionType, setActionType] = useState<"verify" | "resend" | null>(
    null,
  );
  const remainingSeconds = useCountdown(
    state.step === "otp" ? state.resendAvailableAt : 0,
  );

  if (state.step !== "otp") return null;
  const handleVerify = async (code?: string) => {
    setActionType("verify");
    try {
      await submit(code);
    } finally {
      setActionType(null);
    }
  };

  const handleResend = async () => {
    setActionType("resend");
    try {
      await resend();
    } finally {
      setActionType(null);
    }
  };

  const handleOtpChange = (val: string) => {
    setValue(val);
    if (val.length === 6) {
      handleVerify(val);
    }
  };

  return (
    <StepTransition>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{state.email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Field data-invalid={Boolean(state.error)} className="items-center">
          <FieldLabel htmlFor="otp-input" className="sr-only">
            6-digit verification code
          </FieldLabel>

          <InputOTP
            id="otp-input"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={state.otp}
            onChange={handleOtpChange}
            disabled={state.isPending}
            autoFocus
            aria-label="6-digit verification code"
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? "otp-error" : undefined}
          >
            <InputOTPGroup>
              {OTP_SLOTS.map((slot) => (
                <InputOTPSlot key={slot} index={slot} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {state.error && (
            <FieldError id="otp-error" className="text-center">
              {state.error}
            </FieldError>
          )}
        </Field>

        <Button
          type="button"
          className="w-full"
          onClick={() => handleVerify(state.otp)}
          disabled={state.otp.length !== 6 || state.isPending}
        >
          {state.isPending && actionType === "verify" ? (
            <>
              <Spinner data-icon="inline-start" />
              Verifying...
            </>
          ) : (
            "Verify & Sign in"
          )}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={handleResend}
          disabled={state.isPending || remainingSeconds > 0}
        >
          {remainingSeconds > 0
            ? `Resend code in ${remainingSeconds}s`
            : state.isPending && actionType === "resend"
              ? "Sending code..."
              : "Resend code"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={prev}
          disabled={state.isPending}
        >
          Change email
        </Button>
      </CardContent>
    </StepTransition>
  );
}
