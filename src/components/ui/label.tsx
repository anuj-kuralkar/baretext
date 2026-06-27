import { cn } from "@/lib/utils";

export function Label({
  className,
  htmlFor,
  ...props
}: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: <>
    <label
      className={cn(
        "flex select-none items-center gap-2 font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50 group-data-disabled:pointer-events-none group-data-disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}
