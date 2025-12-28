"use client";

import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { TRANSFORMERS } from "@lexical/markdown";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { useEffect, useState } from "react";
import { toaster } from "@/components/ui/toast";
import { getFile } from "@/lib/storage";
import { useEditorStore } from "@/providers/editor-store";
import { theme } from "@/styles/editor-theme";
import { LoadPlugin } from "./plugins/load";
import { SavePlugin } from "./plugins/save";

function onError(error: Error) {
  toaster.error({
    title: "Error",
    description: error.message,
  });
}

export function Editor() {
  const { openFile } = useEditorStore((state) => state);
  const [content, setContent] = useState("");
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (!openFile) return;

    setLoading(true);
    (async () => {
      try {
        const { data, error } = await getFile(openFile);
        if (error || !data) {
          setContent("");
          return;
        }
        setContent(await data.text());
      } catch (err) {
        toaster.error({
          title: "Load Error",
          description: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [openFile]);

  const initialConfig = {
    namespace: "MarkdownEditor",
    theme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      ListNode,
      ListItemNode,
      CodeNode,
      CodeHighlightNode,
      LinkNode,
      AutoLinkNode,
    ],
  };

  if (!openFile) {
    return (
      <div className="flex items-center justify-center h-full">Open a file</div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">Loading...</div>
    );
  }

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative h-full">
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              aria-placeholder="Try typing # for heading"
              className="bg-background min-h-full outline-none xl:p-12 md:p-8 p-4"
              placeholder={
                <div className="absolute inset-0 pointer-events-none xl:p-12 md:p-8 p-4 text-muted-foreground text-sm">
                  {"Try typing # for heading, >; for quote, * for list..."}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />

        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        <SavePlugin path={openFile} />
        <LoadPlugin content={content} />
      </div>
    </LexicalComposer>
  );
}
