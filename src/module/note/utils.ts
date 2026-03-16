import type {
  SerializedEditorState,
  SerializedElementNode,
  SerializedLexicalNode,
  SerializedTextNode,
} from "lexical";

export const getFirstTwoTextNodesText = ({
  root,
}: SerializedEditorState): string[] => {
  const result: string[] = [];

  const walk = (node: SerializedLexicalNode): void => {
    if (result.length === 2) return;

    if (node.type === "text") {
      const text = (node as SerializedTextNode).text.trim();
      if (text) result.push(text);
      return;
    }

    const children = (node as Partial<SerializedElementNode>).children;
    if (!Array.isArray(children)) return;

    for (const child of children) {
      walk(child);
      if (result.length === 2) break;
    }
  };

  walk(root);
  return result;
};
