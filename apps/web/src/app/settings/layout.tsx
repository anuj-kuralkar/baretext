import { SettingsSidebar } from "@/components/layout/settings-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <SettingsSidebar />
      <SidebarInset className="relative flex w-full min-w-0 flex-col bg-background">
        <header className="flex h-14 shrink-0 items-center gap-2 bg-background px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
