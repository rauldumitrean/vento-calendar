const fs = require('fs');
let content = fs.readFileSync('src/components/ai/AIChat.tsx', 'utf8');

// Fix the character encoding issue
content = content.replace(/\?\\n\\n✅ \*\*¡He creado \$\{createdCount\} evento\(s\) en tu calendario!\*\*/g, '\\n\\n✅ **¡He creado ${createdCount} evento(s) en tu calendario!**');
content = content.replace(/\?/g, '✅'); // Just in case it's a single ?

// Add the window event dispatch
const oldDispatch = `if (createdCount > 0) {`;
const newDispatch = `if (createdCount > 0) {
              window.dispatchEvent(new CustomEvent("ventoo-events-updated"));`;
content = content.replace(oldDispatch, newDispatch);

fs.writeFileSync('src/components/ai/AIChat.tsx', content);
