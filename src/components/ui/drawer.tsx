"use client";

import { Drawer as DrawerUnstyled } from "@ark-ui/react/drawer";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";

import { cn } from "@/lib/utils/index";

export const DrawerBackdrop = ({
  className,
  ...props
}: DrawerUnstyled.BackdropProps) => (
  <DrawerUnstyled.Backdrop
    className={cn(
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 duration-500",
      "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
      className,
    )}
    {...props}
  />
);

export const DrawerCloseTrigger = DrawerUnstyled.CloseTrigger;

export const DrawerContent = ({
  className,
  children,
  ...props
}: DrawerUnstyled.ContentProps) => (
  <>
    <DrawerUnstyled.Content
      className={cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out ease-[cubic-bezier(0.32,0.72,0,1)] duration-500",
        "data-[state=open]:data-[swipe-direction=top]:slide-in-from-top data-[state=closed]:data-[swipe-direction=top]:slide-out-to-top",
        "data-[state=open]:data-[swipe-direction=left]:slide-in-from-left data-[state=closed]:data-[swipe-direction=left]:slide-out-to-left",
        "data-[state=open]:data-[swipe-direction=down]:slide-in-from-bottom data-[state=closed]:data-[swipe-direction=down]:slide-out-to-bottom",
        "data-[state=open]:data-[swipe-direction=right]:slide-in-from-right data-[state=closed]:data-[swipe-direction=right]:slide-out-to-right",
        "fixed z-50 flex h-auto flex-col bg-background text-sm",
        "data-[swipe-direction=down]:inset-x-0 data-[swipe-direction=down]:bottom-0 data-[swipe-direction=down]:mt-24 data-[swipe-direction=down]:max-h-[80vh] data-[swipe-direction=down]:rounded-t-xl data-[swipe-direction=down]:border-t",
        "data-[swipe-direction=up]:inset-x-0 data-[swipe-direction=up]:top-0 data-[swipe-direction=up]:mb-24 data-[swipe-direction=up]:max-h-[80vh] data-[swipe-direction=up]:rounded-b-xl data-[swipe-direction=up]:border-b",
        "data-[swipe-direction=left]:inset-y-0 data-[swipe-direction=left]:left-0 data-[swipe-direction=left]:w-3/4 data-[swipe-direction=left]:rounded-r-xl data-[swipe-direction=left]:border-r data-[swipe-direction=left]:sm:max-w-sm",
        "data-[swipe-direction=right]:inset-y-0 data-[swipe-direction=right]:right-0 data-[swipe-direction=right]:w-3/4 data-[swipe-direction=right]:rounded-l-xl data-[swipe-direction=right]:border-l data-[swipe-direction=right]:sm:max-w-sm",
        className,
      )}
      {...props}
    >
      {children}
    </DrawerUnstyled.Content>
  </>
);

export const DrawerContext = DrawerUnstyled.Context;

export const DrawerDescription = ({
  className,
  ...props
}: HTMLArkProps<"p">) => (
  <DrawerUnstyled.Description
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
);

export const DrawerFooter = ({ className, ...props }: HTMLArkProps<"div">) => (
  <ark.div
    className={cn("mt-auto flex flex-col gap-2 p-4", className)}
    {...props}
  />
);

export const DrawerGrabber = DrawerUnstyled.Grabber;

export const DrawerGrabberIndicator = ({
  className,
  ...props
}: DrawerUnstyled.GrabberIndicatorProps) => (
  <DrawerUnstyled.GrabberIndicator
    className={cn(
      "bg-muted mx-auto mt-4 hidden h-1 w-25 shrink-0 rounded-full in-data-[swipe-direction=down]:block",
      className,
    )}
    {...props}
  />
);

export const DrawerHeader = ({ className, ...props }: HTMLArkProps<"div">) => (
  <ark.div
    className={cn(
      "flex flex-col gap-0.5 p-4 in-data-[swipe-direction=down]:text-center in-data-[swipe-direction=up]:text-center md:gap-0.5 md:text-left",
      className,
    )}
    {...props}
  />
);

export const DrawerIndent = DrawerUnstyled.Indent;

export const DrawerIndentBackground = DrawerUnstyled.IndentBackground;

export const DrawerPositioner = DrawerUnstyled.Positioner;

export const DrawerRoot = DrawerUnstyled.Root;

export const DrawerRootProvider = DrawerUnstyled.RootProvider;

export const DrawerStack = DrawerUnstyled.Stack;

export const DrawerSwipeArea = DrawerUnstyled.SwipeArea;

export const DrawerTitle = ({
  className,
  ...props
}: DrawerUnstyled.TitleProps) => (
  <DrawerUnstyled.Title
    className={cn("text-base font-medium text-foreground", className)}
    {...props}
  />
);

export const DrawerTrigger = DrawerUnstyled.Trigger;

export const Drawer = {
  Backdrop: DrawerBackdrop,
  CloseTrigger: DrawerCloseTrigger,
  Content: DrawerContent,
  Context: DrawerContext,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Grabber: DrawerGrabber,
  GrabberIndicator: DrawerGrabberIndicator,
  Header: DrawerHeader,
  Indent: DrawerIndent,
  IndentBackground: DrawerIndentBackground,
  Positioner: DrawerPositioner,
  Root: DrawerRoot,
  RootProvider: DrawerRootProvider,
  Stack: DrawerStack,
  SwipeArea: DrawerSwipeArea,
  Title: DrawerTitle,
  Trigger: DrawerTrigger,
} as const;
