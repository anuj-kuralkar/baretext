"use client";

import {
  Avatar as AvatarUnstyled,
  useAvatarContext,
} from "@ark-ui/react/avatar";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { getImageProps, type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLArkProps<"span">) {
  return (
    <ark.span
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex select-none items-center justify-center rounded-full bg-primary text-primary-foreground bg-blend-color ring-2 ring-background",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
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
        "flex size-full items-center justify-center rounded-full bg-muted text-muted-foreground text-sm group-data-[size=sm]/avatar:text-xs",
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
        "group/avatar-group flex -space-x-2 *:data-[part=root]:ring-2 *:data-[part=root]:ring-background",
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
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=sm]/avatar-group:size-6 [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3",
        className,
      )}
      {...props}
    />
  );
}

export function Image({ className, ...props }: AvatarUnstyled.ImageProps) {
  return (
    <AvatarUnstyled.Image
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      {...props}
    />
  );
}

export function NextImage({ className, ...props }: ImageProps) {
  const avatar = useAvatarContext();

  const { hidden, ...arkImageProps } = avatar.getImageProps();
  const nextImage = getImageProps(props);

  return (
    // biome-ignore lint/performance/noImgElement: required for avatar integration with getImageProps
    // biome-ignore lint/a11y/useAltText: alt text is forwarded through Next.js Image props
    <img
      {...arkImageProps}
      {...nextImage.props}
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className,
      )}
      style={{
        ...props.style,
        visibility: hidden ? "hidden" : "visible",
      }}
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
        "group/avatar relative flex size-8 shrink-0 select-none rounded-full after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
        className,
      )}
      data-size={size}
      {...props}
    />
  );
}
