import { LayoutSidebar } from "react-bootstrap-icons";

import { AppSidebar } from "@/components/app-sidebar";
import { Editor } from "@/components/editor/editor";
import {
  SidebarContent,
  SidebarInset,
  SidebarResizeTrigger,
  SidebarRoot,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function Page() {
  return (
    <SidebarRoot>
      <SidebarContent>
        <AppSidebar />
      </SidebarContent>
      <SidebarResizeTrigger />
      <SidebarInset>
        <div className="flex h-dvh min-h-0 flex-col">
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1">
              <LayoutSidebar className="size-4" />
            </SidebarTrigger>
          </header>

          <main className="flex-1 min-h-0 overflow-y-auto">
            <Editor />
          </main>
        </div>
      </SidebarInset>
    </SidebarRoot>
  );
}
