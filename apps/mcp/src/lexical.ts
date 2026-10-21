import { buildEditorFromExtensions } from "@lexical/extension";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  MdastCommonMarkExtension,
  MdastExtension,
  MdastGfmExtension,
} from "@lexical/mdast";
import { RichTextExtension } from "@lexical/rich-text";
import {
  createBindingV2__EXPERIMENTAL,
  type Provider,
  syncLexicalUpdateToYjsV2__EXPERIMENTAL,
  syncYjsStateToLexicalV2__EXPERIMENTAL,
} from "@lexical/yjs";
import { $getRoot, defineExtension } from "lexical";
import * as decoding from "lib0/decoding";
import * as encoding from "lib0/encoding";
import * as Y from "yjs";

export function unpackYjsOp(buffer: Uint8Array): Uint8Array[] {
  try {
    const decoder = decoding.createDecoder(buffer);
    const ops: Uint8Array[] = [];
    while (decoder.pos < decoder.arr.length) {
      ops.push(decoding.readVarUint8Array(decoder));
    }
    return ops.length > 0 ? ops : [buffer];
  } catch {
    return [buffer];
  }
}

export function packYjsOp(update: Uint8Array): Uint8Array {
  const encoder = encoding.createEncoder();
  encoding.writeVarUint8Array(encoder, update);
  return encoding.toUint8Array(encoder);
}

const editorExtension = defineExtension({
  name: "@baretext/mcp-editor",
  dependencies: [
    RichTextExtension,
    MdastExtension,
    MdastCommonMarkExtension,
    MdastGfmExtension,
  ],
});

function createTrivialProvider(): Provider {
  return {
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
  };
}

export function yjsToMarkdown(
  noteId: string,
  ydocOps: Uint8Array[],
): { markdown: string; textContent: string } {
  const doc = new Y.Doc();
  for (const rawOp of ydocOps) {
    const unpacked = unpackYjsOp(rawOp);
    for (const op of unpacked) {
      Y.applyUpdate(doc, op);
    }
  }

  const editor = buildEditorFromExtensions(editorExtension);
  const binding = createBindingV2__EXPERIMENTAL(editor, noteId, doc, new Map());
  syncYjsStateToLexicalV2__EXPERIMENTAL(binding, createTrivialProvider());

  const markdown = editor.read(() => $convertToMarkdownString());
  const textContent = editor.read(() => $getRoot().getTextContent());

  doc.destroy();
  return { markdown, textContent };
}

export async function markdownToYjs(
  noteId: string,
  markdown: string,
  existingOps: Uint8Array[] = [],
): Promise<{ stateUpdate: Uint8Array; textContent: string }> {
  const doc = new Y.Doc();
  for (const rawOp of existingOps) {
    const unpacked = unpackYjsOp(rawOp);
    for (const op of unpacked) {
      Y.applyUpdate(doc, op);
    }
  }

  const provider = createTrivialProvider();
  const editor = buildEditorFromExtensions(editorExtension);
  const binding = createBindingV2__EXPERIMENTAL(editor, noteId, doc, new Map());

  if (existingOps.length > 0) {
    syncYjsStateToLexicalV2__EXPERIMENTAL(binding, provider);
  }

  editor.registerUpdateListener((update) => {
    syncLexicalUpdateToYjsV2__EXPERIMENTAL(
      binding,
      provider,
      update.prevEditorState,
      update.editorState,
      update.dirtyElements,
      update.dirtyLeaves,
      update.normalizedNodes,
      update.tags,
    );
  });

  editor.update(
    () => {
      $convertFromMarkdownString(markdown);
    },
    { discrete: true },
  );

  // Allow Lexical update commit and deferred callbacks to flush to Yjs
  const { promise, resolve } = Promise.withResolvers<void>();
  setTimeout(resolve, 20);
  await promise;
  const textContent = editor.read(() => $getRoot().getTextContent());
  const rawUpdate = Y.encodeStateAsUpdate(doc);
  const stateUpdate = packYjsOp(rawUpdate);

  doc.destroy();
  return { stateUpdate, textContent };
}
