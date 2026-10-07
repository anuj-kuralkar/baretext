import { Editor } from "@/components/editor";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  return <Editor key={noteId} noteId={noteId} />;
}
