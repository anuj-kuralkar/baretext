"use client";

import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState, SerializedEditorState } from "lexical";
import { useEffect, useRef, useState } from "react";

import { toaster } from "@/components/ui/toast";
import { debounce } from "@/lib/utils";
import { updateNoteAction } from "@/module/note/actions";

interface AutoSavePluginProps {
  noteId: string;
  delay?: number;
}

export function AutoSavePlugin({ noteId, delay = 1500 }: AutoSavePluginProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debouncedSave = useRef(
    debounce(async (content: SerializedEditorState) => {
      setIsSaving(true);
      const { error } = await updateNoteAction({ id: noteId, content });
      setLastSaved(new Date());

      if (error) {
        toaster.error({
          title: "Save Error",
          description: error,
        });
      }
    }, delay),
  ).current;

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      debouncedSave(json);
    });
  };

  return (
    <>
      <OnChangePlugin onChange={handleChange} />

      <div className="absolute bottom-4 right-4 pointer-events-none select-none">
        {isSaving ? (
          <span className="text-[10px] text-muted-foreground animate-pulse">
            Saving...
          </span>
        ) : lastSaved ? (
          <span className="text-[10px] text-muted-foreground/40 font-medium">
            Saved{" "}
            {lastSaved.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ) : null}
      </div>
    </>
  );
}
