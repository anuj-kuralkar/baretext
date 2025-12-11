import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

export function LoadPlugin({ content }: { content: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!content || !editor) {
      return;
    }

    editor.update(() => {
      $convertFromMarkdownString(content, TRANSFORMERS);
    });
  }, [content, editor]);

  return null;
}
