const fs = require('fs');

let login = fs.readFileSync('C:/ventoo-calendar/src/app/login/page.tsx', 'utf8');
const oldLogoRegex = /<div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mb-4">[\s\S]*?<\/svg>\s*<\/div>/;
const newLogo = `<div className="inline-flex items-center justify-center w-24 h-24 mb-4">
            <img src="/ventoo-calendar-logo.svg" alt="Ventoo Logo" className="w-full h-full object-contain" />
          </div>`;
login = login.replace(oldLogoRegex, newLogo);
fs.writeFileSync('C:/ventoo-calendar/src/app/login/page.tsx', login);

