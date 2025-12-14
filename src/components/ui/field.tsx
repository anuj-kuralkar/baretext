import { Field } from "@ark-ui/react/field";

import { Input } from "@/components/ui/input";
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
    <Field.Input asChild {...props}>
      <Input className={className} />
    </Field.Input>
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
