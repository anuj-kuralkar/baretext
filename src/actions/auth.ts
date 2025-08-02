"use server";

import type { Provider } from "@supabase/auth-js";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import {
  type LoginWithEmailFormState,
  loginWithEmailFormSchema,
  type VerifyOtpFormState,
  verifyOtpFormSchema,
} from "@/schemas/auth";

export async function loginWithEmail(
  _state: LoginWithEmailFormState,
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
  const { error } = await supabase.auth.signInWithOtp({
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

export async function verifyOtp(
  _state: VerifyOtpFormState,
  formData: FormData,
) {
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
  const { error } = await supabase.auth.verifyOtp({
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

export async function loginWithOAuth(provider: Provider) {
  console.log("Logging in with OAuth provider:", provider);
  const supabase = await createClient();
  const { data } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: "http://localhost:3000/auth/callback",
    },
  });

  if (data.url) {
    redirect(data.url);
  }

  return data;
}
