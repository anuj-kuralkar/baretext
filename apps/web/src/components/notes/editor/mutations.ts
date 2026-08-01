import { createPacedMutations, debounceStrategy } from "@tanstack/db";

import { updateNoteAction } from "@/actions/note";
import { type Note, noteCollection } from "@/collections/note";

export const updateNotePreview = createPacedMutations<
  { id: string; text: string },
  Note
>({
  onMutate: ({ id, text }) => {
    noteCollection.update(id, (draft) => {
      draft.content = text;
    });
  },
  mutationFn: async ({ transaction }) => {
    await Promise.all(
      transaction.mutations.map(async (mutation) => {
        if (mutation?.type !== "update") return;

        const changes = mutation.changes;
        const original = mutation.original;

        if (!("userId" in original)) return;

        if (changes.content !== undefined) {
          await updateNoteAction({
            id: original.id,
            content: changes.content,
            userId: original.userId,
          });
        }
      }),
    );
  },
  strategy: debounceStrategy({ wait: 500 }),
});
