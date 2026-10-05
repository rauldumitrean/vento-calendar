const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/middleware.ts', 'utf8');

content = content.replace('export const { auth: middleware } = NextAuth(authConfig);', 'export default NextAuth(authConfig).auth;');

fs.writeFileSync('C:/ventoo-calendar/src/middleware.ts', content);
