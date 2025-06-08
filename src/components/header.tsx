import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export function Header() {
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
      <Button asChild>
        <Link href="/login">Login</Link>
      </Button>
    </header>
  );
}
