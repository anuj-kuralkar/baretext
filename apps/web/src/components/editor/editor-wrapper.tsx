"use client";

import { LocalStorageResumeStateProvider } from "@electric-sql/y-electric";
import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import { AutoFocusExtension } from "@lexical/extension";
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
import {
  $getRoot,
  COLLABORATION_TAG,
  defineExtension,
  HISTORY_MERGE_TAG,
} from "lexical";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";

import { useNotePacedMutations } from "@/collections/note";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";
import {
  createElectricProvider,
  createTrivialProvider,
} from "@/lib/electric-provider";

export function EditorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-lg border border-input dark:bg-input/30">
      {children}
    </div>
  );
}

export function Editor({ noteId }: { noteId: string }) {
  const [doc] = useState(() => new Y.Doc());
  const provider = createTrivialProvider();

  const mutateNotePaced = useNotePacedMutations();

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

  const previewSyncExtension = defineExtension({
    name: "baretext/note-preview-sync",
    register: (editor) => {
      return editor.registerUpdateListener(({ editorState, tags }) => {
        if (tags.has(HISTORY_MERGE_TAG) || tags.has(COLLABORATION_TAG)) {
          return;
        }
        editorState.read(() => {
          const text = $getRoot().getTextContent().slice(0, 500);
          mutateNotePaced({ id: noteId, text });
        });
      });
    },
  });

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
      previewSyncExtension,
    ],
    theme: editorTheme,
  });

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
          <div className="relative min-w-0 flex-1 overflow-y-auto">
            <ContentEditable />
          </div>
        </EditorWrapper>
      </LexicalExtensionComposer>
    </LexicalCollaboration>
  );
}
