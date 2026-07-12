"use client";

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
import { useState } from "react";
import * as Y from "yjs";
import { theme } from "@/styles/editor-theme";
import { CollaborationExtension } from "./editor/collaboration-extension";
import { coreExtensions } from "./editor/extension-list";

export function Editor({ noteId }: { noteId: string }) {
  const [doc] = useState(() => new Y.Doc());
  const [editorExtension] = useState(() =>
    defineExtension({
      name: "baretext-editor",
      namespace: "baretext-editor",
      dependencies: [
        ...coreExtensions,
        configExtension(CollaborationExtension, { noteId, doc }),
        MdastExtension,
        MdastCommonMarkExtension,
        MdastGfmExtension,
        MdastShortcutsExtension,
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
