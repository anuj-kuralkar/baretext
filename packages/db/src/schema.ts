import { defineRelations, sql } from "drizzle-orm";
import {
  boolean,
  bytea,
  index,
  integer,
  primaryKey,
  snakeCase,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** Identity and profile fields, per Better Auth's `user` model. */
export const user = snakeCase.table("user", {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp()
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/** One linked login identity — provider credentials and tokens — owned by a user. */
export const account = snakeCase.table(
  "account",
  {
    id: text().primaryKey(),
    accountId: text().notNull(),
    providerId: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text(),
    refreshToken: text(),
    idToken: text(),
    accessTokenExpiresAt: timestamp(),
    refreshTokenExpiresAt: timestamp(),
    scope: text(),
    password: text(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp()
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

/** One WebAuthn credential registered through the passkey plugin, per user. */
export const passkey = snakeCase.table(
  "passkey",
  {
    id: text().primaryKey(),
    name: text(),
    publicKey: text().notNull(),
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: text().notNull(),
    counter: integer().notNull(),
    deviceType: text().notNull(),
    backedUp: boolean().notNull(),
    transports: text(),
    createdAt: timestamp(),
    aaguid: text(),
  },
  (table) => [
    index("passkey_userId_idx").on(table.userId),
    index("passkey_credentialID_idx").on(table.credentialID),
  ],
);

/** One note document: plain editor text plus timestamps, owned by one user. */
export const note = snakeCase.table("note", {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  textContent: text().notNull(),
  createdAt: timestamp({ withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/**
 * One Yjs document update for a note's room, stored as raw bytes; the
 * Electric update shape streams these rows to editors over the API.
 */
export const ydocUpdate = snakeCase.table("ydoc_update", {
  id: uuid().primaryKey().default(sql`uuidv7()`),
  noteId: uuid()
    .notNull()
    .references(() => note.id, { onDelete: "cascade" }),
  op: bytea().notNull(),
  userId: text()
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/**
 * A user's latest Yjs awareness (presence) op on a note, stored in place:
 * (userId, noteId) is the primary key, so there is one row per participant
 * per note.
 */
export const ydocAwareness = snakeCase.table(
  "ydoc_awareness",
  {
    userId: text()
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    noteId: uuid()
      .notNull()
      .references(() => note.id, { onDelete: "cascade" }),
    op: bytea().notNull(),
    updatedAt: timestamp({ withTimezone: true })
      .defaultNow()
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [primaryKey({ columns: [table.userId, table.noteId] })],
);

/** Drizzle relation graph consumed by the relational query builder and the auth drizzle adapter. */
export const relations = defineRelations(
  { user, account, passkey, note, ydocUpdate },
  (r) => ({
    user: {
      accounts: r.many.account(),
      passkeys: r.many.passkey(),
      notes: r.many.note(),
    },
    account: {
      user: r.one.user({
        from: r.account.userId,
        to: r.user.id,
      }),
    },
    passkey: {
      user: r.one.user({
        from: r.passkey.userId,
        to: r.user.id,
      }),
    },
    note: {
      user: r.one.user({
        from: r.note.userId,
        to: r.user.id,
      }),
      ydocUpdates: r.many.ydocUpdate(),
    },
    ydocUpdate: {
      note: r.one.note({
        from: r.ydocUpdate.noteId,
        to: r.note.id,
      }),
      user: r.one.user({
        from: r.ydocUpdate.userId,
        to: r.user.id,
      }),
    },
  }),
);
