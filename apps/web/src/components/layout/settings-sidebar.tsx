import { ShieldIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { BrandLink } from "@/components/brand-link";
import { AppSidebarFooter } from "@/components/layout/app-sidebar-footer";
import { buttonVariants } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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

export function SettingsSidebar() {
  return (
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

      <AppSidebarFooter />
    </Sidebar>
  );
}
