const fs = require('fs');
let content = fs.readFileSync('src/lib/gemini.ts', 'utf8');
content = content.replace(/gemini-3\.8-flash/g, 'gemini-flash-latest');
fs.writeFileSync('src/lib/gemini.ts', content);
