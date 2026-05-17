"use client";
import { SquarePenIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toaster } from "@/components/ui/toast";
import { createNoteAction } from "@/module/note/actions";

export const CreateNoteButton = ({
  iconOnly = false,
}: {
  iconOnly?: boolean;
}) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreateNote = () => {
    startTransition(async () => {
      const { data: note, error } = await createNoteAction();
      if (error) {
        toaster.error({ title: "Could not create note", description: error });
        return;
      }
      if (note) {
        router.push(`/notes/${encodeURIComponent(note.id)}`);
      }
    });
  };

  return (
    <Button
      aria-label="Create new note"
      disabled={isPending}
      onClick={handleCreateNote}
      size={iconOnly ? "icon" : "default"}
      variant="outline"
    >
      {!iconOnly && "New Note"}
      {isPending ? <Spinner /> : <SquarePenIcon />}
    </Button>
  );
};
