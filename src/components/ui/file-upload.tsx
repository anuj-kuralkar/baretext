import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { FileUpload as FileUploadUnstyled } from "@ark-ui/react/file-upload";
import type { VariantProps } from "class-variance-authority";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Root({ className, ...props }: FileUploadUnstyled.RootProps) {
  return (
    <FileUploadUnstyled.Root
      className={cn("flex flex-col gap-3", className)}
      {...props}
    />
  );
}

export function Label({ className, ...props }: FileUploadUnstyled.LabelProps) {
  return (
    <FileUploadUnstyled.Label
      className={cn(
        "font-medium text-foreground text-sm leading-none",
        "data-disabled:cursor-not-allowed data-disabled:opacity-50",
        "data-required:after:ml-0.5 data-required:after:text-destructive data-required:after:content-['*']",
        className,
      )}
      {...props}
    />
  );
}

export function Trigger({
  className,
  ...props
}: FileUploadUnstyled.TriggerProps) {
  return (
    <FileUploadUnstyled.Trigger
      className={cn(
        "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium text-sm",
        "outline-none ring-offset-background transition-colors",
        "h-9 px-4 py-2",
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:pointer-events-none [&_svg]:shrink-0",
        className,
      )}
      {...props}
    />
  );
}

export function Dropzone({
  className,
  children,
  ...props
}: FileUploadUnstyled.DropzoneProps) {
  return (
    <FileUploadUnstyled.Dropzone
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8",
        "border-border bg-muted/40 text-muted-foreground",
        "cursor-pointer transition-colors duration-150",
        "hover:border-muted-foreground/50 hover:bg-muted/60",
        "data-dragging:border-primary data-dragging:bg-primary/5 data-dragging:text-primary",
        "data-invalid:border-destructive/60 data-invalid:bg-destructive/5",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </FileUploadUnstyled.Dropzone>
  );
}

export function DropzoneIcon({ className, ...props }: HTMLArkProps<"div">) {
  return (
    <ark.div
      className={cn(
        "flex size-12 items-center justify-center rounded-full border border-border bg-background shadow-xs",
        className,
      )}
      {...props}
    />
  );
}

export function DropzoneTitle({ className, ...props }: HTMLArkProps<"p">) {
  return (
    <ark.p
      className={cn("font-medium text-foreground text-sm", className)}
      {...props}
    />
  );
}

export function DropzoneDescription({
  className,
  ...props
}: HTMLArkProps<"p">) {
  return (
    <p className={cn("text-muted-foreground text-xs", className)} {...props} />
  );
}

export function ClearTrigger({
  ...props
}: FileUploadUnstyled.ClearTriggerProps & VariantProps<typeof buttonVariants>) {
  return (
    <FileUploadUnstyled.ClearTrigger asChild>
      <Button {...props} />
    </FileUploadUnstyled.ClearTrigger>
  );
}

export function ItemGroup({
  className,
  ...props
}: FileUploadUnstyled.ItemGroupProps) {
  return (
    <FileUploadUnstyled.ItemGroup
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

export function Item({ className, ...props }: FileUploadUnstyled.ItemProps) {
  return (
    <FileUploadUnstyled.Item
      className={cn(
        "group/file-item flex items-center gap-3 rounded-lg border border-border bg-card p-3",
        "text-card-foreground shadow-xs transition-colors",
        "hover:bg-accent/50",
        "data-rejected:border-destructive/40 data-rejected:bg-destructive/5",
        className,
      )}
      {...props}
    />
  );
}

export function ItemPreview({
  className,
  ...props
}: FileUploadUnstyled.ItemPreviewProps) {
  return (
    <FileUploadUnstyled.ItemPreview
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-md border border-border bg-muted",
        "[&_svg:not([class*='size-'])]:size-4 [&_svg]:text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}

export function ItemPreviewImage({
  className,
  ...props
}: FileUploadUnstyled.ItemPreviewImageProps) {
  return (
    <FileUploadUnstyled.ItemPreviewImage
      className={cn("size-9 shrink-0 rounded-md object-cover", className)}
      {...props}
    />
  );
}

export function ItemName({
  className,
  ...props
}: FileUploadUnstyled.ItemNameProps) {
  return (
    <FileUploadUnstyled.ItemName
      className={cn(
        "min-w-0 flex-1 truncate font-medium text-foreground text-sm",
        "data-rejected:text-destructive",
        className,
      )}
      {...props}
    />
  );
}

export function ItemSizeText({
  className,
  ...props
}: FileUploadUnstyled.ItemSizeTextProps) {
  return (
    <FileUploadUnstyled.ItemSizeText
      className={cn(
        "shrink-0 text-muted-foreground text-xs tabular-nums",
        className,
      )}
      {...props}
    />
  );
}

export function ItemDeleteTrigger({
  ...props
}: FileUploadUnstyled.ItemDeleteTriggerProps &
  VariantProps<typeof buttonVariants>) {
  return (
    <FileUploadUnstyled.ItemDeleteTrigger asChild>
      <Button {...props} />
    </FileUploadUnstyled.ItemDeleteTrigger>
  );
}

export const Context = FileUploadUnstyled.Context;
export const HiddenInput = FileUploadUnstyled.HiddenInput;
export const RootProvider = FileUploadUnstyled.RootProvider;
