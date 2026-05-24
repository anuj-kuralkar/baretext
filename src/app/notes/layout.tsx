import { PanelLeftIcon } from "lucide-react";
import { headers } from "next/headers";
import { BrandLink } from "@/components/brand-link";
import { CreateNoteButton } from "@/components/create-note-button";
import { NoteList } from "@/components/note-list";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarPanel,
  SidebarResizeTrigger,
  SidebarRoot,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserSettingsLink } from "@/components/user-settings-link";
import { auth } from "@/lib/auth";
import { listNotesAction } from "@/module/note/actions";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { data: notes } = await listNotesAction();

  return (
    <SidebarRoot>
      <SidebarPanel>
        <SidebarHeader>
          <BrandLink />
        </SidebarHeader>

        <SidebarContent>
          <div className="mb-2 flex items-center justify-between rounded bg-muted px-4 py-2">
            <div className="flex-1">Notes</div>
            <CreateNoteButton iconOnly />
          </div>
          <NoteList notes={notes ?? []} />
        </SidebarContent>

        <SidebarFooter>
          <UserSettingsLink
            image={session?.user.image}
            name={session?.user.name ?? ""}
          />
        </SidebarFooter>
      </SidebarPanel>

      <SidebarResizeTrigger />
      <SidebarInset>
        <div className="flex h-dvh min-h-0 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1">
              <PanelLeftIcon className="size-4" />
            </SidebarTrigger>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </SidebarInset>
    </SidebarRoot>
  );
}
