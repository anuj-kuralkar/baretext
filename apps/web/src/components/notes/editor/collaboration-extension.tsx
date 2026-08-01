import { configExtension, defineExtension } from "@lexical/extension";
import { CollaborationPlugin } from "@lexical/react/LexicalCollaborationPlugin";
import { ReactExtension } from "@lexical/react/ReactExtension";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import { safeCast } from "lexical";
import type * as Y from "yjs";
import { createElectricProvider } from "./electric-provider";

export type CollaborationExtensionConfig = {
  noteId: string;
  doc: Y.Doc;
};

export function CollaborationExtensionComponent() {
  const { config } = useExtensionDependency(CollaborationExtension);
  if (!config) return null;
  const { noteId, doc } = config;

  const providerFactory = (id: string, yjsDocMap: Map<string, Y.Doc>) => {
    yjsDocMap.set(id, doc);
    return createElectricProvider(doc, noteId);
  };

  return (
    <CollaborationPlugin
      id={noteId}
      providerFactory={providerFactory}
      shouldBootstrap={true}
    />
  );
}

export const CollaborationExtension = defineExtension({
  name: "baretext-collaboration",
  config: safeCast<CollaborationExtensionConfig>({
    noteId: "",
    doc: null as unknown as Y.Doc,
  }),
  dependencies: [
    configExtension(ReactExtension, {
      decorators: [<CollaborationExtensionComponent key="collaboration" />],
    }),
  ],
});
