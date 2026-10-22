"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { useLogin } from "./login-context";
import { LoginHeader } from "./login-header";

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
    <div className="flex flex-col p-8">
      <LoginHeader
        title="Check your email"
        description={
          <span>
            We sent a 6-digit code to{" "}
            <button
              type="button"
              onClick={goToEmail}
              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              title="Change email"
            >
              <span className="max-w-[180px] truncate">{email}</span>
              <PencilIcon className="size-3 text-muted-foreground" />
            </button>
          </span>
        }
        onBack={goToEmail}
        backLabel="Change email"
      />
      <div className="mt-6 flex flex-col items-center">
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
              <InputOTPSlot
                index={0}
                className="size-11 text-base sm:size-12 sm:text-lg"
                aria-invalid={!!otpError}
              />
              <InputOTPSlot
                index={1}
                className="size-11 text-base sm:size-12 sm:text-lg"
                aria-invalid={!!otpError}
              />
              <InputOTPSlot
                index={2}
                className="size-11 text-base sm:size-12 sm:text-lg"
                aria-invalid={!!otpError}
              />
            </InputOTPGroup>
            <InputOTPSeparator className="mx-1 sm:mx-2" />
            <InputOTPGroup>
              <InputOTPSlot
                index={3}
                className="size-11 text-base sm:size-12 sm:text-lg"
                aria-invalid={!!otpError}
              />
              <InputOTPSlot
                index={4}
                className="size-11 text-base sm:size-12 sm:text-lg"
                aria-invalid={!!otpError}
              />
              <InputOTPSlot
                index={5}
                className="size-11 text-base sm:size-12 sm:text-lg"
                aria-invalid={!!otpError}
              />
            </InputOTPGroup>
          </InputOTP>

          {otpError && (
            <p className="mt-3 text-center font-medium text-destructive text-xs leading-normal">
              {otpError}
            </p>
          )}
        </div>

        <Button
          size="lg"
          className="mt-6 h-10 w-full font-medium text-sm"
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

        <div className="mt-5 text-center">
          {countdown > 0 ? (
            <p className="text-muted-foreground text-xs">
              Resend code in{" "}
              <span className="font-medium text-foreground">{countdown}s</span>
            </p>
          ) : (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              className="text-muted-foreground text-xs hover:text-foreground"
              onClick={resendOtp}
              disabled={isSendingOtp}
            >
              {isSendingOtp
                ? "Sending new code..."
                : "Didn't get a code? Resend"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
