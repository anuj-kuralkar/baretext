"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { clearDocument } from "y-indexeddb";
import { useNoteCollection } from "@/collections/note";
import { toast } from "@/components/ui/toast";

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
    startTransition(() => {
      try {
        const tx = notes.delete(noteId);

        tx.isPersisted.promise.catch((error) => {
          console.error("Failed to persist note deletion:", error);
          toast.add({ type: "error", title: "Failed to sync note deletion" });
        });

        if (pathname === `/notes/${noteId}`) {
          router.push("/notes");
        }
        clearDocument(noteId).catch((err) => {
          console.error("Failed to clear indexeddb for note:", err);
        });
      } catch (error) {
        console.error("Failed to delete note locally:", error);
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
