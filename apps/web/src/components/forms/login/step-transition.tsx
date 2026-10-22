"use client";

import { ViewTransition } from "react";

export function StepTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{
        forward: "slide-in-right",
        back: "slide-in-left",
        default: "none",
      }}
      exit={{
        forward: "slide-out-left",
        back: "slide-out-right",
        default: "none",
      }}
      default="none"
    >
      {children}
    </ViewTransition>
  );
}
