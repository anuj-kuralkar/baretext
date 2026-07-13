"use client";

import { CodePrismExtension } from "@lexical/code-prism";
import { configExtension, defineExtension } from "@lexical/extension";
import {
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastShortcutsExtension,
} from "@lexical/mdast";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { debounceStrategy, usePacedMutations } from "@tanstack/react-db";
import { useState } from "react";
import * as Y from "yjs";
import type { z } from "zod";
import { updateNoteAction } from "@/actions/note";
import { noteCollection, type noteSelectSchema } from "@/collections/note";
import { theme } from "@/styles/editor-theme";
import { CollaborationExtension } from "./editor/collaboration-extension";
import { coreExtensions } from "./editor/extension-list";
import { PreviewSyncExtension } from "./editor/preview-sync-extension";

export function Editor({ noteId }: { noteId: string }) {
  const mutate = usePacedMutations<string>({
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
  });

  const [doc] = useState(() => new Y.Doc());
  const [editorExtension] = useState(() =>
    defineExtension({
      name: "baretext-editor",
      namespace: "baretext-editor",
      dependencies: [
        ...coreExtensions,
        configExtension(CollaborationExtension, { noteId, doc }),
        configExtension(PreviewSyncExtension, { onPreviewExtract: mutate }),
        MdastExtension,
        MdastCommonMarkExtension,
        MdastGfmExtension,
        MdastShortcutsExtension,
        CodePrismExtension,
        ReactExtension,
      ],
      theme,
      onError: (error: Error) => {
        console.error("Editor Error:", error);
      },
    }),
  );

  const placeholderText =
    "Try typing # for heading, > for quote, * for list...";
  return (
    <LexicalExtensionComposer
      contentEditable={null}
      extension={editorExtension}
    >
      <div className="relative h-full">
        <div className="editor-inner">
          <ContentEditable
            aria-placeholder={placeholderText}
            className="min-h-[50vh] flex-1 overflow-y-auto p-4 focus:outline-none md:p-8 xl:p-12"
            placeholder={
              <div className="pointer-events-none absolute inset-0 p-4 text-muted-foreground/50 text-sm italic md:p-8 xl:p-12">
                {placeholderText}
              </div>
            }
          />
        </div>
      </div>
    </LexicalExtensionComposer>
  );
}
