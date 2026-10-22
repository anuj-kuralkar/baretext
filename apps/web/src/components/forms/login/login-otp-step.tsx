"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { PencilIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { LoginHeader } from "./login-header";

export interface LoginOtpStepProps {
  email: string;
  otp: string;
  onOtpChange: (value: string) => void;
  onVerify: (code: string) => void;
  onResend: () => void;
  onBack: () => void;
  isVerifying: boolean;
  isResending: boolean;
  countdown: number;
  error: string | null;
}

export function LoginOtpStep({
  email,
  otp,
  onOtpChange,
  onVerify,
  onResend,
  onBack,
  isVerifying,
  isResending,
  countdown,
  error,
}: LoginOtpStepProps) {
  return (
    <>
      <LoginHeader
        title="Check your email"
        description={
          <span>
            We sent a 6-digit code to{" "}
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-1 font-medium text-foreground underline-offset-4 transition-colors hover:underline"
              title="Change email"
            >
              <span className="max-w-[200px] truncate">{email}</span>
              <PencilIcon className="size-3 text-muted-foreground" />
            </button>
          </span>
        }
        onBack={onBack}
        backLabel="Change email"
      />
      <CardContent className="flex flex-col items-center gap-4">
        <div className="flex flex-col items-center justify-center py-2">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={otp}
            onChange={(val) => {
              onOtpChange(val);
              if (val.length === 6) {
                onVerify(val);
              }
            }}
            disabled={isVerifying}
            autoFocus
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} aria-invalid={!!error} />
              <InputOTPSlot index={1} aria-invalid={!!error} />
              <InputOTPSlot index={2} aria-invalid={!!error} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} aria-invalid={!!error} />
              <InputOTPSlot index={4} aria-invalid={!!error} />
              <InputOTPSlot index={5} aria-invalid={!!error} />
            </InputOTPGroup>
          </InputOTP>

          {error && (
            <p className="mt-2.5 text-center font-medium text-destructive text-xs leading-normal">
              {error}
            </p>
          )}
        </div>

        <Button
          className="w-full"
          onClick={() => onVerify(otp)}
          disabled={otp.length !== 6 || isVerifying}
        >
          {isVerifying ? (
            <>
              <Spinner data-icon="inline-start" />
              Verifying...
            </>
          ) : (
            "Verify & Sign in"
          )}
        </Button>

        <div className="text-center">
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
              onClick={onResend}
              disabled={isResending}
            >
              {isResending
                ? "Sending new code..."
                : "Didn't get a code? Resend"}
            </Button>
          )}
        </div>
      </CardContent>
    </>
  );
}
