import { Suspense } from "react";
import { BrandLink } from "@/components/brand-link";
import { AppSidebarFooter } from "@/components/layout/app-sidebar-footer";
import { NoteList, NoteListSkeleton } from "@/components/notes/note-list";
import { NoteListActions } from "@/components/notes/note-list-actions";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center justify-between">
        <BrandLink />
        <NoteListActions />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Suspense fallback={<NoteListSkeleton />}>
              <NoteList />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  );
}
