"use client";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { OTPVerifyForm } from "@/components/otp-verify-form";
import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import * as Field from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toast";
import { updateEmail, verifyEmail } from "@/module/user/actions";
import type { User } from "@/module/user/types";

export function EmailUpdateForm({ email }: Pick<User, "email">) {
  const [requestState, requestAction, isRequesting] = useActionState(
    updateEmail,
    { inputs: { email } },
  );
  const [verifyState, verifyAction, isVerifying] = useActionState(verifyEmail, {
    inputs: { email: requestState.inputs.email },
  });

  const [open, setOpen] = useState<boolean>(false);
  useEffect(() => {
    if (requestState.success) {
      setOpen(true);
    }
  }, [requestState]);

  const [emailInvalid, setEmailInvalid] = useState<boolean | undefined>(
    undefined,
  );
  useEffect(() => {
    setEmailInvalid(requestState.fieldErrors?.email?.length ? true : undefined);
  }, [requestState.fieldErrors]);

  const emailChanged = verifyState.success === true;
  useEffect(() => {
    if (emailChanged) {
      queueMicrotask(() => {
        toaster.success({ description: "Email address updated successfully." });
      });
      setOpen(false);
    }
  }, [emailChanged]);

  const isPending = isRequesting || isVerifying;
  const newEmail = requestState.inputs.email;

  return (
    <>
      <Form action={requestAction} noValidate onSubmit={() => setOpen(false)}>
        <Field.Root invalid={emailInvalid}>
          <Card.Root>
            <Card.Header>
              <Card.Title asChild>
                <Field.Label>Email</Field.Label>
              </Card.Title>
              <Card.Description asChild>
                <Field.HelperText>
                  This email is used for signing in and receiving notifications.
                </Field.HelperText>
              </Card.Description>
            </Card.Header>

            <Card.Content className="flex flex-col gap-2">
              <Field.Input
                autoComplete="email"
                defaultValue={requestState.inputs.email ?? email}
                disabled={isPending}
                name="email"
                onChange={() => setEmailInvalid(undefined)}
                type="email"
              />
              <Field.ErrorText>
                {requestState.fieldErrors?.email}
              </Field.ErrorText>
            </Card.Content>
            <Card.Footer>
              <Button className="ms-auto" disabled={isPending} type="submit">
                {isRequesting ? <Spinner /> : null}
                {isRequesting ? "Sending code…" : "Send verification code"}
              </Button>
            </Card.Footer>
          </Card.Root>
        </Field.Root>
      </Form>

      <OTPVerifyForm
        action={verifyAction}
        email={newEmail}
        errors={verifyState.fieldErrors?.otp}
        isPending={isVerifying}
        onOpenChange={(details) => setOpen(details.open)}
        open={open}
      />
    </>
  );
}
