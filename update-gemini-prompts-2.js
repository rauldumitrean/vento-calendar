const fs = require('fs');
let content = fs.readFileSync('src/lib/gemini.ts', 'utf8');

const regex1 = /Devuelve este JSON exacto[\s\S]*?No se pudo interpretar el evento"\}/;
const newParsePrompt = `Devuelve EXACTAMENTE UN ARRAY JSON (sin texto extra, solo el array []) con todos los eventos detectados. Si el usuario menciona varios eventos (ej. "examen el lunes y tutoría el martes"), devuelve varios objetos.

Formato:
[
  {
    "title": "título del evento",
    "description": "descripción o null",
    "startDate": "ISO 8601 con timezone",
    "endDate": "ISO 8601 con timezone (si no se especifica, 1 hora después del inicio)",
    "allDay": false,
    "location": "ubicación o null",
    "color": "blue"
  }
]

Si no puedes extraer ningún evento válido, devuelve un array vacío: []`;

content = content.replace(regex1, newParsePrompt);
content = content.replace('const match = responseText.match(/\\{[\\s\\S]*\\}/);', 'const match = responseText.match(/\\[[\\s\\S]*\\]/);');

const regex2 = /Pregunta del usuario: \$\{message\}[\s\S]*?productividad, etc\./;
const newChatPrompt = `Pregunta del usuario: ${"$"}{message}

Fecha y hora actual: ${"$"}{new Date().toISOString()}

INSTRUCCIÓN CRUCIAL PARA CREAR EVENTOS:
Si el usuario te pide crear uno o varios eventos, debes incluirlos en un bloque JSON dentro de tu respuesta. El sistema leerá este JSON y creará los eventos automáticamente. Usa este formato exacto:
\`\`\`json
[
  {
    "action": "create_event",
    "title": "Nombre",
    "startDate": "ISO 8601",
    "endDate": "ISO 8601",
    "allDay": false,
    "color": "blue"
  }
]
\`\`\`
Puedes añadir texto normal antes y después del JSON para hablar con el usuario.`;

content = content.replace(regex2, newChatPrompt);
fs.writeFileSync('src/lib/gemini.ts', content);
