const fs = require('fs');
let content = fs.readFileSync('src/middleware.ts', 'utf8');
content = content.replace(/matcher: \[\"\/((?!api\/auth|login|_next\/static|_next\/image|favicon\.ico|manifest\.json).*)\"\]/g, 'matcher: ["/((?!api/auth|api/ai/parse|login|_next/static|_next/image|favicon.ico|manifest.json).*)"]');
fs.writeFileSync('src/middleware.ts', content);
