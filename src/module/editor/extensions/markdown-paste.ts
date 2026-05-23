import { $convertFromMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  COMMAND_PRIORITY_NORMAL,
  defineExtension,
  PASTE_COMMAND,
} from "lexical";

export const MarkdownPasteExtension = defineExtension({
  name: "markdown-paste",
  register(editor) {
    return editor.registerCommand(
      PASTE_COMMAND,
      (event: ClipboardEvent) => {
        const text = event.clipboardData?.getData("text/plain");
        if (!text) return false;

        event.preventDefault();

        editor.update(() => {
          const selection = $getSelection();

          if ($isRangeSelection(selection)) {
            const pivotNode = $createParagraphNode();
            $convertFromMarkdownString(text, TRANSFORMERS, pivotNode);

            const children = pivotNode.getChildren();

            if (children.length > 0) {
              selection.insertNodes(children);
            }
          }
        });

        return true;
      },
      COMMAND_PRIORITY_NORMAL,
    );
  },
});
