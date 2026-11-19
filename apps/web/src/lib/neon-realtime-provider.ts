import type {
  MaterializedLiveQuerySubscription,
  RealtimeClient,
  SealedLiveQuery,
} from "@neon/realtime/client";
import {
  Awareness,
  applyAwarenessUpdate,
  encodeAwarenessUpdate,
} from "@y/protocols/awareness";
import * as Y from "yjs";

import { env } from "@/lib/env/client";
import { createAppRealtime } from "@/lib/realtime";

export interface YdocUpdateRow {
  readonly id: string;
  readonly noteId: string;
  readonly op: Uint8Array | string | unknown;
  readonly userId: string;
}

export interface YdocAwarenessRow {
  readonly noteId: string;
  readonly op: Uint8Array | string | unknown;
  readonly updatedAt: Date | string;
  readonly userId: string;
}

export interface NeonRealtimeProviderOptions {
  readonly doc: Y.Doc;
  readonly noteId: string;
  readonly awareness?: Awareness;
  readonly realtimeClient?: RealtimeClient;
  readonly apiUrl?: string;
  readonly renewalIntervalMs?: number;
  readonly fetchClient?: typeof fetch;
  readonly debounceMs?: number;
}

export type ProviderStatus = "connecting" | "connected" | "disconnected";

export type ProviderEventMap = {
  synced: [boolean];
  status: [{ status: ProviderStatus; error?: Error }];
};

export function toUint8Array(val: unknown): Uint8Array {
  if (val instanceof Uint8Array) {
    return val;
  }
  if (typeof val === "string") {
    const hex = val.startsWith("\\x") ? val.slice(2) : val;
    const len = hex.length / 2;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
    }
    return bytes;
  }
  if (Array.isArray(val)) {
    return new Uint8Array(val);
  }
  if (
    val &&
    typeof val === "object" &&
    "data" in val &&
    Array.isArray((val as { data: unknown[] }).data)
  ) {
    return new Uint8Array((val as { data: number[] }).data);
  }
  return new Uint8Array(0);
}

/**
 * Custom Yjs Provider using Neon Realtime for live SQL query subscriptions.
 *
 * It subscribes to Yjs document updates and awareness rows via Neon Realtime,
 * transmits local document updates to PUT /yjs/update, and transmits local
 * awareness states to PUT /yjs/awareness.
 */
export class NeonRealtimeProvider {
  readonly doc: Y.Doc;
  readonly noteId: string;
  readonly awareness: Awareness;

  synced = false;
  status: ProviderStatus = "connecting";

  private readonly realtimeClient: RealtimeClient;
  private readonly apiUrl: string;
  private readonly renewalIntervalMs: number;
  private readonly fetchClient: typeof fetch;
  readonly debounceMs: number;

  private pendingDocUpdates: Uint8Array[] = [];
  private docUpdateTimer: ReturnType<typeof setTimeout> | null = null;
  private pendingAwarenessClients = new Set<number>();
  private awarenessTimer: ReturnType<typeof setTimeout> | null = null;

  private updatesSubscription: MaterializedLiveQuerySubscription<YdocUpdateRow> | null =
    null;
  private awarenessSubscription: MaterializedLiveQuerySubscription<YdocAwarenessRow> | null =
    null;

  private readonly appliedUpdates = new Set<string>();
  private renewalTimer: ReturnType<typeof setInterval> | null = null;
  private destroyed = false;

  private readonly listeners: {
    [K in keyof ProviderEventMap]?: Set<(...args: ProviderEventMap[K]) => void>;
  } = {};

