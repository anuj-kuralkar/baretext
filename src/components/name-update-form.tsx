"use client";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import * as Card from "@/components/ui/card";
import * as Field from "@/components/ui/field";
import { toaster } from "@/components/ui/toast";
import { updateName } from "@/module/user/actions";
import type { User } from "@/module/user/types";

export function NameUpdateForm({ name }: Pick<User, "name">) {
  const [state, formAction, isPending] = useActionState(updateName, {
    inputs: { name },
  });

  const [invalid, setInvalid] = useState<boolean | undefined>(undefined);
  useEffect(() => {
    setInvalid(state.fieldErrors?.name?.length ? true : undefined);
  }, [state.fieldErrors]);

  useEffect(() => {
    if (state.success) {
      queueMicrotask(() => {
        toaster.success({ description: "Display name updated successfully." });
      });
    }
  }, [state.success]);

  return (
    <Form action={formAction} noValidate>
      <Field.Root invalid={invalid}>
        <Card.Root>
          <Card.Header>
            <Card.Title asChild>
              <Field.Label>Display Name</Field.Label>
            </Card.Title>
            <Card.Description asChild>
              <Field.HelperText>
                This is the name displayed on your account.
              </Field.HelperText>
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-2">
            <Field.Input
              defaultValue={state.inputs.name}
              disabled={isPending}
              name="name"
              onChange={() => setInvalid(undefined)}
            />
            <Field.ErrorText>{state.fieldErrors?.name}</Field.ErrorText>
          </Card.Content>
          <Card.Footer>
            <Button className="ms-auto" disabled={isPending} type="submit">
              {isPending ? "Saving…" : "Save"}
            </Button>
          </Card.Footer>
        </Card.Root>
      </Field.Root>
    </Form>
  );
}
