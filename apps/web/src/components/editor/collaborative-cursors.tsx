"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { YBinding, YCursor } from "@lexical/y";
import { type RefObject, useEffect, useState } from "react";

import { authClient } from "@/lib/auth/client";
import type { NeonRealtimeProvider } from "@/lib/neon-realtime-provider";

interface RemoteCursor {
  readonly clientId: number;
  readonly name: string;
  readonly color: string;
  readonly x: number;
  readonly y: number;
  readonly height: number;
}

const CURSOR_COLORS = [
  "#2563eb", // blue
  "#7c3aed", // violet
  "#db2777", // pink
  "#ea580c", // orange
  "#16a34a", // green
  "#0891b2", // cyan
  "#d97706", // amber
  "#4f46e5", // indigo
];

export function getCursorColor(clientId: number): string {
  const index = Math.abs(clientId) % CURSOR_COLORS.length;
  return CURSOR_COLORS[index] ?? "#2563eb";
}

export function syncAwarenessUser(
  awareness: {
    clientID: number;
    getLocalState: () => Record<string, unknown> | null;
    setLocalStateField: (field: string, value: unknown) => void;
  },
  user: { name?: string | null } | null | undefined,
): void {
  const currentState = awareness.getLocalState();
  if (user?.name) {
    const color = getCursorColor(awareness.clientID);
    awareness.setLocalStateField("user", {
      name: user.name,
      color,
    });
  } else if (currentState?.user !== undefined) {
    // If previously set but user is no longer logged in, clear it
    awareness.setLocalStateField("user", null);
  }
}

export function CollaborativeCursors({
  provider,
  binding,
  containerRef,
}: {
  readonly provider: NeonRealtimeProvider;
  readonly binding: YBinding | null;
  readonly containerRef: RefObject<HTMLElement | null>;
}) {
  const [editor] = useLexicalComposerContext();
  const [cursors, setCursors] = useState<readonly RemoteCursor[]>([]);
  const { data: session } = authClient.useSession();

  // Set user details in local awareness state only when authenticated
  useEffect(() => {
    syncAwarenessUser(provider.awareness, session?.user);
  }, [provider, session]);

  // Share local cursor selection
  useEffect(() => {
    if (!binding) return;

    return editor.registerUpdateListener(() => {
      const cursor = binding.getCursor();
      provider.awareness.setLocalStateField("cursor", cursor);
    });
  }, [editor, binding, provider]);

  // Track and render remote cursors
  useEffect(() => {
    if (!binding) return;

    function updateCursors() {
      const container = containerRef.current;
      if (!container) return;

      const containerRect = container.getBoundingClientRect();
      const nextCursors: RemoteCursor[] = [];

      for (const [clientId, state] of provider.awareness.getStates()) {
        if (clientId === provider.awareness.clientID || !state?.cursor) {
          continue;
        }

        editor.read(() => {
          const currentBinding = binding;
          if (!currentBinding) return;

          const points = currentBinding.$resolveCursor(state.cursor as YCursor);
          if (!points) return;

          const domElement = editor.getElementByKey(points.anchor.key);
          if (!domElement) return;

          let rect: DOMRect | null = null;

          if (points.anchor.type === "text") {
            const walker = document.createTreeWalker(
              domElement,
              NodeFilter.SHOW_TEXT,
            );
            let current = walker.nextNode();
            let accumulated = 0;
            let targetNode: Node = domElement;
            let targetOffset = 0;

            while (current) {
              const len = current.textContent?.length ?? 0;
              if (accumulated + len >= points.anchor.offset) {
                targetNode = current;
                targetOffset = points.anchor.offset - accumulated;
                break;
              }
              accumulated += len;
              current = walker.nextNode();
            }

            try {
              const range = document.createRange();
              range.setStart(targetNode, targetOffset);
              range.setEnd(targetNode, targetOffset);
              const rangeRect = range.getBoundingClientRect();
              if (rangeRect.height > 0) {
                rect = rangeRect;
              }
            } catch {
              // fallback to element rect below
            }
          }

          if (!rect) {
            rect = domElement.getBoundingClientRect();
          }

          const x = rect.left - containerRect.left + container.scrollLeft;
          const y = rect.top - containerRect.top + container.scrollTop;
          const height = rect.height > 0 ? rect.height : 20;

          const userInfo = state.user as
            | { name?: string; color?: string }
            | undefined;
          const name = userInfo?.name || "Collaborator";
          const color = userInfo?.color || getCursorColor(clientId);

          nextCursors.push({
            clientId,
            name,
            color,
            x,
            y,
            height,
          });
        });
      }

      setCursors(nextCursors);
    }

    const unlistenAwareness = () => {
      provider.awareness.off("change", updateCursors);
    };
    provider.awareness.on("change", updateCursors);

    const container = containerRef.current;
    container?.addEventListener("scroll", updateCursors, { passive: true });
    window.addEventListener("resize", updateCursors);

    updateCursors();

    return () => {
      unlistenAwareness();
      container?.removeEventListener("scroll", updateCursors);
      window.removeEventListener("resize", updateCursors);
    };
  }, [editor, binding, provider, containerRef]);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {cursors.map((cursor) => (
        <div
          key={cursor.clientId}
          className="absolute transition-all duration-75"
          style={{
            left: `${cursor.x}px`,
            top: `${cursor.y}px`,
          }}
        >
          {/* Caret line */}
          <div
            className="w-[2px] animate-pulse rounded-full"
            style={{
              height: `${cursor.height}px`,
              backgroundColor: cursor.color,
            }}
          />
          {/* User name badge */}
          <div
            className="absolute -top-5 left-0 z-10 rounded px-1.5 py-0.5 text-[10px] font-medium whitespace-nowrap text-white shadow-sm"
            style={{
              backgroundColor: cursor.color,
            }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </div>
  );
}
