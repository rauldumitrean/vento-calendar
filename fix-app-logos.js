const fs = require('fs');

// Fix Sidebar.tsx
let sidebar = fs.readFileSync('C:/ventoo-calendar/src/components/layout/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(
  '<div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-sm">\n            <CalendarDays className="w-5 h-5 text-white" />\n          </div>',
  '<div className="w-10 h-10 flex items-center justify-center shrink-0">\n            <img src="/ventoo-calendar-logo.svg" alt="Ventoo Logo" className="w-full h-full object-contain" />\n          </div>'
);
fs.writeFileSync('C:/ventoo-calendar/src/components/layout/Sidebar.tsx', sidebar);

// Fix login/page.tsx
let login = fs.readFileSync('C:/ventoo-calendar/src/app/login/page.tsx', 'utf8');
login = login.replace(
  '<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">\n            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">\n              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />\n            </svg>\n          </div>',
  '<div className="w-20 h-20 flex items-center justify-center mb-4">\n            <img src="/ventoo-calendar-logo.svg" alt="Ventoo Logo" className="w-full h-full object-contain" />\n          </div>'
);
fs.writeFileSync('C:/ventoo-calendar/src/app/login/page.tsx', login);

// Add favicon handling: Next.js reads /app/icon.svg if it exists.
const svg = fs.readFileSync('C:/ventoo-calendar/public/ventoo-calendar-logo.svg', 'utf8');
fs.writeFileSync('C:/ventoo-calendar/src/app/icon.svg', svg);
