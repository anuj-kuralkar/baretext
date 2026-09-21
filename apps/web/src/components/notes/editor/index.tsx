"use client";

import { useEffect, useState } from "react";
import * as Y from "yjs";
import { Spinner } from "@/components/ui/spinner";
import { createElectricProvider } from "@/lib/electric-provider";

export function Editor({ noteId }: { noteId: string }) {
  // Stable per-component Y.Doc — created once, destroyed on unmount.
  // Must NOT be at module scope: each note needs its own CRDT state.
  const [doc] = useState(() => new Y.Doc());
  const [synced, setSynced] = useState(false);

  // Provider + awareness lifecycle: create in effect so the synced listener
  // is attached before ElectricProvider starts its internal sync loop.
  useEffect(() => {
    const { provider, awareness, unsubscribeResumeState } =
      createElectricProvider(doc, noteId);

    // ElectricProvider emits "synced" when the initial snapshot is applied.
    // Attach before any async work starts to avoid missing the event.
    provider.on("synced", (isSynced: boolean) => {
      if (isSynced) setSynced(true);
    });

    return () => {
      provider.destroy();
      awareness.destroy();
      unsubscribeResumeState();
    };
  }, [doc, noteId]);

  // Destroy the doc when the component unmounts (noteId key change triggers this).
  useEffect(() => {
    return () => {
      doc.destroy();
    };
  }, [doc]);

  if (!synced) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center text-muted-foreground text-sm">
      Editor loading...
    </div>
  );
}
