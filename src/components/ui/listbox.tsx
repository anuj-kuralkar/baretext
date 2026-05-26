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

export function Content({ className, ...props }: ListboxUnstyled.ContentProps) {
  return (
    <ListboxUnstyled.Content
      {...props}
      className={cn(
        "flex flex-1 flex-col gap-2 group-data-[size=xs]/item:gap-0 [&+[data-part=item-content]]:flex-none",
        className,
      )}
    />
  );
}

export function Context<T>(props: ListboxUnstyled.ContextProps<T>) {
  return <ListboxUnstyled.Context {...props} />;
}

export function Empty({ className, ...props }: ListboxUnstyled.EmptyProps) {
  return (
    <ListboxUnstyled.Empty
      {...props}
      className={cn("px-2 py-1.5 text-muted-foreground text-sm", className)}
    />
  );
}

export function Input({ className, ...props }: ListboxUnstyled.InputProps) {
  return (
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
}

export function Item({
  variant = "default",
  size = "default",
  className,
  ...props
}: ListboxUnstyled.ItemProps & VariantProps<typeof itemVariants>) {
  return (
    <ListboxUnstyled.Item
      {...props}
      className={cn(itemVariants({ variant, size, className }))}
      data-size={size}
      data-variant={variant}
    />
  );
}

export function ItemContext(props: ListboxUnstyled.ItemContextProps) {
  return <ListboxUnstyled.ItemContext {...props} />;
}

export function ItemDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
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
}

export function ItemGroup({
  className,
  ...props
}: ListboxUnstyled.ItemGroupProps) {
  return (
    <ListboxUnstyled.ItemGroup
      {...props}
      className={cn(
        "group/item-group flex w-full flex-col gap-4 has-data-[size=sm]:gap-2.5 has-data-[size=xs]:gap-2",
        className,
      )}
    />
  );
}

export function ItemGroupLabel({
  className,
  ...props
}: ListboxUnstyled.ItemGroupLabelProps) {
  return (
    <ListboxUnstyled.ItemGroupLabel
      {...props}
      className={cn(
        "px-2 py-1.5 font-medium text-foreground text-sm",
        className,
      )}
    />
  );
}

export function ItemIndicator({
  className,
  ...props
}: ListboxUnstyled.ItemIndicatorProps) {
  return (
    <ListboxUnstyled.ItemIndicator
      {...props}
      className={cn(
        "absolute left-2 flex size-3.5 items-center justify-center",
        className,
      )}
    />
  );
}

export function ItemText(props: ListboxUnstyled.ItemTextProps) {
  return <ListboxUnstyled.ItemText {...props} />;
}

export function ItemTitle({
  className,
  ...props
}: React.ComponentProps<"div">) {
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
}

export function Label({ className, ...props }: ListboxUnstyled.LabelProps) {
  return (
    <ListboxUnstyled.Label
      {...props}
      className={cn(
        "px-2 py-1.5 font-medium text-foreground text-sm",
        className,
      )}
    />
  );
}

export function Root<T>(props: ListboxUnstyled.RootProps<T>) {
  return <ListboxUnstyled.Root {...props} />;
}

export function RootProvider<T>(props: ListboxUnstyled.RootProviderProps<T>) {
  return <ListboxUnstyled.RootProvider {...props} />;
}

export function ValueText({
  className,
  ...props
}: ListboxUnstyled.ValueTextProps) {
  return (
    <ListboxUnstyled.ValueText
      {...props}
      className={cn("text-sm", className)}
    />
  );
}
