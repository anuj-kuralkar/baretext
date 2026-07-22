import {
  debounceStrategy,
  type PacedMutationsConfig,
} from "@tanstack/react-db";
import type { z } from "zod";
import { updateNoteAction } from "@/actions/note";
import { noteCollection, type noteSelectSchema } from "@/collections/note";

export function createNoteMutationConfig(
  noteId: string,
): PacedMutationsConfig<string, Record<string, unknown>> {
  return {
    onMutate: (text: string) => {
      try {
        noteCollection.update(noteId, (draft) => {
          draft.content = text;
        });
      } catch (error) {
        // TanStack DB throws if the note isn't in the local cache yet (e.g., direct navigation)
        console.debug(
          `Skipped optimistic update: Note ${noteId} not in local cache.`,
          error,
        );
      }
    },
    mutationFn: async ({ transaction }) => {
      const mutation = transaction.mutations[0];
      if (!mutation) return; // Abort if onMutate failed

      const changes = mutation.changes as Partial<
        z.infer<typeof noteSelectSchema>
      >;
      const original = mutation.original as z.infer<typeof noteSelectSchema>;
      if (changes.content !== undefined) {
        await updateNoteAction({
          id: noteId,
          content: changes.content,
          userId: original.userId,
        });
      }
    },
    strategy: debounceStrategy({ wait: 500 }),
  };
}
