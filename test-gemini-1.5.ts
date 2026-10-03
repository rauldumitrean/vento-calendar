import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.8-flash",
    generationConfig: {
      temperature: 0.1,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  const EXTRACTION_PROMPT = `Eres un experto analizando horarios académicos. 
Analiza el documento/imagen y extrae TODAS las clases o asignaturas que puedas ver.
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
`;

  try {
    const result = await model.generateContent([
      { text: "Test content: Math at 9:00 on Monday in Room 1" },
      EXTRACTION_PROMPT,
    ]);
    const responseText = result.response.text().trim();
    console.log("RESPONSE TEXT:");
    console.log(responseText);
  } catch (err: any) {
    console.error("ERROR:");
    console.error(err);
  }
}

run();
