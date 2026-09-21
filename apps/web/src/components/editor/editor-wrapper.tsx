import { HorizontalRuleExtension } from "@lexical/extension";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
  $convertFromMarkdownString,
  CHECK_LIST,
  ELEMENT_TRANSFORMERS,
  MULTILINE_ELEMENT_TRANSFORMERS,
  registerMarkdownShortcuts,
  TEXT_FORMAT_TRANSFORMERS,
  TEXT_MATCH_TRANSFORMERS,
  type Transformer,
} from "@lexical/markdown";
import {
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastShortcutsExtension,
} from "@lexical/mdast";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";
import { defineExtension } from "lexical";
import { useMemo } from "react";

import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "./theme";

const EDITOR_TRANSFORMERS: Transformer[] = [
  CHECK_LIST,
  ...ELEMENT_TRANSFORMERS,
  ...MULTILINE_ELEMENT_TRANSFORMERS,
  ...TEXT_FORMAT_TRANSFORMERS,
  ...TEXT_MATCH_TRANSFORMERS,
];

export function MarkdownEditor() {
  const app = useMemo(
    () =>
      defineExtension({
        name: "@baretext/editor",
        dependencies: [
          RichTextExtension,
          ListExtension,
          CheckListExtension,
          TableExtension,
          HorizontalRuleExtension,
          MdastExtension,
          MdastCommonMarkExtension,
          MdastGfmExtension,
          MdastShortcutsExtension,
        ],
        register: (editor) =>
          registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS),
        $initialEditorState: () => {
          $convertFromMarkdownString(
            [
              "# Markdown shortcuts",
              "",
              "Everything here was written as plain markdown and converted while typing.",
              "",
              "- Start a line with `- ` for a list",
              "- Wrap text in `**stars**` to make it **bold**",
              "- Type `> ` for a quote or ` ``` ` for a code block",
              "",
              "> Try any shortcut on the empty line below.",
            ].join("\n"),
            EDITOR_TRANSFORMERS,
          );
        },
        theme: editorTheme,
      }),
    [],
  );

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <EditorWrapper>
        <div className="relative min-w-0 flex-1 overflow-y-auto">
          <ContentEditable />
        </div>
      </EditorWrapper>
    </LexicalExtensionComposer>
  );
}

function EditorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30">
      {children}
    </div>
  );
}
