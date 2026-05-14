"use client";
import { CodeExtension } from "@lexical/code-core";
import { CodePrismExtension } from "@lexical/code-prism";
import {
  configExtension,
  defineExtension,
  HorizontalRuleExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import { LinkExtension } from "@lexical/link";
import { CheckListExtension, ListExtension } from "@lexical/list";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextExtension } from "@lexical/rich-text";

import { toaster } from "@/components/ui/toast";
import { theme } from "@/styles/editor-theme";

import { AutoSaveExtension } from "./extension/autosave";
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
      HistoryExtension,
      RichTextExtension,
      CodeExtension,
      CodePrismExtension,
      LinkExtension,
      ListExtension,
      CheckListExtension,
      HorizontalRuleExtension,

      configExtension(AutoSaveExtension, { noteId }),
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
            className="flex-1 focus:outline-none xl:p-12 md:p-8 p-4 overflow-y-auto"
            placeholder={
              <div className="absolute inset-0 pointer-events-none xl:p-12 md:p-8 p-4 text-muted-foreground/50 text-sm italic">
                {placeholderText}
              </div>
            }
          />
        </div>
        <AutoSaveIndicator />
        <MarkdownShortcutPlugin />
      </div>
    </LexicalExtensionComposer>
  );
}
