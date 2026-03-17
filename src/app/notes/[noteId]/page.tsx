import { headers } from "next/headers";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { Editor } from "@/module/editor/editor";
import { getNote } from "@/module/note/dal";

export default async function Page({ params }: { params: { noteId: string } }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return redirect("/auth/login");
  }
  const { noteId } = await params;
  const id = decodeURIComponent(noteId);
  const note = await getNote({ id });
  if (!note) {
    notFound();
  }
  return <Editor content={JSON.stringify(note.content)} noteId={id} />;
}
