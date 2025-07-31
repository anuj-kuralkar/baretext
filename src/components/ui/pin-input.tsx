import { PinInput } from "@ark-ui/react/pin-input";

import { cn } from "@/lib/utils";

export function PinInputRoot({ className, ...props }: PinInput.RootProps) {
  return <PinInput.Root className={cn("grid gap-2", className)} {...props} />;
}

export function PinInputControl({
  className,
  ...props
}: PinInput.ControlProps) {
  return (
    <PinInput.Control
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export function PinInputInput({ className, ...props }: PinInput.InputProps) {
  return (
    <PinInput.Input
      className={cn(
        "size-11 text-center min-w-0",
        "text-base placeholder:text-muted-foreground",
        "rounded-md border border-input bg-transparent dark:bg-input/30 shadow-xs",
        "outline-none transition-[color,box-shadow]",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
        "selection:bg-primary selection:text-primary-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function PinInputHiddenInput({
  className,
  ...props
}: PinInput.HiddenInputProps) {
  return <PinInput.HiddenInput className={cn(className)} {...props} />;
}
