import { PanelLeftIcon } from "lucide-react";
import { Suspense } from "react";
import { BrandLink } from "@/components/brand-link";
import { CreateNoteButton } from "@/components/create-note-button";
import { NoteList } from "@/components/note-list";
import * as Sidebar from "@/components/ui/sidebar";
import { UserSettingsLink } from "@/components/user-settings-link";
import { requireSession } from "@/lib/session";
import { listNotesAction } from "@/module/note/actions";

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const notesPromise = listNotesAction();

  return (
    <Sidebar.Root>
      <Sidebar.Panel>
        <Sidebar.Header>
          <BrandLink />
        </Sidebar.Header>

        <Sidebar.Content>
          <div className="mb-2 flex items-center justify-between rounded bg-muted px-4 py-2">
            <div className="flex-1">Notes</div>
            <CreateNoteButton iconOnly />
          </div>
          <div className="p-2">
            <Suspense fallback={"loading..."}>
              <NoteList notesPromise={notesPromise} />
            </Suspense>
          </div>
        </Sidebar.Content>

        <Sidebar.Footer>
          <UserSettingsLink
            image={session.user.image}
            name={session.user.name ?? ""}
          />
        </Sidebar.Footer>
      </Sidebar.Panel>

      <Sidebar.ResizeTrigger />
      <Sidebar.Inset>
        <div className="flex h-dvh min-h-0 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <Sidebar.Trigger className="-ml-1">
              <PanelLeftIcon className="size-4" />
            </Sidebar.Trigger>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </Sidebar.Inset>
    </Sidebar.Root>
  );
}
