"use client";

import { ark, type HTMLArkProps } from "@ark-ui/react/factory";
import { PinInput as PinInputUnstyled } from "@ark-ui/react/pin-input";
import { MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils/index";

export const PinInputControl = ({
  className,
  ...props
}: PinInputUnstyled.ControlProps) => (
  <PinInputUnstyled.Control
    className={cn(
      "flex items-center rounded-lg has-aria-invalid:border-destructive has-aria-invalid:ring-3 has-aria-invalid:ring-destructive/20 has-disabled:opacity-50 dark:has-aria-invalid:ring-destructive/40",
      className,
    )}
    {...props}
  />
);

export const PinInputContext = PinInputUnstyled.Context;

export const PinInputHiddenInput = PinInputUnstyled.HiddenInput;

export const PinInputInput = ({
  className,
  ...props
}: PinInputUnstyled.InputProps) => (
  <PinInputUnstyled.Input
    className={cn(
      "border-y border-r border-input text-center transition-all outline-none first:rounded-l-lg first:border-l last:rounded-r-lg placeholder:text-muted-foreground/50 aria-invalid:border-destructive data-invalid:border-destructive group-data-[size=xs]/pin-input:size-7 group-data-[size=xs]/pin-input:text-xs group-data-[size=sm]/pin-input:size-8 group-data-[size=sm]/pin-input:text-sm group-data-[size=md]/pin-input:size-9 group-data-[size=md]/pin-input:text-sm group-data-[size=lg]/pin-input:size-10 group-data-[size=lg]/pin-input:text-base group-data-[size=xl]/pin-input:size-11 group-data-[size=xl]/pin-input:text-lg focus-visible:z-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:aria-invalid:border-destructive focus-visible:aria-invalid:ring-destructive/20 disabled:cursor-not-allowed dark:bg-input/30 dark:focus-visible:aria-invalid:ring-destructive/40",
      className,
    )}
    {...props}
  />
);

export const PinInputRoot = ({
  className,
  size,
  ...props
}: PinInputUnstyled.RootProps & { size: "xs" | "sm" | "md" | "lg" | "xl" }) => (
  <PinInputUnstyled.Root
    className={cn(
      "cn-pin-input group/pin-input data-disabled:cursor-not-allowed",
      className,
    )}
    data-size={size}
    {...props}
  />
);

export const PinInputRootProvider = PinInputUnstyled.RootProvider;

export const PinInputSeparator = ({
  className,
  ...props
}: HTMLArkProps<"div">) => (
  <ark.div
    className={cn(
      "flex items-center group-data-[size=xs]/pin-input:[&_svg:not([class*='size-'])]:size-3.5 group-data-[size=sm]/pin-input:[&_svg:not([class*='size-'])]:size-4 group-data-[size=md]/pin-input:[&_svg:not([class*='size-'])]:size-4 group-data-[size=lg]/pin-input:[&_svg:not([class*='size-'])]:size-4.5 group-data-[size=xl]/pin-input:[&_svg:not([class*='size-'])]:size-5",
      className,
    )}
    role="separator"
    {...props}
  >
    <MinusIcon />
  </ark.div>
);

export const PinInput = {
  Control: PinInputControl,
  Context: PinInputContext,
  HiddenInput: PinInputHiddenInput,
  Input: PinInputInput,
  Root: PinInputRoot,
  RootProvider: PinInputUnstyled.RootProvider,
  Separator: PinInputSeparator,
} as const;
