import { Avatar as AvatarUnstyled } from "@ark-ui/react/avatar";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";

import { cn } from "@/lib/utils";

export const AvatarBadge = ({ className, ...props }: HTMLArkProps<"span">) => (
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

export const AvatarFallback = ({
  className,
  ...props
}: AvatarUnstyled.FallbackProps) => (
  <AvatarUnstyled.Fallback
    className={cn(
      "flex size-full items-center justify-center rounded-full bg-muted in-data-[size=sm]:text-xs text-muted-foreground text-sm",
      className,
    )}
    {...props}
  />
);

export const AvatarGroup = ({ className, ...props }: HTMLArkProps<"div">) => (
  <ark.div
    className={cn(
      "group/avatar-group flex -space-x-2 *:data-[scope=avatar]:ring-2 *:data-[scope=avatar]:ring-background",
      className,
    )}
    {...props}
  />
);

export const AvatarGroupCount = ({
  className,
  ...props
}: HTMLArkProps<"div">) => (
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

export const AvatarImage = ({
  className,
  ...props
}: AvatarUnstyled.ImageProps) => (
  <AvatarUnstyled.Image
    className={cn("aspect-square size-full", className)}
    {...props}
  />
);

export const AvatarRoot = ({
  className,
  size = "default",
  ...props
}: AvatarUnstyled.RootProps & {
  size?: "default" | "sm" | "lg";
}) => (
  <AvatarUnstyled.Root
    className={cn(
      "group/avatar relative flex size-8 shrink-0 select-none overflow-hidden rounded-full data-[size=lg]:size-10 data-[size=sm]:size-6",
      className,
    )}
    data-size={size}
    {...props}
  />
);

export const Avatar = {
  Badge: AvatarBadge,
  Fallback: AvatarFallback,
  Group: AvatarGroup,
  GroupCount: AvatarGroupCount,
  Image: AvatarImage,
  Root: AvatarRoot,
} as const;
