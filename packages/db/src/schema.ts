import { defineRelations, sql } from "drizzle-orm";
import {
  bigint,
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

export const yhubYdocV1 = pgTable(
  "yhub_ydoc_v1",
  {
    org: text("org"),
    docid: text("docid"),
    branch: text("branch"),
    t: text("t"),
    created: bigint("created", { mode: "number" }),
    gcDoc: bytea("gc_doc"),
    nongcDoc: bytea("nongc_doc"),
    contentmap: bytea("contentmap"),
    contentids: bytea("contentids"),
  },
  (table) => [
    primaryKey({
      columns: [table.org, table.docid, table.branch, table.t],
    }),
    index("yhub_ydoc_v1_updated").on(table.org, table.created),
  ],
);

export const yhubYdocTombstonesV1 = pgTable(
  "yhub_ydoc_tombstones_v1",
  {
    org: text("org"),
    docid: text("docid"),
    branch: text("branch"),
    deletedAt: bigint("deleted_at", { mode: "number" }).notNull(),
    hard: boolean("hard").notNull(),
    purgedAt: bigint("purged_at", { mode: "number" }),
    by: text("by"),
  },
  (table) => [
    primaryKey({
      columns: [table.org, table.docid, table.branch],
    }),
    index("yhub_ydoc_tombstones_v1_pending")
      .on(table.deletedAt)
      .where(sql`${table.purgedAt} IS NULL`),
    index("yhub_ydoc_tombstones_v1_updated").on(table.org, table.deletedAt),
  ],
);

export const yhubYdocVersionsV1 = pgTable(
  "yhub_ydoc_versions_v1",
  {
    org: text("org"),
    docid: text("docid"),
    branch: text("branch"),
    t: bigint("t", { mode: "number" }),
    name: text("name").notNull(),
    custom: bytea("custom").notNull(),
    published: boolean("published").notNull().default(false),
    publishedAt: bigint("published_at", { mode: "number" }),
    publishedBy: text("published_by"),
    createdAt: bigint("created_at", { mode: "number" }).notNull(),
    updatedAt: bigint("updated_at", { mode: "number" }).notNull(),
    createdBy: text("created_by"),
    updatedBy: text("updated_by"),
  },
  (table) => [
    primaryKey({
      columns: [table.org, table.docid, table.branch, table.t],
    }),
  ],
);

export const relations = defineRelations(
  { user, account, passkey, note },
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
    },
  }),
);
