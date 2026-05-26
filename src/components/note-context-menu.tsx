"use client";

import { DownloadTrigger } from "@ark-ui/react/download-trigger";
import { buildEditorFromExtensions } from "@lexical/extension";
import { $generateHtmlFromNodes } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { ClipboardIcon, DownloadIcon, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { startTransition } from "react";

import * as Menu from "@/components/ui/menu";
import { toaster } from "@/components/ui/toast";
import { extensionsList } from "@/module/editor/extensions-list";
import { deleteNoteAction } from "@/module/note/actions";
import type { Note } from "@/module/note/types";
import { getFirstTwoTextNodesText } from "@/module/note/utils";

export function NoteContextMenu({
  note,
  children,
}: {
  note: Note;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { noteId } = useParams<{ noteId: string }>();

  const getEditor = () => {
    const editor = buildEditorFromExtensions(...extensionsList);
    editor.setEditorState(editor.parseEditorState(note.content));
    return editor;
  };

  const getMarkdown = () => {
    const editor = getEditor();
    return editor.read(() => $convertToMarkdownString(TRANSFORMERS));
  };

  const getHtml = () => {
    const editor = getEditor();
    return editor.read(() => $generateHtmlFromNodes(editor));
  };

  const handleDelete = () => {
    startTransition(async () => {
      const { error } = await deleteNoteAction(note.id);
      if (error) {
        toaster.error({ title: "Could not delete note", description: error });
        return;
      }
      // If the user is viewing the deleted note, navigate away
      if (noteId && decodeURIComponent(noteId) === note.id) {
        router.push("/notes");
      }
    });
  };

  const fileName = getFirstTwoTextNodesText(note.content)[0] ?? "untitled";

  return (
    <Menu.Root
      onSelect={(details) => {
        if (details.value === "delete") {
          handleDelete();
        }
      }}
    >
      <Menu.ContextTrigger asChild>{children}</Menu.ContextTrigger>
      <Menu.Positioner>
        <Menu.Content>
          {/* Download submenu */}
          <Menu.Root>
            <Menu.TriggerItem>
              <DownloadIcon />
              <Menu.ItemText>Download</Menu.ItemText>
            </Menu.TriggerItem>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item asChild value="download-markdown">
                  <DownloadTrigger
                    className="w-full"
                    data={getMarkdown}
                    fileName={`${fileName}.md`}
                    mimeType="text/markdown"
                  >
                    <Menu.ItemText>Markdown</Menu.ItemText>
                  </DownloadTrigger>
                </Menu.Item>
                <Menu.Item asChild value="download-html">
                  <DownloadTrigger
                    className="w-full"
                    data={getHtml}
                    fileName={`${fileName}.html`}
                    mimeType="text/html"
                  >
                    <Menu.ItemText>HTML</Menu.ItemText>
                  </DownloadTrigger>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          {/* Copy submenu */}
          <Menu.Root
            onSelect={(details) => {
              if (details.value === "copy-markdown")
                navigator.clipboard.writeText(getMarkdown());
              if (details.value === "copy-html")
                navigator.clipboard.writeText(getHtml());
            }}
          >
            <Menu.TriggerItem>
              <ClipboardIcon />
              <Menu.ItemText>Copy</Menu.ItemText>
            </Menu.TriggerItem>
            <Menu.Positioner>
              <Menu.Content>
                <Menu.Item value="copy-markdown">
                  <Menu.ItemText>Markdown</Menu.ItemText>
                </Menu.Item>
                <Menu.Item value="copy-html">
                  <Menu.ItemText>HTML</Menu.ItemText>
                </Menu.Item>
              </Menu.Content>
            </Menu.Positioner>
          </Menu.Root>

          <Menu.Separator />

          <Menu.Item tone="critical" value="delete">
            <Trash2 />
            <Menu.ItemText>Delete</Menu.ItemText>
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Menu.Root>
  );
}
