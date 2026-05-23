"use client";
import { configExtension, defineExtension } from "@lexical/extension";
import { CHECK_LIST, TRANSFORMERS } from "@lexical/markdown";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";

import { toaster } from "@/components/ui/toast";
import { theme } from "@/styles/editor-theme";

import { AutoSaveExtension } from "./extensions/auto-save";
import { MarkdownPasteExtension } from "./extensions/markdown-paste";
import { extensionsList } from "./extensions-list";
import { AutoSaveIndicator } from "./save-indicator";

export function Editor({
  noteId,
  content,
}: {
  noteId: string;
  content: string;
}) {
  const editorExtension = defineExtension({
    name: "baretext-editor",
    namespace: "editor",
    dependencies: [
      ...extensionsList,
      configExtension(AutoSaveExtension, { noteId }),
      MarkdownPasteExtension,
    ],
    $initialEditorState: content,
    theme,
    onError: (error: Error) => {
      toaster.error({ title: "Editor Error", description: error.message });
    },
  });

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
            className="flex-1 overflow-y-auto p-4 focus:outline-none md:p-8 xl:p-12"
            placeholder={
              <div className="pointer-events-none absolute inset-0 p-4 text-muted-foreground/50 text-sm italic md:p-8 xl:p-12">
                {placeholderText}
              </div>
            }
          />
        </div>
        <AutoSaveIndicator />
        <MarkdownShortcutPlugin transformers={[...TRANSFORMERS, CHECK_LIST]} />
      </div>
    </LexicalExtensionComposer>
  );
}
