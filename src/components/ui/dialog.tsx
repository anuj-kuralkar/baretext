"use client";

import { Dialog as DialogUnstyled } from "@ark-ui/react/dialog";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { Portal as ArkPortal } from "@ark-ui/react/portal";
import { XIcon } from "lucide-react";
import type * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/index";

export function Root({ ...props }: DialogUnstyled.RootProps) {
  return <DialogUnstyled.Root {...props} />;
}

export function Trigger({ ...props }: DialogUnstyled.TriggerProps) {
  return <DialogUnstyled.Trigger {...props} />;
}

export function Portal({ ...props }: React.ComponentProps<typeof ArkPortal>) {
  return <ArkPortal {...props} />;
}

export function CloseTrigger({ ...props }: DialogUnstyled.CloseTriggerProps) {
  return <DialogUnstyled.CloseTrigger {...props} />;
}

export function Backdrop({
  className,
  ...props
}: DialogUnstyled.BackdropProps) {
  return (
    <DialogUnstyled.Backdrop
      className={cn(
        "data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 fixed inset-0 isolate z-50 bg-black/10 duration-100 data-[state=closed]:animate-out data-[state=open]:animate-in supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

export function Content({
  className,
  children,
  showCloseButton = true,
  ...props
}: DialogUnstyled.ContentProps & {
  showCloseButton?: boolean;
}) {
  return (
    <Portal>
      <Backdrop />
      <DialogUnstyled.Positioner>
        <DialogUnstyled.Content
          className={cn(
            "data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-popover-foreground text-sm outline-none ring-1 ring-foreground/10 duration-100 data-[state=closed]:animate-out data-[state=open]:animate-in sm:max-w-sm",
            className,
          )}
          {...props}
        >
          {children}
          {showCloseButton && (
            <DialogUnstyled.CloseTrigger asChild>
              <Button
                className="absolute top-2 right-2"
                size="icon-sm"
                variant="ghost"
              >
                <XIcon />
                <span className="sr-only">Close</span>
              </Button>
            </DialogUnstyled.CloseTrigger>
          )}
        </DialogUnstyled.Content>
      </DialogUnstyled.Positioner>
    </Portal>
  );
}

export function Header({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div className={cn("flex flex-col gap-2", className)} {...props} />
  );
}

export function Footer({
  className,
  showCloseButton = false,
  children,
  ...props
}: HTMLArkProps<"div"> & {
  showCloseButton?: boolean;
}) {
  return (
    <ark.div
      className={cn(
        "-mx-4 -mb-4 flex flex-col-reverse gap-2 rounded-b-xl border-t bg-muted/50 p-4 sm:flex-row sm:justify-end",
        className,
      )}
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogUnstyled.CloseTrigger asChild>
          <Button variant="outline">Close</Button>
        </DialogUnstyled.CloseTrigger>
      )}
    </ark.div>
  );
}

export function Title({ className, ...props }: DialogUnstyled.TitleProps) {
  return (
    <DialogUnstyled.Title
      className={cn("font-medium text-base leading-none", className)}
      {...props}
    />
  );
}

export function Description({
  className,
  ...props
}: DialogUnstyled.DescriptionProps) {
  return (
    <DialogUnstyled.Description
      className={cn(
        "text-muted-foreground text-sm *:[a]:underline *:[a]:underline-offset-3 *:[a]:hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
