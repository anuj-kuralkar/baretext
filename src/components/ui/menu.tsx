import { Menu as MenuUnstyled } from "@ark-ui/react/menu";

import { cn } from "@/lib/utils";

export const MenuArrow = ({ className, ...props }: MenuUnstyled.ArrowProps) => (
  <MenuUnstyled.Arrow {...props} className={cn("fill-popover", className)} />
);

export const MenuArrowTip = ({
  className,
  ...props
}: MenuUnstyled.ArrowTipProps) => (
  <MenuUnstyled.ArrowTip {...props} className={cn("fill-popover", className)} />
);

export const MenuCheckboxItem = ({
  className,
  ...props
}: MenuUnstyled.CheckboxItemProps) => (
  <MenuUnstyled.CheckboxItem
    {...props}
    className={cn(
      "relative flex items-center gap-2 rounded-sm",
      "py-1.5 ps-8 pe-2",
      "select-none text-sm",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
  />
);

export const MenuContent = ({
  className,
  ...props
}: MenuUnstyled.ContentProps) => (
  <MenuUnstyled.Content
    {...props}
    className={cn(
      "bg-popover text-popover-foreground",
      "max-h-(--available-height) min-w-[max(var(--reference-width),8rem)] max-w-[min(var(--available-width),20rem)]",
      "rounded-md border p-1 shadow-md",
      "z-[calc(var(--layer-index)+50)]",
      "overflow-y-auto overflow-x-hidden",
      "focus-visible:outline-none",
      "data-[state=open]:zoom-in-95 data-[state=open]:fade-in-0 data-[state=open]:animate-in",
      "data-[state=closed]:zoom-out-95 data-[state=closed]:fade-out-0 data-[state=closed]:animate-out",
      "data-[placement^=top]:slide-in-from-bottom-2",
      "data-[placement^=bottom]:slide-in-from-top-2",
      "data-[placement^=left]:slide-in-from-right-2",
      "data-[placement^=right]:slide-in-from-left-2",
      className,
    )}
  />
);

export const MenuContext = MenuUnstyled.Context;

export const MenuContextTrigger = MenuUnstyled.ContextTrigger;

export const MenuIndicator = ({
  className,
  ...props
}: MenuUnstyled.IndicatorProps) => (
  <MenuUnstyled.Indicator className={cn("ms-auto", className)} {...props} />
);

export const MenuItem = ({
  className,
  tone,
  inset,
  ...props
}: MenuUnstyled.ItemProps & {
  tone?: "default" | "critical";
  inset?: boolean;
}) => (
  <MenuUnstyled.Item
    data-inset={inset || undefined}
    data-tone={tone}
    {...props}
    className={cn(
      "relative flex items-center gap-2 rounded-sm",
      "px-2 py-1.5 data-inset:pl-8",
      "select-none text-sm",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      "data-[tone=critical]:data-highlighted:bg-destructive/10 data-[tone=critical]:text-destructive data-[tone=critical]:*:[svg]:text-destructive!",
      "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
  />
);

export const MenuItemContext = MenuUnstyled.ItemContext;

export const MenuItemGroup = MenuUnstyled.ItemGroup;

export const MenuItemGroupLabel = ({
  className,
  ...props
}: MenuUnstyled.ItemGroupLabelProps) => (
  <MenuUnstyled.ItemGroupLabel
    {...props}
    className={cn(
      "px-2 py-1.5 data-inset:pl-8",
      "font-medium text-foreground text-sm",
      className,
    )}
  />
);

export const MenuItemIndicator = ({
  className,
  ...props
}: MenuUnstyled.ItemIndicatorProps) => (
  <MenuUnstyled.ItemIndicator
    {...props}
    className={cn(
      "flex items-center justify-center",
      "pointer-events-none absolute left-2 size-3.5",
      className,
    )}
  />
);

export const MenuItemText = MenuUnstyled.ItemText;

export const MenuPositioner = MenuUnstyled.Positioner;

export const MenuRadioItem = ({
  className,
  ...props
}: MenuUnstyled.RadioItemProps) => (
  <MenuUnstyled.RadioItem
    {...props}
    className={cn(
      "relative flex items-center gap-2 rounded-sm",
      "py-1.5 ps-8 pe-2",
      "select-none text-sm",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "aria-disabled:pointer-events-none aria-disabled:opacity-50",
      "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
  />
);

export const MenuRadioItemGroup = (props: MenuUnstyled.RadioItemGroupProps) => (
  <MenuUnstyled.RadioItemGroup {...props} />
);

export const MenuRoot = (props: MenuUnstyled.RootProps) => (
  <MenuUnstyled.Root {...props} />
);

export const MenuRootProvider = (props: MenuUnstyled.RootProviderProps) => (
  <MenuUnstyled.RootProvider {...props} />
);

export const MenuSeparator = ({
  className,
  ...props
}: MenuUnstyled.SeparatorProps) => (
  <MenuUnstyled.Separator
    {...props}
    className={cn("-mx-1 my-1 h-px bg-border", className)}
  />
);

export const MenuTrigger = MenuUnstyled.Trigger;

export const MenuTriggerItem = ({
  className,
  inset,
  ...props
}: MenuUnstyled.TriggerItemProps & { inset?: boolean }) => (
  <MenuUnstyled.TriggerItem
    data-inset={inset || undefined}
    {...props}
    className={cn(
      "flex items-center rounded-sm gap-2",
      "px-2 py-1.5 data-inset:pl-8",
      "select-none text-sm",
      "data-highlighted:bg-accent data-highlighted:text-accent-foreground",
      "data-[state=open]:bg-accent data-[state=open]:text-accent-foreground",
      "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0",
      className,
    )}
  />
);

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
  Trigger: MenuTrigger,
  TriggerItem: MenuTriggerItem,
} as const;
