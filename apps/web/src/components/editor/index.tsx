"use client";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import { CodePrismExtension } from "@lexical/code-prism";
import {
  AutoFocusExtension,
  configExtension,
  defineExtension,
  getExtensionDependencyFromEditor,
} from "@lexical/extension";
import {
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
  MdastHtmlExtension,
  MdastShortcutsExtension,
} from "@lexical/mdast";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import { RichTextExtension } from "@lexical/rich-text";
import {
  createYDoc,
  type YBinding,
  type YCollabBinding,
  YCollabExtension,
  yCollab,
} from "@lexical/y";
import {
  attachYOfflineSession,
  loadYOffline,
  openYOfflineStore,
  type YOfflineSession,
} from "@lexical/y/offline";
import { Awareness } from "@y/protocols/awareness";
import { type RefObject, useEffect, useRef, useState } from "react";
import * as Y from "yjs";

import { useNotePacedMutations } from "@/collections/note";
import { CollaborativeCursors } from "@/components/editor/collaborative-cursors";
import { ContentEditable } from "@/components/editor/content-editable";
import { EditorWrapper } from "@/components/editor/editor-wrapper";
import { textContentExtension } from "@/components/editor/extensions/text-content";
import { setupEditorCollabSync } from "@/components/editor/sync-lifecycle";
import { editorTheme } from "@/components/editor/theme";
import { NeonRealtimeProvider } from "@/lib/neon-realtime-provider";

// The backend stores one append-only Yjs document per note. It has no room
// generations, so the note's document never moves to another epoch.
const OFFLINE_EPOCH = "1";

export function Editor({ noteId }: { readonly noteId: string }) {
  // The document outlives every effect: React Strict Mode (and route
  // keep-alive) runs effects twice, and destroying the doc in a cleanup
  // leaves the editor bound to a dead document after the second run.
  const [doc] = useState(() => createYDoc());

  const mutateNotePaced = useNotePacedMutations();
  const persistRef = useRef(mutateNotePaced);
  useEffect(() => {
    persistRef.current = mutateNotePaced;
  }, [mutateNotePaced]);

  // Stable extension: a new one on every render makes the composer rebuild
  // the editor (and its collaboration binding) each time.
  const [extension] = useState(() =>
    defineExtension({
      name: "@baretext/editor",
      dependencies: [
        RichTextExtension,
        AutoFocusExtension,
        MdastExtension,
        MdastCommonMarkExtension,
        MdastGfmExtension,
        MdastShortcutsExtension,
        MdastHtmlExtension,
        ClipboardDOMImportExtension,
        CodePrismExtension,
        yCollab({
          doc,
          schemaVersion: 1,
          synced: false,
          onStatus: () => {},
        }),
        configExtension(textContentExtension, {
          persist: (text: string) => {
            persistRef.current({ id: noteId, text });
          },
        }),
      ],
      theme: editorTheme,
    }),
  );

  return (
    <LexicalExtensionComposer extension={extension} contentEditable={null}>
      <EditorWorkspace noteId={noteId} doc={doc} />
    </LexicalExtensionComposer>
  );
}

interface LiveSync {
  readonly provider: NeonRealtimeProvider;
  readonly awareness: Awareness;
}

function EditorWorkspace({
  noteId,
  doc,
}: {
  readonly noteId: string;
  readonly doc: Y.Doc;
}) {
  const [editor] = useLexicalComposerContext();
  const containerRef = useRef<HTMLDivElement>(null);
  const [binding, setBinding] = useState<YBinding | null>(null);
  const [sync, setSync] = useState<LiveSync | null>(null);

  useEffect(() => {
    const output = getExtensionDependencyFromEditor(
      editor,
      YCollabExtension,
    ).output;
    if (!output?.binding) return;

    const awareness = new Awareness(doc);
    const provider = new NeonRealtimeProvider({ doc, noteId, awareness });
    const collab = output.collab as YCollabBinding | undefined;

    setBinding(output.binding);
    setSync({ provider, awareness });

    const cleanupSync = setupEditorCollabSync({
      provider,
      collab,
      timeoutMs: 5000,
    });

    let cancelled = false;
    let offlineSession: YOfflineSession | null = null;
    let unsubscribeSynced: (() => void) | null = null;

    void (async () => {
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
            const loadedResult = await loadYOffline({ store, key: noteId });
            if (cancelled) return;
            const loaded = loadedResult.ok ? loadedResult.value : null;

            // Show the locally stored document immediately. Applying it
            // before connecting also lets the provider diff it against what
            // the server has, so only genuinely unsynced edits are sent.
            if (loaded?.state) {
              try {
                Y.applyUpdate(doc, loaded.state, "offline");
              } catch (error) {
                console.warn("Failed to apply stored Yjs state:", error);
              }
            }

            const storedEpoch = loaded?.epoch ?? null;
            offlineSession = attachYOfflineSession({
              binding: collab as YCollabBinding,
              key: noteId,
              epoch: storedEpoch,
              loaded,
              offline: { stage: "replay", store, persist: "document" },
              onError: (error) => {
                console.error("Offline Yjs store error:", error);
              },
              stopSync: () => provider.destroy(),
              writeDelay: 250,
            });

            const verdict = await offlineSession.serverEpoch(
              storedEpoch ?? OFFLINE_EPOCH,
            );
            if (!cancelled && verdict.kind === "same") {
              if (provider.synced) {
                verdict.markSynced();
              } else {
                unsubscribeSynced = provider.on("synced", (synced) => {
                  if (synced) verdict.markSynced();
                });
              }
            }
          }
        } catch (error) {
          console.warn("Failed to attach the offline Yjs store:", error);
        }
      }

      if (cancelled) return;
      await provider.connect();
    })().catch((error) => {
      if (!cancelled) {
        console.error("Failed to connect the collaborative editor:", error);
      }
    });

    return () => {
      cancelled = true;
      unsubscribeSynced?.();
      cleanupSync();
      offlineSession?.dispose();
      provider.destroy();
      awareness.destroy();
    };
  }, [editor, doc, noteId]);

  return (
    <EditorWrapper>
      <div
        ref={containerRef}
        className="relative mx-auto w-full max-w-[210mm] min-w-0 flex-1 overflow-y-auto"
      >
        <ContentEditable />
        {sync ? (
          <CollaborativeCursors
            provider={sync.provider}
            binding={binding}
            containerRef={containerRef as RefObject<HTMLElement | null>}
          />
        ) : null}
      </div>
    </EditorWrapper>
  );
}
