import { pgTable, text, timestamp, boolean, json, integer, pgEnum } from "drizzle-orm/pg-core";
import { createId } from "@paralleldrive/cuid2";

// ── Enums ──────────────────────────────────────────────────────────────────
export const taskPriorityEnum = pgEnum("task_priority", ["low", "medium", "high"]);
export const taskStatusEnum = pgEnum("task_status", ["todo", "in_progress", "done"]);
export const inviteStatusEnum = pgEnum("invite_status", ["pending", "accepted", "declined"]);
export const auditActionEnum = pgEnum("audit_action", [
  "login",
  "logout",
  "event_create",
  "event_update",
  "event_delete",
  "task_create",
  "task_update",
  "task_delete",
]);

// ── Calendar Events ────────────────────────────────────────────────────────
export const calendarEvents = pgTable("calendar_events", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  startDate: timestamp("start_date", { withTimezone: true }).notNull(),
  endDate: timestamp("end_date", { withTimezone: true }).notNull(),
  allDay: boolean("all_day").notNull().default(false),
  color: text("color").notNull().default("blue"),
  location: text("location"),
  userId: text("user_id").notNull(),
  recurrence: json("recurrence"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Event Invites ──────────────────────────────────────────────────────────
export const eventInvites = pgTable("event_invites", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  eventId: text("event_id").notNull().references(() => calendarEvents.id, { onDelete: "cascade" }),
  inviteeId: text("invitee_id").notNull(),
  status: inviteStatusEnum("status").notNull().default("pending"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Tasks ──────────────────────────────────────────────────────────────────
export const tasks = pgTable("calendar_tasks", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description"),
  dueDate: timestamp("due_date", { withTimezone: true }),
  priority: taskPriorityEnum("priority").notNull().default("medium"),
  status: taskStatusEnum("status").notNull().default("todo"),
  category: text("category").notNull().default("general"),
  color: text("color").notNull().default("blue"),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── User Settings ──────────────────────────────────────────────────────────
export const userSettings = pgTable("calendar_user_settings", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().unique(),
  timezone: text("timezone").notNull().default("Europe/Madrid"),
  dailyDigestEnabled: boolean("daily_digest_enabled").notNull().default(true),
  dailyDigestTime: text("daily_digest_time").notNull().default("08:00"),
  theme: text("theme").notNull().default("system"),
  defaultView: text("default_view").notNull().default("month"),
  weekStartsOn: integer("week_starts_on").notNull().default(1),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

// ── Audit Log ──────────────────────────────────────────────────────────────
export const auditLogs = pgTable("calendar_audit_logs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull(),
  action: auditActionEnum("action").notNull(),
  metadata: json("metadata"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// -- Schedules ----------------------------------------------------------
export const schedules = pgTable("calendar_schedules", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  dayOfWeek: integer("day_of_week").notNull(),
  startTime: text("start_time").notNull(),
  endTime: text("end_time").notNull(),
  location: text("location"),
  color: text("color").notNull().default("blue"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
