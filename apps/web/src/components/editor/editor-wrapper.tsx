export function EditorWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden border border-input dark:bg-input/30">
      {children}
    </div>
  );
}
