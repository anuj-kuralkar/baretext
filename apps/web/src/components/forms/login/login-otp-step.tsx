"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "./login-context";

export function LoginOtpStep() {
  const {
    email,
    otp,
    setOtp,
    otpError,
    isVerifyingOtp,
    isSendingOtp,
    countdown,
    verifyOtp,
    resendOtp,
    goToEmail,
  } = useLogin();

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center justify-center py-2">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(val) => {
              setOtp(val);
              if (val.length === 6) {
                verifyOtp(val);
              }
            }}
            disabled={isVerifyingOtp}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} aria-invalid={!!otpError} />
              <InputOTPSlot index={1} aria-invalid={!!otpError} />
              <InputOTPSlot index={2} aria-invalid={!!otpError} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} aria-invalid={!!otpError} />
              <InputOTPSlot index={4} aria-invalid={!!otpError} />
              <InputOTPSlot index={5} aria-invalid={!!otpError} />
            </InputOTPGroup>
          </InputOTP>

          {otpError && (
            <p className="mt-2 text-center font-medium text-destructive text-sm">
              {otpError}
            </p>
          )}
        </div>

        <Button
          className="w-full"
          onClick={() => verifyOtp(otp)}
          disabled={otp.length !== 6 || isVerifyingOtp}
        >
          {isVerifyingOtp ? (
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
          onClick={resendOtp}
          disabled={isSendingOtp || countdown > 0}
        >
          {countdown > 0
            ? `Resend code in ${countdown}s`
            : isSendingOtp
              ? "Sending code..."
              : "Resend code"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={goToEmail}
          disabled={isVerifyingOtp}
        >
          Change email
        </Button>
      </CardContent>
    </Card>
  );
}
