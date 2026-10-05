const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarView.tsx', 'utf8');
content = content.replace(/setSelectedEvent\(null\); setSelectedDate\(null\); setShowModal\(true\);/, 'setSelectedEvent(null); setSelectedDate(null); setPrefillData(null); setShowModal(true);');
fs.writeFileSync('src/components/calendar/CalendarView.tsx', content);
