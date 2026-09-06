"use client";

import { SquarePenIcon } from "lucide-react";
import { NoteCreateTrigger } from "@/components/notes/note-create-trigger";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function NoteListActions() {
  return (
    <div className="flex items-center gap-1">
      <Tooltip>
        <TooltipTrigger
          render={
            <NoteCreateTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  aria-label="New Note"
                />
              }
            />
          }
        >
          <SquarePenIcon />
        </TooltipTrigger>
        <TooltipContent side="top">New Note</TooltipContent>
      </Tooltip>
    </div>
  );
}
