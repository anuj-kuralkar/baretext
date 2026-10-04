"use client";

import { useLiveSuspenseQuery } from "@tanstack/react-db";
import { cn } from "cn";
import Link from "next/link";
import { noteListQuery } from "@/collections/note";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { formatRelativeTime } from "@/lib/utils";
import { NoteContextMenu } from "./note-context-menu";

export interface NoteListProps {
  active?: string;
}

export function NoteList({ active }: NoteListProps) {
  const { data: notes } = useLiveSuspenseQuery(noteListQuery);

  if (notes.length === 0) {
    return <NoteListEmpty />;
  }

  return (
    <div className="flex flex-col gap-2">
      {notes.map((note) => (
        <NoteContextMenu key={note.id} noteId={note.id}>
          <NotePreview
            id={note.id}
            preview={note.preview}
            updatedAt={note.updatedAt}
            isActive={active === note.id}
          />
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

export function NoteListSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2, 3].map((value) => (
        <div
          key={value}
          className="flex flex-col items-start gap-2 rounded-lg border p-4"
        >
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="mt-0.5 h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

interface NotePreviewProps {
  id: string;
  preview: string;
  updatedAt: Date;
  isActive: boolean;
}

function NotePreview({ id, preview, updatedAt, isActive }: NotePreviewProps) {
  const { setOpenMobile } = useSidebar();

  const [title = "A blank page", description = "Your next idea starts here"] =
    preview.split(/\n+/).filter(Boolean).slice(0, 2);

  const relativeTime = formatRelativeTime(updatedAt);

  return (
    <Link
      href={`/notes/${id}`}
      className={cn(
        "flex flex-col items-start gap-2 overflow-hidden rounded-lg border border-sidebar-border bg-sidebar p-4 text-sm leading-tight hover:bg-[color-mix(in_oklch,var(--sidebar),var(--sidebar-foreground)_5%)]",
        isActive &&
          "bg-[color-mix(in_oklch,var(--sidebar),var(--sidebar-foreground)_7.5%)]",
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
