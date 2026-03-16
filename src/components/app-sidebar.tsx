import { CircleUserRoundIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { CreateNoteButton } from "@/components/create-note-button";
import { NoteList } from "@/components/note-list";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { listNotes } from "@/module/note/dal";

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { name, email, image, id } = session?.user ?? {};
  const notes = id ? await listNotes({ userId: id }) : [];

  return (
    <>
      <SidebarHeader>
        <Button asChild className="w-full h-12" size="lg" variant="ghost">
          <Link className="flex items-center gap-2" href="/">
            <Image alt="Baretext" height={32} src="/baretext.svg" width={32} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Baretext</span>
            </div>
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarGroup>
        <div className="flex bg-muted rounded items-center justify-between py-2 px-4 mb-2">
          <div className="flex-1">Notes</div>
          <CreateNoteButton />
        </div>
        <NoteList notes={notes} />
      </SidebarGroup>

      <SidebarFooter>
        <Button asChild className="w-full h-12" size="lg" variant="ghost">
          <Link
            className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
            href="/settings"
          >
            <AvatarRoot className="h-8 w-8 rounded-lg">
              <AvatarImage alt={name} src={image ?? ""} />
              <AvatarFallback className="rounded-lg">
                <CircleUserRoundIcon />
              </AvatarFallback>
            </AvatarRoot>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{name}</span>
              <span className="truncate text-xs">{email}</span>
            </div>
          </Link>
        </Button>
      </SidebarFooter>
    </>
  );
}
