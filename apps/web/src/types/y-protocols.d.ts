declare module "@y/protocols/awareness" {
  import type * as Y from "yjs";

  export interface AwarenessChanges {
    added: number[];
    updated: number[];
    removed: number[];
  }

  export class Awareness {
    doc: Y.Doc;
    clientID: number;
    states: Map<number, Record<string, unknown>>;

    constructor(doc: Y.Doc);

    destroy(): void;
    getLocalState(): Record<string, unknown> | null;
    setLocalState(state: Record<string, unknown> | null): void;
    setLocalStateField(field: string, value: unknown): void;
    getStates(): Map<number, Record<string, unknown>>;
    on(
      event: "update" | "change",
      handler: (changes: AwarenessChanges, origin: unknown) => void,
    ): void;
    // biome-ignore lint/suspicious/noExplicitAny: event handler parameter signature
    on(event: string, handler: (...args: any[]) => void): void;
    off(
      event: "update" | "change",
      handler: (changes: AwarenessChanges, origin: unknown) => void,
    ): void;
    // biome-ignore lint/suspicious/noExplicitAny: event handler parameter signature
    off(event: string, handler: (...args: any[]) => void): void;
    // biome-ignore lint/suspicious/noExplicitAny: event emitter signature
    emit(event: string, args: any[]): void;
  }

  export function encodeAwarenessUpdate(
    awareness: Awareness,
    clients: readonly number[],
    states?: Map<number, Record<string, unknown>>,
  ): Uint8Array;

  export function applyAwarenessUpdate(
    awareness: Awareness,
    update: Uint8Array,
    origin: unknown,
  ): void;

  export function removeAwarenessStates(
    awareness: Awareness,
    clients: readonly number[],
    origin: unknown,
  ): void;

  export const outdatedTimeout: number;
}
