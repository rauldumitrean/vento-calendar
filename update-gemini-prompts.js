const fs = require('fs');

let content = fs.readFileSync('src/lib/gemini.ts', 'utf8');

// Update parseNaturalLanguageEvent to return an array
const oldParsePrompt = `Devuelve este JSON exacto (todos los campos requeridos):
{
  "title": "ttulo del evento",
  "description": "descripcin o null",
  "startDate": "ISO 8601 con timezone",
  "endDate": "ISO 8601 con timezone (si no se especifica, 1 hora despu?s del inicio)",
  "allDay": false,
  "location": "ubicacin o null",
  "color": "blue",
  "recurrence": null
}

Si no puedes extraer un evento volido, devuelve: {"error": "No se pudo interpretar el evento"}`;

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

content = content.replace(oldParsePrompt, newParsePrompt);

content = content.replace('const match = responseText.match(/\\{[\\s\\S]*\\}/);', 'const match = responseText.match(/\\[[\\s\\S]*\\]/);');

// Update chatWithCalendarAI to instruct event creation
const oldChatPrompt = `Pregunta del usuario: ${message}

Puedes ayudar con: crear eventos, sugerir horarios, recordar tareas, dar consejos de productividad, etc.`;

const newChatPrompt = `Pregunta del usuario: ${message}

Fecha actual: ${new Date().toISOString()}

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

content = content.replace(oldChatPrompt, newChatPrompt);

fs.writeFileSync('src/lib/gemini.ts', content);
