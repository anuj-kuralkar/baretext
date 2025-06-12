"use client";

import type * as LabelPrimitive from "@radix-ui/react-label";
import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type FormItemContextValue = {
  id: string;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue,
);

function useFormItem() {
  const context = React.useContext(FormItemContext);
  if (!context) {
    throw new Error("useFormItem should be used within <FormItem>");
  }
  return context;
}

function FormItem({ className, ...props }: React.ComponentProps<"div">) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div
        data-slot="form-item"
        className={cn("grid gap-2", className)}
        {...props}
      />
    </FormItemContext.Provider>
  );
}

function FormLabel({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  const { id } = useFormItem();

  return (
    <Label
      data-slot="form-label"
      className={className}
      htmlFor={`${id}-form-item`}
      {...props}
    />
  );
}

function FormControl({ ...props }: React.ComponentProps<typeof Slot>) {
  const { id } = useFormItem();

  return (
    <Slot
      data-slot="form-control"
      id={`${id}-form-item`}
      aria-describedby={`${id}-form-item-description ${id}-form-item-message`}
      {...props}
    />
  );
}

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { id } = useFormItem();

  return (
    <p
      data-slot="form-description"
      id={`${id}-form-item-description`}
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  const { id } = useFormItem();

  return (
    <p
      data-slot="form-message"
      id={`${id}-form-item-message`}
      className={cn("text-destructive text-sm", className)}
      {...props}
    />
  );
}

export { FormItem, FormLabel, FormControl, FormDescription, FormMessage };
