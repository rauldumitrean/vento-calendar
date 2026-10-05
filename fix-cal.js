const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarView.tsx', 'utf8');

// Toolbar background
content = content.replace(/bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800/g, 'bg-transparent border-b border-gray-200/50 dark:border-gray-800/50 backdrop-blur-md');

// NLP Sparkles
content = content.replace(/text-purple-500/g, 'text-blue-500');

// NLP input background
content = content.replace(/bg-gray-50 dark:bg-gray-800/g, 'bg-white/50 dark:bg-gray-800/50');
content = content.replace(/border-gray-200 dark:border-gray-700/g, 'border-gray-200/50 dark:border-gray-700/50');

// NLP focus ring
content = content.replace(/focus:ring-purple-500/g, 'focus:ring-blue-500');

// NLP button
content = content.replace(/bg-purple-100/g, 'bg-blue-100/80');
content = content.replace(/dark:bg-purple-900\/30/g, 'dark:bg-blue-900/30');
content = content.replace(/text-purple-700/g, 'text-blue-700');
content = content.replace(/dark:text-purple-300/g, 'dark:text-blue-300');
content = content.replace(/hover:bg-purple-200/g, 'hover:bg-blue-200');
content = content.replace(/dark:hover:bg-purple-900\/50/g, 'dark:hover:bg-blue-900/50');

fs.writeFileSync('src/components/calendar/CalendarView.tsx', content);
