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
import { type ExportFormat, exportNote } from "@/lib/export";

export interface NoteContextMenuProps {
  children: ReactNode;
  noteId: string;
}

const EXPORT_FORMAT_META = {
  html: {
    label: "HTML",
    downloadMime: "text/html;charset=utf-8",
    extension: "html",
  },
  markdown: {
    label: "Markdown",
    downloadMime: "text/markdown;charset=utf-8",
    extension: "md",
  },
} as const satisfies Record<
  ExportFormat,
  { label: string; downloadMime: string; extension: string }
>;

/**
 * Copies the note to the clipboard in the requested format. The serialize
 * pass runs once, up front; HTML additionally carries a promoted text/html
 * blob. Both clipboard blobs are promised, since ClipboardItem materializes
 * them at write time.
 */
const handleCopy = async (noteId: string, format: ExportFormat) => {
  const { label } = EXPORT_FORMAT_META[format];
  try {
    const textPromise = exportNote(noteId, format);
    // ClipboardItem materializes the blobs at write time, so both promised
    // blobs share one serialize pass.
    const toBlob = async (type: string): Promise<Blob> =>
      new Blob([await textPromise], { type });

    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": toBlob("text/plain"),
        ...(format === "html" && { "text/html": toBlob("text/html") }),
      }),
    ]);

    toast.add({ type: "success", title: `Copied note as ${label}` });
  } catch {
    toast.add({ type: "error", title: `Failed to copy note as ${label}` });
  }
};

/** Downloads the serialized note as a temp-object-URL file; the URL is revoked a minute later. */
const handleDownload = async (noteId: string, format: ExportFormat) => {
  const meta = EXPORT_FORMAT_META[format];
  try {
    const text = await exportNote(noteId, format);
    const blob = new Blob([text], { type: meta.downloadMime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `note-${noteId}.${meta.extension}`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch {
    toast.add({
      type: "error",
      title: `Failed to download note as ${meta.label}`,
    });
  }
};

/** Wraps a note preview in the copy/download/delete context menu. */
export function NoteContextMenu({ children, noteId }: NoteContextMenuProps) {
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
            <ContextMenuItem onClick={() => handleCopy(noteId, "html")}>
              <FileCode />
              As HTML
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleCopy(noteId, "markdown")}>
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
            <ContextMenuItem onClick={() => handleDownload(noteId, "html")}>
              <FileCode />
              As HTML
            </ContextMenuItem>
            <ContextMenuItem onClick={() => handleDownload(noteId, "markdown")}>
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
