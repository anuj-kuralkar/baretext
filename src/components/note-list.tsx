"use client";
import { createListCollection } from "@ark-ui/react/listbox";
import { redirect, useParams } from "next/navigation";
import { use } from "react";

import { NoteContextMenu } from "@/components/note-context-menu";
import * as Listbox from "@/components/ui/listbox";
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
    return <div>Error {error}</div>;
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
