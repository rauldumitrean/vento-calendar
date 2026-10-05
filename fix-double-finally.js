const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', 'utf8');

const regex = /\} finally \{\s*setParsingNL\(false\);\s*\} finally \{\s*setParsingNL\(false\);\s*\}/g;
content = content.replace(regex, '} finally {\n        setParsingNL(false);\n      }');

fs.writeFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', content);
