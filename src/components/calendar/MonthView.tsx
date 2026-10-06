"use client";

import { getMonthDays, isSameDayCheck, isSameMonthCheck, EVENT_COLORS, expandRecurringEvent } from "@/lib/utils";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import type { CalendarEvent } from "@/types";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

const DAY_NAMES = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onDayClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export function MonthView({ currentDate, events, onDayClick, onEventClick }: MonthViewProps) {
  const days = getMonthDays(currentDate);
  const today = new Date();

  const expandedEvents = useMemo(() => {
    const start = days[0];
    const end = days[days.length - 1];
    return events.flatMap(e => expandRecurringEvent(e, start, end));
  }, [events, days]);

  const getEventsForDay = (day: Date) =>
    expandedEvents.filter(e => isSameDayCheck(new Date(e.startDate), day));

  return (
    <div className="h-full flex flex-col">
      {/* Day names header */}
      <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-800">
        {DAY_NAMES.map(name => (
          <div key={name} className="py-2 text-center text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            {name}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex-1 grid grid-cols-7 auto-rows-fr">
        {days.map((day, i) => {
          const dayEvents = getEventsForDay(day);
          const isToday = isSameDayCheck(day, today);
          const isCurrentMonth = isSameMonthCheck(day, currentDate);
          const isWeekend = day.getDay() === 0 || day.getDay() === 6;

          return (
            <div
              key={i}
              onClick={() => onDayClick(day)}
              className={cn(
                "border-r border-b border-gray-100 dark:border-gray-800 p-1 md:p-1.5 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50 min-h-[60px] md:min-h-[80px]",
                !isCurrentMonth && "bg-gray-50/50 dark:bg-gray-900/30",
                isWeekend && isCurrentMonth && "bg-blue-50/20 dark:bg-blue-900/5"
              )}
            >
              {/* Day number */}
              <div className="flex justify-center mb-1">
                <span className={cn(
                  "w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-full text-xs md:text-sm font-medium",
                  isToday && "bg-blue-600 text-white",
                  !isToday && isCurrentMonth && "text-gray-900 dark:text-gray-100",
                  !isToday && !isCurrentMonth && "text-gray-400 dark:text-gray-600"
                )}>
                  {format(day, "d")}
                </span>
              </div>

              {/* Desktop Events */}
              <div className="hidden md:block space-y-0.5">
                {dayEvents.slice(0, 3).map(event => {
                  const colors = EVENT_COLORS[event.color] ?? EVENT_COLORS.blue;
                  return (
                    <div
                      key={event.id}
                      onClick={e => { e.stopPropagation(); onEventClick(event); }}
                      className={cn(
                        "px-1.5 py-0.5 rounded text-xs font-medium truncate cursor-pointer hover:opacity-80 transition-opacity",
                        colors.bg, colors.text
                      )}
                    >
                      {event.allDay ? "" : `${format(new Date(event.startDate), "HH:mm")} `}{event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 dark:text-gray-400 pl-1.5">
                    +{dayEvents.length - 3} más
                  </div>
                )}
              </div>

              {/* Mobile Events (Dots) */}
              <div className="md:hidden flex flex-wrap justify-center gap-1 mt-1 px-1">
                {dayEvents.slice(0, 4).map(event => {
                  const colors = EVENT_COLORS[event.color] ?? EVENT_COLORS.blue;
                  return (
                    <div
                      key={event.id}
                      className={cn("w-1.5 h-1.5 rounded-full", colors.bg.replace('bg-', 'bg-').replace('/10', '').replace('/20', ''))} 
                      style={{ backgroundColor: event.color === 'blue' ? '#3b82f6' : event.color === 'red' ? '#ef4444' : event.color === 'green' ? '#22c55e' : event.color === 'yellow' ? '#eab308' : '#8b5cf6' }}
                    />
                  );
                })}
                {dayEvents.length > 4 && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

