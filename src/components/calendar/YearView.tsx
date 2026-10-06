"use client";

import { format, setMonth } from "date-fns";
import { es } from "date-fns/locale";
import type { CalendarEvent } from "@/types";
import { cn } from "@/lib/utils";

interface YearViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onMonthClick: (date: Date) => void;
}

export function YearView({ currentDate, events, onMonthClick }: YearViewProps) {
  const currentYear = currentDate.getFullYear();
  const months = Array.from({ length: 12 }).map((_, i) => setMonth(new Date(currentYear, 0, 1), i));

  return (
    <div className="h-full overflow-auto p-4 md:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {months.map((monthDate, i) => {
        // Count events in this month
        const monthStart = new Date(currentYear, i, 1);
        const monthEnd = new Date(currentYear, i + 1, 0);
        
        const monthEvents = events.filter(e => {
          const d = new Date(e.startDate);
          return d >= monthStart && d <= monthEnd;
        });

        return (
          <div 
            key={i} 
            onClick={() => onMonthClick(monthDate)}
            className="bg-white/50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize mb-2">
              {format(monthDate, "MMMM", { locale: es })}
            </h3>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {monthEvents.length} eventos
            </div>
            {/* Visual indicator of events */}
            <div className="mt-4 flex flex-wrap gap-1 h-8 overflow-hidden">
              {monthEvents.slice(0, 15).map((e, idx) => (
                <div key={idx} className={cn("w-2 h-2 rounded-full", "bg-blue-500")} />
              ))}
              {monthEvents.length > 15 && <span className="text-xs text-gray-400 ml-1">...</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
