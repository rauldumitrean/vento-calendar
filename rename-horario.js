const fs = require('fs');

let sidebar = fs.readFileSync('src/components/layout/Sidebar.tsx', 'utf8');
sidebar = sidebar.replace(/label: "Importar Horario"/g, 'label: "Horario"');
fs.writeFileSync('src/components/layout/Sidebar.tsx', sidebar);

let schedulePage = fs.readFileSync('src/app/(dashboard)/schedule/page.tsx', 'utf8');
schedulePage = schedulePage.replace(/Importar Horario/g, 'Horario');
fs.writeFileSync('src/app/(dashboard)/schedule/page.tsx', schedulePage);

