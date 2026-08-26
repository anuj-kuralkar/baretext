import { DbClient } from "@tanstack/db";
import { cookies } from "next/headers";

import { noteListQuery } from "@/collections/note";
import { AppSidebar } from "@/components/layout/app-sidebar";
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
        <AppSidebar />
        <SidebarInset className="relative flex w-full min-w-0 flex-col bg-background">
          <header className="flex h-14 shrink-0 items-center gap-2 bg-background px-4">
            <SidebarTrigger className="-ml-1" />
          </header>
          <main className="flex-1 overflow-auto">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </NotesDbProvider>
  );
}
