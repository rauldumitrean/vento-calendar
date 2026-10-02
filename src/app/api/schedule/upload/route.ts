import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { nextMonday, nextTuesday, nextWednesday, nextThursday, nextFriday, nextSaturday, nextSunday, setHours, setMinutes, parse } from "date-fns";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    
    if (!file || file.type !== "application/pdf") {
      return NextResponse.json({ error: "Por favor sube un archivo PDF válido" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    const prompt = `Eres un asistente que extrae horarios escolares o universitarios.
Analiza este documento PDF y extrae todas las clases/asignaturas.
Devuelve EXACTAMENTE un JSON array válido con este formato:
[
  {
    "title": "Nombre de la Asignatura",
    "dayOfWeek": 1, // 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
    "startTime": "HH:mm", // formato 24h
    "endTime": "HH:mm", // formato 24h
    "location": "Aula o ubicacion (o null)"
  }
]
Si no encuentras ningún horario válido, devuelve un array vacío []. NO devuelvas markdown, SOLO JSON.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf"
        }
      }
    ]);

    const responseText = result.response.text().trim();
    const match = responseText.match(/\[[\s\S]*\]/);
    const jsonText = match ? match[0] : responseText;
    
    let parsedEvents: any[] = [];
    try {
      parsedEvents = JSON.parse(jsonText);
    } catch (e) {
      console.error("Error parseando JSON de Gemini:", jsonText);
      return NextResponse.json({ error: "Error al interpretar el horario con IA" }, { status: 500 });
    }

    if (!Array.isArray(parsedEvents) || parsedEvents.length === 0) {
      return NextResponse.json({ error: "No se encontraron clases en el documento" }, { status: 400 });
    }

    // Convert to upcoming dates starting next week
    const today = new Date();
    const getNextDay = (dayIndex: number) => {
      if (dayIndex === 1) return nextMonday(today);
      if (dayIndex === 2) return nextTuesday(today);
      if (dayIndex === 3) return nextWednesday(today);
      if (dayIndex === 4) return nextThursday(today);
      if (dayIndex === 5) return nextFriday(today);
      if (dayIndex === 6) return nextSaturday(today);
      return nextSunday(today);
    };

    const colors = ["blue", "green", "purple", "pink", "orange", "red", "yellow", "gray"];
    let colorIndex = 0;
    const colorMap = new Map<string, string>();

    const dbEvents = parsedEvents.map(evt => {
      // Assign same color to same subject
      if (!colorMap.has(evt.title)) {
        colorMap.set(evt.title, colors[colorIndex % colors.length]);
        colorIndex++;
      }

      return {
        userId: session.user?.id as string,
        title: evt.title,
        dayOfWeek: Number(evt.dayOfWeek),
        startTime: evt.startTime,
        endTime: evt.endTime,
        location: evt.location || null,
        color: colorMap.get(evt.title) || "blue",
      };
    });

    await db.insert(schedules).values(dbEvents);

    return NextResponse.json({ success: true, count: dbEvents.length });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
