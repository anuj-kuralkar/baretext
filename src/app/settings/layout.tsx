import { PanelLeftIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { BrandLink } from "@/components/brand-link";
import { Button } from "@/components/ui/button";
import * as Sidebar from "@/components/ui/sidebar";
import { UserSettingsLink } from "@/components/user-settings-link";
import { requireSession } from "@/lib/session";

export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  const user = session.user;

  return (
    <Sidebar.Root>
      <Sidebar.Panel>
        <Sidebar.Header className="items-start">
          <BrandLink />
        </Sidebar.Header>

        <Sidebar.Content>
          <div className="p-2">
            <Button asChild className="w-full justify-start" variant="ghost">
              <Link href="/settings/profile">
                <UserIcon /> Profile
              </Link>
            </Button>
          </div>
        </Sidebar.Content>

        <Sidebar.Footer>
          <UserSettingsLink image={user.image} name={user.name ?? ""} />
        </Sidebar.Footer>
      </Sidebar.Panel>

      <Sidebar.ResizeTrigger />
      <Sidebar.Inset>
        <div className="flex h-dvh min-h-0 flex-col">
          <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
            <Sidebar.Trigger className="-ml-1">
              <PanelLeftIcon className="size-4" />
            </Sidebar.Trigger>
          </header>

          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </Sidebar.Inset>
    </Sidebar.Root>
  );
}
