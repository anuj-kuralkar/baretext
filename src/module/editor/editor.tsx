"use client";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { toaster } from "@/components/ui/toast";
import { nodes } from "@/module/editor/nodes";
import { theme } from "@/styles/editor-theme";

import { CodeHighlightPlugin } from "./plugins/code-highlight";
import { AutoSavePlugin } from "./plugins/save";

export function Editor({
  noteId,
  content,
}: {
  noteId: string;
  content: string;
}) {
  const initialConfig = {
    namespace: "MarkdownEditor",
    theme,
    editorState: content,
    onError: (error: Error) => {
      toaster.error({ title: "Editor Error", description: error.message });
    },
    nodes,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder="Try typing # for heading"
              className="flex-1 focus:outline-none xl:p-12 md:p-8 p-4 overflow-y-auto"
              placeholder={
                <div className="absolute inset-0 pointer-events-none xl:p-12 md:p-8 p-4 text-muted-foreground/50 text-sm italic">
                  {"Try typing # for heading, > for quote, * for list..."}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <MarkdownShortcutPlugin />
        <CodeHighlightPlugin />
        <AutoSavePlugin noteId={noteId} />
      </div>
    </LexicalComposer>
  );
}
