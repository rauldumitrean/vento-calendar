import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { events } = await req.json();

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json(
        { error: "No se proporcionaron eventos válidos" },
        { status: 400 }
      );
    }

    const dbEvents = events.map((evt: any) => ({
      userId: session.user?.id as string,
      title: evt.title,
      dayOfWeek: evt.dayOfWeek,
      startTime: evt.startTime,
      endTime: evt.endTime,
      location: evt.location || null,
      color: evt.color || "blue",
    }));

    await db.insert(schedules).values(dbEvents);

    return NextResponse.json({ success: true, count: dbEvents.length });
  } catch (error: any) {
    console.error("Bulk save error:", error?.message ?? error);
    return NextResponse.json(
      { error: "Error al guardar los eventos" },
      { status: 500 }
    );
  }
}
