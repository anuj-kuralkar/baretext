import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LoginForm } from "./login";

describe("LoginForm", () => {
  it("renders sign-in methods and navigates between methods and email step", async () => {
    const user = userEvent.setup();
    render(<LoginForm />);

    expect(
      screen.getByRole("button", { name: "Sign in with Email" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in with Google/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Sign in with GitHub/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign in with Passkey" }),
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: "Sign in with Email" }),
    );

    const submitButton = screen.getByRole("button", {
      name: "Send Verification code",
    });
    expect(submitButton).toBeDisabled();

    await user.type(screen.getByLabelText("Email address"), "ada@example.com");
    expect(submitButton).toBeEnabled();

    await user.click(screen.getByRole("button", { name: "Back" }));
    expect(
      screen.getByRole("button", { name: "Sign in with Email" }),
    ).toBeInTheDocument();
  });
});
