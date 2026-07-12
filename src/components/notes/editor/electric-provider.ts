import {
  ElectricProvider,
  LocalStorageResumeStateProvider,
  parseToDecoder,
} from "@electric-sql/y-electric";
import type { Provider } from "@lexical/yjs";
import type { Decoder } from "lib0/decoding";
import type * as Y from "yjs";

type DestroyableProvider = Provider & { destroy?: () => void };

function createDummyAwareness() {
  const emptyFunction = () => {};
  return {
    getLocalState: () => null,
    getStates: () => new Map(),
    off: emptyFunction,
    on: emptyFunction,
    setLocalState: emptyFunction,
    setLocalStateField: emptyFunction,
  };
}

export function createElectricProvider(doc: Y.Doc, roomId: string): Provider {
  const resumeProvider = new LocalStorageResumeStateProvider(roomId);
  const electricProvider = new ElectricProvider<{ update: Decoder }>({
    doc,
    documentUpdates: {
      shape: {
        url:
          typeof window !== "undefined"
            ? new URL(
                `/api/shape?table=ydoc_update&room=${roomId}`,
                window.location.origin,
              ).toString()
            : `/api/shape?table=ydoc_update&room=${roomId}`,
        parser: parseToDecoder,
      },
      sendUrl:
        typeof window !== "undefined"
          ? new URL("/api/yjs", window.location.origin).toString()
          : "/api/yjs",
      getUpdateFromRow: (row) => row.update,
    },
    resumeState: resumeProvider.load(),
    debounceMs: 100,
    fetchClient: (url, init) => {
      return fetch(url, {
        ...init,
        headers: {
          ...init?.headers,
          "x-room-id": roomId,
        },
      });
    },
  });

  const unsubscribeResumeState =
    resumeProvider.subscribeToResumeState(electricProvider);

  // Cast and inject properties required by Lexical's CollaborationPlugin
  const provider = electricProvider as unknown as DestroyableProvider;
  provider.awareness = createDummyAwareness();
  provider.destroy = () => {
    unsubscribeResumeState();
    electricProvider.destroy();
  };

  if (!provider.connect) provider.connect = () => electricProvider.connect();
  if (!provider.disconnect)
    provider.disconnect = () => electricProvider.disconnect();
  if (!provider.off) provider.off = () => {};
  if (!provider.on) provider.on = () => {};

  return provider;
}
