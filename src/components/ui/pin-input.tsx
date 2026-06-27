import { PinInput as PinInputUnstyled } from "@ark-ui/react/pin-input";
import { Label as LabelStyled } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Root({ className, ...props }: PinInputUnstyled.RootProps) {
  return (
    <PinInputUnstyled.Root
      className={cn(
        "group/pin-input flex items-center",
        "data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

export function Label(props: PinInputUnstyled.LabelProps) {
  return (
    <PinInputUnstyled.Label>
      <LabelStyled {...props} />
    </PinInputUnstyled.Label>
  );
}

export function Control({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <PinInputUnstyled.Control
      className={cn(
        "flex items-center rounded-lg",
        "group-data-invalid/pin-input:border-destructive group-data-invalid/pin-input:ring-3 group-data-invalid/pin-input:ring-destructive/20 dark:group-data-invalid/pin-input:ring-destructive/40",
        className,
      )}
      {...props}
    />
  );
}

export function Input({ className, ...props }: PinInputUnstyled.InputProps) {
  return (
    <PinInputUnstyled.Input
      className={cn(
        "relative flex size-8 items-center justify-center border-input border-y border-r text-center text-sm transition-all",
        "outline-none first:rounded-l-lg first:border-l last:rounded-r-lg",
        "data-invalid:border-destructive",
        "focus:z-10 focus:border-ring focus:ring-3 focus:ring-ring/50",
        "focus:data-invalid:border-destructive focus:data-invalid:ring-destructive/20 dark:focus:data-invalid:ring-destructive/40",
        "dark:bg-input/30",
        className,
      )}
      {...props}
    />
  );
}

export function HiddenInput(props: PinInputUnstyled.HiddenInputProps) {
  return <PinInputUnstyled.HiddenInput {...props} />;
}
