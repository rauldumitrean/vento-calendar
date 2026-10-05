const fs = require('fs');
let content = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');

// Container
content = content.replace(/bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800/g, 'bg-transparent border-r border-gray-200/50 dark:border-gray-800/50');

// Logo gradient
content = content.replace(/from-indigo-500 to-purple-600/g, 'from-blue-500 to-cyan-600');

// AI Button
content = content.replace(/text-purple-600 dark:text-purple-400/g, 'text-blue-600 dark:text-blue-400');
content = content.replace(/hover:bg-purple-50 dark:hover:bg-purple-900\/20/g, 'hover:bg-blue-50 dark:hover:bg-blue-900/20');

// Bottom border
content = content.replace(/border-gray-200 dark:border-gray-800/g, 'border-gray-200/50 dark:border-gray-800/50');

fs.writeFileSync('src/components/layout/Sidebar.tsx', content);
