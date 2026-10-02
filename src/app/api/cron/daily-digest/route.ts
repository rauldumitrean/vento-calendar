import { db } from "@/lib/db";
import { calendarEvents, tasks, userSettings } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { sendEmail, dailyDigestTemplate } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
import { startOfDay, endOfDay } from "date-fns";

const sql = neon(process.env.DATABASE_URL!);

export async function GET(req: NextRequest) {
  // Verify Vercel Cron secret
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get all users with daily digest enabled
    const settings = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.dailyDigestEnabled, true));

    const today = new Date();
    const dayStart = startOfDay(today);
    const dayEnd = endOfDay(today);

    let sent = 0;

    for (const setting of settings) {
      try {
        // Get user info from Ventoo users table
        const users = await sql`
          SELECT id, name, email FROM users WHERE id = ${setting.userId} LIMIT 1
        `;
        if (!users.length) continue;
        const user = users[0];

        // Get today's events
        const todayEvents = await db
          .select()
          .from(calendarEvents)
          .where(
            and(
              eq(calendarEvents.userId, setting.userId),
              gte(calendarEvents.startDate, dayStart),
              lte(calendarEvents.startDate, dayEnd)
            )
          )
          .orderBy(calendarEvents.startDate);

        // Get pending tasks (due today or overdue)
        const pendingTasks = await db
          .select()
          .from(tasks)
          .where(
            and(
              eq(tasks.userId, setting.userId),
              eq(tasks.status, "todo")
            )
          );

        await sendEmail({
          to: user.email,
          subject: `📅 Tu resumen del día — ${today.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })}`,
          html: dailyDigestTemplate(user.name, todayEvents, pendingTasks),
        });

        sent++;
      } catch (err) {
        console.error(`Error sending digest to ${setting.userId}:`, err);
      }
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Cron daily-digest error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
