import { BrandLink } from "@/components/brand-link";
import { AppSidebarFooter } from "@/components/layout/app-sidebar-footer";
import { SettingsSidebarNav } from "@/components/layout/settings-sidebar-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

export function SettingsSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="flex-row items-center justify-between">
        <BrandLink />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SettingsSidebarNav />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <AppSidebarFooter />
    </Sidebar>
  );
}
