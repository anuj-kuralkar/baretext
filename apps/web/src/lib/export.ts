import { LocalStorageResumeStateProvider } from "@electric-sql/y-electric";
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
import {
  createBindingV2__EXPERIMENTAL,
  syncYjsStateToLexicalV2__EXPERIMENTAL,
} from "@lexical/yjs";
import { defineExtension } from "lexical";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";
import {
  createElectricProvider,
  createTrivialProvider,
} from "@/lib/electric-provider";

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

export async function exportNote(
  noteId: string,
  format: "html" | "markdown",
): Promise<string> {
  const doc = new Y.Doc();

  // 1. Load local offline state (using y-indexeddb built-in promise)
  const persistence = new IndexeddbPersistence(noteId, doc);
  await Promise.race([
    persistence.whenSynced,
    new Promise((r) => setTimeout(r, 2000)),
  ]);

  // 2. If online, fetch changes from other devices
  if (typeof navigator !== "undefined" && navigator.onLine) {
    const resumeProvider = new LocalStorageResumeStateProvider(noteId);
    const awareness = new Awareness(doc);
    const electric = createElectricProvider(
      doc,
      noteId,
      awareness,
      resumeProvider.load(),
    );
    const unsubscribeResume = resumeProvider.subscribeToResumeState(electric);

    try {
      if (!electric.synced) {
        await new Promise((r) => {
          electric.once("synced", r);
          setTimeout(r, 1500);
        });
      }
    } finally {
      unsubscribeResume();
      electric.destroy();
      awareness.destroy();
    }
  }

  // 3. Bind and sync to headless editor
  const editor = buildEditorFromExtensions(exportExtension);
  syncYjsStateToLexicalV2__EXPERIMENTAL(
    createBindingV2__EXPERIMENTAL(editor, noteId, doc, new Map()),
    createTrivialProvider(),
  );

  // 4. Serialize
  const result = editor.read(() =>
    format === "html"
      ? $generateHtmlFromNodes(editor)
      : $convertToMarkdownString(),
  );

  persistence.destroy();
  doc.destroy();

  return result;
}
