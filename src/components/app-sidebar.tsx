import Image from "next/image";
import Link from "next/link";
import { Person } from "react-bootstrap-icons";

import { FileTree } from "@/components/file-tree";
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
import { getUser } from "@/lib/auth";

export async function AppSidebar() {
  const { user } = await getUser();
  const { name, email, avatar } = user?.user_metadata ?? {};

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
        <FileTree />
      </SidebarGroup>

      <SidebarFooter>
        <Button asChild className="w-full h-12" size="lg" variant="ghost">
          <Link
            className="flex items-center gap-2 px-1 py-1.5 text-left text-sm"
            href="/settings"
          >
            <AvatarRoot className="h-8 w-8 rounded-lg">
              <AvatarImage alt={name} src={avatar} />
              <AvatarFallback className="rounded-lg">
                <Person />
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
