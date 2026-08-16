import { createPacedMutations, debounceStrategy } from "@tanstack/db";
import type { Note } from "api/src/modules/note/model";

import { noteCollection } from "@/collections/note";
import { api } from "@/lib/api";

export const updateNotePreview = createPacedMutations<
  { id: string; text: string },
  Note
>({
  onMutate: ({ id, text }) => {
    noteCollection.update(id, (draft) => {
      draft.content = text;
      draft.updatedAt = new Date();
    });
  },
  mutationFn: async ({ transaction }) => {
    await Promise.all(
      transaction.mutations.map(async (mutation) => {
        if (mutation?.type !== "update") return;

        const changes = mutation.changes;
        const original = mutation.original;

        if (!("id" in original)) return;

        if (changes.content !== undefined) {
          await api.notes({ id: original.id }).patch({
            content: changes.content,
            updatedAt: changes.updatedAt,
          });
        }
      }),
    );
  },
  strategy: debounceStrategy({ wait: 500 }),
});
