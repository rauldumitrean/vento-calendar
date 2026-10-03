const fs = require('fs');
const path = 'E:/08. Proyectos/ventoo-calendar/src/app/api/schedule/upload/route.ts';

let content = fs.readFileSync(path, 'utf8');

const replacements = {
  'imǭgenes': 'imágenes',
  'escaneadas': 'escaneadas',
  'acadǸmico': 'académico',
  'visin': 'visión',
  'cuadrcula': 'cuadrícula',
  'todas': 'todas',
  'puedas': 'puedas',
  'MiǸrcoles': 'Miércoles',
  'Sǭbado': 'Sábado',
  'saturacin': 'saturación',
  'Asegǧrate': 'Asegúrate',
  'estǸ': 'esté',
  'contrasea': 'contraseña',
  'mǭs': 'más',
  'asegǧrate': 'asegúrate',
  'invǭlido': 'inválido',
  'extradas': 'extraídas',
  'IntǸntalo': 'Inténtalo'
};

for (const [bad, good] of Object.entries(replacements)) {
  content = content.replaceAll(bad, good);
}

fs.writeFileSync(path, content, 'utf8');
console.log('Sanitized successfully.');
