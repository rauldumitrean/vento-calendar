import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Use gemini-1.5-flash which supports PDF inline data
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const maxDuration = 60; // Allow up to 60s for AI processing

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No se ha enviado ningún archivo" }, { status: 400 });
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json({ error: "Por favor sube un archivo PDF válido" }, { status: 400 });
    }

    // Convert file to base64
    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Eres un experto en análisis de horarios académicos escolares y universitarios.
Analiza el PDF adjunto y extrae TODAS las clases/asignaturas que encuentres en el horario.
Presta atención a tablas, grillas de horario, o listas de clases.

Devuelve ÚNICAMENTE un array JSON válido con este formato exacto (sin markdown, sin comentarios, sin explicaciones):
[
  {
    "title": "Nombre de la Asignatura",
    "dayOfWeek": 1,
    "startTime": "09:00",
    "endTime": "10:30",
    "location": "Aula 101"
  }
]

Reglas:
- dayOfWeek: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
- startTime y endTime en formato HH:mm (24h)
- location puede ser null si no se especifica
- Si la misma asignatura aparece varios días, crea una entrada por cada día
- Si no encuentras ningún horario válido, devuelve: []
- SOLO devuelve el JSON array, nada más`;

    let responseText = "";
    try {
      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: "application/pdf",
          },
        },
        prompt,
      ]);
      responseText = result.response.text().trim();
    } catch (aiError: any) {
      console.error("Error llamando a Gemini:", aiError?.message ?? aiError);
      return NextResponse.json(
        { error: "La IA no pudo procesar el archivo. Asegúrate de que el PDF contiene texto (no es una imagen escaneada)." },
        { status: 500 }
      );
    }

    // Strip markdown code fences if present
    responseText = responseText.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();

    // Extract JSON array
    const match = responseText.match(/\[[\s\S]*\]/);
    const jsonText = match ? match[0] : responseText;

    let parsedEvents: any[] = [];
    try {
      parsedEvents = JSON.parse(jsonText);
    } catch (parseError) {
      console.error("Error parseando JSON de Gemini. Respuesta cruda:", responseText);
      return NextResponse.json(
        { error: "La IA devolvió un formato inesperado. Inténtalo de nuevo con un PDF más claro." },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsedEvents)) {
      return NextResponse.json({ error: "Formato de respuesta inválido de la IA" }, { status: 500 });
    }

    if (parsedEvents.length === 0) {
      return NextResponse.json(
        { error: "No se encontraron clases en el documento. Asegúrate de que el PDF contiene un horario con clases." },
        { status: 400 }
      );
    }

    // Filter and sanitize entries
    const validEvents = parsedEvents.filter(
      (evt) =>
        evt.title &&
        typeof evt.title === "string" &&
        typeof evt.dayOfWeek === "number" &&
        evt.dayOfWeek >= 0 &&
        evt.dayOfWeek <= 6 &&
        evt.startTime &&
        evt.endTime
    );

    if (validEvents.length === 0) {
      return NextResponse.json(
        { error: "Las clases extraídas no tienen el formato correcto. Inténtalo con otro PDF." },
        { status: 400 }
      );
    }

    const colors = ["blue", "green", "purple", "pink", "orange", "red", "yellow", "cyan"];
    let colorIndex = 0;
    const colorMap = new Map<string, string>();

    const dbEvents = validEvents.map((evt) => {
      const titleKey = evt.title.trim();
      if (!colorMap.has(titleKey)) {
        colorMap.set(titleKey, colors[colorIndex % colors.length]);
        colorIndex++;
      }

      return {
        userId: session.user?.id as string,
        title: titleKey,
        dayOfWeek: Number(evt.dayOfWeek),
        startTime: String(evt.startTime),
        endTime: String(evt.endTime),
        location: evt.location ? String(evt.location) : null,
        color: colorMap.get(titleKey) || "blue",
      };
    });

    await db.insert(schedules).values(dbEvents);

    return NextResponse.json({ success: true, count: dbEvents.length });
  } catch (error: any) {
    console.error("Upload error:", error?.message ?? error);
    return NextResponse.json({ error: "Error interno del servidor al procesar el horario" }, { status: 500 });
  }
}
