"use client";

import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { noteCollection } from "@/collections/note";
import { authClient } from "@/lib/auth/client";

export interface NoteCreateTriggerProps
  extends useRender.ComponentProps<"div"> {
  disabled?: boolean;
}

export function NoteCreateTrigger({
  render,
  ...props
}: NoteCreateTriggerProps) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isPending, startTransition] = React.useTransition();

  const handleCreate = () => {
    startTransition(() => {
      try {
        const newId = crypto.randomUUID();

        const tx = noteCollection.insert({
          id: newId,
          content: "",
          userId: session?.user?.id ?? "",
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        tx.isPersisted.promise.catch((error) => {
          console.error("Failed to persist note:", error);
          toast.error("Failed to sync note creation");
        });

        router.push(`/notes/${newId}`);
      } catch (error) {
        console.error("Failed to create note locally:", error);
        toast.error("Failed to create note");
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
