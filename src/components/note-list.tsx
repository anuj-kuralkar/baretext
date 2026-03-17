"use client";
import { createListCollection } from "@ark-ui/react/listbox";
import { redirect, useParams } from "next/navigation";
import { NoteContextMenu } from "@/components/note-context-menu";
import { Listbox } from "@/components/ui/listbox";
import type { Note } from "@/module/note/types";
import { getFirstTwoTextNodesText } from "@/module/note/utils";

export function NoteList({ notes }: { notes: Note[] }) {
  const { noteId } = useParams<{ noteId: string }>();

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
          return (
            <NoteContextMenu key={note.id} note={note}>
              <Listbox.Item
                className="h-32"
                item={note}
                key={note.id}
                variant="muted"
              >
                <Listbox.ItemText>
                  <Listbox.ItemTitle>
                    {firstTwoTextNodesText[0]}
                  </Listbox.ItemTitle>
                  <Listbox.ItemDescription>
                    {firstTwoTextNodesText[1]}
                  </Listbox.ItemDescription>
                  <Listbox.ItemDescription className="font-extralight">
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
