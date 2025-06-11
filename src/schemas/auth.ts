import { z } from "zod";

export const loginWithEmailFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export type LoginWithEmailFormState = {
  inputs: { email: string };
  errors: { email?: string[] };
  success: boolean;
};

export const verifyOtpFormSchema = z.object({
  otp: z
    .string()
    .regex(/^\d{6}$/, { message: "The OTP must be a 6-digit number" }),
});

export type VerifyOtpFormState = {
  inputs: { otp: string };
  errors: { otp?: string[] };
};
