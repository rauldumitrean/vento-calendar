const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', 'utf8');

// The weird characters in UTF-8 might be represented as replacement characters or specific malformed bytes
content = content.replace(//g, ''); // Remove all 
content = content.replace(/toast\.success\(`¡\$\{successCount\}/g, 'toast.success(`¡${successCount}');

fs.writeFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', content);
