"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  type LoginWithEmailFormState,
  loginWithEmailFormSchema,
} from "@/schemas/auth";
import { type VerifyOtpFormState, verifyOtpFormSchema } from "@/schemas/auth";

export async function loginWithEmail(
  state: LoginWithEmailFormState,
  formData: FormData,
): Promise<LoginWithEmailFormState> {
  const email = formData.get("email") as string;

  const validatedFields = loginWithEmailFormSchema.safeParse({ email });

  if (!validatedFields.success) {
    const errors = validatedFields.error.flatten().fieldErrors;
    return {
      inputs: { email },
      errors,
      success: false,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOtp({
    email: validatedFields.data.email,
  });

  if (error) {
    return {
      inputs: { email },
      errors: { email: [error.message] },
      success: false,
    };
  }

  return {
    inputs: { email: validatedFields.data.email },
    errors: { email: [] },
    success: true,
  };
}

export async function verifyOtp(state: VerifyOtpFormState, formData: FormData) {
  const otp = formData.get("otp") as string;
  const email = formData.get("email") as string;

  const validatedFields = verifyOtpFormSchema.safeParse({ otp });

  if (!validatedFields.success) {
    return {
      inputs: { otp },
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token: otp,
    type: "email",
  });

  if (error) {
    return {
      inputs: { otp },
      errors: { otp: [error.message] },
    };
  }

  redirect("/");
}
