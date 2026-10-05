const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');
content = content.replace(/type: "spring"/g, 'type: "spring" as const');
fs.writeFileSync('src/app/page.tsx', content);
