import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { tasks } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { logAuditEvent } from "@/lib/audit";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const userTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.userId, session.user.id))
      .orderBy(tasks.createdAt);

    return NextResponse.json(userTasks);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const [task] = await db
      .insert(tasks)
      .values({
        ...body,
        userId: session.user.id,
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
      })
      .returning();

    await logAuditEvent({ userId: session.user.id, action: "task_create", metadata: { title: task.title } });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
