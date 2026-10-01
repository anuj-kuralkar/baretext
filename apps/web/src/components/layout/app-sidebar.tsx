"use client";
import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense } from "react";
import { BrandLink } from "@/components/brand-link";
import { NoteList, NoteListSkeleton } from "@/components/notes/note-list";
import { NoteListActions } from "@/components/notes/note-list-actions";
import { SearchInput } from "@/components/notes/search-input";
import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
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

      <div className="px-2 pb-2">
        <SearchInput />
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Suspense fallback={<NoteListSkeleton />}>
              <NoteList active={noteId} />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="flex-row items-center justify-between">
        <UserCard image={user?.image ?? undefined} name={user?.name} />
        <Link
          href="/settings/profile"
          className={buttonVariants({ size: "icon-sm", variant: "outline" })}
        >
          <SettingsIcon />
        </Link>
      </SidebarFooter>
    </Sidebar>
  );
}
