"use client";

import { Avatar } from "@ark-ui/react/avatar";

import { cn } from "@/lib/utils";

export function AvatarRoot({ className, ...props }: Avatar.RootProps) {
  return (
    <Avatar.Root
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export function AvatarImage({ className, ...props }: Avatar.ImageProps) {
  return (
    <Avatar.Image
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

export function AvatarFallback({ className, ...props }: Avatar.FallbackProps) {
  return (
    <Avatar.Fallback
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}
