const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/EventModal.tsx', 'utf8');
content = content.replace(/bg-white dark:bg-gray-900 rounded-2xl shadow-2xl/g, 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl');
fs.writeFileSync('src/components/calendar/EventModal.tsx', content);

let content2 = fs.readFileSync('src/components/tasks/TaskModal.tsx', 'utf8');
content2 = content2.replace(/bg-white dark:bg-gray-900 rounded-2xl shadow-2xl/g, 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/50 dark:border-gray-700/50 rounded-3xl shadow-2xl');
fs.writeFileSync('src/components/tasks/TaskModal.tsx', content2);

let content3 = fs.readFileSync('src/components/ai/AIChat.tsx', 'utf8');
content3 = content3.replace(/bg-white dark:bg-gray-900/g, 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border border-white/50 dark:border-gray-700/50');
fs.writeFileSync('src/components/ai/AIChat.tsx', content3);
