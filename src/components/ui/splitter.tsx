import { Splitter as SplitterUnstyled } from "@ark-ui/react/splitter";

import { cn } from "@/lib/utils";

export const SplitterPanel = SplitterUnstyled.Panel;

export const SplitterResizeTrigger = ({
  className,
  ...props
}: SplitterUnstyled.ResizeTriggerProps) => (
  <SplitterUnstyled.ResizeTrigger
    className={cn(
      "group w-2 -translate-x-1/2 flex justify-center items-center",
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
      "h-full w-px group-hover:w-1 bg-border transition-all duration-150 ease-in-out",
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

export const Splitter = {
  Panel: SplitterPanel,
  ResizeTrigger: SplitterResizeTrigger,
  ResizeTriggerIndicator: SplitterResizeTriggerIndicator,
  Root: SplitterRoot,
} as const;
