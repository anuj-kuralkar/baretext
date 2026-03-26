import { PanelLeftIcon } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarPanel,
  SidebarResizeTrigger,
  SidebarRoot,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function Page({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarRoot>
      <SidebarPanel>
        <AppSidebar />
      </SidebarPanel>
      <SidebarResizeTrigger />
      <SidebarInset>
        <div className="flex h-dvh min-h-0 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1">
              <PanelLeftIcon className="size-4" />
            </SidebarTrigger>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto">{children}</main>
        </div>
      </SidebarInset>
    </SidebarRoot>
  );
}
