"use client";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { cn } from "@/lib/utils";

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: HTMLArkProps<"div"> & {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <ark.div
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-px w-full" : "w-px self-stretch",
        className,
      )}
      data-orientation={orientation}
      role="separator"
      {...props}
    />
  );
}

export { Separator };
