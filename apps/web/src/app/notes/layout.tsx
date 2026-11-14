import { DbClient } from "@tanstack/react-db";
import { cookies } from "next/headers";
import { connection } from "next/server";

import { noteListQuery } from "@/collections/note";
import { NotesSidebar } from "@/components/layout/notes-sidebar";
import { NotesDbProvider } from "@/components/providers/notes-db-provider";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { createAppRealtime } from "@/lib/realtime";
import { requireSession } from "@/lib/session";

export const instant = false;

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  await requireSession();

  const { data, error } = await api.notes.live.get({
    fetch: {
      headers: {
        cookie: (await cookies()).toString(),
      },
    },
  });
  if (error) {
    throw error;
  }

  const realtime = createAppRealtime();
  const dbClient = new DbClient({
    realtime,
    sealedQuery: data.sealedQuery,
  });
  void dbClient
    .preloadLiveQuery(noteListQuery)
    .catch(() => {}) // failure streams to the client via the snapshot's error status
    .finally(() => dbClient.cleanup().finally(() => realtime.close()));
  const state = dbClient.dehydrate({
    shouldDehydrateCollection: () => false,
    shouldDehydrateLiveQuery: () => true,
  });

  return (
    <NotesDbProvider state={state} sealedQuery={data.sealedQuery}>
      <SidebarProvider>
        <NotesSidebar />
        <SidebarInset>
          <header className="sticky top-0 z-10 flex shrink-0 items-center gap-2 border-b bg-background p-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <div className="flex flex-1 flex-col gap-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </NotesDbProvider>
  );
}
