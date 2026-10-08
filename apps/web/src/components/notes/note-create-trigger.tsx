"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { safeRandomUUID } from "@tanstack/react-db";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useNoteCollection } from "@/collections/note";
import { useSidebar } from "@/components/ui/sidebar";
import { toast } from "@/components/ui/toast";

export interface NoteCreateTriggerProps
  extends useRender.ComponentProps<"div"> {
  disabled?: boolean;
}

export function NoteCreateTrigger({
  render,
  ...props
}: NoteCreateTriggerProps) {
  const notes = useNoteCollection();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { setOpenMobile } = useSidebar();

  const handleCreate = () => {
    startTransition(async () => {
      try {
        const newId = safeRandomUUID();
        const tx = notes.insert({
          id: newId,
          textContent: "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        router.push(`/notes/${newId}`);
        setOpenMobile(false);
        await tx.when("settled");
      } catch (error) {
        console.error("Failed to create note:", error);
        toast.add({ type: "error", title: "Failed to create note" });
      }
    });
  };
  return useRender({
    render,
    props: mergeProps(
      {
        onClick: handleCreate,
        disabled: isPending,
        "data-disabled": isPending,
      },
      props,
    ),
    defaultTagName: "div",
  });
}
