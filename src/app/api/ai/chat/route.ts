import { auth } from "@/lib/auth";
import { chatWithCalendarAI } from "@/lib/gemini";
import { db } from "@/lib/db";
import { calendarEvents, tasks } from "@/lib/db/schema";
import { eq, gte } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { message } = await req.json();

    // Get context
    const now = new Date();
    const [upcomingEvents, pendingTasks] = await Promise.all([
      db.select({ title: calendarEvents.title, startDate: calendarEvents.startDate })
        .from(calendarEvents)
        .where(eq(calendarEvents.userId, session.user.id))
        .limit(10),
      db.select({ title: tasks.title, priority: tasks.priority, dueDate: tasks.dueDate })
        .from(tasks)
        .where(eq(tasks.userId, session.user.id))
        .limit(10),
    ]);

    const response = await chatWithCalendarAI(message, { upcomingEvents, pendingTasks });
    return NextResponse.json({ response });
  } catch (error: any) {
    console.error("AI chat error:", error);
    return NextResponse.json({ error: String(error?.message || "Error en el chat") }, { status: 500 });
  }
}
