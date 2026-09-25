"use client";

import { LocalStorageResumeStateProvider } from "@electric-sql/y-electric";
import { HorizontalRuleExtension } from "@lexical/extension";
import { CheckListExtension, ListExtension } from "@lexical/list";
import {
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastShortcutsExtension,
} from "@lexical/mdast";
import { LexicalCollaboration } from "@lexical/react/LexicalCollaborationContext";
import { CollaborationPluginV2__EXPERIMENTAL } from "@lexical/react/LexicalCollaborationPlugin";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";
import {
  $getRoot,
  COLLABORATION_TAG,
  defineExtension,
  HISTORIC_TAG,
} from "lexical";
import { useEffect, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import { Awareness } from "y-protocols/awareness";
import * as Y from "yjs";

import { useNotePacedMutations } from "@/collections/note";
import { ContentEditable } from "@/components/editor/plugins/content-editable";
import { editorTheme } from "@/components/editor/theme";
import { Spinner } from "@/components/ui/spinner";
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
  const awareness = new Awareness(doc);
  const resumeStateProvider = new LocalStorageResumeStateProvider(noteId);

  const [isSynced, setIsSynced] = useState(false);
  const mutateNotePaced = useNotePacedMutations();

  const electricProvider = createElectricProvider(
    doc,
    noteId,
    awareness,
    resumeStateProvider.load(),
  );
  const provider = createTrivialProvider(awareness, electricProvider);

  useEffect(() => {
    new IndexeddbPersistence(noteId, doc);
    const unsubscribeResumeState =
      resumeStateProvider.subscribeToResumeState(electricProvider);

    const onSynced = (synced: boolean) => {
      if (synced) {
        setIsSynced(true);
      }
    };

    electricProvider.on("synced", onSynced);
    if (electricProvider.synced) {
      setIsSynced(true);
    }

    return () => {
      electricProvider.off("synced", onSynced);
      unsubscribeResumeState();
      awareness.destroy();
      electricProvider.destroy();
      doc.destroy();
    };
  }, [electricProvider, resumeStateProvider, awareness, doc, noteId]);

  const previewSyncExtension = defineExtension({
    name: "baretext/note-preview-sync",
    register: (editor) => {
      return editor.registerUpdateListener(({ editorState, tags }) => {
        if (tags.has(COLLABORATION_TAG) || tags.has(HISTORIC_TAG)) {
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
      ListExtension,
      CheckListExtension,
      TableExtension,
      HorizontalRuleExtension,
      MdastExtension,
      MdastCommonMarkExtension,
      MdastGfmExtension,
      MdastShortcutsExtension,
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
          {!isSynced ? (
            <div className="flex flex-1 items-center justify-center">
              <Spinner className="size-8" />
            </div>
          ) : (
            <div className="relative min-w-0 flex-1 overflow-y-auto">
              <ContentEditable />
            </div>
          )}
        </EditorWrapper>
      </LexicalExtensionComposer>
    </LexicalCollaboration>
  );
}
