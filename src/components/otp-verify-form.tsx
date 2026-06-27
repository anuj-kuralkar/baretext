"use client";
import type { DialogRootBaseProps } from "@ark-ui/react/dialog";
import Form from "next/form";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import * as Dialog from "@/components/ui/dialog";
import * as Field from "@/components/ui/field";
import * as PinInput from "@/components/ui/pin-input";
import { Spinner } from "./ui/spinner";

type OTPVerifyFormProps = {
  open: DialogRootBaseProps["open"];
  onOpenChange: DialogRootBaseProps["onOpenChange"];
  email?: string;
  errors?: string[];
  action: NonNullable<
    string | ((formData: FormData) => void | Promise<void>) | undefined
  >;
  isPending: boolean;
};

export function OTPVerifyForm({
  open,
  onOpenChange,
  email,
  action,
  isPending,
  errors,
}: OTPVerifyFormProps) {
  const [invalid, setInvalid] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setInvalid(errors ? true : undefined);
  }, [errors]);

  return (
    <Dialog.Root
      closeOnInteractOutside={false}
      lazyMount
      onOpenChange={onOpenChange}
      open={open}
      unmountOnExit
    >
      <Dialog.Content>
        <Form action={action} className="contents">
          <Dialog.Header className="text-center">
            <Dialog.Title>Verify your email</Dialog.Title>
            <Dialog.Description>
              Enter the verification code we sent to your email address:{" "}
              <span className="font-medium">{email}</span>.
            </Dialog.Description>
          </Dialog.Header>

          <Field.Root>
            <Field.Label className="sr-only">Verification code</Field.Label>
            <PinInput.Root
              count={6}
              invalid={invalid}
              name="otp"
              onChange={() => setInvalid(undefined)}
              otp
              required
            >
              <PinInput.Control className="mx-auto *:data-[part=input]:h-12 *:data-[part=input]:w-11 *:data-[part=input]:text-xl">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <PinInput.Input index={index} key={index} />
                ))}
              </PinInput.Control>
              <PinInput.HiddenInput />
            </PinInput.Root>
          </Field.Root>
          <input name="email" type="hidden" value={email} />

          <Dialog.Footer>
            <Button className="w-full" disabled={isPending} type="submit">
              {isPending ? <Spinner /> : null}
              {isPending ? "Verifying..." : "Verify"}
            </Button>
          </Dialog.Footer>
        </Form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
