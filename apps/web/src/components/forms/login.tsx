"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { FingerprintIcon, MailIcon } from "lucide-react";
import {
  Activity,
  addTransitionType,
  createContext,
  type ReactNode,
  startTransition,
  useContext,
  useReducer,
  useState,
  ViewTransition,
} from "react";

import { GithubIcon, GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "@/components/ui/toast";
import { useCountdown } from "@/hooks/use-countdown";
import { authClient } from "@/lib/auth/client";

export type Step = "methods" | "email" | "otp";
export type SocialProvider = "google" | "github";

export type LoginFormState =
  | {
      readonly step: "methods";
      readonly loadingProvider: SocialProvider | "passkey" | null;
    }
  | {
      readonly step: "email";
      readonly email: string;
      readonly isPending: boolean;
      readonly error: string | null;
    }
  | {
      readonly step: "otp";
      readonly email: string;
      readonly otp: string;
      readonly resendAvailableAt: number;
      readonly isPending: boolean;
      readonly error: string | null;
    };

export type LoginFormAction =
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "SET_VALUE"; value: string }
  | { type: "SET_PENDING"; isPending: boolean }
  | { type: "SET_ERROR"; error: string }
  | { type: "CLEAR_ERROR" }
  | { type: "RESET_RESEND"; resendAvailableAt: number }
  | { type: "START_PROVIDER_AUTH"; provider: SocialProvider | "passkey" }
  | { type: "FINISH_PROVIDER_AUTH" };

export const initialLoginFormState: LoginFormState = {
  step: "methods",
  loadingProvider: null,
};

export function loginReducer(
  state: LoginFormState,
  action: LoginFormAction,
): LoginFormState {
  switch (action.type) {
    case "NEXT":
      if (state.step === "methods") {
        return {
          step: "email",
          email: "",
          isPending: false,
          error: null,
        };
      }
      if (state.step === "email") {
        return {
          step: "otp",
          email: state.email.trim(),
          otp: "",
          resendAvailableAt: Date.now() + 30_000,
          isPending: false,
          error: null,
        };
      }
      return state;

    case "PREV":
      if (state.step === "otp") {
        return {
          step: "email",
          email: state.email,
          isPending: false,
          error: null,
        };
      }
      if (state.step === "email") {
        return {
          step: "methods",
          loadingProvider: null,
        };
      }
      return state;

    case "SET_VALUE":
      if (state.step === "email") {
        return { ...state, email: action.value, error: null };
      }
      if (state.step === "otp") {
        return { ...state, otp: action.value, error: null };
      }
      return state;

    case "SET_PENDING":
      if (state.step === "methods") return state;
      return {
        ...state,
        isPending: action.isPending,
        error: action.isPending ? null : state.error,
      };

    case "SET_ERROR":
      if (state.step === "methods") return state;
      return { ...state, isPending: false, error: action.error };

    case "RESET_RESEND":
      if (state.step !== "otp") return state;
      return {
        ...state,
        isPending: false,
        resendAvailableAt: action.resendAvailableAt,
        error: null,
      };

    case "START_PROVIDER_AUTH":
      if (state.step !== "methods") return state;
      return { ...state, loadingProvider: action.provider };

    case "FINISH_PROVIDER_AUTH":
      if (state.step !== "methods") return state;
      return { ...state, loadingProvider: null };

    case "CLEAR_ERROR":
      if (state.step === "methods") return state;
      return { ...state, error: null };

    default:
      return state;
  }
}

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

function useLoginForm() {
  const context = useContext(LoginFormContext);
  if (!context) {
    throw new Error("useLoginForm must be used within a LoginFormProvider");
  }
  return context;
}

function LoginFormProvider({ children }: { children: ReactNode }) {
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

function StepTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition
      enter={{
        forward: "slide-in-right",
        back: "slide-in-left",
        default: "none",
      }}
      exit={{
        forward: "slide-out-left",
        back: "slide-out-right",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}

function LoginMethodsStep() {
  const { state, next, signInSocial, signInPasskey } = useLoginForm();
  if (state.step !== "methods") return null;

  const isPending = state.loadingProvider !== null;

  return (
    <StepTransition>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Welcome back
        </CardTitle>
        <CardDescription>Hop back in and keep writing.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="w-full"
          onClick={next}
          disabled={isPending}
        >
          <MailIcon data-icon="inline-start" />
          Sign in with Email
        </Button>
        <Separator />
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signInSocial("google")}
          disabled={isPending}
        >
          {state.loadingProvider === "google" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GoogleIcon data-icon="inline-start" />
          )}
          Sign in with Google
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => signInSocial("github")}
          disabled={isPending}
        >
          {state.loadingProvider === "github" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <GithubIcon data-icon="inline-start" />
          )}
          Sign in with GitHub
        </Button>
        <Separator />

        <Button
          variant="outline"
          className="w-full"
          onClick={signInPasskey}
          disabled={isPending}
        >
          {state.loadingProvider === "passkey" ? (
            <Spinner data-icon="inline-start" />
          ) : (
            <FingerprintIcon data-icon="inline-start" />
          )}
          Sign in with Passkey
        </Button>
      </CardContent>
    </StepTransition>
  );
}

