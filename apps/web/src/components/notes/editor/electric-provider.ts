import {
  ElectricProvider,
  LocalStorageResumeStateProvider,
  parseToDecoder,
} from "@electric-sql/y-electric";
import type { Provider } from "@lexical/yjs";
import type { Decoder } from "lib0/decoding";
import { IndexeddbPersistence } from "y-indexeddb";
import type * as Y from "yjs";
import { env } from "@/lib/env/client";

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
  const indexeddbProvider = new IndexeddbPersistence(roomId, doc);
  const resumeProvider = new LocalStorageResumeStateProvider(roomId);
  const electricProvider = new ElectricProvider<{ update: Decoder }>({
    doc,
    documentUpdates: {
      shape: {
        url: new URL("/shape", env.NEXT_PUBLIC_API_URL).toString(),
        params: { table: "ydoc_update", room: roomId },
        parser: parseToDecoder,
        fetchClient: ((url, init) =>
          fetch(url, { ...init, credentials: "include" })) as typeof fetch,
      },
      sendUrl: new URL(
        `/yjs?room=${roomId}`,
        env.NEXT_PUBLIC_API_URL,
      ).toString(),
      getUpdateFromRow: (row) => row.update,
    },
    resumeState: resumeProvider.load(),
    debounceMs: 100,
    fetchClient: ((url, init) =>
      fetch(url, { ...init, credentials: "include" })) as typeof fetch,
  });

  const unsubscribeResumeState =
    resumeProvider.subscribeToResumeState(electricProvider);

  const provider = electricProvider as unknown as DestroyableProvider;
  provider.awareness = createDummyAwareness();
  provider.destroy = () => {
    unsubscribeResumeState();
    indexeddbProvider.destroy();
    electricProvider.destroy();
  };

  if (!provider.connect) provider.connect = () => electricProvider.connect();
  if (!provider.disconnect)
    provider.disconnect = () => electricProvider.disconnect();
  if (!provider.off) provider.off = () => {};
  if (!provider.on) provider.on = () => {};

  return provider;
}
