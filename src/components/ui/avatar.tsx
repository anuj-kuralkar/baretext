import { Avatar as AvatarUnstyled } from "@ark-ui/react/avatar";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLArkProps<"span">) {
  return (
    <ark.span
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background",
        "in-data-[size=sm]:size-2 in-data-[size=sm]:[&>svg]:hidden",
        "in-data-[size=default]:size-2.5 in-data-[size=default]:[&>svg]:size-2",
        "in-data-[size=lg]:size-3 in-data-[size=lg]:[&>svg]:size-2",
        className,
      )}
      {...props}
    />
  );
}

export function Fallback({
  className,
  ...props
}: AvatarUnstyled.FallbackProps) {
  return (
    <AvatarUnstyled.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted in-data-[size=sm]:text-xs text-muted-foreground text-sm",
        className,
      )}
      {...props}
    />
  );
}

export function Group({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[scope=avatar]:ring-2 *:data-[scope=avatar]:ring-background",
        className,
      )}
      {...props}
    />
  );
}

export function GroupCount({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm ring-2 ring-background [&>svg]:size-4",
        "group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6",
        "group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export function Image({ className, ...props }: AvatarUnstyled.ImageProps) {
  return (
    <AvatarUnstyled.Image
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

export function Root({
  className,
  size = "default",
  ...props
}: AvatarUnstyled.RootProps & {
  size?: "default" | "sm" | "lg";
}) {
  return (
    <AvatarUnstyled.Root
      className={cn(
        "group/avatar relative flex size-8 shrink-0 select-none overflow-hidden rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6",
        className,
      )}
      data-size={size}
      {...props}
    />
  );
}
