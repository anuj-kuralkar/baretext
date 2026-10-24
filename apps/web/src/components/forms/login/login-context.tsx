"use client";

import {
  addTransitionType,
  createContext,
  startTransition,
  useContext,
  useReducer,
} from "react";
import { toast } from "@/components/ui/toast";
import { authClient } from "@/lib/auth/client";
import { initialLoginFormState, loginReducer } from "./login-reducer";
import type { LoginFormState, SocialProvider } from "./types";

interface LoginFormContextValue {
  state: LoginFormState;
  next: () => void;
  prev: () => void;
  setValue: (value: string) => void;
  submit: (explicitValue?: string) => Promise<void>;
  resend: () => Promise<void>;
  signInSocial: (provider: SocialProvider) => Promise<void>;
  signInPasskey: () => Promise<void>;
}

const LoginFormContext = createContext<LoginFormContextValue | null>(null);

export function useLoginForm() {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error("useLoginForm must be used within a LoginFormProvider");
  }
  return context;
}

export function LoginFormProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(loginReducer, initialLoginFormState);

  const next = () => {
    startTransition(() => {
      addTransitionType("forward");
      dispatch({ type: "NEXT" });
    });
  };

  const prev = () => {
    startTransition(() => {
      addTransitionType("back");
      dispatch({ type: "PREV" });
    });
  };

  const setValue = (value: string) => {
    dispatch({ type: "SET_VALUE", value });
  };

  const submit = async (explicitValue?: string) => {
    if (state.step === "email") {
      const email = state.email.trim();
      if (!email || state.isPending) return;

      dispatch({ type: "SET_PENDING", isPending: true });

      try {
        const { error } = await authClient.emailOtp.sendVerificationOtp({
          email,
          type: "sign-in",
        });

        if (error) {
          dispatch({
            type: "SET_ERROR",
            error:
              error.message ??
              error.statusText ??
              "Failed to send verification code",
          });
          return;
        }

        next();
      } catch {
        dispatch({
          type: "SET_ERROR",
          error:
            "Failed to send verification code. Please check your connection.",
        });
      }
      return;
    }

    if (state.step === "otp") {
      const code = (explicitValue ?? state.otp).trim();
      if (code.length !== 6 || state.isPending) return;

      dispatch({ type: "SET_PENDING", isPending: true });

      try {
        const { error } = await authClient.signIn.emailOtp({
          email: state.email,
          otp: code,
        });

        if (error) {
          dispatch({
            type: "SET_ERROR",
            error: error.message ?? "Invalid or expired verification code",
          });
          return;
        }

        window.location.href = "/";
      } catch {
        dispatch({
          type: "SET_ERROR",
          error: "Verification failed. Please check your connection.",
        });
      }
    }
  };

  const resend = async () => {
    if (state.step !== "otp" || state.isPending) return;
    if (Date.now() < state.resendAvailableAt) return;

    dispatch({ type: "SET_PENDING", isPending: true });

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email: state.email,
        type: "sign-in",
      });

      if (error) {
        dispatch({
          type: "SET_ERROR",
          error: error.message ?? error.statusText ?? "Failed to resend code",
        });
        return;
      }

      dispatch({
        type: "RESET_RESEND",
        resendAvailableAt: Date.now() + 30_000,
      });
    } catch {
      dispatch({
        type: "SET_ERROR",
        error: "Failed to resend code. Please try again.",
      });
    }
  };

  const signInSocial = async (provider: SocialProvider) => {
    if (state.step !== "methods" || state.loadingProvider !== null) return;
    dispatch({ type: "START_PROVIDER_AUTH", provider });

    try {
      const { error } = await authClient.signIn.social({
        provider,
        callbackURL: `${window.location.origin}/`,
        errorCallbackURL: `${window.location.origin}/login`,
      });

      if (error) {
        toast.add({
          type: "error",
          title:
            error.message ??
            error.statusText ??
            `Failed to sign in with ${provider}`,
        });
      }
    } catch {
      toast.add({
        type: "error",
        title: `Failed to sign in with ${provider}. Please try again.`,
      });
    } finally {
      dispatch({ type: "FINISH_PROVIDER_AUTH" });
    }
  };

  const signInPasskey = async () => {
    if (state.step !== "methods" || state.loadingProvider !== null) return;
    dispatch({ type: "START_PROVIDER_AUTH", provider: "passkey" });

    try {
      const { error } = await authClient.signIn.passkey();
      if (error) {
        toast.add({
          type: "error",
          title:
            error.message ??
            error.statusText ??
            "Passkey authentication failed",
        });
        return;
      }

      window.location.href = "/";
    } catch {
      toast.add({
        type: "error",
        title: "Passkey authentication failed. Please try again.",
      });
    } finally {
      dispatch({ type: "FINISH_PROVIDER_AUTH" });
    }
  };

  return (
    <LoginFormContext.Provider
      value={{
        state,
        next,
        prev,
        setValue,
        submit,
        resend,
        signInSocial,
        signInPasskey,
      }}
    >
      {children}
    </LoginFormContext.Provider>
  );
}
