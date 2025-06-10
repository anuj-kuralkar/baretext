import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import { Person } from "react-bootstrap-icons";

export async function Header({ user }: { user: User | null }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Link href="/" className="w-8 h-8">
        <Image src="/lintnote.svg" alt="LintNote Logo" width={32} height={32} />
      </Link>
      <nav className="mx-auto">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notes">Notes</Link>
        </Button>
      </nav>
      {user ? (
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url} />
          <AvatarFallback>
            <Person />
          </AvatarFallback>
        </Avatar>
      ) : (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </header>
  );
}
