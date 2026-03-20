"use client";

import { type Drawer, useDrawerContext } from "@ark-ui/react/drawer";
import { Portal } from "@ark-ui/react/portal";
import { type Splitter, useSplitterContext } from "@ark-ui/react/splitter";
import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DrawerBackdrop,
  DrawerCloseTrigger,
  DrawerContent,
  DrawerPositioner,
  DrawerRoot,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  SplitterPanel,
  SplitterResizeTrigger,
  SplitterRoot,
} from "@/components/ui/splitter";
import { useIsMobile } from "@/hooks/use-mobile";
import { useWindowWidth } from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";

const MIN_SIDEBAR_WIDTH = 256;
const MAX_SIDEBAR_WIDTH = 320;

export interface SidebarRootProps {
  children: React.ReactNode;
}

export interface SidebarContentProps {
  children: React.ReactNode;
}

export interface SidebarInsetProps {
  children: React.ReactNode;
}

export interface SidebarResizeTriggerProps
  extends Omit<Splitter.ResizeTriggerProps, "id"> {}

export interface SidebarTriggerProps extends React.ComponentProps<"button"> {}

const SidebarContext = createContext<{
  isResizing?: boolean;
  isMobile: boolean;
} | null>(null);

function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarRoot");
  }
  return context;
}

export function SidebarRoot({ children }: SidebarRootProps) {
  const isMobile = useIsMobile();
  const windowWidth = useWindowWidth();
  const [open, setOpen] = useState(false);
  const [isResizing, setIsResizing] = useState(false);

  const minPercent =
    windowWidth >= MIN_SIDEBAR_WIDTH
      ? (MIN_SIDEBAR_WIDTH / windowWidth) * 100
      : 0;

  const maxPercent =
    windowWidth >= MAX_SIDEBAR_WIDTH
      ? (MAX_SIDEBAR_WIDTH / windowWidth) * 100
      : 35;

  const defaultPercent = open ? minPercent : 0;

  const contextValue = { isMobile, isResizing };

  if (isMobile) {
    return (
      <SidebarContext value={contextValue}>
        <DrawerRoot
          onOpenChange={({ open }) => setOpen(open)}
          open={open}
          swipeDirection="left"
        >
          {children}
        </DrawerRoot>
      </SidebarContext>
    );
  }

  return (
    <SidebarContext value={contextValue}>
      <SplitterRoot
        defaultSize={[defaultPercent, 100 - defaultPercent]}
        onCollapse={({ panelId }) => panelId === "a" && setOpen(false)}
        onExpand={({ panelId }) => panelId === "a" && setOpen(true)}
        onResizeEnd={() => setIsResizing(false)}
        onResizeStart={() => setIsResizing(true)}
        panels={[
          {
            id: "a",
            collapsible: true,
            collapsedSize: 0,
            minSize: minPercent,
            maxSize: maxPercent,
          },
          { id: "b" },
        ]}
      >
        {children}
      </SplitterRoot>
    </SidebarContext>
  );
}

export function SidebarContent({ children }: SidebarContentProps) {
  const { isMobile, isResizing } = useSidebarContext();

  if (isMobile) {
    return (
      <Portal>
        <DrawerBackdrop />
        <DrawerPositioner>
          <DrawerContent className="bg-sidebar text-sidebar-foreground">
            {children}
          </DrawerContent>
        </DrawerPositioner>
      </Portal>
    );
  }

  return (
    <SplitterPanel
      className={cn(
        "bg-sidebar text-sidebar-foreground h-dvh duration-150",
        isResizing && "duration-0",
      )}
      id="a"
    >
      <div className="flex flex-col h-full min-w-3xs">{children}</div>
    </SplitterPanel>
  );
}

export function SidebarInset({ children }: SidebarInsetProps) {
  const { isMobile } = useSidebarContext();
  if (isMobile) return children;

  return (
    <SplitterPanel className="h-full" id="b">
      {children}
    </SplitterPanel>
  );
}

export function SidebarResizeTrigger({
  className,
  ...props
}: SidebarResizeTriggerProps) {
  const { isMobile } = useSidebarContext();
  if (isMobile) return null;

  return (
    <SplitterResizeTrigger
      aria-label="Resize"
      className={cn("bg-sidebar-border w-0.5", className)}
      id="a:b"
      {...props}
    />
  );
}

function SidebarTriggerDesktop(props: SidebarTriggerProps) {
  const splitter = useSplitterContext();

  const togglePanel = () => {
    splitter.isPanelCollapsed("a")
      ? splitter.expandPanel("a")
      : splitter.collapsePanel("a");
  };

  return (
    <Button onClick={togglePanel} size="icon" variant="ghost" {...props} />
  );
}

function SidebarTriggerMobile(
  props: Drawer.TriggerProps | Drawer.CloseTriggerProps,
) {
  const { open } = useDrawerContext();
  const TriggerComponent = open ? DrawerCloseTrigger : DrawerTrigger;
  return (
    <Button asChild size="icon" variant="ghost">
      <TriggerComponent {...props} />
    </Button>
  );
}

export function SidebarTrigger(props: SidebarTriggerProps) {
  const { isMobile } = useSidebarContext();
  if (isMobile) return <SidebarTriggerMobile {...props} />;
  return <SidebarTriggerDesktop {...props} />;
}

export function SidebarGroup({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col flex-1 w-full p-2", className)}
      {...props}
    />
  );
}

export function SidebarHeader({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  );
}

export function SidebarFooter({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  );
}
