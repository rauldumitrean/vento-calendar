import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 4096,
  },
});

export const maxDuration = 60;

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

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No se ha enviado ningún archivo" },
        { status: 400 }
      );
    }

    const isValidType = file.type === "application/pdf" || file.type.startsWith("image/");
    if (!isValidType) {
      return NextResponse.json(
        { error: "Por favor sube un archivo PDF o una imagen (JPG/PNG)" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    let responseText = "";
    let lastError: string | null = null;

    try {
      const result = await model.generateContent([
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
        EXTRACTION_PROMPT,
      ]);
      responseText = result.response.text().trim();
    } catch (err: any) {
      lastError = err?.message ?? String(err);
      console.warn("Strategy 1 (inline) failed:", lastError);
      responseText = "";
    }

    if (!responseText || responseText.length < 5) {
      try {
        const result = await model.generateContent([
          {
            inlineData: {
              data: base64Data,
              mimeType: file.type,
            },
          },
          `Eres un asistente OCR y extractor de datos. Este archivo puede contener imágenes escaneadas o texto de un horario académico.
Usa tus capacidades de visión para leer cualquier tabla, cuadrícula, imagen o texto que veas.
Extrae todas las clases que puedas identificar.
Responde SOLO con un JSON array con este formato:
[{"title":"Nombre","dayOfWeek":1,"startTime":"09:00","endTime":"10:00","location":null}]
dayOfWeek: 1=Lunes, 2=Martes, 3=Miércoles, 4=Jueves, 5=Viernes, 6=Sábado, 0=Domingo
Si no hay horario devuelve: []`,
        ]);
        responseText = result.response.text().trim();
      } catch (err: any) {
        lastError = err?.message ?? String(err);
        console.error("Strategy 2 (OCR re-attempt) failed:", lastError);
        return NextResponse.json(
          {
            error:
              "La IA no pudo leer el documento. Asegúrate de que el archivo tenga buena calidad y no esté protegido con contraseña.",
          },
          { status: 500 }
        );
      }
    }

    responseText = responseText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    const match = responseText.match(/\[[\s\S]*\]/);
    const jsonText = match ? match[0] : responseText;

    let parsedEvents: any[] = [];
    try {
      parsedEvents = JSON.parse(jsonText);
    } catch {
      console.error("JSON parse error. Raw AI response:", responseText);
      return NextResponse.json(
        {
          error:
            "La IA devolvió una respuesta inesperada. Inténtalo de nuevo con un archivo más claro.",
        },
        { status: 500 }
      );
    }

    if (!Array.isArray(parsedEvents)) {
      return NextResponse.json(
        { error: "Formato de respuesta inválido de la IA" },
        { status: 500 }
      );
    }

    if (parsedEvents.length === 0) {
      return NextResponse.json(
        {
          error:
            "No se encontraron clases en el documento. Asegúrate de que el archivo contenga un horario legible.",
        },
        { status: 400 }
      );
    }

    const validEvents = parsedEvents.filter(
      (evt) =>
        evt &&
        typeof evt.title === "string" &&
        evt.title.trim().length > 0 &&
        typeof evt.dayOfWeek === "number" &&
        evt.dayOfWeek >= 0 &&
        evt.dayOfWeek <= 6 &&
        typeof evt.startTime === "string" &&
        typeof evt.endTime === "string"
    );

    if (validEvents.length === 0) {
      return NextResponse.json(
        {
          error:
            "Las asignaturas extraídas no tienen el formato correcto. Inténtalo de nuevo.",
        },
        { status: 400 }
      );
    }

    const colors = [
      "blue",
      "purple",
      "green",
      "orange",
      "pink",
      "red",
      "yellow",
      "cyan",
    ];
    let colorIndex = 0;
    const colorMap = new Map<string, string>();

    const processedEvents = validEvents.map((evt) => {
      const titleKey = evt.title.trim();
      if (!colorMap.has(titleKey)) {
        colorMap.set(titleKey, colors[colorIndex % colors.length]);
        colorIndex++;
      }

      return {
        title: titleKey,
        dayOfWeek: Number(evt.dayOfWeek),
        startTime: String(evt.startTime),
        endTime: String(evt.endTime),
        location: evt.location ? String(evt.location) : null,
        color: colorMap.get(titleKey) || "blue",
      };
    });

    // DO NOT SAVE TO DB HERE - Return for preview!
    return NextResponse.json({ success: true, events: processedEvents });
  } catch (error: any) {
    console.error("Upload route unhandled error:", error?.message ?? error);
    return NextResponse.json(
      { error: "Error interno del servidor al procesar el horario" },
      { status: 500 }
    );
  }
}
