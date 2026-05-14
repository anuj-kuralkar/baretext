import {
  ArrowRight,
  CloudIcon,
  CodeIcon,
  FolderIcon,
  LayoutIcon,
  PlayCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <main className="grid min-h-dvh grid-rows-[auto_1fr] bg-background">
      <Header />

      <section className="relative flex items-center">
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-24">
          <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.6fr]">
            {/* Copy */}
            <div className="space-y-7">
              <h1 className="max-w-xl text-balance font-semibold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
                Markdown notes,
                <br />
                without the noise.
              </h1>

              <p className="max-w-md text-pretty text-md text-muted-foreground sm:text-lg">
                A calm place to write, organize, and revisit your thoughts. Pure
                Markdown. No distractions.
              </p>

              {/* Features */}
              <ul className="grid grid-cols-2 gap-x-6 gap-y-4 pt-2 text-muted-foreground text-sm">
                <li className="flex items-center gap-3">
                  <CloudIcon className="size-4 shrink-0 text-foreground" />
                  Cloud sync
                </li>
                <li className="flex items-center gap-3">
                  <CodeIcon className="size-4 shrink-0 text-foreground" />
                  Syntax highlighting
                </li>
                <li className="flex items-center gap-3">
                  <FolderIcon className="size-4 shrink-0 text-foreground" />
                  Simple folders
                </li>
                <li className="flex items-center gap-3">
                  <LayoutIcon className="size-4 shrink-0 text-foreground" />
                  Zero clutter
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap gap-4 pt-4">
                <Button asChild size="lg">
                  <Link href="/notes">
                    Start writing
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>

                <Button size="lg" variant="outline">
                  <PlayCircle className="mr-2 size-4" />
                  Watch demo
                </Button>
              </div>
            </div>

            {/* Screenshot */}
            <div className="relative">
              <div className="relative aspect-4/3 overflow-visible">
                <Image
                  alt="Minimal markdown notes editor"
                  className="object-contain"
                  fill
                  priority
                  src="/app-screenshot.png"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
