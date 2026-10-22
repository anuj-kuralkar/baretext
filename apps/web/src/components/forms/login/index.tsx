"use client";

import { Activity } from "react";
import { Card } from "@/components/ui/card";
import { LoginFormProvider, useLoginForm } from "./login-context";
import { LoginEmailStep } from "./login-email-step";
import { LoginMethodsStep } from "./login-methods-step";
import { LoginOtpStep } from "./login-otp-step";

function LoginContent() {
  const { step } = useLoginForm();

  return (
    <Card>
      <Activity mode={step === "methods" ? "visible" : "hidden"}>
        <LoginMethodsStep />
      </Activity>

      <Activity mode={step === "email" ? "visible" : "hidden"}>
        <LoginEmailStep />
      </Activity>

      <Activity mode={step === "otp" ? "visible" : "hidden"}>
        <LoginOtpStep />
      </Activity>
    </Card>
  );
}

export function LoginForm() {
  return (
    <LoginFormProvider>
      <LoginContent />
    </LoginFormProvider>
  );
}
