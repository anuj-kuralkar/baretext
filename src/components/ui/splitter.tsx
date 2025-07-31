"use client";

import { Splitter } from "@ark-ui/react/splitter";
import type { PropsWithChildren } from "react";

export function SplitterRoot(props: PropsWithChildren<Splitter.RootProps>) {
  return <Splitter.Root {...props} />;
}

export function SplitterPanel(props: PropsWithChildren<Splitter.PanelProps>) {
  return <Splitter.Panel {...props} />;
}

export function SplitterResizeTrigger(props: Splitter.ResizeTriggerProps) {
  return <Splitter.ResizeTrigger {...props} />;
}
