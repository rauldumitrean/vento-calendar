const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarView.tsx', 'utf8');

const regex = /\} finally \{\s*setParsingNL\(false\);\s*\} finally \{\s*setParsingNL\(false\);\s*\}/;
content = content.replace(regex, '} finally {\n        setParsingNL(false);\n      }');

fs.writeFileSync('src/components/calendar/CalendarView.tsx', content);
