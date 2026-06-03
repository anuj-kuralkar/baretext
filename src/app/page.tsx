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

import { AuroraBackground } from "@/components/aurora-background";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="dark">
      <main className="relative min-h-dvh bg-background text-foreground">
        <AuroraBackground />

      <div className="relative z-10 grid min-h-dvh grid-rows-[auto_1fr]">
        <Header />

        <section className="relative flex items-center">
          <div className="mx-auto max-w-7xl px-6 pt-20 pb-24">
            <div className="grid items-center gap-16 lg:grid-cols-[1fr_1.4fr]">
              {/* Copy */}
              <div className="space-y-8">
                <h1 className="max-w-xl text-balance font-bold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                  Write without <span className="text-gradient">limits</span>
                </h1>

                <p className="max-w-md text-pretty text-lg text-muted-foreground sm:text-xl">
                  A calm place to write, organize, and revisit your thoughts.
                  Pure Markdown. No distractions.
                </p>

                {/* Features */}
                <ul className="grid grid-cols-2 gap-x-8 gap-y-4 pt-2">
                  {[
                    { icon: CloudIcon, label: "Cloud sync" },
                    { icon: CodeIcon, label: "Syntax highlighting" },
                    { icon: FolderIcon, label: "Simple folders" },
                    { icon: LayoutIcon, label: "Zero clutter" },
                  ].map((feature) => (
                    <li
                      key={feature.label}
                      className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all group-hover:bg-primary/20 group-hover:scale-110">
                        <feature.icon className="size-4" />
                      </div>
                      {feature.label}
                    </li>
                  ))}
                </ul>

                {/* CTAs */}
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg" variant="gradient">
                    <Link href="/notes">
                      Start writing
                      <ArrowRight className="ml-2 size-4 transition-transform group-hover/button:translate-x-1" />
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
                <div className="relative aspect-4/3 overflow-visible rounded-xl glow-lg">
                  <div className="absolute inset-0 rounded-xl bg-gradient opacity-20 blur-3xl" />
                  <div className="relative h-full w-full overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm">
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
          </div>
        </section>
      </div>
      </main>
    </div>
  );
}
