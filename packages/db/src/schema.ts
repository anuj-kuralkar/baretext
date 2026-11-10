import { defineRelations, sql } from "drizzle-orm";
import {
  boolean,
  bytea,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

/** Identity and profile fields, per Better Auth's `user` model. */
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
});

/** One linked login identity — provider credentials and tokens — owned by a user. */
export const account = pgTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at")
      .$onUpdate(() => /* @__PURE__ */ new Date())
      .notNull(),
  },
  (table) => [index("account_userId_idx").on(table.userId)],
);

/** One WebAuthn credential registered through the passkey plugin, per user. */
export const passkey = pgTable(
  "passkey",
  {
    id: text("id").primaryKey(),
    name: text("name"),
    publicKey: text("public_key").notNull(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    credentialID: text("credential_id").notNull(),
    counter: integer("counter").notNull(),
    deviceType: text("device_type").notNull(),
    backedUp: boolean("backed_up").notNull(),
    transports: text("transports"),
    createdAt: timestamp("created_at"),
    aaguid: text("aaguid"),
  },
  (table) => [
    index("passkey_userId_idx").on(table.userId),
    index("passkey_credentialID_idx").on(table.credentialID),
  ],
);

/** One note document: plain editor text plus timestamps, owned by one user. */
export const note = pgTable("note", {
  id: uuid("id").primaryKey().default(sql`uuidv7()`),
  textContent: text("text_content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/**
 * One Yjs document update for a note's room, stored as raw bytes; the
 * Electric update shape streams these rows to editors over the API.
 */
export const ydocUpdate = pgTable("ydoc_update", {
  id: uuid("id").primaryKey().default(sql`uuidv7()`),
  noteId: uuid("note_id")
    .notNull()
    .references(() => note.id, { onDelete: "cascade" }),
  op: bytea("op").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/**
 * A user's latest Yjs awareness (presence) op on a note, stored in place:
 * (userId, noteId) is the primary key, so there is one row per participant
 * per note.
 */
export const ydocAwareness = pgTable(
  "ydoc_awareness",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    noteId: uuid("note_id")
      .notNull()
      .references(() => note.id, { onDelete: "cascade" }),
    op: bytea("op").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
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
