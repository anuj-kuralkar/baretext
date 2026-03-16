"use client";
import { SquarePenIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { createNoteAction } from "@/module/note/actions";

export const CreateNoteButton = () => {
  const handleCreateNote = async () => {
    await createNoteAction();
  };

  return (
    <Button onClick={handleCreateNote} size={"icon"} variant={"outline"}>
      <SquarePenIcon />
    </Button>
  );
};
