"use client";
import { createListCollection } from "@ark-ui/react/listbox";
import { AlertCircleIcon } from "lucide-react";
import { redirect, useParams } from "next/navigation";
import { use } from "react";
import { NoteContextMenu } from "@/components/note-context-menu";
import * as Empty from "@/components/ui/empty";
import * as Listbox from "@/components/ui/listbox";
import { Skeleton } from "@/components/ui/skeleton";
import type { Result } from "@/lib/result";
import { cn } from "@/lib/utils";
import type { Note } from "@/module/note/types";
import { getFirstTwoTextNodesText } from "@/module/note/utils";

export function NoteList({
  notesPromise,
}: {
  notesPromise: Promise<Result<Note[]>>;
}) {
  const { noteId: noteIdEncoded } = useParams<{ noteId: string }>();
  const noteId = decodeURIComponent(noteIdEncoded);

  const { data: notes, error } = use(notesPromise);
  if (error || !notes) {
    return <NoteListError />;
  }

  const collection = createListCollection({
    items: notes,
    itemToValue: (note) => note.id,
    itemToString: (note) => getFirstTwoTextNodesText(note.content)[0],
  });

  return (
    <Listbox.Root
      collection={collection}
      onValueChange={(details) => redirect(`/notes/${details.value[0]}`)}
      value={[noteId]}
    >
      <Listbox.Content>
        {notes.map((note) => {
          const firstTwoTextNodesText = getFirstTwoTextNodesText(note.content);
          const hasTitle = !!firstTwoTextNodesText[0];
          const hasDescription = !!firstTwoTextNodesText[1];

          const title = hasTitle ? firstTwoTextNodesText[0] : "Blank Thoughts";

          const description = hasDescription
            ? firstTwoTextNodesText[1]
            : hasTitle
              ? ""
              : "Every masterpiece starts as suspiciously nothing.";
          return (
            <NoteContextMenu key={note.id} note={note}>
              <Listbox.Item
                className="h-28"
                item={note}
                key={note.id}
                variant={note.id === noteId ? "outline" : "muted"}
              >
                <Listbox.ItemText className="flex h-full flex-col justify-between">
                  <Listbox.ItemTitle
                    className={cn(
                      "font-medium text-sm",
                      !hasTitle && "text-foreground/50",
                    )}
                  >
                    {title}
                  </Listbox.ItemTitle>
                  <Listbox.ItemDescription
                    className={cn(!hasDescription && "text-foreground/30")}
                  >
                    {description}
                  </Listbox.ItemDescription>
                  <Listbox.ItemDescription className="font-extralight text-xs">
                    {note.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "2-digit",
                    })}
                  </Listbox.ItemDescription>
                </Listbox.ItemText>
              </Listbox.Item>
            </NoteContextMenu>
          );
        })}
      </Listbox.Content>
    </Listbox.Root>
  );
}

export function NoteListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 5 }, (_, i) => i).map((i) => (
        <Skeleton className="h-28" key={i} />
      ))}
    </div>
  );
}

export function NoteListError() {
  return (
    <Empty.Root className="flex flex-1 items-center justify-center">
      <Empty.Header>
        <Empty.Media
          className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive"
          variant="icon"
        >
          <AlertCircleIcon />
        </Empty.Media>
        <Empty.Title>Couldn't load notes</Empty.Title>
      </Empty.Header>
    </Empty.Root>
  );
}
