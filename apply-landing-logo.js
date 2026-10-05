const fs = require('fs');

let page = fs.readFileSync('C:/ventoo-calendar/src/app/page.tsx', 'utf8');
page = page.replace('<div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">\n            <CalendarDays className="w-5 h-5 text-white" />\n          </div>', '<div className="w-12 h-12 flex items-center justify-center">\n            <img src="/ventoo-calendar-logo.svg" alt="Ventoo Logo" className="w-full h-full object-contain" />\n          </div>');

fs.writeFileSync('C:/ventoo-calendar/src/app/page.tsx', page);
