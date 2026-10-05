const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

async function run() {
  const text = 'Examen de lengua dia 11 de octubre a las 9';
  const now = new Date().toISOString();
  const userTimezone = 'Europe/Madrid';
  
  const prompt = "Eres un asistente de calendario. Extrae información de evento del siguiente texto y devuelve SOLO un JSON válido (sin markdown, sin explicaciones).\nTexto del usuario: \"" + text + "\"\nFecha/hora actual: " + now + "\nZona horaria del usuario: " + userTimezone + "\nDevuelve este JSON exacto (todos los campos requeridos):\n{\n  \"title\": \"título del evento\",\n  \"description\": \"descripción o null\",\n  \"startDate\": \"ISO 8601 con timezone\",\n  \"endDate\": \"ISO 8601 con timezone (si no se especifica, 1 hora después del inicio)\",\n  \"allDay\": false,\n  \"location\": \"ubicación o null\",\n  \"color\": \"blue\",\n  \"recurrence\": null\n}\nSi no puedes extraer un evento válido, devuelve: {\"error\": \"No se pudo interpretar el evento\"}";

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    console.log("--- RAW RESPONSE ---");
    console.log(responseText);
    console.log("--------------------");
    const match = responseText.match(/\{[\s\S]*\}/);
    const jsonText = match ? match[0] : responseText;
    console.log("JSON PARSED:", JSON.parse(jsonText));
  } catch(e) {
    console.error("ERROR:", e.message);
  }
}
run();
