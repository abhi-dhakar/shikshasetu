import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const demoRequests = pgTable(
  "demo_requests",
  {
    id: serial("id").primaryKey(),
    parentFirstName: varchar("parent_first_name", { length: 120 }).notNull(),
    parentLastName: varchar("parent_last_name", { length: 120 }).notNull(),
    childFirstName: varchar("child_first_name", { length: 120 }).notNull(),
    childLastName: varchar("child_last_name", { length: 120 }).notNull(),
    standard: varchar("standard", { length: 60 }).notNull(),
    board: varchar("board", { length: 60 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 180 }),
    addressLine1: varchar("address_line1", { length: 240 }).notNull(),
    addressLine2: varchar("address_line2", { length: 240 }),
    city: varchar("city", { length: 120 }).notNull(),
    state: varchar("state", { length: 120 }).notNull(),
    postalCode: varchar("postal_code", { length: 20 }).notNull(),
    schoolName: varchar("school_name", { length: 200 }),
    mode: varchar("mode", { length: 40 }).notNull(),
    preferredDate: varchar("preferred_date", { length: 20 }).notNull(),
    preferredSlot: varchar("preferred_slot", { length: 20 }).notNull(),
    altDate: varchar("alt_date", { length: 20 }),
    altTime: varchar("alt_time", { length: 20 }),
    comments: text("comments"),
    status: varchar("status", { length: 30 }).notNull().default("new"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("demo_requests_slot_idx").on(table.preferredDate, table.preferredSlot),
  ],
);

export const tutorApplications = pgTable("tutor_applications", {
  id: serial("id").primaryKey(),
  fullName: varchar("full_name", { length: 160 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 180 }),
  qualification: varchar("qualification", { length: 160 }).notNull(),
  experience: varchar("experience", { length: 60 }).notNull(),
  subjects: varchar("subjects", { length: 300 }).notNull(),
  classes: varchar("classes", { length: 160 }).notNull(),
  boards: varchar("boards", { length: 160 }).notNull(),
  area: varchar("area", { length: 120 }).notNull(),
  mode: varchar("mode", { length: 40 }).notNull(),
  about: text("about"),
  status: varchar("status", { length: 30 }).notNull().default("received"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 160 }).notNull(),
    phone: varchar("phone", { length: 20 }).notNull(),
    email: varchar("email", { length: 180 }),
    topic: varchar("topic", { length: 80 }).notNull(),
    message: text("message").notNull(),
    status: varchar("status", { length: 30 }).notNull().default("unread"),
    handledAt: timestamp("handled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("contact_messages_status_idx").on(table.status)],
);

export const adminAccounts = pgTable(
  "admin_accounts",
  {
    id: serial("id").primaryKey(),
    username: varchar("username", { length: 120 }).notNull(),
    displayName: varchar("display_name", { length: 160 }).notNull(),
    passwordHash: varchar("password_hash", { length: 300 }).notNull(),
    active: boolean("active").notNull().default(true),
    passwordChangedAt: timestamp("password_changed_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("admin_accounts_username_idx").on(table.username)],
);

export const adminLoginAttempts = pgTable(
  "admin_login_attempts",
  {
    id: serial("id").primaryKey(),
    fingerprint: varchar("fingerprint", { length: 80 }).notNull(),
    failedCount: integer("failed_count").notNull().default(0),
    blockedUntil: timestamp("blocked_until", { withTimezone: true }),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("admin_login_attempts_fingerprint_idx").on(table.fingerprint)],
);

export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: serial("id").primaryKey(),
    actor: varchar("actor", { length: 120 }).notNull(),
    action: varchar("action", { length: 80 }).notNull(),
    entityType: varchar("entity_type", { length: 60 }),
    entityId: integer("entity_id"),
    detail: text("detail"),
    fingerprint: varchar("fingerprint", { length: 80 }),
    successful: boolean("successful").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("admin_audit_logs_created_at_idx").on(table.createdAt),
    index("admin_audit_logs_action_idx").on(table.action),
  ],
);

export type DemoRequest = typeof demoRequests.$inferSelect;
export type TutorApplication = typeof tutorApplications.$inferSelect;
export type ContactMessage = typeof contactMessages.$inferSelect;
export type AdminAccount = typeof adminAccounts.$inferSelect;
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
