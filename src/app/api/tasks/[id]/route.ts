import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const body = await req.json();
    const [task] = await db
      .update(tasks)
      .set({ ...body, dueDate: body.dueDate ? new Date(body.dueDate) : null, updatedAt: new Date() })
      .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
      .returning();

    if (!task) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await logAuditEvent({ userId: session.user.id, action: "task_update", metadata: { title: task.title } });

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  try {
    const [deleted] = await db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
      .returning();

    if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
    await logAuditEvent({ userId: session.user.id, action: "task_delete", metadata: { title: deleted.title } });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
