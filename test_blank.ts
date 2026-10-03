import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "dummy_key");

const model = genAI.getGenerativeModel({
  model: "gemini-3.8-flash", // Use 3.8-flash to avoid 429
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          dayOfWeek: { type: SchemaType.INTEGER },
          startTime: { type: SchemaType.STRING },
          endTime: { type: SchemaType.STRING },
          location: { type: SchemaType.STRING, nullable: true },
        },
        required: ["title", "dayOfWeek", "startTime", "endTime"],
      },
    },
  },
});

const EXTRACTION_PROMPT = `Eres un experto analizando horarios acadÃ©micos. 
Analiza el documento/imagen y extrae TODAS las clases o asignaturas que puedas ver.

El horario puede estar en formato de tabla, lista, imagen escaneada, o cualquier otro formato.
Incluso si la calidad es baja o estÃ¡ borroso, intenta extraer la mÃ¡xima informaciÃ³n posible.
Usa tus capacidades de visiÃ³n para leer cualquier texto dentro de la imagen.

Devuelve ÃšNICAMENTE un JSON array vÃ¡lido. Sin markdown, sin explicaciones, solo el JSON:

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
- dayOfWeek: 1=Lunes, 2=Martes, 3=MiÃ©rcoles, 4=Jueves, 5=Viernes, 6=SÃ¡bado, 0=Domingo
- startTime y endTime en formato HH:mm (24 horas)
- location puede ser null si no aparece
- Si la misma asignatura tiene varias clases a la semana, incluye una entrada por cada clase
- Si el horario es semanal recurrente, extrae todos los dÃ­as
- Si ves abreviaturas de asignaturas, usa el nombre completo si lo puedes deducir
- Devuelve [] SOLO si el documento no contiene ningÃºn tipo de horario
- NO inventes datos, solo extrae lo que ves

Ahora analiza el documento y devuelve el JSON:`;

// Create a blank 1x1 image base64
const blankImageBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

async function main() {
  try {
    const result = await model.generateContent([
      {
        inlineData: {
          data: blankImageBase64,
          mimeType: "image/png",
        },
      },
      EXTRACTION_PROMPT,
    ]);
    console.log("Raw output length:", result.response.text().length);
    console.log("Raw output:");
    console.log(result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
