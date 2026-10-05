const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// Gradients
content = content.replace(/bg-indigo-500\/20 dark:bg-indigo-600\/20/g, 'bg-blue-500/20 dark:bg-blue-600/20');
content = content.replace(/bg-purple-500\/20 dark:bg-purple-600\/20/g, 'bg-cyan-500/20 dark:bg-cyan-600/20');

// Logo
content = content.replace(/from-indigo-500 to-purple-600/g, 'from-blue-500 to-cyan-600');

// AI badge
content = content.replace(/bg-purple-100 dark:bg-purple-900\/30/g, 'bg-blue-100 dark:bg-blue-900/30');
content = content.replace(/border-purple-200 dark:border-purple-800/g, 'border-blue-200 dark:border-blue-800');
content = content.replace(/text-purple-700 dark:text-purple-300/g, 'text-blue-700 dark:text-blue-300');

// Hero title
content = content.replace(/from-indigo-500 to-purple-600/g, 'from-blue-500 to-cyan-600');

// CTA Buttons
content = content.replace(/bg-indigo-600/g, 'bg-blue-600');
content = content.replace(/hover:bg-indigo-700/g, 'hover:bg-blue-700');
content = content.replace(/shadow-indigo-600\/30/g, 'shadow-blue-600/30');
content = content.replace(/shadow-indigo-900\/10/g, 'shadow-blue-900/10');

// Floating elements
content = content.replace(/bg-indigo-500/g, 'bg-blue-500');
content = content.replace(/shadow-purple-500\/10/g, 'shadow-blue-500/10');
content = content.replace(/border-purple-100 dark:border-purple-900\/30/g, 'border-blue-100 dark:border-blue-900/30');
content = content.replace(/bg-purple-100 dark:bg-purple-900\/50/g, 'bg-blue-100 dark:bg-blue-900/50');
content = content.replace(/text-purple-600 dark:text-purple-400/g, 'text-blue-600 dark:text-blue-400');

// Features section
content = content.replace(/text-purple-500/g, 'text-blue-500');

// Footer & Bottom CTA
content = content.replace(/text-indigo-500/g, 'text-blue-500');
content = content.replace(/text-indigo-100/g, 'text-blue-100');
content = content.replace(/text-indigo-600/g, 'text-blue-600');

fs.writeFileSync('src/app/page.tsx', content);
