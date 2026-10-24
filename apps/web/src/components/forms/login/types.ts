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
