import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isSameMonth, addDays, addWeeks, addMonths, addYears } from "date-fns";
import { es } from "date-fns/locale";
import type { CalendarEvent, RecurrenceRule } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date, fmt: string = "PPP") {
  return format(date, fmt, { locale: es });
}

export function getMonthDays(date: Date, weekStartsOn: 0 | 1 = 1) {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn });
  const end = endOfWeek(endOfMonth(date), { weekStartsOn });
  return eachDayOfInterval({ start, end });
}

export function getWeekDays(date: Date, weekStartsOn: 0 | 1 = 1) {
  const start = startOfWeek(date, { weekStartsOn });
  const end = endOfWeek(date, { weekStartsOn });
  return eachDayOfInterval({ start, end });
}

export function isSameDayCheck(a: Date, b: Date) {
  return isSameDay(a, b);
}

export function isSameMonthCheck(a: Date, b: Date) {
  return isSameMonth(a, b);
}

export const EVENT_COLORS: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  blue:   { bg: "bg-blue-100 dark:bg-blue-900/40",   text: "text-blue-800 dark:text-blue-200",   border: "border-blue-400",   dot: "bg-blue-500" },
  red:    { bg: "bg-red-100 dark:bg-red-900/40",     text: "text-red-800 dark:text-red-200",     border: "border-red-400",    dot: "bg-red-500" },
  green:  { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-800 dark:text-green-200", border: "border-green-400",  dot: "bg-green-500" },
  yellow: { bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-800 dark:text-yellow-200", border: "border-yellow-400", dot: "bg-yellow-500" },
  purple: { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-800 dark:text-purple-200", border: "border-purple-400", dot: "bg-purple-500" },
  pink:   { bg: "bg-pink-100 dark:bg-pink-900/40",   text: "text-pink-800 dark:text-pink-200",   border: "border-pink-400",   dot: "bg-pink-500" },
  orange: { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-800 dark:text-orange-200", border: "border-orange-400", dot: "bg-orange-500" },
  gray:   { bg: "bg-gray-100 dark:bg-gray-800",      text: "text-gray-800 dark:text-gray-200",   border: "border-gray-400",   dot: "bg-gray-500" },
};

export function expandRecurringEvent(event: CalendarEvent, rangeStart: Date, rangeEnd: Date): CalendarEvent[] {
  if (!event.recurrence) return [event];

  const rule = event.recurrence as RecurrenceRule;
  const events: CalendarEvent[] = [];
  let current = new Date(event.startDate);
  const duration = event.endDate.getTime() - event.startDate.getTime();
  let count = 0;

  while (current <= rangeEnd) {
    const endDate = new Date(current.getTime() + duration);

    if (current >= rangeStart) {
      events.push({
        ...event,
        id: `${event.id}_${count}`,
        startDate: new Date(current),
        endDate,
      });
    }

    count++;
    if (rule.count && count >= rule.count) break;
    if (rule.endDate && current > new Date(rule.endDate)) break;

    switch (rule.frequency) {
      case "daily":   current = addDays(current, rule.interval ?? 1); break;
      case "weekly":  current = addWeeks(current, rule.interval ?? 1); break;
      case "monthly": current = addMonths(current, rule.interval ?? 1); break;
      case "yearly":  current = addYears(current, rule.interval ?? 1); break;
    }
  }

  return events;
}
