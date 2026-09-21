import {
  type ContentEditableElementProps,
  ContentEditable as LexicalContentEditable,
} from "@lexical/react/LexicalContentEditable";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const contentEditableVariants = cva(
  "min-h-full w-full bg-transparent text-sm outline-none",
  {
    variants: {
      variant: {
        default: "px-2.5 py-2",
        toolbar: "px-4 py-4",
        draggable: "px-12 py-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

const placeholderVariants = cva(
  "pointer-events-none absolute text-sm text-muted-foreground select-none",
  {
    variants: {
      variant: {
        default: "inset-s-2.5 top-2",
        toolbar: "inset-s-4 top-4",
        draggable: "inset-s-12 top-4",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export function ContentEditable({
  variant,
  className,
  placeholder = "Type something...",
  placeholderClassName,
  ...props
}: VariantProps<typeof contentEditableVariants> &
  Omit<ContentEditableElementProps, "editor" | "className"> & {
    className?: string;
    placeholder?: string;
    placeholderClassName?: string;
  }) {
  return (
    <LexicalContentEditable
      {...props}
      className={cn(contentEditableVariants({ variant }), className)}
      aria-placeholder={placeholder}
      placeholder={
        <div
          className={cn(placeholderVariants({ variant }), placeholderClassName)}
        >
          {placeholder}
        </div>
      }
    />
  );
}
