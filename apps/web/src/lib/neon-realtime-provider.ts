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

interface SealedQueries {
  updates: SealedLiveQuery<YdocUpdateRow>;
  awareness: SealedLiveQuery<YdocAwarenessRow>;
  initialUpdates?: readonly YdocUpdateRow[];
  initialAwareness?: readonly YdocAwarenessRow[];
}

const REMOTE_ORIGIN = "remote";
const EMPTY_UPDATE = Y.encodeStateAsUpdate(new Y.Doc());

function isEmptyUpdate(update: Uint8Array): boolean {
  return (
    update.byteLength === EMPTY_UPDATE.byteLength &&
    update.every((byte, index) => byte === EMPTY_UPDATE[index])
  );
}

/**
 * Decode the representations a bytea value can take on its way from Neon to
 * the browser: a typed array, a JSON Buffer (`{type: "Buffer", data}`), a
 * number array, or a hex string (`\x...`, as Postgres prints it).
 */
export function toUint8Array(val: unknown): Uint8Array {
  if (val instanceof Uint8Array) {
    return val;
  }
  if (val instanceof ArrayBuffer) {
    return new Uint8Array(val);
  }
  if (ArrayBuffer.isView(val)) {
    return new Uint8Array(val.buffer, val.byteOffset, val.byteLength);
  }
  if (typeof val === "string") {
    const hex = val.startsWith("\\x") ? val.slice(2) : val;
    if (hex.length % 2 === 0 && /^[0-9a-fA-F]*$/.test(hex)) {
      const bytes = new Uint8Array(hex.length / 2);
      for (let i = 0; i < bytes.length; i++) {
        bytes[i] = Number.parseInt(hex.slice(i * 2, i * 2 + 2), 16);
      }
      return bytes;
    }
    try {
      const binary = atob(hex);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
      }
      return bytes;
    } catch {
      return new Uint8Array(0);
    }
  }
  if (Array.isArray(val)) {
    return new Uint8Array(val);
  }
  if (val && typeof val === "object" && "data" in val) {
    return toUint8Array((val as { data: unknown }).data);
  }
  return new Uint8Array(0);
}

