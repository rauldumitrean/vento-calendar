const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/lib/auth.config.ts', 'utf8');

if (!content.includes('trustHost: true')) {
  content = content.replace('export const authConfig: NextAuthConfig = {', 'export const authConfig: NextAuthConfig = {\n  trustHost: true,\n  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,');
  fs.writeFileSync('C:/ventoo-calendar/src/lib/auth.config.ts', content);
}
