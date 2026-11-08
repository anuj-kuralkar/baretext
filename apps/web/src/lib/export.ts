import { CodePrismExtension } from "@lexical/code-prism";
import {
  buildEditorFromExtensions,
  configExtension,
  defineExtension,
  getExtensionDependencyFromEditor,
} from "@lexical/extension";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  $convertToMarkdownString,
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastHtmlExtension,
} from "@lexical/mdast";
import { RichTextExtension } from "@lexical/rich-text";
import { createYDoc, YCollabExtension } from "@lexical/y";
import { WebsocketProvider } from "@y/websocket";

import { env } from "@/lib/env/client";

export async function exportNote(
  noteId: string,
  format: "html" | "markdown",
): Promise<string> {
  const doc = createYDoc();
  const provider = new WebsocketProvider(
    env.NEXT_PUBLIC_COLLAB_WS_URL,
    `default/${noteId}`,
    doc,
  );

  await new Promise<void>((resolve) => {
    if (provider.synced) {
      resolve();
      return;
    }
    const timer = setTimeout(resolve, 2000);
    const onSync = (isSynced: boolean) => {
      if (isSynced) {
        clearTimeout(timer);
        provider.off("sync", onSync);
        resolve();
      }
    };
    provider.on("sync", onSync);
  });

  const exportExtension = defineExtension({
    name: "@baretext/export",
    dependencies: [
      RichTextExtension,
      CodePrismExtension,
      MdastExtension,
      MdastCommonMarkExtension,
      MdastGfmExtension,
      MdastHtmlExtension,
      configExtension(YCollabExtension, {
        doc,
        schemaVersion: 1,
        synced: true,
      }),
    ],
  });

  const editor = buildEditorFromExtensions(exportExtension);
  const { binding } = getExtensionDependencyFromEditor(
    editor,
    YCollabExtension,
  ).output;
  binding.initialize();

  const result = editor.read(() =>
    format === "html"
      ? $generateHtmlFromNodes(editor)
      : $convertToMarkdownString(),
  );

  provider.destroy();
  provider.awareness.destroy();
  doc.destroy();

  return result;
}
