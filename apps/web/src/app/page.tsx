import { ArrowRight, CircleUserRoundIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { Background } from "@/components/background";
import { BrandLink } from "@/components/brand-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/session";

async function UserNav() {
  const session = await getSession();
  const user = session?.user;

  if (user) {
    return (
      <Link href="/settings/profile">
        <Avatar>
          <AvatarImage alt="User Avatar" src={user.image ?? undefined} />
          <AvatarFallback>
            <CircleUserRoundIcon className="size-4" />
          </AvatarFallback>
        </Avatar>
      </Link>
    );
  }

  return (
    <Link href="/login" className={buttonVariants()}>
      Login
    </Link>
  );
}

export default function Home() {
  return (
    <div className="group/layout relative z-10 flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-10 w-full bg-background">
        <nav className="mx-auto flex h-14 w-full max-w-7xl items-center px-4 md:px-6">
          <BrandLink />

          <div className="ml-auto flex items-center gap-4">
            <Link
              href="/notes"
              className={buttonVariants({ variant: "outline" })}
            >
              Notes
            </Link>

            <Suspense fallback={<Button disabled>Login</Button>}>
              <UserNav />
            </Suspense>
          </div>
        </nav>
      </header>

      <main className="relative flex flex-1 flex-col items-center pt-10 pb-12 md:pt-20">
        <Background />

        <section className="mx-auto flex w-full max-w-5xl flex-col items-center gap-4 px-4 text-center md:gap-6 md:px-6">
          <h1 className="max-w-3xl text-balance font-semibold text-4xl text-primary tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Your thoughts, beautifully organized.
          </h1>

          <p className="max-w-2xl text-balance text-base text-muted-foreground sm:text-lg md:text-xl">
            A simple place to write, organize, and revisit your notes. Easy to
            get started with, comfortable to use every day.
          </p>

          <Link
            href="/notes"
            className={buttonVariants({ size: "lg", className: "mt-4" })}
          >
            Start writing
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </section>

        <section className="mx-auto mt-12 w-full max-w-6xl px-4 md:mt-20 md:px-6">
          <div className="overflow-hidden rounded-2xl border bg-background/50 shadow-2xl ring-1 ring-border/50">
            <Image
              alt="Editor preview"
              height={1575}
              priority
              src="/app-screenshot.png"
              width={2160}
              className="w-full object-cover"
              sizes="(max-width: 768px) 100vw, 1200px"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
