const fs = require('fs');

let geminiTs = fs.readFileSync('src/lib/gemini.ts', 'utf8');
geminiTs = geminiTs.replace(/model: "gemini-1.5-flash"/g, 'model: "gemini-3.5-flash"');
fs.writeFileSync('src/lib/gemini.ts', geminiTs);

let uploadTs = fs.readFileSync('src/app/api/schedule/upload/route.ts', 'utf8');
uploadTs = uploadTs.replace(/model: "gemini-1.5-flash"/g, 'model: "gemini-3.5-flash"');
fs.writeFileSync('src/app/api/schedule/upload/route.ts', uploadTs);

let chatTs = fs.readFileSync('src/app/api/ai/chat/route.ts', 'utf8');
chatTs = chatTs.replace(/model: "gemini-1.5-flash"/g, 'model: "gemini-3.5-flash"');
fs.writeFileSync('src/app/api/ai/chat/route.ts', chatTs);

console.log("Updated to gemini-3.5-flash");
