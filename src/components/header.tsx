import { CircleUserRoundIcon, FileIcon } from "lucide-react";
import Link from "next/link";

import { BrandLink } from "@/components/brand-link";
import * as Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

export async function Header() {
  const session = await getSession();
  const user = session?.user;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <BrandLink />

      <nav className="ml-auto">
        <Button asChild>
          <Link href="/notes">
            <FileIcon />
            Notes
          </Link>
        </Button>
      </nav>

      {user ? (
        <Avatar.Root>
          <Avatar.Image alt="User Avatar" src={user.image ?? undefined} />
          <Avatar.Fallback>
            <CircleUserRoundIcon />
          </Avatar.Fallback>
        </Avatar.Root>
      ) : (
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      )}
    </header>
  );
}
