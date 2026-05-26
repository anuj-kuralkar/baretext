"use client";

import { useDrawerContext } from "@ark-ui/react/drawer";
import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { Portal } from "@ark-ui/react/portal";
import {
  type Splitter as SplitterUnstyled,
  useSplitterContext,
} from "@ark-ui/react/splitter";
import { createContext, useContext, useState } from "react";
import { Button } from "@/components/ui/button";
import * as Drawer from "@/components/ui/drawer";
import * as Splitter from "@/components/ui/splitter";
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
  extends Omit<SplitterUnstyled.ResizeTriggerProps, "id"> {}

export interface SidebarTriggerProps
  extends Omit<React.ComponentProps<"button">, "value"> {}

const SidebarContext = createContext<{
  isMobile: boolean;
} | null>(null);

function useSidebarContext() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebarContext must be used within a SidebarRoot");
  }
  return context;
}

export function Content({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div
      className={cn(
        "no-scrollbar flex min-h-0 flex-1 flex-col gap-0 overflow-auto",
        className,
      )}
      {...props}
    />
  );
}

export function Footer({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  );
}

export function Header({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div className={cn("flex flex-col gap-2 p-2", className)} {...props} />
  );
}

export function Inset({ children }: SidebarInsetProps) {
  const { isMobile } = useSidebarContext();
  if (isMobile) return children;

  return (
    <Splitter.Panel className="h-full" id="b">
      {children}
    </Splitter.Panel>
  );
}

export function Panel({ children }: SidebarContentProps) {
  const { isMobile } = useSidebarContext();

  if (isMobile) {
    return (
      <Portal>
        <Drawer.Backdrop />
        <Drawer.Positioner>
          <Drawer.Content className="bg-sidebar text-sidebar-foreground">
            {children}
          </Drawer.Content>
        </Drawer.Positioner>
      </Portal>
    );
  }

  return (
    <Splitter.Panel
      className={cn(
        "h-dvh bg-sidebar text-sidebar-foreground duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] data-dragging:duration-0",
      )}
      id="a"
    >
      <div className="flex h-full min-w-3xs flex-col">{children}</div>
    </Splitter.Panel>
  );
}

export function ResizeTrigger({ ...props }: SidebarResizeTriggerProps) {
  const { isMobile } = useSidebarContext();
  if (isMobile) return null;

  return (
    <Splitter.ResizeTrigger aria-label="Resize" id="a:b" {...props}>
      <Splitter.ResizeTriggerIndicator className="bg-sidebar-border" />
    </Splitter.ResizeTrigger>
  );
}

export function Root({ children }: SidebarRootProps) {
  const isMobile = useIsMobile();
  const windowWidth = useWindowWidth();
  const [open, setOpen] = useState(false);

  const minPercent =
    windowWidth >= MIN_SIDEBAR_WIDTH
      ? (MIN_SIDEBAR_WIDTH / windowWidth) * 100
      : 0;

  const maxPercent =
    windowWidth >= MAX_SIDEBAR_WIDTH
      ? (MAX_SIDEBAR_WIDTH / windowWidth) * 100
      : 35;

  const defaultPercent = open ? minPercent : 0;

  const contextValue = { isMobile };

  if (isMobile) {
    return (
      <SidebarContext value={contextValue}>
        <Drawer.Root
          onOpenChange={({ open }) => setOpen(open)}
          open={open}
          swipeDirection="start"
        >
          {children}
        </Drawer.Root>
      </SidebarContext>
    );
  }

  return (
    <SidebarContext value={contextValue}>
      <Splitter.Root
        defaultSize={[defaultPercent, 100 - defaultPercent]}
        onCollapse={({ panelId }) => panelId === "a" && setOpen(false)}
        onExpand={({ panelId }) => panelId === "a" && setOpen(true)}
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
      </Splitter.Root>
    </SidebarContext>
  );
}

const SidebarTriggerDesktop = (props: SidebarTriggerProps) => {
  const splitter = useSplitterContext();

  const togglePanel = () => {
    splitter.isPanelCollapsed("a")
      ? splitter.expandPanel("a")
      : splitter.collapsePanel("a");
  };

  return (
    <Button onClick={togglePanel} size="icon" variant="ghost" {...props} />
  );
};

const SidebarTriggerMobile = (props: SidebarTriggerProps) => {
  const { open } = useDrawerContext();
  const TriggerComponent = open ? Drawer.CloseTrigger : Drawer.Trigger;
  return (
    <Button asChild size="icon" variant="ghost">
      <TriggerComponent {...props} />
    </Button>
  );
};

export function Trigger(props: SidebarTriggerProps) {
  const { isMobile } = useSidebarContext();
  if (isMobile) return <SidebarTriggerMobile {...props} />;
  return <SidebarTriggerDesktop {...props} />;
}
