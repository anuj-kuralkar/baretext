"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { useNoteCollection } from "@/collections/note";
import { toast } from "@/components/ui/toast";
import { clearNoteIndexedDb } from "@/lib/indexeddb";

export interface NoteDeleteTriggerProps
  extends useRender.ComponentProps<"div"> {
  noteId: string;
  disabled?: boolean;
}

export function NoteDeleteTrigger({
  noteId,
  render,
  ...props
}: NoteDeleteTriggerProps) {
  const notes = useNoteCollection();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const tx = notes.delete(noteId);

        if (pathname === `/notes/${noteId}`) {
          router.push("/notes");
        }

        await tx.when("settled");
        clearNoteIndexedDb(noteId);
      } catch (error) {
        console.error("Failed to delete note:", error);
        toast.add({ type: "error", title: "Failed to delete note" });
      }
    });
  };

  return useRender({
    render,
    props: mergeProps(
      {
        onClick: handleDelete,
        disabled: isPending,
        "data-disabled": isPending,
      },
      props,
    ),
    defaultTagName: "div",
  });
}
