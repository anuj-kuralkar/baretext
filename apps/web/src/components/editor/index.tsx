"use client";

import { LocalStorageResumeStateProvider } from "@electric-sql/y-electric";
import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import { CodePrismExtension } from "@lexical/code-prism";
import {
  AutoFocusExtension,
  configExtension,
  defineExtension,
} from "@lexical/extension";
import { HistoryExtension } from "@lexical/history";
import {
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastHtmlExtension,
  MdastShortcutsExtension,
} from "@lexical/mdast";
import { LexicalCollaboration } from "@lexical/react/LexicalCollaborationContext";
import { CollaborationPluginV2__EXPERIMENTAL } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { useEffect } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";

import { useNotePacedMutations } from "@/collections/note";
import { ContentEditable } from "@/components/editor/content-editable";
import { EditorWrapper } from "@/components/editor/editor-wrapper";
import { previewExtension } from "@/components/editor/extensions/preview-sync";
import { searchHighlightExtension } from "@/components/editor/extensions/search-highlight";
import { editorTheme } from "@/components/editor/theme";
import {
  createElectricProvider,
  createTrivialProvider,
} from "@/lib/electric-provider";

export function Editor({ noteId }: { noteId: string }) {
  const doc = new Y.Doc();
  const provider = createTrivialProvider();
  const mutateNotePaced = useNotePacedMutations();

  const app = defineExtension({
    name: "@baretext/editor",
    dependencies: [
      RichTextExtension,
      AutoFocusExtension,
      HistoryExtension,
      MdastExtension,
      MdastCommonMarkExtension,
      MdastGfmExtension,
      MdastShortcutsExtension,
      MdastHtmlExtension,
      ClipboardDOMImportExtension,
      searchHighlightExtension,
      CodePrismExtension,
      configExtension(previewExtension, {
        persist: (text) => {
          mutateNotePaced({ id: noteId, text });
        },
      }),
    ],
    theme: editorTheme,
  });

  useEffect(() => {
    new IndexeddbPersistence(noteId, doc);
    const awareness = new Awareness(doc);
    const resumeStateProvider = new LocalStorageResumeStateProvider(noteId);
    const electricProvider = createElectricProvider(
      doc,
      noteId,
      awareness,
      resumeStateProvider.load(),
    );
    const unsubscribeResumeState =
      resumeStateProvider.subscribeToResumeState(electricProvider);

    return () => {
      unsubscribeResumeState();
      awareness.destroy();
      electricProvider.destroy();
      doc.destroy();
    };
  }, [doc, noteId]);

  return (
    <LexicalCollaboration>
      <LexicalExtensionComposer extension={app} contentEditable={null}>
        <CollaborationPluginV2__EXPERIMENTAL
          id={noteId}
          doc={doc}
          provider={provider}
          __shouldBootstrapUnsafe={true}
        />
        <EditorWrapper>
          <div className="relative mx-auto w-full min-w-0 max-w-[210mm] flex-1 overflow-y-auto">
            <ContentEditable />
          </div>
        </EditorWrapper>
      </LexicalExtensionComposer>
    </LexicalCollaboration>
  );
}
