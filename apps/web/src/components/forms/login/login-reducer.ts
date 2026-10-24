import type { LoginFormAction, LoginFormState } from "./types";

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
          email: state.email,
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
