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
import { createYDoc, YCollabExtension, type YDoc } from "@lexical/y";
import { WebsocketProvider } from "@y/websocket";
import { useEffect, useRef } from "react";

import { useNotePacedMutations } from "@/collections/note";
import { ContentEditable } from "@/components/editor/content-editable";
import { EditorWrapper } from "@/components/editor/editor-wrapper";
import { textContentExtension } from "@/components/editor/extensions/text-content";
import { editorTheme } from "@/components/editor/theme";
import { env } from "@/lib/env/client";

function CollabSync({ doc, noteId }: { doc: YDoc; noteId: string }) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const wsUrl = env.NEXT_PUBLIC_COLLAB_WS_URL;
    const provider = new WebsocketProvider(wsUrl, `default/${noteId}`, doc);

    const { binding } = getExtensionDependencyFromEditor(
      editor,
      YCollabExtension,
    ).output;

    provider.once("sync", () => {
      binding.initialize();
    });

    // Share this client's selection via awareness as documented in Lexical y.md
    const unregisterListener = editor.registerUpdateListener(() => {
      provider.awareness.setLocalStateField("cursor", binding.getCursor());
    });

    return () => {
      unregisterListener();
      provider.destroy();
      provider.awareness.destroy();
    };
  }, [doc, editor, noteId]);

  return null;
}

export function Editor({ noteId }: { noteId: string }) {
  const docRef = useRef<YDoc | null>(null);
  if (!docRef.current) {
    docRef.current = createYDoc();
  }
  const doc = docRef.current;
  const mutateNotePaced = useNotePacedMutations();

  useEffect(() => {
    return () => {
      doc.destroy();
    };
  }, [doc]);

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
      configExtension(YCollabExtension, {
        doc,
        schemaVersion: 1,
      }),
      configExtension(textContentExtension, {
        persist: (text) => {
          mutateNotePaced({ id: noteId, text });
        },
      }),
    ],
    theme: editorTheme,
  });

  return (
    <LexicalExtensionComposer extension={app} contentEditable={null}>
      <CollabSync doc={doc} noteId={noteId} />
      <EditorWrapper>
        <div className="relative mx-auto w-full min-w-0 max-w-[210mm] flex-1 overflow-y-auto">
          <ContentEditable />
        </div>
      </EditorWrapper>
    </LexicalExtensionComposer>
  );
}
