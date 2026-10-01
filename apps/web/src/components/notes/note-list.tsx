"use client";

import { useSignalValue } from "@lexical/react/useExtensionSignalValue";
import { useLiveSuspenseQuery } from "@tanstack/react-db";
import { cn } from "cn";
import Link from "next/link";
import type { ReactNode } from "react";
import { noteListQuery } from "@/collections/note";
import { useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  findMatchRanges,
  matchesAllTerms,
  parseSearchTerms,
} from "@/lib/search";
import { searchQuery } from "@/lib/search-query";
import { formatRelativeTime } from "@/lib/utils";
import { NoteContextMenu } from "./note-context-menu";

export interface NoteListProps {
  active?: string;
}

export function NoteList({ active }: NoteListProps) {
  const { data: notes } = useLiveSuspenseQuery(noteListQuery);
  const query = useSignalValue(searchQuery);

  const terms = parseSearchTerms(query);
  const matches =
    terms.length === 0
      ? notes
      : notes.filter((note) => matchesAllTerms(note.preview, terms));

  if (notes.length === 0) {
    return <NoteListEmpty />;
  }

  if (matches.length === 0) {
    return <NoteListNoMatches query={query} />;
  }

  return (
    <div className="flex flex-col gap-2">
      {matches.map((note) => (
        <NoteContextMenu key={note.id} noteId={note.id}>
          <NotePreview
            id={note.id}
            preview={note.preview}
            updatedAt={note.updatedAt}
            terms={terms}
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

function NoteListNoMatches({ query }: { query: string }) {
  return (
    <div className="px-3 py-8 text-center text-[14px] text-muted-foreground/60">
      No notes match <span className="font-medium">{query.trim()}</span>.
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
  terms: string[];
  isActive: boolean;
}

function NotePreview({
  id,
  preview,
  updatedAt,
  terms,
  isActive,
}: NotePreviewProps) {
  const { setOpenMobile } = useSidebar();

  const [title = "A blank page", description = "Your next idea starts here"] =
    preview.split(/\n+/).filter(Boolean).slice(0, 2);

  const relativeTime = formatRelativeTime(updatedAt);

  return (
    <Link
      href={`/notes/${id}`}
      className={cn(
        "flex flex-col items-start gap-2 overflow-hidden rounded-lg border p-4 text-sm leading-tight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        isActive &&
          "border-transparent bg-sidebar-accent text-sidebar-accent-foreground",
      )}
      onClick={() => setOpenMobile(false)}
    >
      <span className="w-full truncate font-medium">
        <Highlighted text={title} terms={terms} />
      </span>
      <span className="line-clamp-2 whitespace-break-spaces text-xs">
        <Highlighted text={description} terms={terms} />
      </span>
      <span className="text-xs">{relativeTime}</span>
    </Link>
  );
}

function Highlighted({ text, terms }: { text: string; terms: string[] }) {
  const ranges = findMatchRanges(text, terms);

  if (ranges.length === 0) {
    return <>{text}</>;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((range) => {
    if (range.start > cursor) {
      parts.push(text.slice(cursor, range.start));
    }
    parts.push(
      <mark
        key={`${range.start}-${range.end}`}
        className="rounded bg-yellow-200/70 dark:bg-yellow-500/30"
      >
        {text.slice(range.start, range.end)}
      </mark>,
    );
    cursor = range.end;
  });

  if (cursor < text.length) {
    parts.push(text.slice(cursor));
  }

  return <>{parts}</>;
}
