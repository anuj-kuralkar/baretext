"use server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  sendOtpEmailFormSchema,
  verifyOtpFormSchema,
} from "@/module/auth/schema";
import type { LoginWithEmailFormState } from "@/module/auth/types";

export async function loginWithOAuth(provider: "google" | "github") {
  const { url } = await auth.api.signInSocial({
    body: {
      provider,
    },
  });

  if (url) {
    redirect(url);
  }
}

export async function loginWithEmail(
  state: LoginWithEmailFormState,
  formData: FormData,
): Promise<LoginWithEmailFormState> {
  const email = formData.get("email") as string;

  if (state.inputs.email && !state.errors.email) {
    const otp = formData.get("otp") as string;
    const validatedFields = verifyOtpFormSchema.safeParse({ email, otp });

    if (!validatedFields.success) {
      const errors = z.flattenError(validatedFields.error).fieldErrors;
      return {
        inputs: { email, otp },
        errors,
        success: false,
      };
    }

    await auth.api.signInEmailOTP({
      body: {
        email,
        otp,
      },
    });

    redirect("/");
  }

  const validatedFields = sendOtpEmailFormSchema.safeParse({ email });

  if (!validatedFields.success) {
    const errors = z.flattenError(validatedFields.error).fieldErrors;
    return {
      inputs: { email },
      errors,
      success: false,
    };
  }

  const { success } = await auth.api.sendVerificationOTP({
    body: {
      email,
      type: "sign-in",
    },
  });

  return {
    inputs: { email },
    errors: {},
    success,
  };
}
