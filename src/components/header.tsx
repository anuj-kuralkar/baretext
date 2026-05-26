import { CircleUserRoundIcon, FileIcon } from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";

import * as Avatar from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";

export async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const user = session?.user;

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image alt="Baretext" height={32} src="/baretext.svg" width={32} />
          <span className="font-semibold text-lg">Baretext</span>
        </div>
      </Link>

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
