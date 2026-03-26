import { z } from "zod";

export const sendOtpEmailFormSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export const verifyOtpFormSchema = sendOtpEmailFormSchema.extend({
  otp: z
    .string()
    .regex(/^\d{6}$/, { message: "The OTP must be a 6-digit number" }),
});
