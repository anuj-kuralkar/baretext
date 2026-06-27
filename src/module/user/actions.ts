"use server";
import { del, put } from "@vercel/blob";
import { isAPIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";

import { auth } from "@/lib/auth";
import {
  updateAvatarFormSchema,
  updateEmailFormSchema,
  updateNameFormSchema,
  verifyEmailFormSchema,
} from "./schema";
import type {
  UpdateAvatarFormState,
  UpdateEmailFormState,
  UpdateNameFormState,
  VerifyEmailFormState,
} from "./types";

export async function updateName(
  state: UpdateNameFormState,
  formData: FormData,
): Promise<UpdateNameFormState> {
  const validatedFields = updateNameFormSchema.safeParse({
    name: formData.get("name"),
  });

  if (!validatedFields.success) {
    return {
      inputs: { name: state.inputs.name },
      fieldErrors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { name } = validatedFields.data;

  try {
    const { status } = await auth.api.updateUser({
      headers: await headers(),
      body: { name },
    });

    revalidatePath("/settings/profile");

    if (status) {
      return { inputs: { name }, success: true };
    }
  } catch (error) {
    if (isAPIError(error)) {
      return { inputs: { name }, fieldErrors: { name: [error.message] } };
    }
  }

  return { inputs: { name: state.inputs.name } };
}

export async function updateEmail(
  state: UpdateEmailFormState,
  formData: FormData,
): Promise<UpdateEmailFormState> {
  const validatedFields = updateEmailFormSchema.safeParse({
    email: formData.get("email"),
  });

  if (!validatedFields.success) {
    return {
      inputs: { email: state.inputs.email },
      fieldErrors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { email } = validatedFields.data;

  try {
    const { success } = await auth.api.requestEmailChangeEmailOTP({
      headers: await headers(),
      body: { newEmail: email },
    });

    if (success) {
      return { inputs: { email }, success: true };
    }
  } catch (error) {
    if (isAPIError(error)) {
      return { inputs: { email }, fieldErrors: { email: [error.message] } };
    }
  }

  return {
    inputs: { email: state.inputs.email },
    formErrors: "Something went wrong. Please try again.",
  };
}

export async function verifyEmail(
  state: VerifyEmailFormState,
  formData: FormData,
): Promise<VerifyEmailFormState> {
  const validatedFields = verifyEmailFormSchema.safeParse({
    email: formData.get("email"),
    otp: formData.get("otp"),
  });

  if (!validatedFields.success) {
    return {
      inputs: {
        email: state.inputs.email,
        otp: state.inputs.otp,
      },
      fieldErrors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { email, otp } = validatedFields.data;

  try {
    const { success } = await auth.api.changeEmailEmailOTP({
      headers: await headers(),
      body: { newEmail: email, otp },
    });

    revalidatePath("/settings/profile");

    if (success) {
      return { inputs: { email, otp }, success: true };
    }
  } catch (error) {
    if (isAPIError(error)) {
      return { inputs: { email, otp }, formErrors: error.message };
    }
  }

  return {
    inputs: { email, otp },
    formErrors: "Something went wrong. Please try again.",
  };
}

export async function updateAvatar(
  state: UpdateAvatarFormState,
  formData: FormData,
): Promise<UpdateAvatarFormState> {
  const validatedFields = updateAvatarFormSchema.safeParse({
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      inputs: {
        image: state.inputs.image,
      },
      fieldErrors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const session = await auth.api.getSession({ headers: await headers() });
  const oldImage = session?.user?.image;

  const { image } = validatedFields.data;

  const blob = await put(image.name, image, {
    access: "public",
    addRandomSuffix: true,
  });

  try {
    const { status: success } = await auth.api.updateUser({
      headers: await headers(),
      body: { image: blob.url },
    });

    if (success) {
      if (oldImage?.includes("public.blob.vercel-storage.com")) {
        try {
          await del(oldImage);
        } catch (e) {
          console.error("Failed to delete old avatar:", e);
        }
      }

      return {
        inputs: {
          image: state.inputs.image,
        },
        success: true,
      };
    }
  } catch (error) {
    if (isAPIError(error)) {
      return {
        inputs: { image: state.inputs.image },
        formErrors: error.message,
      };
    }
  }

  return {
    inputs: { image: state.inputs.image },
    formErrors: "Something went wrong. Please try again.",
  };
}
