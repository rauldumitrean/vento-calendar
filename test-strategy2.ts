import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as fs from "fs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
  const model = genAI.getGenerativeModel({
    model: "gemini-3.5-flash",
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

  try {
    const result = await model.generateContent([
      { text: "This is a dummy schedule with Math at 10 AM on Tuesday." },
      `Eres un asistente OCR y extractor de datos. Este archivo puede contener imágenes escaneadas o texto de un horario académico.
Usa tus capacidades de visión para leer cualquier tabla, cuadrícula, imagen o texto que veas.
Extrae todas las clases que puedas identificar.
Responde SOLO con un JSON array con este formato:
[{"title":"Nombre","dayOfWeek":1,"startTime":"09:00","endTime":"10:00","location":null}]
dayOfWeek: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
Si no hay horario devuelve: []`,
    ]);
    const responseText = result.response.text().trim();
    console.log("RAW RESPONSE:");
    console.log(responseText);
  } catch (err: any) {
    console.error("ERROR:");
    console.error(err);
  }
}

run();
