"use client";

import { Field as FieldUnstyled } from "@ark-ui/react/field";

import { cn } from "@/lib/utils";

export const FieldContext = FieldUnstyled.Context;

export const FieldErrorText = ({
  className,
  ...props
}: FieldUnstyled.ErrorTextProps) => (
  <FieldUnstyled.ErrorText
    className={cn("text-sm font-normal text-destructive", className)}
    {...props}
  />
);

export const FieldHelperText = ({
  className,
  ...props
}: FieldUnstyled.HelperTextProps) => (
  <FieldUnstyled.HelperText
    className={cn(
      "text-left text-sm leading-normal font-normal text-muted-foreground group-data-[orientation=horizontal]/field:text-balance [[data-variant=legend]+&]:-mt-1.5 last:mt-0 nth-last-2:-mt-1 [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
      className,
    )}
    {...props}
  />
);

export const FieldInput = ({
  className,
  ...props
}: FieldUnstyled.InputProps) => (
  <FieldUnstyled.Input
    className={cn(
      "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      className,
    )}
    {...props}
  />
);

export const FieldLabel = ({
  className,
  ...props
}: FieldUnstyled.LabelProps) => (
  <FieldUnstyled.Label
    className={cn(
      "field-label group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-disabled/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>.field-root]:w-full has-[>.field-root]:flex-col has-[>.field-root]:rounded-lg has-[>.field-root]:border [&>.field-root]:p-2.5 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
      className,
    )}
    {...props}
  />
);

export const FieldRequiredIndicator = ({
  className,
  ...props
}: FieldUnstyled.RequiredIndicatorProps) => (
  <FieldUnstyled.RequiredIndicator
    className={cn("text-destructive", className)}
    {...props}
  />
);

export const FieldRoot = ({
  className,
  orientation = "vertical",
  ...props
}: FieldUnstyled.RootProps & {
  orientation?: "vertical" | "horizontal" | "responsive";
}) => (
  <FieldUnstyled.Root
    className={cn(
      "field-root group/field flex w-full gap-2 data-invalid:text-destructive data-[orientation=vertical]:flex-col data-[orientation=vertical]:*:w-full data-[orientation=vertical]:[&>.sr-only]:w-auto data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:has-[>.field-content]:items-start data-[orientation=horizontal]:[&>.field-label]:flex-auto data-[orientation=horizontal]:has-[>.field-content]:[&>[role=checkbox],[role=radio]]:mt-px data-[orientation=responsive]:flex-col data-[orientation=responsive]:*:w-full data-[orientation=responsive]:[&>.sr-only]:w-auto @md/field-group:data-[orientation=responsive]:flex-row @md/field-group:data-[orientation=responsive]:items-center @md/field-group:data-[orientation=responsive]:*:w-auto @md/field-group:data-[orientation=responsive]:has-[>.field-content]:items-start @md/field-group:data-[orientation=responsive]:[&>.field-label]:flex-auto @md/field-group:data-[orientation=responsive]:has-[>.field-content]:[&>[role=checkbox],[role=radio]]:mt-px",
      className,
    )}
    data-orientation={orientation}
    {...props}
  />
);

export const FieldRootProvider = ({
  className,
  orientation = "vertical",
  ...props
}: FieldUnstyled.RootProviderProps & {
  orientation?: "vertical" | "horizontal" | "responsive";
}) => (
  <FieldUnstyled.RootProvider
    className={cn(
      "field-root group/field flex w-full gap-2 data-invalid:text-destructive data-[orientation=vertical]:flex-col data-[orientation=vertical]:*:w-full data-[orientation=vertical]:[&>.sr-only]:w-auto data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:items-center data-[orientation=horizontal]:has-[>.field-content]:items-start data-[orientation=horizontal]:[&>.field-label]:flex-auto data-[orientation=horizontal]:has-[>.field-content]:[&>[role=checkbox],[role=radio]]:mt-px data-[orientation=responsive]:flex-col data-[orientation=responsive]:*:w-full data-[orientation=responsive]:[&>.sr-only]:w-auto @md/field-group:data-[orientation=responsive]:flex-row @md/field-group:data-[orientation=responsive]:items-center @md/field-group:data-[orientation=responsive]:*:w-auto @md/field-group:data-[orientation=responsive]:has-[>.field-content]:items-start @md/field-group:data-[orientation=responsive]:[&>.field-label]:flex-auto @md/field-group:data-[orientation=responsive]:has-[>.field-content]:[&>[role=checkbox],[role=radio]]:mt-px",
      className,
    )}
    data-orientation={orientation}
    {...props}
  />
);

export const FieldTextarea = ({
  className,
  ...props
}: FieldUnstyled.TextareaProps) => (
  <FieldUnstyled.Textarea
    className={cn(
      "border-input placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 field-sizing-content min-h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
      "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
      "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
      className,
    )}
    {...props}
  />
);

export const Field = {
  Context: FieldContext,
  ErrorText: FieldErrorText,
  HelperText: FieldHelperText,
  Input: FieldInput,
  Label: FieldLabel,
  RequiredIndicator: FieldRequiredIndicator,
  Root: FieldRoot,
  RootProvider: FieldRootProvider,
  Textarea: FieldTextarea,
} as const;
