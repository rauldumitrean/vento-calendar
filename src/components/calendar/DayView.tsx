"use client";

import { isSameDayCheck, EVENT_COLORS } from "@/lib/utils";
import { format, setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";
import type { CalendarEvent } from "@/types";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSlotClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function DayView({ currentDate, events, onSlotClick, onEventClick }: DayViewProps) {
  const today = new Date();
  const isToday = isSameDayCheck(currentDate, today);

  const dayEvents = events.filter(e => isSameDayCheck(new Date(e.startDate), currentDate) && !e.allDay);
  const allDayEvents = events.filter(e => isSameDayCheck(new Date(e.startDate), currentDate) && e.allDay);

  const getEventStyle = (event: CalendarEvent) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const durationMinutes = Math.max((end.getTime() - start.getTime()) / 60000, 30);
    const top = (startMinutes / 60) * 80;
    const height = (durationMinutes / 60) * 80;
    return { top: `${top}px`, height: `${Math.max(height, 32)}px` };
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className={cn(
            "w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold",
            isToday ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          )}>
            {format(currentDate, "d")}
          </div>
          <div>
            <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {format(currentDate, "EEEE", { locale: es })}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
              {format(currentDate, "MMMM yyyy", { locale: es })}
            </p>
          </div>
        </div>

        {allDayEvents.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {allDayEvents.map(e => {
              const colors = EVENT_COLORS[e.color] ?? EVENT_COLORS.blue;
              return (
                <div
                  key={e.id}
                  onClick={() => onEventClick(e)}
                  className={cn("px-2 py-1 rounded-lg text-sm font-medium cursor-pointer", colors.bg, colors.text)}
                >
                  {e.title}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Time grid */}
      <div className="flex flex-1">
        <div className="w-20 flex-shrink-0">
          {HOURS.map(h => (
            <div key={h} className="h-20 border-b border-gray-100 dark:border-gray-800 flex items-start justify-end pr-3 pt-1">
              <span className="text-xs text-gray-400">{h === 0 ? "" : `${String(h).padStart(2, "0")}:00`}</span>
            </div>
          ))}
        </div>

        <div
          className="flex-1 relative border-l border-gray-200 dark:border-gray-700"
          onClick={e => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            const y = e.clientY - rect.top;
            const hour = Math.floor(y / 80);
            const mins = y % 80 >= 40 ? 30 : 0;
            const date = setMinutes(setHours(new Date(currentDate), hour), mins);
            onSlotClick(date);
          }}
        >
          {HOURS.map(h => (
            <div key={h} className="h-20 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors" />
          ))}

          {dayEvents.map(event => {
            const style = getEventStyle(event);
            const colors = EVENT_COLORS[event.color] ?? EVENT_COLORS.blue;
            return (
              <div
                key={event.id}
                style={style}
                onClick={e => { e.stopPropagation(); onEventClick(event); }}
                className={cn(
                  "absolute left-2 right-2 rounded-xl px-3 py-2 cursor-pointer hover:opacity-90 transition shadow-sm overflow-hidden",
                  colors.bg, colors.text, `border-l-4 ${colors.border}`
                )}
              >
                <p className="font-semibold truncate">{event.title}</p>
                <p className="text-sm opacity-75">
                  {format(new Date(event.startDate), "HH:mm")} – {format(new Date(event.endDate), "HH:mm")}
                </p>
                {event.location && <p className="text-xs opacity-60 truncate">📍 {event.location}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

