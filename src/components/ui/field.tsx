import { Field as FieldUnstyled } from "@ark-ui/react/field";
import { cva, type VariantProps } from "class-variance-authority";
import { Children, type ComponentProps } from "react";

import { Input as InputStyled } from "@/components/ui/input";
import { Label as LabelStyled } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const fieldVariants = cva(
  "group/field flex w-full gap-2 data-invalid:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-field-content]]:items-start *:data-[part=label]:flex-auto has-[>[data-field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-field-content]]:items-start @md/field-group:*:data-[part=label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

export function Content({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "group/field-content flex flex-1 flex-col gap-0.5 leading-snug",
        className,
      )}
      data-field-content
      {...props}
    />
  );
}

export function ErrorText({
  className,
  children,
  ...props
}: ComponentProps<"div">) {
  const childArray = Children.toArray(children);

  const content =
    childArray.length <= 1 ? (
      children
    ) : (
      <ul className="ml-4 flex list-disc flex-col gap-1">
        {childArray.map((error) => {
          if (!error) return null;
          return <li key={(error as React.ReactElement).key}>{error}</li>;
        })}
      </ul>
    );

  return (
    <FieldUnstyled.ErrorText {...props} asChild>
      <div className={cn("font-normal text-destructive text-sm", className)}>
        {content}
      </div>
    </FieldUnstyled.ErrorText>
  );
}

export function Input(props: FieldUnstyled.InputProps) {
  return (
    <FieldUnstyled.Input {...props} asChild>
      <InputStyled />
    </FieldUnstyled.Input>
  );
}

export function HelperText({
  className,
  ...props
}: FieldUnstyled.HelperTextProps) {
  return (
    <FieldUnstyled.HelperText
      className={cn(
        "text-left font-normal text-muted-foreground text-sm leading-normal group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "nth-last-2:-mt-1 last:mt-0",
        "[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4",
        className,
      )}
      {...props}
    />
  );
}

export function Label({ className, ...props }: FieldUnstyled.LabelProps) {
  return (
    <FieldUnstyled.Label asChild>
      <LabelStyled
        className={cn(
          "group/field-label peer/field-label flex w-fit gap-2 leading-snug has-[>[data-slot=field]]:rounded-lg has-[>[data-slot=field]]:border has-data-checked:border-primary/30 has-data-checked:bg-primary/5 *:data-[part=root]:p-2.5 group-data-[disabled=true]/field:opacity-50 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
          "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
          className,
        )}
        {...props}
      />
    </FieldUnstyled.Label>
  );
}

export function Root({
  className,
  orientation = "vertical",
  ...props
}: FieldUnstyled.RootProps & VariantProps<typeof fieldVariants>) {
  return (
    <FieldUnstyled.Root
      className={cn(fieldVariants({ orientation }), className)}
      data-orientation={orientation}
      {...props}
    />
  );
}
