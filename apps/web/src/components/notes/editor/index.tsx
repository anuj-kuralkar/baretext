"use client";

import { useDbClient } from "@tanstack/react-db";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Collaboration, { isChangeOrigin } from "@tiptap/extension-collaboration";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import typescript from "highlight.js/lib/languages/typescript";
import { createLowlight } from "lowlight";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { Spinner } from "@/components/ui/spinner";
import { createElectricProvider } from "../electric-provider";
import { updateNotePreview } from "./mutations";

const lowlight = createLowlight();
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("rust", rust);

const editorProps = {
  attributes: {
    class: "editor focus:outline-none",
  },
};

const baseExtensions = [
  StarterKit.configure({
    undoRedo: false,
    codeBlock: false,
  }),
  TaskList,
  TaskItem.configure({
    nested: true,
  }),
];

export function Editor({ noteId }: { noteId: string }) {
  // Stable per-component Y.Doc — created once, destroyed on unmount.
  // Must NOT be at module scope: each note needs its own CRDT state.
  const [doc] = useState(() => new Y.Doc());

  const [synced, setSynced] = useState(false);

  // Provider + awareness lifecycle: create in effect so the synced listener
  // is attached before ElectricProvider starts its internal sync loop.
  useEffect(() => {
    const { provider, awareness, unsubscribeResumeState } =
      createElectricProvider(doc, noteId);

    // ElectricProvider emits "synced" when the initial snapshot is applied.
    // Attach before any async work starts to avoid missing the event.
    provider.on("synced", (isSynced: boolean) => {
      if (isSynced) setSynced(true);
    });

    return () => {
      provider.destroy();
      awareness.destroy();
      unsubscribeResumeState();
    };
  }, [doc, noteId]);

  // Destroy the doc when the component unmounts (noteId key change triggers this).
  useEffect(() => {
    return () => {
      doc.destroy();
    };
  }, [doc]);

  const client = useDbClient();

  const mutate = (text: string) =>
    updateNotePreview({ id: noteId, text, client });

  const editor = useEditor({
    immediatelyRender: false,
    editorProps,
    extensions: [
      ...baseExtensions,
      Collaboration.configure({ document: doc }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    onUpdate: ({ editor, transaction }) => {
      // Skip updates applied from Yjs (initial snapshot, remote/local CRDT
      // sync). Mutating there would bump updatedAt on every note open.
      if (isChangeOrigin(transaction)) return;
      mutate(editor.getText());
    },
  });

  // Don't render until Yjs has applied the initial snapshot — avoids a
  // flash of empty content before remote state arrives.
  if (!editor || !synced)
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );

  return (
    <EditorContent
      editor={editor}
      className="mx-auto w-full max-w-[210mm] flex-1 overflow-y-auto p-4 focus:outline-none"
    />
  );
}
