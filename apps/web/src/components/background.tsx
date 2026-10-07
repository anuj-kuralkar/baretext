"use client";

import { Aurora, CursorRipples, Shader } from "shaders/react";

export function Background() {
  return (
    <Shader className="pointer-events-none fixed inset-0 -z-10 size-full">
      <Aurora
        balance={50}
        center={{ x: 0, y: 0.25 }}
        colorA="#164e63"
        colorB="#115e59"
        colorC="#0f766e"
        colorSpace="oklch"
        height={75}
        rayDensity={25}
        speed={5}
        waviness={75}
      />
      <CursorRipples
        chromaticSplit={0.5}
        decay={5}
        edges="stretch"
        intensity={2.5}
        radius={0.25}
      />
    </Shader>
  );
}
