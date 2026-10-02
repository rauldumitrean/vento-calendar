export type CalendarView = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string | null;
  startDate: Date;
  endDate: Date;
  allDay: boolean;
  color: string;
  location?: string | null;
  userId: string;
  recurrence?: RecurrenceRule | null;
  invites?: EventInvite[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurrenceRule {
  frequency: "daily" | "weekly" | "monthly" | "yearly";
  interval: number;
  endDate?: Date;
  count?: number;
}

export interface EventInvite {
  id: string;
  eventId: string;
  inviteeId: string;
  status: "pending" | "accepted" | "declined";
  invitee?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  dueDate?: Date | null;
  priority: "low" | "medium" | "high";
  status: "todo" | "in_progress" | "done";
  category: string;
  color: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  timezone: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: "login" | "logout" | "event_create" | "event_update" | "event_delete" | "task_create" | "task_update" | "task_delete";
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
}

export type TaskPriority = Task["priority"];
export type TaskStatus = Task["status"];
export type EventColor =
  | "blue"
  | "red"
  | "green"
  | "yellow"
  | "purple"
  | "pink"
  | "orange"
  | "gray";
