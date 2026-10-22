"use client";

import { Card } from "@/components/ui/card";
import { LoginProvider, useLogin } from "./login-context";
import { LoginEmailStep } from "./login-email-step";
import { LoginMethodsStep } from "./login-methods-step";
import { LoginOtpStep } from "./login-otp-step";

function LoginCardContent() {
  const { step, direction } = useLogin();

  const animationClass =
    direction === "left"
      ? "animate-in fade-in slide-in-from-right-6 duration-200"
      : direction === "right"
        ? "animate-in fade-in slide-in-from-left-6 duration-200"
        : direction === "up"
          ? "animate-in fade-in slide-in-from-bottom-6 duration-250"
          : "animate-in fade-in slide-in-from-top-6 duration-200";

  return (
    <Card className="w-full overflow-hidden rounded-2xl border bg-card/90 shadow-md backdrop-blur-sm">
      <div key={step} className={animationClass}>
        {step === "methods" && <LoginMethodsStep />}
        {step === "email" && <LoginEmailStep />}
        {step === "otp" && <LoginOtpStep />}
      </div>
    </Card>
  );
}

export function LoginForm() {
  return (
    <LoginProvider>
      <LoginCardContent />
    </LoginProvider>
  );
}
