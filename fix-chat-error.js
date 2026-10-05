const fs = require('fs');

let chatTs = fs.readFileSync('src/app/api/ai/chat/route.ts', 'utf8');
chatTs = chatTs.replace(/return NextResponse\.json\(\{ error: \"Error en el asistente IA\" \}, \{ status: 500 \}\);/g, 'return NextResponse.json({ error: String(error?.message || "Error en el chat") }, { status: 500 });');
fs.writeFileSync('src/app/api/ai/chat/route.ts', chatTs);

