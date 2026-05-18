import type { Metadata } from "next";

import "@/styles/globals.css";
import { Geist } from "next/font/google";
import { DevelopmentBanner } from "@/components/development-banner";
import { ThemeProvider } from "@/components/theme-provider";
import { AppToaster } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Baretext - Simple and Fast Markdown Notes",
  description:
    "A fast, lightweight, and user-friendly Markdown note-taking app. Easily organize your ideas, tasks, and notes using clean, readable Markdown syntax.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn("font-sans", geist.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <DevelopmentBanner />
          {children}
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
