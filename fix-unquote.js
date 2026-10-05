const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/app/page.tsx', 'utf8');
content = content.replace(/&quot;/g, '"');
fs.writeFileSync('C:/ventoo-calendar/src/app/page.tsx', content);
