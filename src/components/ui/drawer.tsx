"use client";

import { Dialog } from "@ark-ui/react/dialog";
import { createContext, useContext } from "react";

import { cn } from "@/lib/utils";

export type DrawerDirection = "top" | "bottom" | "left" | "right";

export const DrawerDirectionContext = createContext<
  DrawerDirection | undefined
>(undefined);

export const useDrawerDirection = () => {
  const context = useContext(DrawerDirectionContext);
  if (!context)
    throw new Error(
      "useDrawerDirection must be used within a DrawerDirectionContext",
    );
  return context;
};

export function DrawerRoot({
  direction = "left",
  ...props
}: Dialog.RootProps & { direction?: "top" | "bottom" | "left" | "right" }) {
  return (
    <DrawerDirectionContext value={direction}>
      <Dialog.Root {...props} />
    </DrawerDirectionContext>
  );
}

export function DrawerTrigger(props: Dialog.TriggerProps) {
  return <Dialog.Trigger {...props} />;
}

export function DrawerCloseTrigger(props: Dialog.CloseTriggerProps) {
  return <Dialog.CloseTrigger {...props} />;
}

export function DrawerBackdrop({ className, ...props }: Dialog.BackdropProps) {
  return (
    <Dialog.Backdrop
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className,
      )}
      {...props}
    />
  );
}

export function DrawerPositioner(props: Dialog.PositionerProps) {
  return <Dialog.Positioner {...props} />;
}

export function DrawerContent({
  className,
  children,
  ...props
}: Dialog.ContentProps) {
  const direction = useDrawerDirection();
  return (
    <Dialog.Content
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out duration-500",
        "group/drawer-content bg-background fixed z-50 flex h-auto flex-col",
        "data-[direction=top]:inset-x-0 data-[direction=top]:top-0 data-[direction=top]:mb-24 data-[direction=top]:max-h-[80vh] data-[direction=top]:rounded-b-lg data-[direction=top]:border-b data-[direction=top]:slide-in-from-top-[100%] data-[direction=top]:slide-out-to-top-[100%]",
        "data-[direction=bottom]:inset-x-0 data-[direction=bottom]:bottom-0 data-[direction=bottom]:mt-24 data-[direction=bottom]:max-h-[80vh] data-[direction=bottom]:rounded-t-lg data-[direction=bottom]:border-t data-[direction=bottom]:slide-in-from-bottom-[100%] data-[direction=bottom]:slide-out-to-bottom-[100%]",
        "data-[direction=right]:inset-y-0 data-[direction=right]:right-0 data-[direction=right]:w-3/4 data-[direction=right]:border-l data-[direction=right]:sm:max-w-sm data-[direction=right]:slide-in-from-right-[640px] data-[direction=right]:slide-out-to-right-[640px]",
        "data-[direction=left]:inset-y-0 data-[direction=left]:left-0 data-[direction=left]:w-3/4 data-[direction=left]:border-r data-[direction=left]:sm:max-w-sm data-[direction=left]:slide-in-from-left-[640px] data-[direction=left]:slide-out-to-left-[640px]",
        className,
      )}
      data-direction={direction}
      {...props}
    >
      <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[direction=bottom]/drawer-content:block" />
      {children}
    </Dialog.Content>
  );
}

export function DrawerHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 p-4 group-data-[direction=bottom]/drawer-content:text-center group-data-[direction=top]/drawer-content:text-center md:gap-1.5 md:text-left",
        className,
      )}
      data-part="drawer-header"
      {...props}
    />
  );
}

export function DrawerFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      data-part="drawer-footer"
      {...props}
    />
  );
}

export function DrawerTitle({ className, ...props }: Dialog.TitleProps) {
  return (
    <Dialog.Title
      className={cn("text-foreground font-semibold", className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: Dialog.DescriptionProps) {
  return (
    <Dialog.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}
