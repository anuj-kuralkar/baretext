"use client";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

const NoteList = dynamic(
  () => import("@/components/notes/note-list").then((mod) => mod.NoteList),
  { ssr: false },
);

const NoteListActions = dynamic(
  () =>
    import("@/components/notes/note-list-actions").then(
      (mod) => mod.NoteListActions,
    ),
  { ssr: false },
);

import { Settings } from "lucide-react";
import Link from "next/link";
import { BrandLink } from "@/components/brand-link";
import { buttonVariants } from "@/components/ui/button";
import { UserCard } from "@/components/user/user-card";
import { authClient } from "@/lib/auth/client";

export function AppSidebar() {
  const { noteId } = useParams<{ noteId: string }>();
  const { data: session } = authClient.useSession();
  const user = session?.user;

  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center justify-between">
        <BrandLink />
        <NoteListActions />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <NoteList active={noteId} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex-row items-center justify-between">
        <UserCard image={user?.image ?? undefined} name={user?.name} />
        <Link
          href="/settings/profile"
          className={buttonVariants({ size: "icon-sm", variant: "outline" })}
        >
          <Settings />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
