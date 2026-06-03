"use client";

import { Shader, Aurora } from "shaders/react";

export function AuroraBackground() {
  return (
    <Shader className="fixed inset-0 -z-10 pointer-events-none">
      <Aurora
        colorA="#7c3aed"
        colorB="#3b82f6"
        colorC="#06b6d4"
        speed={0.4}
        blend={0.6}
        amplitude={1.0}
      />
    </Shader>
  );
}
