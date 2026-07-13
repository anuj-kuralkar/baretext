import { Editor } from "@/components/notes/editor";

export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  return (
    <div className="flex h-full w-full flex-col">
      <Editor key={noteId} noteId={noteId} />
    </div>
  );
}
