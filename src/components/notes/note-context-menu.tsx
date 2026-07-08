import { Copy, Download, FileCode, FileText, Trash2 } from "lucide-react";
import type { ReactNode } from "react";
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

export interface NoteContextMenuProps {
  children: ReactNode;
  noteId: string;
}

export function NoteContextMenu({ children, noteId }: NoteContextMenuProps) {
  return (
    <ContextMenu>
      <ContextMenuTrigger className="block h-full w-full">
        {children}
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Copy className="mr-2 h-4 w-4" />
            Copy
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem onClick={() => console.log("Copy HTML", noteId)}>
              <FileCode className="mr-2 h-4 w-4" />
              As HTML
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => console.log("Copy Markdown", noteId)}
            >
              <FileText className="mr-2 h-4 w-4" />
              As Markdown
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <Download className="mr-2 h-4 w-4" />
            Download
          </ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem
              onClick={() => console.log("Download HTML", noteId)}
            >
              <FileCode className="mr-2 h-4 w-4" />
              As HTML
            </ContextMenuItem>
            <ContextMenuItem
              onClick={() => console.log("Download Markdown", noteId)}
            >
              <FileText className="mr-2 h-4 w-4" />
              As Markdown
            </ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>

        <ContextMenuSeparator />

        <ContextMenuItem
          variant="destructive"
          onClick={() => console.log("Delete", noteId)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
