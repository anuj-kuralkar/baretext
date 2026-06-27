import type z from "zod";

import type { auth } from "@/lib/auth";
import type {
  updateAvatarFormSchema,
  updateEmailFormSchema,
  updateNameFormSchema,
  verifyEmailFormSchema,
} from "./schema";

export type User = typeof auth.$Infer.Session.user;

export type UpdateNameFormState = {
  inputs: Partial<z.infer<typeof updateNameFormSchema>>;
  fieldErrors?: Partial<
    Record<keyof z.infer<typeof updateNameFormSchema>, string[]>
  >;
  formErrors?: string;
  success?: boolean;
};

export type UpdateEmailFormState = {
  inputs: Partial<z.infer<typeof updateEmailFormSchema>>;
  fieldErrors?: Partial<
    Record<keyof z.infer<typeof updateEmailFormSchema>, string[]>
  >;
  formErrors?: string;
  success?: boolean;
};

export type VerifyEmailFormState = {
  inputs: Partial<z.infer<typeof verifyEmailFormSchema>>;
  fieldErrors?: Partial<
    Record<keyof z.infer<typeof verifyEmailFormSchema>, string[]>
  >;
  formErrors?: string;
  success?: boolean;
};

export type UpdateAvatarFormState = {
  inputs: Partial<z.infer<typeof updateAvatarFormSchema>>;
  fieldErrors?: Partial<
    Record<keyof z.infer<typeof updateAvatarFormSchema>, string[]>
  >;
  formErrors?: string;
  success?: boolean;
};
