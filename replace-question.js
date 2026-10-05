const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', 'utf8');

content = content.replace(/\$\{successCount\}/g, '¡${successCount}');

fs.writeFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', content);
