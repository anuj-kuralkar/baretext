import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import type { EditorState } from "lexical";
import { useEffect, useRef, useState } from "react";
import { toaster } from "@/components/ui/toast";
import { upsertFile } from "@/lib/storage";
import { debounce } from "@/lib/utils";

export function SavePlugin({
  delay = 2000,
  path,
}: {
  path: string | null;
  delay?: number;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const saveContent = async (content: string) => {
    if (!path) return;

    setIsSaving(true);
    try {
      const blob = new Blob([content], { type: "text/markdown" });
      const { error } = await upsertFile(path, blob, "text/markdown");

      if (error) throw error;

      setLastSaved(new Date());
    } catch (err) {
      toaster.error({
        title: "Save Error",
        description: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const debouncedSave = useRef(
    debounce((markdown: string) => {
      saveContent(markdown);
    }, delay),
  ).current;

  useEffect(() => {
    return () => debouncedSave.cancel();
  }, [debouncedSave]);

  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS);
      debouncedSave(markdown);
    });
  };

  return (
    <>
      <OnChangePlugin onChange={handleChange} />
      {(isSaving || lastSaved) && (
        <div className="absolute top-2 right-2 text-xs text-gray-500">
          {isSaving ? "Saving..." : `Saved ${lastSaved?.toLocaleTimeString()}`}
        </div>
      )}
    </>
  );
}
