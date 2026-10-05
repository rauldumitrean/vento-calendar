const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
content = content.replace('CalendarDays,', 'CalendarDays,\n  FileUp,');
fs.writeFileSync('src/components/layout/Sidebar.tsx', content);
