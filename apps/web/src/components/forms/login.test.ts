import { describe, expect, it } from "vitest";
import { initialLoginFormState, loginReducer } from "./login";

describe("loginReducer state reset across email changes", () => {
  it("clears stale OTP digits, error, and pending state when navigating back to change email", () => {
    let state = initialLoginFormState;
    expect(state.step).toBe("methods");

    state = loginReducer(state, { type: "NEXT" });
    expect(state.step).toBe("email");

    state = loginReducer(state, {
      type: "SET_VALUE",
      value: "first@example.com",
    });
    if (state.step !== "email") throw new Error("Expected email step");
    expect(state.email).toBe("first@example.com");

    state = loginReducer(state, { type: "NEXT" });
    expect(state.step).toBe("otp");
    if (state.step !== "otp") throw new Error("Expected otp step");
    expect(state.email).toBe("first@example.com");
    expect(state.otp).toBe("");
    expect(state.error).toBeNull();
    const firstResendAvailableAt = state.resendAvailableAt;
    expect(firstResendAvailableAt).toBeGreaterThan(Date.now());

    state = loginReducer(state, { type: "SET_VALUE", value: "111111" });
    if (state.step !== "otp") throw new Error("Expected otp step");
    expect(state.otp).toBe("111111");

    state = loginReducer(state, {
      type: "SET_ERROR",
      error: "Invalid or expired verification code",
    });
    if (state.step !== "otp") throw new Error("Expected otp step");
    expect(state.error).toBe("Invalid or expired verification code");

    state = loginReducer(state, { type: "PREV" });
    expect(state.step).toBe("email");
    if (state.step !== "email") throw new Error("Expected email step");
    expect(state.email).toBe("first@example.com");
    expect(state.error).toBeNull();
    expect(state.isPending).toBe(false);

    state = loginReducer(state, {
      type: "SET_VALUE",
      value: "second@example.com",
    });
    if (state.step !== "email") throw new Error("Expected email step");
    expect(state.email).toBe("second@example.com");

    state = loginReducer(state, { type: "NEXT" });
    expect(state.step).toBe("otp");
    if (state.step !== "otp") throw new Error("Expected otp step");

    expect(state.email).toBe("second@example.com");
    expect(state.otp).toBe("");
    expect(state.error).toBeNull();
    expect(state.isPending).toBe(false);
    expect(state.resendAvailableAt).toBeGreaterThanOrEqual(
      firstResendAvailableAt,
    );
  });
});
