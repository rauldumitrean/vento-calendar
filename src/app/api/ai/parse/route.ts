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
    return NextResponse.json({ error: String(error?.message || "Error al interpretar") }, { status: 500 });
  }
}
