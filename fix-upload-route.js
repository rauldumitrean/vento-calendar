const fs = require('fs');
let content = fs.readFileSync('src/app/api/schedule/upload/route.ts', 'utf8');
content = content.replace(/userId: session\.user\.id,/g, 'userId: session.user!.id,');
fs.writeFileSync('src/app/api/schedule/upload/route.ts', content);
