"use client";

import { createToaster, Toast, Toaster } from "@ark-ui/react/toast";
import {
  ArrowRepeat,
  CheckCircle,
  ExclamationCircle,
  ExclamationTriangle,
  type IconProps,
  InfoCircle,
  X,
} from "react-bootstrap-icons";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ToastRoot(props: Toast.RootProps) {
  return (
    <Toast.Root
      className={cn(
        "w-xs p-4 flex gap-2 rounded-md border text-sm shadow-md",
        "translate-x-(--x) translate-y-(--y) z-(--z-index) opacity-(--opacity) height-(--height) scale-(--scale)",
        "duration-400 transition-all",
        "bg-popover border-border text-popover-foreground",
        "data-[type=error]:text-red-600 dark:data-[type=error]:text-red-400",
        "data-[type=info]:text-blue-600 dark:data-[type=info]:text-blue-400",
        "data-[type=success]:text-green-600 dark:data-[type=success]:text-green-400",
        "data-[type=warning]:text-yellow-600 dark:data-[type=warning]:text-yellow-400",
      )}
      {...props}
    />
  );
}

export function ToastTitle(props: Toast.TitleProps) {
  return <Toast.Title className="font-medium leading-normal pr-5" {...props} />;
}

export function ToastDescription(props: Toast.DescriptionProps) {
  return (
    <Toast.Description
      className="font-normal pr-5 text-popover-foreground"
      {...props}
    />
  );
}

export function ToastActionTrigger({
  className,
  children,
  ...props
}: Toast.ActionTriggerProps) {
  return (
    <Toast.ActionTrigger
      className={cn("self-start mt-1", className)}
      {...props}
      asChild
    >
      <Button size="sm">{children}</Button>
    </Toast.ActionTrigger>
  );
}

export function ToastCloseTrigger({
  className,
  ...props
}: Toast.CloseTriggerProps) {
  return (
    <Toast.CloseTrigger
      className={cn(
        "inline-flex items-center justify-center size-6 rounded-md shadow-md transition-colors",
        "absolute right-3 top-3",
        "border border-border",
        "disabled:pointer-events-none disabled:opacity-50",
        "outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-3",
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
  success: CheckCircle,
  error: ExclamationCircle,
  info: InfoCircle,
  warning: ExclamationTriangle,
  loading: ({ className, ...props }: IconProps) => (
    <ArrowRepeat className={cn("animate-spin", className)} {...props} />
  ),
} as const;

export const toaster = createToaster({
  placement: "top",
  gap: 16,
  overlap: true,
});

export function AppToaster() {
  return (
    <Toaster toaster={toaster}>
      {(toast) => {
        const ToastIcon = toast.type
          ? iconMap[toast.type as keyof typeof iconMap]
          : undefined;

        return (
          <ToastRoot key={toast.id}>
            {ToastIcon && <ToastIcon />}
            <div className="flex flex-col gap-1">
              <ToastTitle>{toast.title}</ToastTitle>
              <ToastDescription>{toast.description}</ToastDescription>
              {toast.action && (
                <ToastActionTrigger>{toast.action?.label}</ToastActionTrigger>
              )}
            </div>
            <ToastCloseTrigger>
              <X />
            </ToastCloseTrigger>
          </ToastRoot>
        );
      }}
    </Toaster>
  );
}

const ToastStyled = {
  Root: ToastRoot,
  ActionTrigger: ToastActionTrigger,
  CloseTrigger: ToastCloseTrigger,
  Description: ToastDescription,
  Title: ToastTitle,
  Context: Toast.Context,
};

export { ToastStyled as Toast };
