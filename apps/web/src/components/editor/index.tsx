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
  YCollabExtension,
  yCollab,
} from "@lexical/y";
import {
  attachYOfflineSession,
  loadYOffline,
  openYOfflineStore,
  type YOfflineBinding,
} from "@lexical/y/offline";
import { Awareness } from "@y/protocols/awareness";
import { type RefObject, useEffect, useRef, useState } from "react";

import { useNotePacedMutations } from "@/collections/note";
import { CollaborativeCursors } from "@/components/editor/collaborative-cursors";
import { ContentEditable } from "@/components/editor/content-editable";
import { EditorWrapper } from "@/components/editor/editor-wrapper";
import { textContentExtension } from "@/components/editor/extensions/text-content";
import { setupEditorCollabSync } from "@/components/editor/sync-lifecycle";
import { editorTheme } from "@/components/editor/theme";
import { NeonRealtimeProvider } from "@/lib/neon-realtime-provider";

function CollabBridge({
  provider,
  containerRef,
  onBindingReady,
}: {
  readonly provider: NeonRealtimeProvider;
  readonly containerRef: RefObject<HTMLElement | null>;
  readonly onBindingReady: (binding: YBinding, collab: unknown) => void;
}) {
  const [editor] = useLexicalComposerContext();
  const [binding, setBinding] = useState<YBinding | null>(null);

  useEffect(() => {
    try {
      const output = getExtensionDependencyFromEditor(
        editor,
        YCollabExtension,
      ).output;
      if (output?.binding) {
        setBinding(output.binding);
        onBindingReady(output.binding, output.collab);
      }
    } catch (e) {
      console.error("Failed to extract YCollabExtension output:", e);
    }
  }, [editor, onBindingReady]);

  return (
    <CollaborativeCursors
      provider={provider}
      binding={binding}
      containerRef={containerRef}
    />
  );
}

export function Editor({ noteId }: { readonly noteId: string }) {
  const [doc] = useState(() => createYDoc());
  const [awareness] = useState(() => new Awareness(doc));
  const [provider] = useState(
    () => new NeonRealtimeProvider({ doc, noteId, awareness }),
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const mutateNotePaced = useNotePacedMutations();

  const app = defineExtension({
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
        persist: (text) => {
          mutateNotePaced({ id: noteId, text });
        },
      }),
    ],
    theme: editorTheme,
  });

  const handleBindingReady = (
    _binding: YBinding,
    collab: { markSynced?: () => void } | unknown,
  ) => {
    // Ensures editor unlocks on provider sync, disconnection (offline editing), or safety timeout
    const cleanupSync = setupEditorCollabSync({
      provider,
      collab,
      timeoutMs: 5000,
    });

    // Initialize offline persistence with @lexical/y/offline
    if (typeof window !== "undefined" && window.indexedDB) {
      openYOfflineStore({
        idb: {
          indexedDB: window.indexedDB,
          IDBKeyRange: window.IDBKeyRange,
        },
      })
        .then(async (opened) => {
          if (!opened.ok) return;
          const store = opened.value;
          const loadedRes = await loadYOffline({ store, key: noteId });
          const loaded = loadedRes.ok ? loadedRes.value : null;

          attachYOfflineSession({
            binding: collab as unknown as YOfflineBinding,
            key: noteId,
            epoch: loaded?.epoch ?? null,
            loaded,
            offline: { stage: "replay", store, persist: "document" },
            onError: (err) => console.error("Offline store error:", err),
            stopSync: () => provider.destroy(),
          });
        })
        .catch((err) => {
          console.warn("Failed to attach offline session:", err);
        });
    }

    return () => {
      cleanupSync();
    };
  };

  useEffect(() => {
    return () => {
      awareness.destroy();
      provider.destroy();
      doc.destroy();
    };
  }, [doc, awareness, provider]);

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <EditorWrapper>
        <div
          ref={containerRef}
          className="relative mx-auto w-full max-w-[210mm] min-w-0 flex-1 overflow-y-auto"
        >
          <ContentEditable />
          <CollabBridge
            provider={provider}
            containerRef={containerRef}
            onBindingReady={handleBindingReady}
          />
        </div>
      </EditorWrapper>
    </LexicalExtensionComposer>
  );
}
