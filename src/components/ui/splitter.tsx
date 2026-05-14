import { Splitter as SplitterUnstyled } from "@ark-ui/react/splitter";

import { cn } from "@/lib/utils";

export const SplitterContext = SplitterUnstyled.Context;
export const SplitterPanel = SplitterUnstyled.Panel;

export const SplitterResizeTrigger = ({
  className,
  ...props
}: SplitterUnstyled.ResizeTriggerProps) => (
  <SplitterUnstyled.ResizeTrigger
    className={cn(
      "group flex w-2 -translate-x-1/2 items-center justify-center",
      className,
    )}
    {...props}
  />
);

export const SplitterResizeTriggerIndicator = ({
  className,
  ...props
}: SplitterUnstyled.ResizeTriggerIndicatorProps) => (
  <SplitterUnstyled.ResizeTriggerIndicator
    className={cn(
      "h-full w-px bg-border transition-all duration-150 ease-in-out group-hover:w-1",
      className,
    )}
    {...props}
  />
);

export const SplitterRoot = ({
  className,
  ...props
}: SplitterUnstyled.RootProps) => (
  <SplitterUnstyled.Root
    className={cn(
      "flex size-full data-[orientation=vertical]:flex-col",
      className,
    )}
    {...props}
  />
);

export const SplitterRootProvider = SplitterUnstyled.RootProvider;

export const Splitter = {
  Context: SplitterContext,
  Panel: SplitterPanel,
  ResizeTrigger: SplitterResizeTrigger,
  ResizeTriggerIndicator: SplitterResizeTriggerIndicator,
  Root: SplitterRoot,
  RootProvider: SplitterRootProvider,
} as const;
