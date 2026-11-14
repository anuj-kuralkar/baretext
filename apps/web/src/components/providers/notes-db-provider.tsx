"use client";

import type { Note } from "@baretext/db/zod/schema";
import type { SealedLiveQuery } from "@neon/realtime/client";
import {
  DbClient,
  DbProvider,
  type DehydratedDbState,
  HydrationBoundary,
} from "@tanstack/react-db";
import type { ReactNode } from "react";
import { useState } from "react";

import { createAppRealtime } from "@/lib/realtime";

export function NotesDbProvider({
  children,
  state,
  sealedQuery,
}: {
  children: ReactNode;
  state: DehydratedDbState;
  sealedQuery: SealedLiveQuery<Note>;
}) {
  const [realtime] = useState(() => createAppRealtime());
  const [client] = useState(
    () =>
      new DbClient({
        realtime,
        sealedQuery,
      }),
  );
  return (
    <DbProvider client={client}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </DbProvider>
  );
}
