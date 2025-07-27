import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { FileEarmark, Person } from "react-bootstrap-icons";
import {
  AvatarFallback,
  AvatarImage,
  AvatarRoot,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

export async function Header({ user }: { user: User | null }) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <Link href="/">
        <div className="flex items-center gap-2">
          <Image alt="LintNote" height={32} src="/lintnote.svg" width={32} />
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
        <AvatarRoot>
          <AvatarImage alt="User Avatar" src={user.user_metadata?.avatar_url} />
          <AvatarFallback>
            <Person />
          </AvatarFallback>
        </AvatarRoot>
      ) : (
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      )}
    </header>
  );
}
