"use client";

import { LoginProvider, useLogin } from "./login-context";
import { LoginEmailStep } from "./login-email-step";
import { LoginMethodsStep } from "./login-methods-step";
import { LoginOtpStep } from "./login-otp-step";

function LoginContent() {
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
    <div className="w-full overflow-hidden">
      <div key={step} className={animationClass}>
        {step === "methods" && <LoginMethodsStep />}
        {step === "email" && <LoginEmailStep />}
        {step === "otp" && <LoginOtpStep />}
      </div>
    </div>
  );
}

export function LoginForm() {
  return (
    <LoginProvider>
      <LoginContent />
    </LoginProvider>
  );
}
