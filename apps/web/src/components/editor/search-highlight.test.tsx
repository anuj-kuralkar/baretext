import { act, StrictMode } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import { searchQuery } from "@/lib/search-query";
import { Editor } from "./index";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

vi.mock("@/collections/note", () => ({
  useNotePacedMutations: () => () => Promise.resolve(),
}));

vi.mock("@/lib/electric-provider", () => ({
  createElectricProvider: () => ({
    on: () => {},
    off: () => {},
    destroy: () => {},
  }),
  createTrivialProvider: () => ({
    awareness: {
      getLocalState: () => null,
      getStates: () => new Map(),
      on: () => {},
      off: () => {},
      setLocalState: () => {},
      setLocalStateField: () => {},
    },
    connect: () => {},
    disconnect: () => {},
    on: () => {},
    off: () => {},
  }),
}));

const HIGHLIGHT = "editor-find-match";

const delay = (ms: number) => {
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, ms);
  return promise;
};

let root: Root | undefined;
let container: HTMLDivElement | undefined;

const highlightedText = () => {
  const highlight = CSS.highlights.get(HIGHLIGHT);
  return highlight === undefined ? [] : [...highlight].map((r) => r.toString());
};

const resetHighlight = () => {
  CSS.highlights.set(HIGHLIGHT, new Highlight());
};

async function mount(noteId: string) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  await act(async () => {
    root?.render(
      <StrictMode>
        <Editor noteId={noteId} />
      </StrictMode>,
    );
    await delay(150);
  });
}

async function type(text: string) {
  const editable = document.querySelector<HTMLElement>(
    '[contenteditable="true"]',
  );
  await act(async () => {
    editable?.focus();
    document.execCommand?.("insertText", false, text);
    await delay(100);
  });
}

async function search(query: string) {
  await act(async () => {
    searchQuery.value = query;
    await delay(100);
  });
}

beforeEach(() => {
  searchQuery.value = "";
  resetHighlight();
});

afterEach(async () => {
  await act(async () => {
    root?.unmount();
    await delay(50);
  });
  container?.remove();
  root = undefined;
  container = undefined;
  searchQuery.value = "";
  resetHighlight();
});

test("a hit in the middle of a word is highlighted", async () => {
  await mount("test-highlight-mid");
  await type("hello world");
  await search("wor");

  expect(highlightedText()).toEqual(["wor"]);
});

test("every occurrence is highlighted", async () => {
  await mount("test-highlight-all");
  await type("one two one");
  await search("one");

  expect(highlightedText()).toEqual(["one", "one"]);
});

test("matching ignores case", async () => {
  await mount("test-highlight-case");
  await type("Hello World");
  await search("hello");

  expect(highlightedText()).toEqual(["Hello"]);
});

test("a term cannot match across two blocks", async () => {
  await mount("test-highlight-blocks");
  await type("foo");
  await act(async () => {
    document
      .querySelector<HTMLElement>('[contenteditable="true"]')
      ?.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Enter", bubbles: true }),
      );
    await delay(100);
  });
  await type("bar");
  await search("oob");

  expect(highlightedText()).toEqual([]);
});

test("clearing the query removes the highlight", async () => {
  await mount("test-highlight-clear");
  await type("hello");
  await search("ell");
  expect(highlightedText()).toEqual(["ell"]);

  await search("");

  expect(highlightedText()).toEqual([]);
});
