const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/ai/AIChat.tsx', 'utf8');

// Also fix the question marks if I replaced them
// Wait, I replaced all question marks with ✅ previously? Let me check if there are any ✅!
content = content.replace(/✅/g, '?');

const regex = /finalContent\.replace\(match\[0\], `\\n\\n[\s\S]+?\$\{createdCount\} evento\(s\) en tu calendario!\*\*`\);/;
const replacement = 'finalContent = finalContent.replace(match[0], `\\n\\n✅ **¡He creado ${createdCount} evento(s) en tu calendario!**`);';
content = content.replace(regex, replacement);

fs.writeFileSync('C:/ventoo-calendar/src/components/ai/AIChat.tsx', content);
