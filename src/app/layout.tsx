import type { Metadata } from "next";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "LintNote - Simple and Fast Markdown Notes",
  description:
    "A fast, lightweight, and user-friendly Markdown note-taking app. Easily organize your ideas, tasks, and notes using clean, readable Markdown syntax.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
