const fs = require('fs');

// 1. Update gemini.ts to gemini-2.5-flash
let geminiTs = fs.readFileSync('src/lib/gemini.ts', 'utf8');
geminiTs = geminiTs.replace(/model: \"[^\"]+\"/g, 'model: "gemini-2.5-flash"');
fs.writeFileSync('src/lib/gemini.ts', geminiTs);

// 2. Update upload route to gemini-2.5-flash
let uploadTs = fs.readFileSync('src/app/api/schedule/upload/route.ts', 'utf8');
uploadTs = uploadTs.replace(/model: \"[^\"]+\"/g, 'model: "gemini-2.5-flash"');
fs.writeFileSync('src/app/api/schedule/upload/route.ts', uploadTs);

// 3. Update chat route to gemini-2.5-flash and send real errors
let chatTs = fs.readFileSync('src/app/api/ai/chat/route.ts', 'utf8');
chatTs = chatTs.replace(/model: \"[^\"]+\"/g, 'model: "gemini-2.5-flash"');
chatTs = chatTs.replace(/return NextResponse\.json\(\{ error: "Error en el chat" \}, \{ status: 500 \}\);/g, 'return NextResponse.json({ error: String(error?.message || "Error en el chat") }, { status: 500 });');
fs.writeFileSync('src/app/api/ai/chat/route.ts', chatTs);

console.log("Updated to gemini-2.5-flash");
