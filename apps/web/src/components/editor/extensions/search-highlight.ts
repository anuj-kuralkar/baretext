import { effect } from "@lexical/extension";
import { defineExtension, safeCast } from "lexical";
import { findMatchRanges, parseSearchTerms } from "@/lib/search";
import { searchQuery } from "@/lib/search-query";

// Styled by theme.css, which already carries a forced-colors fallback for
// this name. A find plugin registering the same name would fight over the
// single registry entry.
const HIGHLIGHT_NAME = "editor-find-match";
// Lexical joins blocks with a blank line; mirroring that keeps a term from
// matching across two blocks.
const BLOCK_SEPARATOR = "\n\n";

const supportsHighlights = () =>
  typeof CSS !== "undefined" &&
  "highlights" in CSS &&
  typeof Highlight !== "undefined";

// `HighlightRegistry.delete` is absent from the DOM typings in TypeScript 7,
// and an empty Highlight paints nothing, so clearing registers one.
const clearHighlight = () => {
  if (!supportsHighlights()) {
    return;
  }
  CSS.highlights.set(HIGHLIGHT_NAME, new Highlight());
};

interface TextPart {
  node: Text;
  start: number;
  length: number;
}

// The registry holds one entry per name, so only the editor that painted it
// may clear it. Without this, an editor that has already lost its root -- a
// remount, or a note change under <Editor key={noteId}> -- clears the
// highlight belonging to the editor that replaced it.
let owner: object | null = null;

function blockOf(node: Node, root: HTMLElement): Element | null {
  let current: Node | null = node;
  while (current !== null && current.parentNode !== root) {
    current = current.parentNode;
  }
  return current instanceof Element ? current : null;
}

/**
 * Paints search hits with the CSS Custom Highlight API. The ranges live in the
 * registry rather than the document, so nothing here reaches the Yjs doc or
 * Lexical's reconciler -- a decorator node would do both.
 */
export const searchHighlightExtension = defineExtension({
  config: safeCast<Record<string, never>>({}),
  name: "@baretext/search-highlight",
  register: (editor) => {
    const token = {};

    const clear = () => {
      if (owner !== token) {
        return;
      }
      clearHighlight();
      owner = null;
    };

    const collectParts = (root: HTMLElement) => {
      const parts: TextPart[] = [];
      let text = "";
      let previous: Text | null = null;

      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (
        let node = walker.nextNode();
        node !== null;
        node = walker.nextNode()
      ) {
        const value = node.nodeValue ?? "";
        if (value === "") {
          continue;
        }
        if (
          previous !== null &&
          blockOf(previous, root) !== blockOf(node as Text, root)
        ) {
          text += BLOCK_SEPARATOR;
        }
        parts.push({
          node: node as Text,
          start: text.length,
          length: value.length,
        });
        text += value;
        previous = node as Text;
      }

      return { parts, text };
    };

    const paint = (query: string) => {
      if (!supportsHighlights()) {
        return;
      }

      const root = editor.getRootElement();
      const terms = parseSearchTerms(query);

      if (root === null || terms.length === 0) {
        clear();
        return;
      }

      const { parts, text } = collectParts(root);
      const ranges: Range[] = [];

      for (const { start, end } of findMatchRanges(text, terms)) {
        for (const part of parts) {
          const partEnd = part.start + part.length;
          if (partEnd <= start || part.start >= end) {
            continue;
          }
          const range = document.createRange();
          range.setStart(part.node, Math.max(0, start - part.start));
          range.setEnd(part.node, Math.min(part.length, end - part.start));
          ranges.push(range);
        }
      }

      if (ranges.length === 0) {
        clear();
        return;
      }

      CSS.highlights.set(HIGHLIGHT_NAME, new Highlight(...ranges));
      owner = token;
    };

    // The query drives repaints through the signal. Document changes go through
    // the update listener, which peeks so an edit does not also re-trigger the
    // effect.
    const stopQueryEffect = effect(() => {
      paint(searchQuery.value);
    });
    const unregisterUpdate = editor.registerUpdateListener(() => {
      paint(searchQuery.peek());
    });
    paint(searchQuery.peek());

    return () => {
      stopQueryEffect();
      unregisterUpdate();
      clear();
    };
  },
});
