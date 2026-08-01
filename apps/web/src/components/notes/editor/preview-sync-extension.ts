import { defineExtension } from "@lexical/extension";
import { $getRoot, safeCast } from "lexical";

export type PreviewSyncExtensionConfig = {
  onPreviewExtract: (text: string) => void;
};

export const PreviewSyncExtension = defineExtension({
  name: "baretext-preview-sync",
  config: safeCast<PreviewSyncExtensionConfig>({
    onPreviewExtract: () => {},
  }),
  register(editor, config) {
    if (!config.onPreviewExtract) return () => {};
    // Initialize with current state to prevent spurious saves during editor bootstrap
    let lastExtracted: string | null = null;
    editor.getEditorState().read(() => {
      const text = $getRoot().getTextContent();
      lastExtracted = [...text].slice(0, 500).join("");
    });

    return editor.registerUpdateListener(({ editorState, tags }) => {
      // Ignore remote collaboration changes
      if (tags.has("collaboration") || tags.has("historic")) return;

      editorState.read(() => {
        const text = $getRoot().getTextContent();
        const truncated = [...text].slice(0, 500).join("");

        if (lastExtracted !== truncated) {
          lastExtracted = truncated;
          config.onPreviewExtract(truncated);
        }
      });
    });
  },
});
