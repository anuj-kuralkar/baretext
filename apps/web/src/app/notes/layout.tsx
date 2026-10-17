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
import { requireSession } from "@/lib/session";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await connection();
  await requireSession();

  const dbClient = new DbClient({
    cookie: (await cookies()).toString(),
  });
  void dbClient.preloadLiveQuery(noteListQuery);
  const state = dbClient.dehydrate({
    shouldDehydrateCollection: () => false,
    shouldDehydrateLiveQuery: () => true,
  });

  return (
    <NotesDbProvider state={state}>
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
