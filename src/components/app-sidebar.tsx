import Image from "next/image";
import Link from "next/link";
import type * as React from "react";
import { Person } from "react-bootstrap-icons";

import { FileTree } from "@/components/file-tree";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <Image
                  alt="LintNote"
                  height={32}
                  src="/lintnote.svg"
                  width={32}
                />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">LintNote</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <FileTree />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
          <AvatarRoot className="h-8 w-8 rounded-lg">
            <AvatarImage
              alt={user?.user_metadata.name}
              src={user?.user_metadata.avatar}
            />
            <AvatarFallback className="rounded-lg">
              <Person />
            </AvatarFallback>
          </AvatarRoot>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-medium">
              {user?.user_metadata.name}
            </span>
            <span className="truncate text-xs">
              {user?.user_metadata.email}
            </span>
          </div>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
