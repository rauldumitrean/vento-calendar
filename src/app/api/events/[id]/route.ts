import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { calendarEvents } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";
import { notifySSEClients } from "../route";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const [event] = await db
      .update(calendarEvents)
      .set({
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
        updatedAt: new Date(),
      })
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, session.user.id)))
      .returning();

    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await logAuditEvent({ userId: session.user.id, action: "event_update", metadata: { title: event.title } });
    notifySSEClients(session.user.id, { type: "event_updated", data: event });

    return NextResponse.json(event);
  } catch (error) {
    console.error("PUT /api/events/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const [deleted] = await db
      .delete(calendarEvents)
      .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, session.user.id)))
      .returning();

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });

    await logAuditEvent({ userId: session.user.id, action: "event_delete", metadata: { title: deleted.title } });
    notifySSEClients(session.user.id, { type: "event_deleted", data: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/events/[id] error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
