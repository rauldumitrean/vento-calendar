const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/app/(dashboard)/settings/page.tsx', 'utf8');

const oldLoading = `if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }`;

const newLoading = `if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8 w-full animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6" />
        <div className="space-y-6">
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-64" />
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-32" />
          <div className="bg-white/50 dark:bg-gray-900/40 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 h-48" />
        </div>
      </div>
    );
  }`;

content = content.replace(oldLoading, newLoading);
// Also let's fix any corrupted characters just in case
content = content.replace(/Amrica/g, 'América');
content = content.replace(/Bogot/g, 'Bogotá');
content = content.replace(/Da/g, 'Día');

fs.writeFileSync('C:/ventoo-calendar/src/app/(dashboard)/settings/page.tsx', content);
