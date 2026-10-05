const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', 'utf8');

const oldLoading = `{loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (`;

const newLoading = `{loading ? (
          <div className="h-full p-4 flex flex-col gap-4 animate-pulse">
            <div className="grid grid-cols-7 gap-4 flex-1">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="bg-gray-200/50 dark:bg-gray-800/30 rounded-2xl border border-gray-100 dark:border-gray-800 backdrop-blur-sm shadow-sm" />
              ))}
            </div>
          </div>
        ) : (`;

content = content.replace(oldLoading, newLoading);
fs.writeFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', content);
