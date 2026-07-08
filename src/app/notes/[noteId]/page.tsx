export default async function NotePage({
  params,
}: {
  params: Promise<{ noteId: string }>;
}) {
  const { noteId } = await params;
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center text-muted-foreground">
        <p className="text-sm">Editor placeholder</p>
        <p className="mt-1 text-xs">Note ID: {noteId}</p>
      </div>
    </div>
  );
}
