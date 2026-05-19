import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CreateNoteButton } from "@/components/create-note-button";
import { Empty } from "@/components/ui/empty";
import { auth } from "@/lib/auth";
import { listNotesAction } from "@/module/note/actions";

export default async function Page() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/auth/login");

  const { data: notes } = await listNotesAction();

  console.log(notes);

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
