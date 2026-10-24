"use client";

import { Activity } from "react";
import { Card } from "@/components/ui/card";
import { LoginFormProvider, useLoginForm } from "./login-context";
import { LoginEmailStep } from "./login-email-step";
import { LoginMethodsStep } from "./login-methods-step";
import { LoginOtpStep } from "./login-otp-step";

function LoginContent() {
  const { state } = useLoginForm();

  return (
    <Card>
      <Activity mode={state.step === "methods" ? "visible" : "hidden"}>
        <LoginMethodsStep />
      </Activity>

      <Activity mode={state.step === "email" ? "visible" : "hidden"}>
        <LoginEmailStep />
      </Activity>

      <Activity mode={state.step === "otp" ? "visible" : "hidden"}>
        <LoginOtpStep key={state.step === "otp" ? state.email : "otp"} />
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
