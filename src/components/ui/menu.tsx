import { Menu } from "@ark-ui/react/menu";

import { cn } from "@/lib/utils";

export function MenuRootProvider(props: Menu.RootProviderProps) {
  return <Menu.RootProvider {...props} />;
}

export function MenuPositioner(props: Menu.PositionerProps) {
  return <Menu.Positioner {...props} />;
}

export function MenuItem({ className, ...props }: Menu.ItemProps) {
  return (
    <Menu.Item
      className={cn(
        "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[disabled=true]:opacity-50 data-[disabled=true]:pointer-events-none data-[focus-visible=true]:ring-2 data-[focus-visible=true]:ring-sidebar-ring data-[focus-visible=true]:outline-hidden flex h-8 items-center rounded-md px-2 text-sm font-medium outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function MenuContent({ className, ...props }: Menu.ContentProps) {
  return (
    <Menu.Content
      className={cn(
        "z-50 min-w-[8rem] rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[side=bottom]:animate-slide-up data-[side=left]:animate-slide-left data-[side=right]:animate-slide-right data-[side=top]:animate-slide-down",
        className,
      )}
      {...props}
    />
  );
}

export function MenuContextTrigger(props: Menu.ContextTriggerProps) {
  return <Menu.ContextTrigger {...props} />;
}
