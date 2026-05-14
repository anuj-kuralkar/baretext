import type { Signal } from "@lexical/extension";
import { EditorStateExtension, signal } from "@lexical/extension";
import type { SerializedEditorState } from "lexical";
import { defineExtension } from "lexical";
import { toaster } from "@/components/ui/toast";
import { debounce } from "@/lib/utils";
import { updateNoteAction } from "@/module/note/actions";

export interface AutoSaveConfig {
  noteId: string;
  delay: number;
}

export interface AutoSaveOutput {
  isSaving: Signal<boolean>;
  lastSaved: Signal<Date | null>;
}

export const AutoSaveExtension = defineExtension({
  name: "auto-save",
  config: { noteId: "", delay: 1500 } as AutoSaveConfig,
  dependencies: [EditorStateExtension],

  build(): AutoSaveOutput {
    return {
      isSaving: signal(false),
      lastSaved: signal<Date | null>(null),
    };
  },

  register(editor, config, state): () => void {
    if (!config.noteId) return () => {};

    const { isSaving, lastSaved } = state.getOutput();

    const debouncedSave = debounce(async (content: SerializedEditorState) => {
      isSaving.value = true;
      try {
        const { error } = await updateNoteAction({
          id: config.noteId,
          content,
        });
        if (error) {
          toaster.error({ title: "Save Error", description: error });
        } else {
          lastSaved.value = new Date();
        }
      } finally {
        isSaving.value = false;
      }
    }, config.delay);

    const removeUpdateListener = editor.registerUpdateListener(
      ({ editorState, dirtyElements, dirtyLeaves }) => {
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) return;
        debouncedSave(editorState.toJSON());
      },
    );

    return () => {
      removeUpdateListener();
      debouncedSave.cancel?.();
    };
  },
});
