import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userSettings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const settings = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    if (!settings) {
      // Default settings
      return NextResponse.json({
        timezone: "Europe/Madrid",
        dailyDigestEnabled: true,
        dailyDigestTime: "08:00",
        defaultView: "month",
        weekStartsOn: 1,
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { timezone, dailyDigestEnabled, dailyDigestTime, theme, defaultView, weekStartsOn } = body;

    const existing = await db.query.userSettings.findFirst({
      where: eq(userSettings.userId, session.user.id),
    });

    if (existing) {
      await db.update(userSettings)
        .set({
          timezone,
          dailyDigestEnabled,
          dailyDigestTime,
          theme,
          defaultView,
          weekStartsOn,
          updatedAt: new Date(),
        })
        .where(eq(userSettings.userId, session.user.id));
    } else {
      await db.insert(userSettings).values({
        userId: session.user.id,
        timezone,
        dailyDigestEnabled,
        dailyDigestTime,
        theme,
        defaultView,
        weekStartsOn,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
