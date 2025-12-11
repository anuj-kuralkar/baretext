"use client";

import { createContext, type ReactNode, useContext, useRef } from "react";
import { useStore } from "zustand";

import { createEditorStore, type EditorStore } from "@/stores/editor";

export type EditorStoreApi = ReturnType<typeof createEditorStore>;

export const EditorStoreContext = createContext<EditorStoreApi | undefined>(
  undefined,
);

export interface EditorStoreProviderProps {
  children: ReactNode;
}

export const EditorStoreProvider = ({ children }: EditorStoreProviderProps) => {
  const storeRef = useRef<EditorStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createEditorStore();
  }

  return (
    <EditorStoreContext value={storeRef.current}>{children}</EditorStoreContext>
  );
};

export const useEditorStore = <T,>(selector: (store: EditorStore) => T): T => {
  const editorStoreContext = useContext(EditorStoreContext);

  if (!editorStoreContext) {
    throw new Error(`useEditorStore must be used within EditorStoreProvider`);
  }

  return useStore(editorStoreContext, selector);
};
