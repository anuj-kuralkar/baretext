import {
  $getRoot,
  COLLABORATION_TAG,
  defineExtension,
  HISTORY_MERGE_TAG,
  safeCast,
} from "lexical";

interface PreviewConfig {
  persist: (text: string) => void;
}

export const previewExtension = defineExtension({
  config: safeCast<PreviewConfig>({ persist: () => {} }),
  name: "@baretext/preview-extension",
  register: (editor, config) => {
    return editor.registerUpdateListener(({ editorState, tags }) => {
      if (tags.has(HISTORY_MERGE_TAG) || tags.has(COLLABORATION_TAG)) {
        return;
      }
      editorState.read(() => {
        const text = $getRoot().getTextContent().slice(0, 256);
        config.persist(text);
      });
    });
  },
});
