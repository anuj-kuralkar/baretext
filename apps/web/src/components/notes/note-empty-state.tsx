"use client";

import { NotebookPen, Plus } from "lucide-react";
import { NoteCreateTrigger } from "@/components/notes/note-create-trigger";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
export function NoteEmptyState() {
  return (
    <Empty className="h-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NotebookPen />
        </EmptyMedia>

        <EmptyTitle>Select or create a note</EmptyTitle>

        <EmptyDescription>
          Choose a note from the sidebar, or create a new one to start writing.
        </EmptyDescription>
      </EmptyHeader>

      <EmptyContent>
        <NoteCreateTrigger render={<Button />}>
          <Plus />
          New note
        </NoteCreateTrigger>
      </EmptyContent>
    </Empty>
  );
}
