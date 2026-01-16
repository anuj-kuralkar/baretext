import type { Metadata } from "next";

import "@/styles/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AppToaster } from "@/components/ui/toast";
import { EditorStoreProvider } from "@/providers/editor-store";

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
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          disableTransitionOnChange
          enableSystem
        >
          <EditorStoreProvider>{children}</EditorStoreProvider>
          <AppToaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
