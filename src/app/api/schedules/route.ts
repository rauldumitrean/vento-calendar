import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { schedules } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const list = await db
      .select()
      .from(schedules)
      .where(eq(schedules.userId, session.user.id));

    return NextResponse.json(list);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, dayOfWeek, startTime, endTime, location, color } = body;
    
    const [schedule] = await db
      .insert(schedules)
      .values({
        userId: session.user.id,
        title,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        location: location || null,
        color: color || "blue",
      })
      .returning();

    return NextResponse.json(schedule, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "No ID" }, { status: 400 });

    await db.delete(schedules).where(eq(schedules.id, id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { id, title, dayOfWeek, startTime, endTime, location, color } = body;
    
    if (!id) return NextResponse.json({ error: "No ID provided" }, { status: 400 });

    const [schedule] = await db
      .update(schedules)
      .set({
        title,
        dayOfWeek: Number(dayOfWeek),
        startTime,
        endTime,
        location: location || null,
        color: color || "blue",
      })
      .where(eq(schedules.id, id))
      .returning();

    return NextResponse.json(schedule);
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
