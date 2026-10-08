import { Copy, Download, FileCode, FileText, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
import { NoteDeleteTrigger } from "@/components/notes/note-delete-trigger";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { toast } from "@/components/ui/toast";
import { exportNote } from "@/lib/export";

export interface NoteContextMenuProps {
  children: ReactNode;
  noteId: string;
}

export function NoteContextMenu({ children, noteId }: NoteContextMenuProps) {
  const handleCopy = async (format: "html" | "markdown") => {
    const label = format === "html" ? "HTML" : "Markdown";
    try {
      const textPromise = exportNote(noteId, format);
      const blob = (type: string) =>
        textPromise.then((text) => new Blob([text], { type }));

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/plain": blob("text/plain"),
          ...(format === "html" && { "text/html": blob("text/html") }),
        }),
      ]);

      toast.add({ type: "success", title: `Copied note as ${label}` });
    } catch {
      toast.add({ type: "error", title: `Failed to copy note as ${label}` });
    }
  };

  const handleDownload = async (format: "html" | "markdown") => {
    const label = format === "html" ? "HTML" : "Markdown";
    try {
      const text = await exportNote(noteId, format);
      const ext = format === "html" ? "html" : "md";
      const blob = new Blob([text], {
        type:
          format === "html"
            ? "text/html;charset=utf-8"
            : "text/markdown;charset=utf-8",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `note-${noteId}.${ext}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch {
      toast.add({
        type: "error",
        title: `Failed to download note as ${label}`,
      });
    }
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger className="block h-full w-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Copy />
            Copy
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleCopy("html")}>
              <FileCode />
              As HTML
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleCopy("markdown")}>
              <FileText />
              As Markdown
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Download />
            Download
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => handleDownload("html")}>
              <FileCode />
              As HTML
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleDownload("markdown")}>
              <FileText />
              As Markdown
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />
        <NoteDeleteTrigger
          noteId={noteId}
          render={<ContextMenuItem variant="destructive" />}
        >
          <Trash2 />
          Delete
        </NoteDeleteTrigger>
      </ContextMenuContent>
    </ContextMenu>
  );
}
