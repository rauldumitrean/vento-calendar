const fs = require('fs');

// Replace in Sidebar.tsx
let sidebar = fs.readFileSync('C:/ventoo-calendar/src/components/layout/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace('<div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">', '<div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0">');
sidebar = sidebar.replace('<CalendarIcon className="w-5 h-5 text-white" />', '<img src="/ventoo-calendar-logo.svg" alt="Logo" className="w-8 h-8" />');
fs.writeFileSync('C:/ventoo-calendar/src/components/layout/Sidebar.tsx', sidebar);

// Replace in TopBar.tsx (mobile logo)
let topbar = fs.readFileSync('C:/ventoo-calendar/src/components/layout/TopBar.tsx', 'utf8');
topbar = topbar.replace('<div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">', '<div className="w-8 h-8 rounded-xl flex items-center justify-center">');
topbar = topbar.replace('<CalendarIcon className="w-5 h-5 text-white" />', '<img src="/ventoo-calendar-logo.svg" alt="Logo" className="w-8 h-8" />');
fs.writeFileSync('C:/ventoo-calendar/src/components/layout/TopBar.tsx', topbar);

// Replace in LoginPage
let login = fs.readFileSync('C:/ventoo-calendar/src/app/login/page.tsx', 'utf8');
login = login.replace('<div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4">', '<div className="w-16 h-16 rounded-xl flex items-center justify-center mb-4">');
login = login.replace('<CalendarIcon className="w-8 h-8 text-white" />', '<img src="/ventoo-calendar-logo.svg" alt="Logo" className="w-16 h-16" />');
fs.writeFileSync('C:/ventoo-calendar/src/app/login/page.tsx', login);

