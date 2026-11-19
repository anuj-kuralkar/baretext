import { CodePrismExtension } from "@lexical/code-prism";
import { buildEditorFromExtensions } from "@lexical/extension";
import { $generateHtmlFromNodes } from "@lexical/html";
import {
  $convertToMarkdownString,
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastHtmlExtension,
} from "@lexical/mdast";
import { RichTextExtension } from "@lexical/rich-text";
import { createYBinding, createYDoc } from "@lexical/y";
import { loadYOffline, openYOfflineStore } from "@lexical/y/offline";
import { defineExtension } from "lexical";
import * as Y from "yjs";

import { NeonRealtimeProvider } from "@/lib/neon-realtime-provider";

const exportExtension = defineExtension({
  name: "@baretext/export",
  dependencies: [
    RichTextExtension,
    CodePrismExtension,
    MdastExtension,
    MdastCommonMarkExtension,
    MdastGfmExtension,
    MdastHtmlExtension,
  ],
});

export type ExportFormat = "html" | "markdown";

export async function exportNote(
  noteId: string,
  format: ExportFormat,
): Promise<string> {
  const doc = createYDoc();

  // 1. Try to load local offline state from @lexical/y/offline store
  if (typeof window !== "undefined" && window.indexedDB) {
    try {
      const opened = await openYOfflineStore({
        idb: {
          indexedDB: window.indexedDB,
          IDBKeyRange: window.IDBKeyRange,
        },
      });

      if (opened.ok) {
        const store = opened.value;
        const loadedRes = await loadYOffline({ store, key: noteId });
        if (loadedRes.ok && loadedRes.value?.state) {
          Y.applyUpdate(doc, loadedRes.value.state, "local");
        }
      }
    } catch (err) {
      console.warn("Failed to read offline state for export:", err);
    }
  }

  // 2. If online, fetch latest changes from Neon Realtime
  if (typeof navigator !== "undefined" && navigator.onLine) {
    const provider = new NeonRealtimeProvider({ doc, noteId });
    try {
      if (!provider.synced) {
        await new Promise<void>((resolve) => {
          const timeout = setTimeout(() => resolve(), 1500);
          provider.once("synced", () => {
            clearTimeout(timeout);
            resolve();
          });
        });
      }
    } finally {
      provider.destroy();
    }
  }

  // 3. Bind Yjs doc to headless Lexical editor
  const editor = buildEditorFromExtensions(exportExtension);
  const binding = createYBinding(editor, {
    doc,
    schemaVersion: 1,
    synced: true,
    onStatus: () => {},
  });

  // 4. Serialize
  const result = editor.read(() =>
    format === "html"
      ? $generateHtmlFromNodes(editor)
      : $convertToMarkdownString(),
  );

  binding.dispose();
  doc.destroy();

  return result;
}
