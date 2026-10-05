const fs = require('fs');
let content = fs.readFileSync('src/app/api/ai/parse/route.ts', 'utf8');

content = content.replace(/console\.error\("AI parse error:", error\);/g, 'console.error("AI parse error FULL:", error, "\\nMessage:", error.message, "\\nStack:", error.stack);');

fs.writeFileSync('src/app/api/ai/parse/route.ts', content);

let contentGemini = fs.readFileSync('src/lib/gemini.ts', 'utf8');
contentGemini = contentGemini.replace(/console\.error\("Failed to parse Gemini response:", responseText\);/g, 'console.error("Failed to parse Gemini response RAW:", responseText);');
fs.writeFileSync('src/lib/gemini.ts', contentGemini);
