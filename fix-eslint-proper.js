const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/app/page.tsx', 'utf8');
content = "/* eslint-disable react/no-unescaped-entities */\n" + content;
fs.writeFileSync('C:/ventoo-calendar/src/app/page.tsx', content);
