"use client";

import {
  DbClient,
  DbProvider,
  type DehydratedDbState,
  HydrationBoundary,
} from "@tanstack/react-db";
import type { ReactNode } from "react";
import { useState } from "react";

export function NotesDbProvider({
  children,
  state,
}: {
  children: ReactNode;
  state: DehydratedDbState;
}) {
  const [client] = useState(() => new DbClient());
  return (
    <DbProvider client={client}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </DbProvider>
  );
}
