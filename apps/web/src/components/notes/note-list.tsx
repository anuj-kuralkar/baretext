"use client";

import { useLiveQuery } from "@tanstack/react-db";
import Link from "next/link";
import type { Note } from "shared/schema";

import { noteListQuery } from "@/collections/note";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatRelativeTime } from "@/lib/utils";
import { NoteContextMenu } from "./note-context-menu";

export interface NoteListProps {
  active?: string;
}

export function NoteList({ active }: NoteListProps) {
  const { data: notes, isLoading } = useLiveQuery(noteListQuery);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2">
        <NotePreviewSkeleton />
        <NotePreviewSkeleton />
        <NotePreviewSkeleton />
        <NotePreviewSkeleton />
      </div>
    );
  }

  if (!notes || notes.length === 0) {
    return <NoteListEmpty />;
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteContextMenu key={note.id} noteId={note.id}>
          <NotePreview note={note} isActive={active === note.id} />
        </NoteContextMenu>
      ))}
    </div>
  );
}

function NoteListEmpty() {
  return (
    <div className="px-3 py-8 text-center text-[14px] text-muted-foreground/60">
      No notes yet.
    </div>
  );
}

function NotePreviewSkeleton() {
  return (
    <div className="flex flex-col items-start gap-2 rounded-lg border p-4">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="mt-0.5 h-3 w-1/4" />
    </div>
  );
}

interface NotePreviewProps {
  note: Note;
  isActive: boolean;
}

function NotePreview({ note, isActive }: NotePreviewProps) {
  const { setOpenMobile } = useSidebar();

  const firstLine = note.content ? note.content.split("\n")[0].trim() : "";
  const title = firstLine || "Empty note";

  let description = "No additional text";
  if (note.content) {
    const lines = note.content.split("\n");
    if (lines.length > 1) {
      const rest = lines.slice(1).join(" ").trim();
      if (rest) description = rest;
    }
  }

  const relativeTime = formatRelativeTime(note.updatedAt);

  return (
    <Link
      href={`/notes/${note.id}`}
      className={cn(
        "flex flex-col items-start gap-2 overflow-hidden rounded-lg border p-4 text-sm leading-tight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive &&
          "border-transparent bg-sidebar-accent text-sidebar-accent-foreground",
      )}
      onClick={() => setOpenMobile(false)}
    >
      <span className="w-full truncate font-medium">{title}</span>
      <span className="line-clamp-2 whitespace-break-spaces text-xs">
        {description}
      </span>
      <span className="text-xs">{relativeTime}</span>
    </Link>
  );
}
