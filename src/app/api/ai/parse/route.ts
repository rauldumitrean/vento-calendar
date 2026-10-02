import { auth } from "@/lib/auth";
import { parseNaturalLanguageEvent } from "@/lib/gemini";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { text, timezone } = await req.json();
    const parsed = await parseNaturalLanguageEvent(text, timezone ?? "Europe/Madrid");
    return NextResponse.json(parsed);
  } catch (error: any) {
    console.error("AI parse error FULL:", error, "\nMessage:", error.message, "\nStack:", error.stack);
    const fs = require('fs');
    try {
      fs.writeFileSync('C:/ventoo-calendar/error-ai.txt', String(error?.stack || error?.message || error));
      fs.writeFileSync('E:/08. Proyectos/ventoo-calendar/error-ai.txt', String(error?.stack || error?.message || error));
    } catch(e) {}
    return NextResponse.json({ error: String(error?.message || "Error al interpretar") }, { status: 500 });
  }
}