function LoginEmailStep() {
  const { state, prev, setValue, submit } = useLoginForm();
  if (state.step !== "email") return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    submit();
  };

  return (
    <StepTransition>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Sign in with email
        </CardTitle>
        <CardDescription>
          We'll send a 6-digit verification code to your email.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <Field data-invalid={Boolean(state.error)}>
            <FieldLabel htmlFor="email-input">Email address</FieldLabel>
            <Input
              id="email-input"
              type="email"
              placeholder="name@example.com"
              value={state.email}
              onChange={(e) => setValue(e.target.value)}
              autoFocus
              autoComplete="email"
              disabled={state.isPending}
              aria-invalid={Boolean(state.error)}
              aria-describedby={state.error ? "email-error" : undefined}
            />
            {state.error && (
              <FieldError id="email-error">{state.error}</FieldError>
            )}
          </Field>

          <Button
            type="submit"
            className="w-full"
            disabled={state.isPending || !state.email.trim()}
          >
            {state.isPending ? (
              <>
                <Spinner data-icon="inline-start" />
                Sending code...
              </>
            ) : (
              "Continue with code"
            )}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={prev}
            disabled={state.isPending}
          >
            Back
          </Button>
        </form>
      </CardContent>
    </StepTransition>
  );
}

const OTP_SLOTS = [0, 1, 2, 3, 4, 5] as const;

function LoginOtpStep() {
  const { state, prev, setValue, submit, resend } = useLoginForm();
  const [actionType, setActionType] = useState<"verify" | "resend" | null>(
    null,
  );
  const remainingSeconds = useCountdown(
    state.step === "otp" ? state.resendAvailableAt : 0,
  );

  if (state.step !== "otp") return null;

  const handleVerify = async (code?: string) => {
    setActionType("verify");
    try {
      await submit(code);
    } finally {
      setActionType(null);
    }
  };

  const handleResend = async () => {
    setActionType("resend");
    try {
      await resend();
    } finally {
      setActionType(null);
    }
  };

  const handleOtpChange = (val: string) => {
    setValue(val);
    if (val.length === 6) {
      handleVerify(val);
    }
  };

  return (
    <StepTransition>
      <CardHeader className="text-center">
        <CardTitle className="font-extrabold text-2xl tracking-tight">
          Check your email
        </CardTitle>
        <CardDescription>
          We sent a 6-digit code to{" "}
          <span className="font-medium text-foreground">{state.email}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-4">
        <Field data-invalid={Boolean(state.error)} className="items-center">
          <FieldLabel htmlFor="otp-input" className="sr-only">
            6-digit verification code
          </FieldLabel>

          <InputOTP
            id="otp-input"
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={state.otp}
            onChange={handleOtpChange}
            disabled={state.isPending}
            autoFocus
            aria-label="6-digit verification code"
            aria-invalid={Boolean(state.error)}
            aria-describedby={state.error ? "otp-error" : undefined}
          >
            <InputOTPGroup>
              {OTP_SLOTS.map((slot) => (
                <InputOTPSlot key={slot} index={slot} />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {state.error && (
            <FieldError id="otp-error" className="text-center">
              {state.error}
            </FieldError>
          )}
        </Field>

        <Button
          type="button"
          className="w-full"
          onClick={() => handleVerify(state.otp)}
          disabled={state.otp.length !== 6 || state.isPending}
        >
          {state.isPending && actionType === "verify" ? (
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
          onClick={handleResend}
          disabled={state.isPending || remainingSeconds > 0}
        >
          {remainingSeconds > 0
            ? `Resend code in ${remainingSeconds}s`
            : state.isPending && actionType === "resend"
              ? "Sending code..."
              : "Resend code"}
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="w-full"
          onClick={prev}
          disabled={state.isPending}
        >
          Change email
        </Button>
      </CardContent>
    </StepTransition>
  );
}

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
