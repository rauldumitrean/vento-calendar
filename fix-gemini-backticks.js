const fs = require('fs');
let content = fs.readFileSync('src/lib/gemini.ts', 'utf8');

// The file literally has unescaped backticks.
content = content.replace(/```json/g, '\\`\\`\\`json');
// The closing block
content = content.replace(/\]\r?\n```/g, ']\n\\`\\`\\`');

fs.writeFileSync('src/lib/gemini.ts', content);
