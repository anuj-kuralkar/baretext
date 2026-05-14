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
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarPanel,
} from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { listNotesAction } from "@/module/note/actions";

export async function AppSidebar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const { name, email, image } = session?.user ?? {};
  const { data: notes } = await listNotesAction();

  return (
    <SidebarPanel>
      <SidebarHeader>
        <Button asChild className="h-12 w-full" size="lg" variant="ghost">
          <Link className="flex items-center gap-2" href="/">
            <Image alt="Baretext" height={32} src="/baretext.svg" width={32} />
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">Baretext</span>
            </div>
          </Link>
        </Button>
      </SidebarHeader>

      <SidebarContent>
        <div className="mb-2 flex items-center justify-between rounded bg-muted px-4 py-2">
          <div className="flex-1">Notes</div>
          <CreateNoteButton />
        </div>
        <NoteList notes={notes ?? []} />
      </SidebarContent>

      <SidebarFooter>
        <Button asChild className="h-12 w-full" size="lg" variant="ghost">
          <Link
            className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
            href="/"
          >
            <AvatarRoot className="h-8 w-8 rounded-lg">
              <AvatarImage alt={name} src={image ?? undefined} />
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
    </SidebarPanel>
  );
}
