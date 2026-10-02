import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calendarEvents } from "@/lib/db/schema";
import { and, eq, between, gte, lte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  try {
    const conditions = [eq(calendarEvents.userId, session.user.id)];

    if (start && end) {
      conditions.push(gte(calendarEvents.startDate, new Date(start)));
      conditions.push(lte(calendarEvents.endDate, new Date(end)));
    }

    const events = await db
      .select()
      .from(calendarEvents)
      .where(and(...conditions))
      .orderBy(calendarEvents.startDate);

    return NextResponse.json(events);
  } catch (error) {
    console.error("GET /api/events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, startDate, endDate, allDay, location, color, recurrenceFreq } = body;
    
    const [event] = await db
      .insert(calendarEvents)
      .values({
        userId: session.user.id,
        title,
        description: description ?? null,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        allDay: allDay ?? false,
        location: location ?? null,
        color: color ?? "blue",
        recurrence: recurrenceFreq ? { frequency: recurrenceFreq } : null,
      })
      .returning();

    await logAuditEvent({
      userId: session.user.id,
      action: "event_create",
      metadata: { title: event.title },
      ip: req.headers.get("x-forwarded-for") ?? undefined,
    });

    // Notify SSE clients
    notifySSEClients(session.user.id, { type: "event_created", data: event });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("POST /api/events error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Simple in-memory SSE broadcaster (Vercel-compatible)
const clients = new Map<string, Set<(data: unknown) => void>>();

export function addSSEClient(userId: string, callback: (data: unknown) => void) {
  if (!clients.has(userId)) clients.set(userId, new Set());
  clients.get(userId)!.add(callback);
  return () => clients.get(userId)?.delete(callback);
}

export function notifySSEClients(userId: string, data: unknown) {
  clients.get(userId)?.forEach(cb => cb(data));
}
