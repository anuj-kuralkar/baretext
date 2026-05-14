"use client";
import { useExtensionSignalValue } from "@lexical/react/useExtensionSignalValue";
import { AutoSaveExtension } from "./extension/autosave";

export function AutoSaveIndicator() {
  const isSaving = useExtensionSignalValue(AutoSaveExtension, "isSaving");
  const lastSaved = useExtensionSignalValue(AutoSaveExtension, "lastSaved");

  return (
    <div className="absolute bottom-4 right-4 pointer-events-none select-none">
      {isSaving ? (
        <span className="text-xs text-muted-foreground animate-pulse">
          Saving...
        </span>
      ) : lastSaved ? (
        <span className="text-xs text-muted-foreground/40 font-medium">
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
