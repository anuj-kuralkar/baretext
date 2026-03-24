"use server";
import { redirect } from "next/navigation";
import { z } from "zod";

import { auth } from "@/lib/auth";
import {
  sendOtpEmailFormSchema,
  verifyOtpFormSchema,
} from "@/module/auth/schema";
import type {
  sendOtpEmailFormState,
  VerifyOtpEmailFormState,
} from "@/module/auth/types";

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

export async function sendOtpEmail(
  _state: sendOtpEmailFormState,
  formData: FormData,
): Promise<sendOtpEmailFormState | never> {
  const email = formData.get("email") as string;

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
export async function verifyOtpEmail(
  _state: VerifyOtpEmailFormState,
  formData: FormData,
): Promise<VerifyOtpEmailFormState> {
  const email = formData.get("email") as string;
  const otp = formData.get("otp") as string;

  const validatedFields = verifyOtpFormSchema.safeParse({ email, otp });

  if (!validatedFields.success) {
    const errors = z.flattenError(validatedFields.error).fieldErrors;
    return {
      inputs: { otp },
      errors,
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
