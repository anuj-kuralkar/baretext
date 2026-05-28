import { notFound } from "next/navigation";

import { requireSession } from "@/lib/session";
import { Editor } from "@/module/editor/editor";
import { getNoteAction } from "@/module/note/actions";

export default async function Page({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  await requireSession();
  const { noteId } = await params;
  const id = decodeURIComponent(noteId);
  const { data: note } = await getNoteAction(id);
  if (!note) {
    notFound();
  }
  return <Editor content={JSON.stringify(note.content)} noteId={id} />;
}