  constructor({
    doc,
    noteId,
    awareness,
    realtimeClient,
    apiUrl = env.NEXT_PUBLIC_API_URL,
    renewalIntervalMs = 30_000,
    fetchClient = ((url, init) =>
      fetch(url, { ...init, credentials: "include" })) as typeof fetch,
    debounceMs = 150,
  }: NeonRealtimeProviderOptions) {
    this.doc = doc;
    this.noteId = noteId;
    this.apiUrl = apiUrl;
    this.renewalIntervalMs = renewalIntervalMs;
    this.fetchClient = fetchClient;
    this.realtimeClient = realtimeClient ?? createAppRealtime();
    // Debounce saves by at least 100ms
    this.debounceMs = Math.max(100, debounceMs);

    this.awareness = awareness ?? new Awareness(doc);

    this.doc.on("update", this.handleDocUpdate);
    this.awareness.on("update", this.handleAwarenessUpdate);

    this.connect().catch((error) => {
      this.status = "disconnected";
      this.emit("status", { status: "disconnected", error });
    });
  }

  on<K extends keyof ProviderEventMap>(
    event: K,
    listener: (...args: ProviderEventMap[K]) => void,
  ): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = new Set() as never;
    }
    this.listeners[event]?.add(listener as never);
    return () => this.off(event, listener);
  }

  once<K extends keyof ProviderEventMap>(
    event: K,
    listener: (...args: ProviderEventMap[K]) => void,
  ): () => void {
    const unsubscribe = this.on(event, ((...args: ProviderEventMap[K]) => {
      unsubscribe();
      listener(...args);
    }) as never);
    return unsubscribe;
  }

  off<K extends keyof ProviderEventMap>(
    event: K,
    listener: (...args: ProviderEventMap[K]) => void,
  ): void {
    this.listeners[event]?.delete(listener as never);
  }

  private emit<K extends keyof ProviderEventMap>(
    event: K,
    ...args: ProviderEventMap[K]
  ): void {
    this.listeners[event]?.forEach((fn) => {
      try {
        fn(...args);
      } catch (err) {
        console.error(
          `Error in NeonRealtimeProvider listener for ${event}:`,
          err,
        );
      }
    });
  }

  async connect(): Promise<void> {
    if (this.destroyed) return;

    this.status = "connecting";
    this.emit("status", { status: "connecting" });

    const sealed = await this.fetchSealedQueries();
    if (this.destroyed) return;

    // Apply any initial updates retrieved on cold start so doc is immediately hydrated
    if (sealed.initialUpdates && sealed.initialUpdates.length > 0) {
      for (const row of sealed.initialUpdates) {
        if (!this.appliedUpdates.has(row.id)) {
          this.appliedUpdates.add(row.id);
          const opBytes = toUint8Array(row.op);
          if (opBytes.byteLength > 0) {
            Y.applyUpdate(this.doc, opBytes, "remote");
          }
        }
      }
    }

    if (sealed.initialAwareness && sealed.initialAwareness.length > 0) {
      for (const row of sealed.initialAwareness) {
        const opBytes = toUint8Array(row.op);
        if (opBytes.byteLength > 0) {
          applyAwarenessUpdate(this.awareness, opBytes, "remote");
        }
      }
    }

    if (!this.synced) {
      this.synced = true;
      this.status = "connected";
      this.emit("synced", true);
      this.emit("status", { status: "connected" });
    }

    this.updatesSubscription = this.realtimeClient.subscribe(sealed.updates, {
      materialize: true,
    });

    this.awarenessSubscription = this.realtimeClient.subscribe(
      sealed.awareness,
      { materialize: true },
    );

    this.updatesSubscription.onChange((snapshot) => {
      if (this.destroyed) return;

      if (snapshot.status === "live" && snapshot.data) {
        for (const row of snapshot.data) {
          if (!this.appliedUpdates.has(row.id)) {
            this.appliedUpdates.add(row.id);
            const opBytes = toUint8Array(row.op);
            if (opBytes.byteLength > 0) {
              Y.applyUpdate(this.doc, opBytes, "remote");
            }
          }
        }

        if (!this.synced) {
          this.synced = true;
          this.status = "connected";
          this.emit("synced", true);
          this.emit("status", { status: "connected" });
        }
      } else if (snapshot.status === "error") {
        this.status = "disconnected";
        this.emit("status", {
          status: "disconnected",
          error: snapshot.error,
        });
      }
    });

    this.awarenessSubscription.onChange((snapshot) => {
      if (this.destroyed) return;

      if (snapshot.status === "live" && snapshot.data) {
        for (const row of snapshot.data) {
          const opBytes = toUint8Array(row.op);
          if (opBytes.byteLength > 0) {
            applyAwarenessUpdate(this.awareness, opBytes, "remote");
          }
        }
      }
    });

    this.renewalTimer = setInterval(() => {
      this.renewSubscriptions().catch((err) => {
        console.warn("Failed to renew Neon Realtime sealed queries:", err);
      });
    }, this.renewalIntervalMs);
  }

  private async fetchSealedQueries(): Promise<{
    updates: SealedLiveQuery<YdocUpdateRow>;
    awareness: SealedLiveQuery<YdocAwarenessRow>;
    initialUpdates?: readonly YdocUpdateRow[];
    initialAwareness?: readonly YdocAwarenessRow[];
  }> {
    const liveUrl = new URL("/yjs/live", this.apiUrl);
    liveUrl.searchParams.set("noteId", this.noteId);

    const res = await this.fetchClient(liveUrl.toString(), {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      const err = new Error(
        `Failed to fetch live queries for note ${this.noteId}: ${res.statusText}`,
      );
      this.status = "disconnected";
      this.emit("status", { status: "disconnected", error: err });
      throw err;
    }

    return (await res.json()) as {
      updates: SealedLiveQuery<YdocUpdateRow>;
      awareness: SealedLiveQuery<YdocAwarenessRow>;
      initialUpdates?: readonly YdocUpdateRow[];
      initialAwareness?: readonly YdocAwarenessRow[];
    };
  }

  private async renewSubscriptions(): Promise<void> {
    if (
      this.destroyed ||
      !this.updatesSubscription ||
      !this.awarenessSubscription
    ) {
      return;
    }

    const sealed = await this.fetchSealedQueries();
    if (this.destroyed) return;

    await Promise.all([
      this.updatesSubscription.renew(sealed.updates),
      this.awarenessSubscription.renew(sealed.awareness),
    ]);
  }

  private handleDocUpdate = (update: Uint8Array, origin: unknown) => {
    if (
      this.destroyed ||
      origin === "remote" ||
      this.status === "disconnected"
    ) {
      return;
    }

    this.pendingDocUpdates.push(update);

    if (this.docUpdateTimer !== null) {
      clearTimeout(this.docUpdateTimer);
    }

    this.docUpdateTimer = setTimeout(() => {
      this.flushDocUpdates().catch((err) => {
        if (this.status !== "disconnected") {
          console.warn("Failed to send doc update to server:", err);
        }
      });
    }, this.debounceMs);
  };

  async flushDocUpdates(): Promise<void> {
    if (this.docUpdateTimer !== null) {
      clearTimeout(this.docUpdateTimer);
      this.docUpdateTimer = null;
    }

    if (this.pendingDocUpdates.length === 0 || this.status === "disconnected") {
      return;
    }

    const updates = this.pendingDocUpdates;
    this.pendingDocUpdates = [];

    const first = updates[0];
    if (!first) return;
    const merged =
      updates.length === 1
        ? first
        : Y.mergeUpdates(updates as unknown as Array<Uint8Array<ArrayBuffer>>);
    await this.sendDocUpdate(merged);
  }

  private async sendDocUpdate(update: Uint8Array): Promise<void> {
    const updateUrl = new URL("/yjs/update", this.apiUrl);
    updateUrl.searchParams.set("noteId", this.noteId);

    const res = await this.fetchClient(updateUrl.toString(), {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: update as unknown as BodyInit,
    });

    if (!res.ok) {
      const err = new Error(`Failed to save doc update: ${res.statusText}`);
      if (res.status === 401) {
        this.status = "disconnected";
        this.emit("status", { status: "disconnected", error: err });
      }
      throw err;
    }
  }

  private handleAwarenessUpdate = (
    {
      added,
      updated,
      removed,
    }: { added: number[]; updated: number[]; removed: number[] },
    origin: unknown,
  ) => {
    if (
      this.destroyed ||
      origin === "remote" ||
      this.status === "disconnected"
    ) {
      return;
    }

    for (const client of added.concat(updated, removed)) {
      this.pendingAwarenessClients.add(client);
    }

    if (this.awarenessTimer !== null) {
      clearTimeout(this.awarenessTimer);
    }

    this.awarenessTimer = setTimeout(() => {
      this.flushAwarenessUpdates().catch((err) => {
        if (this.status !== "disconnected") {
          console.warn("Failed to send awareness update to server:", err);
        }
      });
    }, this.debounceMs);
  };

  async flushAwarenessUpdates(): Promise<void> {
    if (this.awarenessTimer !== null) {
      clearTimeout(this.awarenessTimer);
      this.awarenessTimer = null;
    }

    if (
      this.pendingAwarenessClients.size === 0 ||
      this.status === "disconnected"
    ) {
      return;
    }

    const clients = Array.from(this.pendingAwarenessClients);
    this.pendingAwarenessClients.clear();

    await this.sendAwarenessUpdate(clients);
  }

  private async sendAwarenessUpdate(clients: number[]): Promise<void> {
    if (clients.length === 0) return;

    const update = encodeAwarenessUpdate(this.awareness, clients);
    const awarenessUrl = new URL("/yjs/awareness", this.apiUrl);
    awarenessUrl.searchParams.set("noteId", this.noteId);

    const res = await this.fetchClient(awarenessUrl.toString(), {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/octet-stream",
      },
      body: update as unknown as BodyInit,
    });

    if (!res.ok) {
      const err = new Error(
        `Failed to save awareness update: ${res.statusText}`,
      );
      if (res.status === 401) {
        this.status = "disconnected";
        this.emit("status", { status: "disconnected", error: err });
      }
      throw err;
    }
  }

  destroy(): void {
    if (this.destroyed) return;
    this.destroyed = true;

    if (this.renewalTimer) {
      clearInterval(this.renewalTimer);
      this.renewalTimer = null;
    }

    if (this.docUpdateTimer) {
      clearTimeout(this.docUpdateTimer);
      this.docUpdateTimer = null;
    }

    if (this.awarenessTimer) {
      clearTimeout(this.awarenessTimer);
      this.awarenessTimer = null;
    }

    // Flush pending updates immediately before unbinding
    if (this.pendingDocUpdates.length > 0 && this.status !== "disconnected") {
      const updates = this.pendingDocUpdates;
      this.pendingDocUpdates = [];
      const first = updates[0];
      if (first) {
        const merged =
          updates.length === 1
            ? first
            : Y.mergeUpdates(
                updates as unknown as Array<Uint8Array<ArrayBuffer>>,
              );
        this.sendDocUpdate(merged).catch(() => {});
      }
    }

    if (
      this.pendingAwarenessClients.size > 0 &&
      this.status !== "disconnected"
    ) {
      const clients = Array.from(this.pendingAwarenessClients);
      this.pendingAwarenessClients.clear();
      this.sendAwarenessUpdate(clients).catch(() => {});
    }

    this.doc.off("update", this.handleDocUpdate);
    this.awareness.off("update", this.handleAwarenessUpdate);

    if (this.updatesSubscription) {
      this.updatesSubscription.unsubscribe();
      this.updatesSubscription = null;
    }

    if (this.awarenessSubscription) {
      this.awarenessSubscription.unsubscribe();
      this.awarenessSubscription = null;
    }

    this.synced = false;
    this.status = "disconnected";
    this.emit("status", { status: "disconnected" });
  }
}
