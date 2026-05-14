"use client";
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue";
import { AutoSaveExtension } from "./extension/autosave";

export function AutoSaveIndicator() {
  const isSaving = useExtensionSignalValue(AutoSaveExtension, "isSaving");
  const lastSaved = useExtensionSignalValue(AutoSaveExtension, "lastSaved");

  return (
    <div className="pointer-events-none absolute right-4 bottom-4 select-none">
      {isSaving ? (
        <span className="animate-pulse text-muted-foreground text-xs">
          Saving...
        </span>
      ) : lastSaved ? (
        <span className="font-medium text-muted-foreground/40 text-xs">
          Saved{" "}
          {(lastSaved as Date).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      ) : null}
    </div>
  );
}
