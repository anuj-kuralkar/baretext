import type { DbClient } from "@tanstack/db";
import { createPacedMutations, debounceStrategy } from "@tanstack/db";
import type { Note } from "shared/schema";

import { noteCollection } from "@/collections/note";
import { api } from "@/lib/api";

type UpdateNotePreviewVariables = {
  id: string;
  text: string;
  client: DbClient;
};

export const updateNotePreview = createPacedMutations<
  UpdateNotePreviewVariables,
  Note
>({
  onMutate: ({ id, text, client }) => {
    const notes = client.collection(noteCollection);
    notes.update(id, (draft) => {
      draft.preview = text;
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

        if (changes.preview !== undefined && changes.updatedAt !== undefined) {
          await api.notes({ id: original.id }).patch({
            preview: changes.preview,
            updatedAt: changes.updatedAt,
          });
        }
      }),
    );
  },
  strategy: debounceStrategy({ wait: 500 }),
});
