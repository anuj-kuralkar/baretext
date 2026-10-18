import { SettingsIcon } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { buttonVariants } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";
import { UserCard, UserCardSkeleton } from "@/components/user/user-card";

export function AppSidebarFooter() {
  return (
    <SidebarFooter className="flex-row items-center justify-between">
      <Suspense fallback={<UserCardSkeleton />}>
        <UserCard />
      </Suspense>
      <Link
        href="/settings/profile"
        className={buttonVariants({ size: "icon-sm", variant: "outline" })}
      >
        <SettingsIcon />
      </Link>
    </SidebarFooter>
  );
}
