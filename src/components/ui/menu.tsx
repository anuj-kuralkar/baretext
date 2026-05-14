"use client";

import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { Menu as MenuUnstyled } from "@ark-ui/react/menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export const MenuArrow = ({ className, ...props }: MenuUnstyled.ArrowProps) => (
  <MenuUnstyled.Arrow
    {...props}
    className={cn("rotate-45 bg-popover [--arrow-size:16px]", className)}
  />
);

export const MenuArrowTip = ({
  className,
  ...props
}: MenuUnstyled.ArrowTipProps) => (
  <MenuUnstyled.ArrowTip
    {...props}
    className={cn("-rotate-45 border-border border-t border-l", className)}
  />
);

export const MenuCheckboxItem = ({
  className,
  children,
  inset,
  ...props
}: MenuUnstyled.CheckboxItemProps & {
  inset?: boolean;
}) => {
  return (
    <MenuUnstyled.CheckboxItem
      className={cn(
        "relative flex cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:pl-7 data-highlighted:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-inset={inset}
      {...props}
    >
      <span className="pointer-events-none absolute right-2">
        <MenuUnstyled.ItemIndicator>
          <CheckIcon />
        </MenuUnstyled.ItemIndicator>
      </span>
      {children}
    </MenuUnstyled.CheckboxItem>
  );
};

export const MenuContent = ({
  className,
  ...props
}: MenuUnstyled.ContentProps) => {
  return (
    <MenuUnstyled.Content
      className={cn(
        "data-[placement^=bottom]:slide-in-from-top-2 data-[placement^=top]:slide-in-from-bottom-2 data-[placement^=left]:slide-in-from-right-2 data-[placement^=right]:slide-in-from-left-2 data-open:fade-in-0 data-open:zoom-in-95 data-closed:fade-out-0 data-closed:zoom-out-95 z-50 max-h-(--available-height) min-w-36 origin-(--transform-origin) overflow-y-auto overflow-x-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md outline-none ring-1 ring-foreground/10 duration-100 data-closed:animate-out data-open:animate-in",
        "data-[nested=menu]:shadow-lg",
        className,
      )}
      {...props}
    />
  );
};

export const MenuContext = MenuUnstyled.Context;

export const MenuContextTrigger = ({
  className,
  ...props
}: MenuUnstyled.ContextTriggerProps) => {
  return (
    <MenuUnstyled.ContextTrigger
      className={cn("select-none", className)}
      {...props}
    />
  );
};

export const MenuIndicator = MenuUnstyled.Indicator;

export const MenuItem = ({
  className,
  inset,
  tone = "default",
  ...props
}: MenuUnstyled.ItemProps & {
  inset?: boolean;
  tone?: "default" | "critical";
}) => {
  return (
    <MenuUnstyled.Item
      className={cn(
        "group/context-menu-item relative flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden data-[tone=critical]:data-highlighted:bg-destructive/10 data-[tone=critical]:data-highlighted:text-destructive data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:pl-7 data-[tone=critical]:text-destructive data-highlighted:text-accent-foreground data-disabled:opacity-50 dark:data-[tone=critical]:data-highlighted:bg-destructive/20 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0 data-[tone=critical]:*:[svg]:text-destructive data-highlighted:*:[svg]:text-accent-foreground",
        className,
      )}
      data-inset={inset}
      data-tone={tone}
      {...props}
    />
  );
};

export const MenuItemContext = MenuUnstyled.ItemContext;

export const MenuItemGroup = MenuUnstyled.ItemGroup;

export const MenuItemGroupLabel = ({
  className,
  inset,
  ...props
}: MenuUnstyled.ItemGroupLabelProps & {
  inset?: boolean;
}) => {
  return (
    <MenuUnstyled.ItemGroupLabel
      className={cn(
        "px-1.5 py-1 font-medium text-muted-foreground text-xs data-inset:pl-7",
        className,
      )}
      data-inset={inset}
      {...props}
    />
  );
};

export const MenuItemIndicator = MenuUnstyled.ItemIndicator;

export const MenuItemText = MenuUnstyled.ItemText;

export const MenuPositioner = ({
  className,
  ...props
}: MenuUnstyled.PositionerProps) => {
  return (
    <MenuUnstyled.Positioner
      className={cn("isolate z-50 outline-none", className)}
      {...props}
    />
  );
};

export const MenuRadioItem = ({
  className,
  children,
  inset,
  ...props
}: MenuUnstyled.RadioItemProps & {
  inset?: boolean;
}) => {
  return (
    <MenuUnstyled.RadioItem
      className={cn(
        "relative flex cursor-default select-none items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-accent data-inset:pl-7 data-highlighted:text-accent-foreground data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-inset={inset}
      {...props}
    >
      <span className="pointer-events-none absolute right-2">
        <MenuUnstyled.ItemIndicator>
          <CheckIcon />
        </MenuUnstyled.ItemIndicator>
      </span>
      {children}
    </MenuUnstyled.RadioItem>
  );
};

export const MenuRadioItemGroup = MenuUnstyled.RadioItemGroup;

export const MenuRoot = MenuUnstyled.Root;

export const MenuRootProvider = MenuUnstyled.RootProvider;

export const MenuSeparator = ({
  className,
  ...props
}: MenuUnstyled.SeparatorProps) => {
  return (
    <MenuUnstyled.Separator
      className={cn("-mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
};

export const MenuShortcut = ({ className, ...props }: HTMLArkProps<"span">) => {
  return (
    <ark.span
      className={cn(
        "ml-auto text-muted-foreground text-xs tracking-widest group-data-highlighted/context-menu-item:text-accent-foreground",
        className,
      )}
      {...props}
    />
  );
};

export const MenuTrigger = MenuUnstyled.Trigger;

export const MenuTriggerItem = ({
  className,
  inset,
  children,
  ...props
}: MenuUnstyled.TriggerItemProps & {
  inset?: boolean;
}) => {
  return (
    <MenuUnstyled.TriggerItem
      className={cn(
        "flex cursor-default select-none items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden data-highlighted:bg-accent data-open:bg-accent data-inset:pl-7 data-highlighted:text-accent-foreground data-open:text-accent-foreground [&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      data-inset={inset}
      {...props}
    >
      {children}
      <ChevronRightIcon className="ms-auto" />
    </MenuUnstyled.TriggerItem>
  );
};

export const Menu = {
  Arrow: MenuArrow,
  ArrowTip: MenuArrowTip,
  CheckboxItem: MenuCheckboxItem,
  Content: MenuContent,
  Context: MenuContext,
  ContextTrigger: MenuContextTrigger,
  Indicator: MenuIndicator,
  Item: MenuItem,
  ItemContext: MenuItemContext,
  ItemGroup: MenuItemGroup,
  ItemGroupLabel: MenuItemGroupLabel,
  ItemIndicator: MenuItemIndicator,
  ItemText: MenuItemText,
  Positioner: MenuPositioner,
  RadioItem: MenuRadioItem,
  RadioItemGroup: MenuRadioItemGroup,
  Root: MenuRoot,
  RootProvider: MenuRootProvider,
  Separator: MenuSeparator,
  Shortcut: MenuShortcut,
  Trigger: MenuTrigger,
  TriggerItem: MenuTriggerItem,
} as const;
