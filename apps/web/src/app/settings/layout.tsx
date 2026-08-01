import { SettingsIcon, ShieldIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { BrandLink } from "@/components/brand-link";
import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserCard } from "@/components/user/user-card";
import { requireSession } from "@/lib/session";

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
    icon: UserIcon,
  },
  {
    title: "Account",
    href: "/settings/account",
    icon: ShieldIcon,
  },
];

export default async function NotesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const user = session.user;
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex-row items-center justify-between">
          <BrandLink />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu className="flex flex-col *:justify-start">
                {sidebarNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <Link
                      href={item.href}
                      className={buttonVariants({
                        variant: "ghost",
                        className: "w-full justify-start",
                      })}
                    >
                      <item.icon />
                      {item.title}
                    </Link>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
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
      <SidebarInset className="relative flex w-full min-w-0 flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 bg-background px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
