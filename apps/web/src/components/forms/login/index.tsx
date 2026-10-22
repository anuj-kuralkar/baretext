"use client";

import { ViewTransition } from "react";
import { LoginFormProvider, useLoginForm } from "./login-context";
import { LoginEmailStep } from "./login-email-step";
import { LoginMethodsStep } from "./login-methods-step";
import { LoginOtpStep } from "./login-otp-step";

function LoginContent() {
  const { step } = useLoginForm();

  return (
    <div className="w-full">
      <ViewTransition name="login-card" share="auto" enter="auto">
        {step === "methods" && <LoginMethodsStep key="methods" />}
        {step === "email" && <LoginEmailStep key="email" />}
        {step === "otp" && <LoginOtpStep key="otp" />}
      </ViewTransition>
    </div>
  );
}

export function LoginForm() {
  return (
    <LoginFormProvider>
      <LoginContent />
    </LoginFormProvider>
  );
}
