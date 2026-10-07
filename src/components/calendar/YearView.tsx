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
        const monthStart = new Date(currentYear, i, 1);
        const daysInMonth = new Date(currentYear, i + 1, 0).getDate();
        
        // 0 = Sunday, 1 = Monday. We want Monday = 0, Sunday = 6
        let startDayOfWeek = monthStart.getDay() - 1;
        if (startDayOfWeek === -1) startDayOfWeek = 6;
        
        return (
          <div 
            key={i} 
            onClick={() => onMonthClick(monthDate)}
            className="bg-white/50 dark:bg-gray-900/30 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 cursor-pointer hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-gray-900 dark:text-white capitalize group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {format(monthDate, "MMMM", { locale: es })}
              </h3>
            </div>
            
            <div className="grid grid-cols-7 gap-1 text-center mb-2">
              {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                <div key={d} className="text-[10px] font-semibold text-gray-400 dark:text-gray-500">{d}</div>
              ))}
            </div>
            
            <div className="grid grid-cols-7 gap-y-1 gap-x-1">
              {Array.from({ length: startDayOfWeek }).map((_, idx) => (
                <div key={`empty-${idx}`} className="h-7 w-full" />
              ))}
              
              {Array.from({ length: daysInMonth }).map((_, idx) => {
                const dateNum = idx + 1;
                const dayDate = new Date(currentYear, i, dateNum);
                const dateStr = dayDate.toDateString();
                
                const isToday = new Date().toDateString() === dateStr;
                const dayEvents = events.filter(e => new Date(e.startDate).toDateString() === dateStr);
                const hasEvents = dayEvents.length > 0;
                
                return (
                  <div key={dateNum} className="relative flex items-center justify-center h-7 w-full">
                    <div className={cn(
                      "flex flex-col items-center justify-center w-6 h-6 rounded-md text-[11px] transition-colors",
                      isToday ? "bg-blue-600 text-white font-bold shadow-sm" : 
                      hasEvents ? "bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium" : 
                      "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                    )}>
                      {dateNum}
                    </div>
                    {hasEvents && !isToday && (
                      <span className="absolute bottom-[2px] w-1 h-1 bg-blue-500 rounded-full" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
