"use client";

import { getWeekDays, isSameDayCheck, EVENT_COLORS } from "@/lib/utils";
import { format, setHours, setMinutes } from "date-fns";
import { es } from "date-fns/locale";
import type { CalendarEvent } from "@/types";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DAY_NAMES_SHORT = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSlotClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function WeekView({ currentDate, events, onSlotClick, onEventClick }: WeekViewProps) {
  const days = getWeekDays(currentDate);
  const today = new Date();

  const getEventsForDay = (day: Date) =>
    events.filter(e => isSameDayCheck(new Date(e.startDate), day) && !e.allDay);

  const getAllDayEventsForDay = (day: Date) =>
    events.filter(e => isSameDayCheck(new Date(e.startDate), day) && e.allDay);

  const getEventStyle = (event: CalendarEvent) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    const startMinutes = start.getHours() * 60 + start.getMinutes();
    const durationMinutes = Math.max((end.getTime() - start.getTime()) / 60000, 30);
    const top = (startMinutes / 60) * 64; // 64px per hour
    const height = (durationMinutes / 60) * 64;
    return { top: `${top}px`, height: `${Math.max(height, 28)}px` };
  };

  return (
    <div className="flex flex-col h-full overflow-auto">
      {/* Header */}
      <div className="flex-shrink-0 sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="flex">
          <div className="w-16 flex-shrink-0" />
          {days.map((day, i) => {
            const isToday = isSameDayCheck(day, today);
            const allDay = getAllDayEventsForDay(day);
            return (
              <div key={i} className="flex-1 text-center py-2 border-l border-gray-100 dark:border-gray-800">
                <p className="text-xs text-gray-500 dark:text-gray-400 uppercase">{DAY_NAMES_SHORT[i]}</p>
                <div className={cn(
                  "mx-auto w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold mt-0.5",
                  isToday ? "bg-blue-600 text-white" : "text-gray-900 dark:text-gray-100"
                )}>
                  {format(day, "d")}
                </div>
                {allDay.map(e => {
                  const colors = EVENT_COLORS[e.color] ?? EVENT_COLORS.blue;
                  return (
                    <div
                      key={e.id}
                      onClick={() => onEventClick(e)}
                      className={cn("mx-1 mt-1 px-1 py-0.5 rounded text-xs truncate cursor-pointer", colors.bg, colors.text)}
                    >
                      {e.title}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex flex-1">
        {/* Hours */}
        <div className="w-16 flex-shrink-0">
          {HOURS.map(h => (
            <div key={h} className="h-16 border-b border-gray-100 dark:border-gray-800 flex items-start justify-end pr-2 pt-1">
              <span className="text-xs text-gray-400">{h === 0 ? "" : `${h}:00`}</span>
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, di) => (
          <div
            key={di}
            className="flex-1 relative border-l border-gray-100 dark:border-gray-800"
            onClick={e => {
              const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
              const y = e.clientY - rect.top;
              const hour = Math.floor(y / 64);
              const mins = y % 64 >= 32 ? 30 : 0;
              const date = setMinutes(setHours(new Date(day), hour), mins);
              onSlotClick(date);
            }}
          >
            {HOURS.map(h => (
              <div key={h} className="h-16 border-b border-gray-100 dark:border-gray-800 hover:bg-blue-50/30 dark:hover:bg-blue-900/10 transition-colors" />
            ))}

            {/* Events */}
            {getEventsForDay(day).map(event => {
              const style = getEventStyle(event);
              const colors = EVENT_COLORS[event.color] ?? EVENT_COLORS.blue;
              return (
                <div
                  key={event.id}
                  style={style}
                  onClick={e => { e.stopPropagation(); onEventClick(event); }}
                  className={cn(
                    "absolute left-1 right-1 rounded-lg px-1.5 py-1 cursor-pointer hover:opacity-90 transition shadow-sm overflow-hidden",
                    colors.bg, colors.text, `border-l-2 ${colors.border}`
                  )}
                >
                  <p className="text-xs font-semibold truncate">{event.title}</p>
                  <p className="text-xs opacity-75">
                    {format(new Date(event.startDate), "HH:mm")} – {format(new Date(event.endDate), "HH:mm")}
                  </p>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

