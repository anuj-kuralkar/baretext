import { Field } from "@ark-ui/react/field";

import { cn } from "@/lib/utils";

export function FieldRoot({ className, ...props }: Field.RootProps) {
  return <Field.Root className={cn("grid gap-2", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: Field.LabelProps) {
  return (
    <Field.Label
      className={cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function FieldInput({ className, ...props }: Field.InputProps) {
  return (
    <Field.Input
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function FieldErrorText({ className, ...props }: Field.ErrorTextProps) {
  return (
    <Field.ErrorText
      className={cn("text-destructive text-sm leading-none", className)}
      {...props}
    />
  );
}
