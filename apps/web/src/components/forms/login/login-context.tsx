"use client";

import { createContext, useContext, useState } from "react";
import type { SlideDirection, Step } from "./types";

interface LoginContextValue {
  step: Step;
  direction: SlideDirection;
  email: string;
  setEmail: (email: string) => void;
  goToMethods: () => void;
  goToEmail: () => void;
  goToOtp: (email?: string) => void;
}

const LoginContext = createContext<LoginContextValue | null>(null);

export function useLogin() {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLogin must be used within a LoginProvider");
  }
  return context;
}

export function LoginProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<Step>("methods");
  const [direction, setDirection] = useState<SlideDirection>("left");
  const [email, setEmail] = useState("");

  const goToMethods = () => {
    setDirection("right");
    setStep("methods");
  };

  const goToEmail = () => {
    setDirection(step === "otp" ? "down" : "left");
    setStep("email");
  };

  const goToOtp = (nextEmail?: string) => {
    if (nextEmail) setEmail(nextEmail);
    setDirection("up");
    setStep("otp");
  };

  return (
    <LoginContext.Provider
      value={{
        step,
        direction,
        email,
        setEmail,
        goToMethods,
        goToEmail,
        goToOtp,
      }}
    >
      {children}
    </LoginContext.Provider>
  );
}
