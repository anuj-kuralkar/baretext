import { Drawer as DrawerUnstyled } from "@ark-ui/react/drawer";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";

import { cn } from "@/lib/utils/index";

export function Backdrop({
  className,
  ...props
}: DrawerUnstyled.BackdropProps) {
  return (
    <DrawerUnstyled.Backdrop
      className={cn(
        "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 duration-500 data-[state=closed]:animate-out data-[state=open]:animate-in",
        "fixed inset-0 z-50 bg-black/10 supports-backdrop-filter:backdrop-blur-xs",
        className,
      )}
      {...props}
    />
  );
}

export function CloseTrigger(props: DrawerUnstyled.CloseTriggerProps) {
  return <DrawerUnstyled.CloseTrigger {...props} />;
}

export function Content({
  className,
  children,
  ...props
}: DrawerUnstyled.ContentProps) {
  return (
    <DrawerUnstyled.Content
      className={cn(
        "duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] data-[state=closed]:animate-out data-[state=open]:animate-in",
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
  );
}

export function Context(props: DrawerUnstyled.ContextProps) {
  return <DrawerUnstyled.Context {...props} />;
}

export function Description({ className, ...props }: HTMLArkProps<"p">) {
  return (
    <DrawerUnstyled.Description
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

export function Footer({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div
      className={cn("mt-auto flex flex-col gap-2 p-4", className)}
      {...props}
    />
  );
}

export function Grabber(props: DrawerUnstyled.GrabberProps) {
  return <DrawerUnstyled.Grabber {...props} />;
}

export function GrabberIndicator({
  className,
  ...props
}: DrawerUnstyled.GrabberIndicatorProps) {
  return (
    <DrawerUnstyled.GrabberIndicator
      className={cn(
        "mx-auto mt-4 in-data-[swipe-direction=down]:block hidden h-1 w-25 shrink-0 rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export function Header({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div
      className={cn(
        "flex flex-col gap-0.5 p-4 in-data-[swipe-direction=down]:text-center in-data-[swipe-direction=up]:text-center md:gap-0.5 md:text-left",
        className,
      )}
      {...props}
    />
  );
}

export function Indent(props: DrawerUnstyled.IndentProps) {
  return <DrawerUnstyled.Indent {...props} />;
}

export function IndentBackground(props: DrawerUnstyled.IndentBackgroundProps) {
  return <DrawerUnstyled.IndentBackground {...props} />;
}

export function Positioner(props: DrawerUnstyled.PositionerProps) {
  return <DrawerUnstyled.Positioner {...props} />;
}

export function Root(props: DrawerUnstyled.RootProps) {
  return <DrawerUnstyled.Root {...props} />;
}

export function RootProvider(props: DrawerUnstyled.RootProviderProps) {
  return <DrawerUnstyled.RootProvider {...props} />;
}

export function Stack(props: DrawerUnstyled.StackProps) {
  return <DrawerUnstyled.Stack {...props} />;
}

export function SwipeArea(props: DrawerUnstyled.SwipeAreaProps) {
  return <DrawerUnstyled.SwipeArea {...props} />;
}

export function Title({ className, ...props }: DrawerUnstyled.TitleProps) {
  return (
    <DrawerUnstyled.Title
      className={cn("font-medium text-base text-foreground", className)}
      {...props}
    />
  );
}

export function Trigger(props: DrawerUnstyled.TriggerProps) {
  return <DrawerUnstyled.Trigger {...props} />;
}
