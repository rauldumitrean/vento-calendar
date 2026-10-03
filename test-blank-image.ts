import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
  },
});

const EXTRACTION_PROMPT = `Eres un experto analizando horarios académicos. 
Analiza el documento/imagen y extrae TODAS las clases o asignaturas que puedas ver.

El horario puede estar en formato de tabla, lista, imagen escaneada, o cualquier otro formato.
Incluso si la calidad es baja o está borroso, intenta extraer la máxima información posible.
Usa tus capacidades de visión para leer cualquier texto dentro de la imagen.

Devuelve ÚNICAMENTE un JSON array válido. Sin markdown, sin explicaciones, solo el JSON:

[
  {
    "title": "Nombre de la Asignatura",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "10:30",
    "location": "Aula 101"
  }
]

REGLAS IMPORTANTES:
- dayOfWeek: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
- startTime y endTime en formato HH:mm (24 horas)
- location puede ser null si no aparece
- Si la misma asignatura tiene varias clases a la semana, incluye una entrada por cada clase
- Si el horario es semanal recurrente, extrae todos los días
- Si ves abreviaturas de asignaturas, usa el nombre completo si lo puedes deducir
- Devuelve [] SOLO si el documento no contiene ningún tipo de horario
- NO inventes datos, solo extrae lo que ves

Ahora analiza el documento y devuelve el JSON:`;

async function main() {
  try {
    const res = await model.generateContent([
      {
        inlineData: {
          // A tiny 1x1 white pixel png
          data: "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/eb+g8EAAAAASUVORK5CYII=",
          mimeType: "image/png"
        }
      },
      EXTRACTION_PROMPT
    ]);
    let text = res.response.text();
    console.log("Raw Response:");
    console.log(text);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
main();
