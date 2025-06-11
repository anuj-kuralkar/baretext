import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User } from "@supabase/supabase-js";
import { FileEarmark, Person } from "react-bootstrap-icons";

export async function Header({ user }: { user: User | null }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image src="/lintnote.svg" alt="LintNote" width={32} height={32} />
          <span className="text-lg font-semibold">LintNote</span>
        </div>
      </Link>
      <nav className="ml-auto">
        <Button asChild>
          <Link href="/notes">
            <FileEarmark />
            Notes
          </Link>
        </Button>
      </nav>
      {user ? (
        <Avatar>
          <AvatarImage src={user.user_metadata?.avatar_url} alt="User Avatar" />
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
