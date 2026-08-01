import { CodePrismExtension } from "@lexical/code-prism";
import { configExtension, defineExtension } from "@lexical/extension";
import {
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastHtmlExtension,
  MdastShortcutsExtension,
} from "@lexical/mdast";
import { ReactExtension } from "@lexical/react/ReactExtension";
import type * as Y from "yjs";
import { theme } from "@/styles/editor-theme";
import { CollaborationExtension } from "./collaboration-extension";
import { coreExtensions } from "./extension-list";
import { PreviewSyncExtension } from "./preview-sync-extension";

export function createEditorExtension({
  noteId,
  doc,
  mutate,
}: {
  noteId: string;
  doc: Y.Doc;
  mutate: (text: string) => void;
}) {
  return defineExtension({
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
      MdastHtmlExtension,
      CodePrismExtension,
      ReactExtension,
    ],
    theme,
    onError: (error: Error) => {
      console.error("Editor Error:", error);
    },
  });
}
