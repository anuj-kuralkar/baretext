import {
  $getRoot,
  COLLABORATION_TAG,
  defineExtension,
  HISTORY_MERGE_TAG,
  safeCast,
} from "lexical";

interface TextContentConfig {
  persist: (text: string) => void;
}

export const textContentExtension = defineExtension({
  config: safeCast<TextContentConfig>({ persist: () => {} }),
  name: "@baretext/text-content-extension",
  register: (editor, config) => {
    return editor.registerUpdateListener(
      ({ editorState, tags, dirtyElements, dirtyLeaves }) => {
        if (tags.has(HISTORY_MERGE_TAG) || tags.has(COLLABORATION_TAG)) {
          return;
        }
        if (dirtyElements.size === 0 && dirtyLeaves.size === 0) {
          return;
        }
        editorState.read(() => {
          const text = $getRoot().getTextContent();
          config.persist(text);
        });
      },
    );
  },
});
