import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Background } from "@/components/background";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <div className="group/layout relative z-10 flex min-h-svh flex-col bg-background">
      <Header />
      <main className="flex min-h-0 flex-1 flex-col">
        <Background />
        <div className="flex flex-1 flex-col">
          <section className="border-grid md:**:[.container]:pb-8 lg:**:[.container]:pb-12">
            <div className="mx-auto w-full 3xl:fixed:max-w-[calc(var(--breakpoint-2xl)+2rem)] px-2">
              <div className="mx-auto flex 3xl:max-w-screen-2xl max-w-350 flex-col items-center gap-2 px-6 py-8 text-center md:py-16 lg:px-8 lg:py-20 xl:gap-4">
                <h1 className="max-w-4xl text-balance font-semibold text-3xl text-primary leading-tighter tracking-tight lg:font-semibold lg:leading-[1.1] xl:text-5xl xl:tracking-tighter">
                  Your thoughts, beautifully organized.
                </h1>

                <p className="max-w-4xl text-balance text-base text-foreground sm:text-lg">
                  A simple place to write, organize, and revisit your notes.
                  Easy to get started with, comfortable to use every day.
                </p>

                <div className="flex w-full items-center justify-center gap-2 pt-2">
                  <Button asChild size="lg">
                    <Link href="/notes">
                      Start writing
                      <ArrowRight className="ml-2 size-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          <div className="mx-auto w-full 3xl:fixed:max-w-[calc(var(--breakpoint-2xl)+2rem)] flex-1 px-2 pt-0 pb-4">
            <div className="mx-auto 3xl:max-w-screen-2xl max-w-350 overflow-hidden px-4 md:px-0 lg:max-w-none lg:px-8">
              <section className="mx-auto max-w-4xl overflow-hidden">
                <Image
                  alt="Editor preview"
                  height={1575}
                  priority
                  src="/app-screenshot.png"
                  width={2160}
                />
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
