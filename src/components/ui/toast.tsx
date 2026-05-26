"use client";

import { createToaster, Toast, Toaster } from "@ark-ui/react/toast";
import {
  CheckCircleIcon,
  CircleXIcon,
  InfoIcon,
  LoaderCircleIcon,
  type LucideProps,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ActionTrigger({
  className,
  children,
  ...props
}: Toast.ActionTriggerProps) {
  return (
    <Toast.ActionTrigger
      className={cn("mt-1 self-start", className)}
      {...props}
      asChild
    >
      <Button size="sm">{children}</Button>
    </Toast.ActionTrigger>
  );
}

export function AppToaster() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => {
        const ToastIcon = toast.type
          ? iconMap[toast.type as keyof typeof iconMap]
          : undefined;

        return (
          <Root key={toast.id}>
            {ToastIcon && <ToastIcon />}
            <div className="flex flex-col gap-1">
              <Title>{toast.title}</Title>
              <Description>{toast.description}</Description>
              {toast.action && (
                <ActionTrigger>{toast.action?.label}</ActionTrigger>
              )}
            </div>
            <CloseTrigger>
              <XIcon />
            </CloseTrigger>
          </Root>
        );
      }}
    </Toaster>
  );
}

export function CloseTrigger({ className, ...props }: Toast.CloseTriggerProps) {
  return (
    <Toast.CloseTrigger
      className={cn(
        "inline-flex size-6 items-center justify-center rounded-md shadow-md transition-colors",
        "absolute top-3 right-3",
        "border border-border",
        "disabled:pointer-events-none disabled:opacity-50",
        "outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "hover:bg-secondary/90",
        "bg-secondary text-secondary-foreground",
        "[&_svg]:size-4 [&_svg]:shrink-0 [&_svg]:translate-y-0.5",
        className,
      )}
      {...props}
    />
  );
}

const iconMap = {
  success: CheckCircleIcon,
  error: CircleXIcon,
  info: InfoIcon,
  warning: TriangleAlertIcon,
  loading: ({ className, ...props }: LucideProps) => (
    <LoaderCircleIcon className={cn("animate-spin", className)} {...props} />
  ),
} as const;

export function Description(props: Toast.DescriptionProps) {
  return (
    <Toast.Description
      className="pr-5 font-normal text-popover-foreground"
      {...props}
    />
  );
}

export function Root(props: Toast.RootProps) {
  return (
    <Toast.Root
      className={cn(
        "flex w-xs gap-2 rounded-md border p-4 text-sm shadow-md",
        "height-(--height) z-(--z-index) translate-x-(--x) translate-y-(--y) scale-(--scale) opacity-(--opacity)",
        "transition-all duration-400",
        "border-border bg-popover text-popover-foreground",
        "data-[type=error]:text-red-600 dark:data-[type=error]:text-red-400",
        "data-[type=info]:text-blue-600 dark:data-[type=info]:text-blue-400",
        "data-[type=success]:text-green-600 dark:data-[type=success]:text-green-400",
        "data-[type=warning]:text-yellow-600 dark:data-[type=warning]:text-yellow-400",
      )}
      {...props}
    />
  );
}

export function Title(props: Toast.TitleProps) {
  return <Toast.Title className="pr-5 font-medium leading-normal" {...props} />;
}

export const toaster = createToaster({
  placement: "top",
  gap: 16,
  overlap: true,
});
