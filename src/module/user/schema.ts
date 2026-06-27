import { z } from "zod";

export const updateNameFormSchema = z.object({
  name: z.string().min(1),
});

export const updateEmailFormSchema = z.object({
  email: z.email(),
});

export const verifyEmailFormSchema = z.object({
  email: z.email(),
  otp: z.string().length(6),
});

export const updateAvatarFormSchema = z.object({
  image: z.file(),
});
