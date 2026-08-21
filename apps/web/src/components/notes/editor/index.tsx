"use client";

import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import Collaboration from "@tiptap/extension-collaboration";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import typescript from "highlight.js/lib/languages/typescript";
import { createLowlight } from "lowlight";
import { useEffect } from "react";
import * as Y from "yjs";
import { createElectricProvider } from "../electric-provider";
import { updateNotePreview } from "./mutations";

const lowlight = createLowlight();
lowlight.register("typescript", typescript);
lowlight.register("python", python);
lowlight.register("rust", rust);

export const doc = new Y.Doc();

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
  useEffect(() => {
    const provider = createElectricProvider(doc, noteId);
    return () => provider.destroy();
  }, [noteId]);

  const mutate = (text: string) => updateNotePreview({ id: noteId, text });

  const editor = useEditor({
    immediatelyRender: false,
    editorProps,
    extensions: [
      ...baseExtensions,
      Collaboration.configure({
        document: doc,
      }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    onUpdate: ({ editor }) => {
      mutate(editor.getText());
    },
  });

  if (!editor) return null;

  return (
    <EditorContent
      editor={editor}
      className="flex-1 overflow-y-auto focus:outline-none md:p-8 xl:p-12"
    />
  );
}
