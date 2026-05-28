import { redirect } from "next/navigation";
import { CreateNoteButton } from "@/components/create-note-button";
import * as Empty from "@/components/ui/empty";
import { requireSession } from "@/lib/session";
import { listNotesAction } from "@/module/note/actions";

export default async function Page() {
  await requireSession();

  const { data: notes } = await listNotesAction();

  if (notes?.length) {
    redirect(`/notes/${encodeURIComponent(notes[0].id)}`);
  }

  return (
    <Empty.Root className="h-full">
      <Empty.Header>
        <Empty.Title>No notes yet</Empty.Title>
        <Empty.Description>
          Create your first note to get started.
        </Empty.Description>
      </Empty.Header>
      <CreateNoteButton />
    </Empty.Root>
  );
}
