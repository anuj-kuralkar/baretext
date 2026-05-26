import { Splitter as SplitterUnstyled } from "@ark-ui/react/splitter";

import { cn } from "@/lib/utils";

export function Context(props: SplitterUnstyled.ContextProps) {
  return <SplitterUnstyled.Context {...props} />;
}

export function Panel(props: SplitterUnstyled.PanelProps) {
  return <SplitterUnstyled.Panel {...props} />;
}

export function ResizeTrigger({
  className,
  ...props
}: SplitterUnstyled.ResizeTriggerProps) {
  return (
    <SplitterUnstyled.ResizeTrigger
      className={cn(
        "group flex w-2 -translate-x-1/2 items-center justify-center",
        className,
      )}
      {...props}
    />
  );
}

export function ResizeTriggerIndicator({
  className,
  ...props
}: SplitterUnstyled.ResizeTriggerIndicatorProps) {
  return (
    <SplitterUnstyled.ResizeTriggerIndicator
      className={cn(
        "h-full w-px bg-border transition-all duration-150 ease-in-out group-hover:w-1",
        className,
      )}
      {...props}
    />
  );
}

export function Root({ className, ...props }: SplitterUnstyled.RootProps) {
  return (
    <SplitterUnstyled.Root
      className={cn(
        "flex size-full data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

export function RootProvider(props: SplitterUnstyled.RootProviderProps) {
  return <SplitterUnstyled.RootProvider {...props} />;
}
