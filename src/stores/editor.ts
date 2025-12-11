import { createStore } from "zustand/vanilla";

export type EditorState = {
  openFile: string | null;
};

export type EditorActions = {
  setOpenFile: (path: string) => void;
};

export type EditorStore = EditorState & EditorActions;

export const defaultInitState: EditorState = {
  openFile: "",
};

export const createEditorStore = (
  initState: EditorState = defaultInitState,
) => {
  return createStore<EditorStore>()((set) => ({
    ...initState,
    setOpenFile: (path) => set(() => ({ openFile: path })),
  }));
};