/**
 * Custom Yjs provider using Neon Realtime for live SQL query subscriptions.
 *
 * The provider is intentionally inert until {@link connect} is called: React
 * (and React Strict Mode) mounts effects twice, so construction must not open
 * sockets or fetch. {@link disconnect} tears the connection down without
 * touching the document, which makes the provider safe to reuse when an
 * editor is hidden and shown again.
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
  private flushInFlight = false;

  private updatesSubscription: MaterializedLiveQuerySubscription<YdocUpdateRow> | null =
    null;
  private awarenessSubscription: MaterializedLiveQuerySubscription<YdocAwarenessRow> | null =
    null;

  private readonly appliedUpdates = new Set<string>();
  private renewalTimer: ReturnType<typeof setInterval> | null = null;
  private destroyed = false;
  private readonly ownsAwareness: boolean;
  private listening = false;
  private connectionId = 0;

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
    // Debounce saves by at least 100ms.
    this.debounceMs = Math.max(100, debounceMs);

    this.awareness = awareness ?? new Awareness(doc);
    this.ownsAwareness = awareness === undefined;
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

  /**
   * Connect the document to its note. Safe to call again after
   * {@link disconnect}; a call while another connect is in flight
   * supersedes it.
   */
  async connect(): Promise<void> {
    if (this.destroyed || this.status === "connected") return;

    const connection = ++this.connectionId;
    this.status = "connecting";
    this.emit("status", { status: "connecting" });
    this.startListening();

    let sealed: SealedQueries;
    try {
      sealed = await this.fetchSealedQueries();
    } catch (error) {
      if (this.isStale(connection)) return;
      this.fail(error);
      throw error;
    }
    if (this.isStale(connection)) return;

    // A scratch document holding only what the server has: the vector lets
    // us send exactly the local edits the server lacks, instead of replaying
    // the whole document (which grew a row per open) or losing offline edits
    // (which the provider never saw as updates).
    const serverDoc = new Y.Doc();
    for (const row of sealed.initialUpdates ?? []) {
      const bytes = toUint8Array(row.op);
      if (bytes.byteLength === 0) continue;
      try {
        Y.applyUpdate(serverDoc, bytes);
      } catch {
        // The update was already rejected below; skip it here too.
      }
    }

    for (const row of sealed.initialUpdates ?? []) {
      this.applyRemoteUpdate(row);
    }
    for (const row of sealed.initialAwareness ?? []) {
      this.applyRemoteAwareness(row);
    }

    if (this.isStale(connection)) {
      serverDoc.destroy();
      return;
    }

    const localOnly = Y.encodeStateAsUpdate(
      this.doc,
      Y.encodeStateVector(serverDoc),
    );
    serverDoc.destroy();

    // Everything pending is included in `localOnly` (it is the document with
    // the server's vector removed), so replacing the queue avoids sending
    // the same structs twice.
    this.pendingDocUpdates = [];
    if (!isEmptyUpdate(localOnly)) {
      await this.sendDocUpdate(localOnly).catch((error) => {
        if (this.status === "disconnected") return;
        console.warn("Failed to send local edits to server:", error);
        this.pendingDocUpdates.push(localOnly);
        this.scheduleFlush();
      });
    }
    if (this.isStale(connection)) return;

    this.updatesSubscription = this.realtimeClient.subscribe(sealed.updates, {
      materialize: true,
    });
    this.awarenessSubscription = this.realtimeClient.subscribe(
      sealed.awareness,
      {
        materialize: true,
      },
    );

    this.updatesSubscription.onChange((snapshot) => {
      if (this.destroyed || this.isStale(connection)) return;

      if (snapshot.status === "live" && snapshot.data) {
        for (const row of snapshot.data) {
          this.applyRemoteUpdate(row);
        }
        this.markSynced();
      } else if (snapshot.status === "error") {
        this.fail(snapshot.error);
      }
    });

    this.awarenessSubscription.onChange((snapshot) => {
      if (this.destroyed || this.isStale(connection)) return;
      if (snapshot.status === "live" && snapshot.data) {
        for (const row of snapshot.data) {
          this.applyRemoteAwareness(row);
        }
      }
    });

    this.renewalTimer = setInterval(() => {
      this.renewSubscriptions(connection).catch((err) => {
        console.warn("Failed to renew Neon Realtime sealed queries:", err);
      });
    }, this.renewalIntervalMs);

    this.markSynced();
    this.flushDocUpdates().catch(() => {});
  }

  /**
   * Stop syncing without destroying the document or awareness. The next
   * {@link connect} resumes from whatever the document holds.
   */
  disconnect(): void {
    if (
      this.status === "disconnected" &&
      !this.listening &&
      !this.updatesSubscription &&
      !this.awarenessSubscription
    ) {
      return;
    }

    // Take the last local edits with us. If the send fails they stay queued
    // for the next connect, whose diff also covers them.
    void this.flushDocUpdates().catch(() => {});
    void this.flushAwarenessUpdates().catch(() => {});
    this.teardownConnection();

    this.synced = false;
    this.status = "disconnected";
    this.emit("status", { status: "disconnected" });
  }

  private teardownConnection(): void {
    this.connectionId++;
    this.stopListening();
    this.clearTimers();

    this.updatesSubscription?.unsubscribe();
    this.updatesSubscription = null;
    this.awarenessSubscription?.unsubscribe();
    this.awarenessSubscription = null;
  }

  destroy(): void {
    if (this.destroyed) return;
    this.disconnect();
    this.destroyed = true;
    if (this.ownsAwareness) {
      this.awareness.destroy();
    }
  }

  private isStale(connection: number): boolean {
    return this.destroyed || this.connectionId !== connection;
  }

  private isDisconnected(): boolean {
    return this.status === "disconnected";
  }

  private startListening(): void {
    if (this.listening) return;
    this.listening = true;
    this.doc.on("update", this.handleDocUpdate);
    this.awareness.on("update", this.handleAwarenessUpdate);
  }

  private stopListening(): void {
    if (!this.listening) return;
    this.listening = false;
    this.doc.off("update", this.handleDocUpdate);
    this.awareness.off("update", this.handleAwarenessUpdate);
  }

  private clearTimers(): void {
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
  }

  private fail(error: unknown): void {
    const normalized =
      error instanceof Error ? error : new Error(String(error));
    this.teardownConnection();
    this.synced = false;
    this.status = "disconnected";
    this.emit("status", { status: "disconnected", error: normalized });
  }

  private markSynced(): void {
    if (!this.synced) {
      this.synced = true;
      this.status = "connected";
      this.emit("synced", true);
      this.emit("status", { status: "connected" });
    }
  }

  private applyRemoteUpdate(row: YdocUpdateRow): void {
    if (this.appliedUpdates.has(row.id)) return;
    this.appliedUpdates.add(row.id);

    const bytes = toUint8Array(row.op);
    if (bytes.byteLength === 0) return;
    try {
      Y.applyUpdate(this.doc, bytes, REMOTE_ORIGIN);
    } catch (error) {
      // One corrupt row must not stop the rest of the document from
      // syncing. The server keeps the row; the client stays usable.
      console.warn(`Skipping invalid Yjs update row ${row.id}:`, error);
    }
  }

  private applyRemoteAwareness(row: YdocAwarenessRow): void {
    const bytes = toUint8Array(row.op);
    if (bytes.byteLength === 0) return;
    try {
      applyAwarenessUpdate(this.awareness, bytes, REMOTE_ORIGIN);
    } catch (error) {
      console.warn(
        `Skipping invalid Yjs awareness row for ${row.noteId}:`,
        error,
      );
    }
  }

  private async fetchSealedQueries(): Promise<SealedQueries> {
    const liveUrl = new URL("/yjs/live", this.apiUrl);
    liveUrl.searchParams.set("noteId", this.noteId);

    const res = await this.fetchClient(liveUrl.toString(), {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(
        `Failed to fetch live queries for note ${this.noteId}: ${res.status} ${res.statusText}`,
      );
    }

    return (await res.json()) as SealedQueries;
  }

  private async renewSubscriptions(connection: number): Promise<void> {
    if (
      this.isStale(connection) ||
      !this.updatesSubscription ||
      !this.awarenessSubscription
    ) {
      return;
    }

    const sealed = await this.fetchSealedQueries();
    if (this.isStale(connection)) return;

    await Promise.all([
      this.updatesSubscription.renew(sealed.updates),
      this.awarenessSubscription.renew(sealed.awareness),
    ]);
  }

  private handleDocUpdate = (update: Uint8Array, origin: unknown) => {
    if (
      this.destroyed ||
      origin === REMOTE_ORIGIN ||
      this.status === "disconnected"
    ) {
      return;
    }

    this.pendingDocUpdates.push(update);
    this.scheduleFlush();
  };

  private scheduleFlush(delay = this.debounceMs): void {
    if (this.destroyed) return;
    if (this.docUpdateTimer !== null) {
      clearTimeout(this.docUpdateTimer);
    }
    this.docUpdateTimer = setTimeout(() => {
      this.docUpdateTimer = null;
      this.flushDocUpdates().catch((err) => {
        if (this.status !== "disconnected") {
          console.warn("Failed to send doc update to server:", err);
        }
      });
    }, delay);
  }

  async flushDocUpdates(): Promise<void> {
    if (this.docUpdateTimer !== null) {
      clearTimeout(this.docUpdateTimer);
      this.docUpdateTimer = null;
    }

    if (
      this.flushInFlight ||
      this.pendingDocUpdates.length === 0 ||
      this.status !== "connected"
    ) {
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
    if (isEmptyUpdate(merged)) return;

    this.flushInFlight = true;
    let failed = false;
    try {
      await this.sendDocUpdate(merged);
    } catch (error) {
      failed = true;
      this.pendingDocUpdates.unshift(merged);
      throw error;
    } finally {
      this.flushInFlight = false;
      if (this.pendingDocUpdates.length > 0 && !this.isDisconnected()) {
        this.scheduleFlush(failed ? 2_000 : this.debounceMs);
      }
    }
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
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        this.fail(err);
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
      origin === REMOTE_ORIGIN ||
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
      this.awarenessTimer = null;
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

    try {
      await this.sendAwarenessUpdate(clients);
    } catch (error) {
      for (const client of clients) {
        this.pendingAwarenessClients.add(client);
      }
      throw error;
    }
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
      if (res.status === 401 || res.status === 403 || res.status === 404) {
        this.fail(err);
      }
      throw err;
    }
  }
}
