const fs = require('fs');
let content = fs.readFileSync('src/components/layout/TopBar.tsx', 'utf8');

content = content.replace(/bg-white dark:bg-gray-900/g, 'bg-transparent');
content = content.replace(/border-gray-200 dark:border-gray-800/g, 'border-gray-200/50 dark:border-gray-800/50');
content = content.replace(/from-indigo-400 to-purple-500/g, 'from-blue-400 to-cyan-500');

fs.writeFileSync('src/components/layout/TopBar.tsx', content);
