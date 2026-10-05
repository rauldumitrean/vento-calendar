const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', 'utf8');

const regex = /toast\.success\(`\S+\$\{successCount\} evento\(s\) guardado\(s\)!`\);/g;
content = content.replace(regex, 'toast.success(`¡${successCount} evento(s) guardado(s)!`);');

const regex2 = /toast\.error\("No se detect.*?ning.*?n evento v.*?lido\."\);/g;
content = content.replace(regex2, 'toast.error("No se detectó ningún evento válido.");');

const regex3 = /label: "D.*?a"/g;
content = content.replace(regex3, 'label: "Día"');

fs.writeFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', content);
