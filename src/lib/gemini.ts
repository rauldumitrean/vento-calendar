import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
});

// ── Parse natural language into event ─────────────────────────────────────
export async function parseNaturalLanguageEvent(text: string, userTimezone: string = "Europe/Madrid") {
  const now = new Date().toISOString();

  const prompt = `Eres un asistente de calendario. Extrae información de evento del siguiente texto y devuelve SOLO un JSON válido (sin markdown, sin explicaciones).

Texto del usuario: "${text}"
Fecha/hora actual: ${now}
Zona horaria del usuario: ${userTimezone}

Devuelve EXACTAMENTE UN ARRAY JSON (sin texto extra, solo el array []) con todos los eventos detectados. Si el usuario menciona varios eventos (ej. "examen el lunes y tutor�a el martes"), devuelve varios objetos.

Formato:
[
  {
    "title": "t�tulo del evento",
    "description": "descripci�n o null",
    "startDate": "ISO 8601 con timezone",
    "endDate": "ISO 8601 con timezone (si no se especifica, 1 hora despu�s del inicio)",
    "allDay": false,
    "location": "ubicaci�n o null",
    "color": "blue"
  }
]

Si no puedes extraer ningúnn evento válido, devuelve un array vac�o: []`;

  const result = await geminiModel.generateContent(prompt);
  const responseText = result.response.text().trim();

  // Robust JSON extraction
  const match = responseText.match(/\[[\s\S]*\]/);
  const jsonText = match ? match[0] : responseText;

  try {
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Failed to parse Gemini response RAW:", responseText);
    throw new Error("Invalid JSON from AI");
  }
}

// ── Weekly summary ─────────────────────────────────────────────────────────
export async function generateWeeklySummary(
  events: Array<{ title: string; startDate: Date }>,
  tasks: Array<{ title: string; priority: string; status: string }>
) {
  const prompt = `Eres un asistente personal de productividad. Analiza la semana del usuario y da un resumen motivador y sugerencias concretas en español. Sé conciso y útil.

Eventos de esta semana: ${JSON.stringify(events.map(e => ({ title: e.title, date: e.startDate })))}
Tareas pendientes: ${JSON.stringify(tasks)}

Responde en formato markdown con:
1. Un resumen breve de la semana
2. 2-3 sugerencias de optimización de tiempo
3. Un mensaje motivador al final`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}

// ── AI Chat ────────────────────────────────────────────────────────────────
export async function chatWithCalendarAI(
  message: string,
  context: {
    upcomingEvents: Array<{ title: string; startDate: Date }>;
    pendingTasks: Array<{ title: string; priority: string; dueDate?: Date | null }>;
  }
) {
  const prompt = `Eres el asistente IA de Ventoo Calendar, un calendario inteligente. Ayuda al usuario con su calendario y tareas. Responde en español de forma amigable y concisa.

Contexto del usuario:
- Próximos eventos: ${JSON.stringify(context.upcomingEvents.slice(0, 10))}
- Tareas pendientes: ${JSON.stringify(context.pendingTasks.slice(0, 10))}

Pregunta del usuario: ${message}

Fecha y hora actual: ${new Date().toISOString()}

INSTRUCCI�N CRUCIAL PARA CREAR EVENTOS:
Si el usuario te pide crearáá uno o varios eventos, debes incluirlos en un bloque JSON dentro de tu respuesta. El sistema leeráá� este JSON y crearáá� los eventos autom�ticamente. Usa este formato exacto:
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
Puedes a�adir texto normal antes y despu�s del JSON para hablar con el usuario.`;

  const result = await geminiModel.generateContent(prompt);
  return result.response.text();
}
