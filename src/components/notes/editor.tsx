"use client";

import { LexicalCollaboration } from "@lexical/react/LexicalCollaborationContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { usePacedMutations } from "@tanstack/react-db";
import { useMemo } from "react";
import * as Y from "yjs";

import { createEditorExtension } from "./editor/core-extension";
import { createNoteMutationConfig } from "./editor/mutations";

export function Editor({ noteId }: { noteId: string }) {
  const mutate = usePacedMutations(createNoteMutationConfig(noteId));
  const editorExtension = useMemo(
    () => createEditorExtension({ noteId, doc: new Y.Doc(), mutate }),
    [noteId, mutate],
  );

  const placeholderText =
    "Try typing # for heading, > for quote, * for list...";
  return (
    <LexicalCollaboration>
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
    </LexicalCollaboration>
  );
}
