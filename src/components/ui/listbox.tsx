"use client";
import { Listbox as ListboxUnstyled } from "@ark-ui/react/listbox";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const itemVariants = cva(
  "group/item flex items-center border border-transparent aria-selected:border-muted-foreground text-sm rounded-md transition-colors [a]:hover:bg-accent/50 [a]:transition-colors duration-100 flex-wrap outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border-border",
        muted: "bg-muted/50",
      },
      size: {
        default: "p-4 gap-4 ",
        sm: "py-3 px-4 gap-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const ListboxContent = ({
  className,
  ...props
}: ListboxUnstyled.ContentProps) => (
  <ListboxUnstyled.Content
    {...props}
    className={cn(
      "flex flex-1 flex-col gap-2 group-data-[size=xs]/item:gap-0 [&+[data-part=item-content]]:flex-none",
      className,
    )}
  />
);

export const ListboxContext = ListboxUnstyled.Context;

export const ListboxEmpty = ({
  className,
  ...props
}: ListboxUnstyled.EmptyProps) => (
  <ListboxUnstyled.Empty
    {...props}
    className={cn("px-2 py-1.5 text-muted-foreground text-sm", className)}
  />
);

export const ListboxInput = ({
  className,
  ...props
}: ListboxUnstyled.InputProps) => (
  <ListboxUnstyled.Input
    {...props}
    className={cn(
      "w-full rounded-md border bg-background px-3 py-2 text-sm",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
      "disabled:pointer-events-none disabled:opacity-50",
      className,
    )}
  />
);

export const ListboxItem = ({
  variant = "default",
  size = "default",
  className,
  ...props
}: ListboxUnstyled.ItemProps & VariantProps<typeof itemVariants>) => (
  <ListboxUnstyled.Item
    {...props}
    className={cn(itemVariants({ variant, size, className }))}
    data-size={size}
    data-variant={variant}
  />
);

export const ListboxItemContext = ListboxUnstyled.ItemContext;

export const ListboxItemDescription = ({
  className,
  ...props
}: React.ComponentProps<"p">) => {
  return (
    <p
      className={cn(
        "line-clamp-2 text-left font-normal text-muted-foreground text-sm leading-normal group-data-[size=xs]/item:text-xs [&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      data-part="item-description"
      {...props}
    />
  );
};

export const ListboxItemGroup = ({
  className,
  ...props
}: ListboxUnstyled.ItemGroupProps) => (
  <ListboxUnstyled.ItemGroup
    {...props}
    className={cn(
      "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
      className,
    )}
  />
);

export const ListboxItemGroupLabel = ({
  className,
  ...props
}: ListboxUnstyled.ItemGroupLabelProps) => (
  <ListboxUnstyled.ItemGroupLabel
    {...props}
    className={cn("px-2 py-1.5 font-medium text-foreground text-sm", className)}
  />
);

export const ListboxItemIndicator = ({
  className,
  ...props
}: ListboxUnstyled.ItemIndicatorProps) => (
  <ListboxUnstyled.ItemIndicator
    {...props}
    className={cn(
      "absolute left-2 flex size-3.5 items-center justify-center",
      className,
    )}
  />
);

export const ListboxItemText = ListboxUnstyled.ItemText;

export const ListBoxItemTitle = ({
  className,
  ...props
}: React.ComponentProps<"div">) => {
  return (
    <div
      className={cn(
        "line-clamp-1 flex w-fit items-center gap-2 font-medium text-sm leading-snug underline-offset-4",
        className,
      )}
      data-part="item-title"
      {...props}
    />
  );
};

export const ListboxLabel = ({
  className,
  ...props
}: ListboxUnstyled.LabelProps) => (
  <ListboxUnstyled.Label
    {...props}
    className={cn("px-2 py-1.5 font-medium text-foreground text-sm", className)}
  />
);

export const ListboxRoot = ListboxUnstyled.Root;

export const ListboxRootProvider = ListboxUnstyled.RootProvider;

export const ListboxValueText = ({
  className,
  ...props
}: ListboxUnstyled.ValueTextProps) => (
  <ListboxUnstyled.ValueText {...props} className={cn("text-sm", className)} />
);

export const Listbox = {
  Content: ListboxContent,
  Context: ListboxContext,
  Empty: ListboxEmpty,
  Input: ListboxInput,
  Item: ListboxItem,
  ItemContext: ListboxItemContext,
  ItemDescription: ListboxItemDescription,
  ItemGroup: ListboxItemGroup,
  ItemGroupLabel: ListboxItemGroupLabel,
  ItemIndicator: ListboxItemIndicator,
  ItemText: ListboxItemText,
  ItemTitle: ListBoxItemTitle,
  Label: ListboxLabel,
  Root: ListboxRoot,
  RootProvider: ListboxRootProvider,
  ValueText: ListboxValueText,
} as const;
