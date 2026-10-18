"use client";

import { ShieldIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
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

export function SettingsSidebarNav() {
  const { setOpenMobile } = useSidebar();

  return (
    <SidebarMenu className="flex flex-col *:justify-start">
      {sidebarNavItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link
            href={item.href}
            className={buttonVariants({
              variant: "ghost",
              size: "lg",
              className: "w-full justify-start",
            })}
            onClick={() => setOpenMobile(false)}
          >
            <item.icon />
            {item.title}
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
