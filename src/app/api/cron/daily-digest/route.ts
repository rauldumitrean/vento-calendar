import { db } from "@/lib/db";
import { calendarEvents, tasks, userSettings } from "@/lib/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { neon } from "@neondatabase/serverless";
import { sendEmail, dailyDigestTemplate } from "@/lib/email";
import { NextRequest, NextResponse } from "next/server";
// StartOfDay and endOfDay from date-fns are no longer needed for UTC since we calculate window manually

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
    // A wider time window to cover any timezone (e.g. +/- 2 days around UTC)
    const utcStart = new Date(today);
    utcStart.setDate(utcStart.getDate() - 2);
    const utcEnd = new Date(today);
    utcEnd.setDate(utcEnd.getDate() + 2);

    let sent = 0;

    for (const setting of settings) {
      try {
        const tz = setting.timezone || "Europe/Madrid";
        
        // Get user info from Ventoo users table
        const users = await sql`
          SELECT id, name, email FROM "User" WHERE id = ${setting.userId} LIMIT 1
        `;
        if (!users.length) continue;
        const user = users[0];

        // Get events roughly around today
        const rawEvents = await db
          .select()
          .from(calendarEvents)
          .where(
            and(
              eq(calendarEvents.userId, setting.userId),
              lte(calendarEvents.startDate, utcEnd),
              gte(calendarEvents.endDate, utcStart)
            )
          )
          .orderBy(calendarEvents.startDate);

        // Filter exactly using Intl in the user's timezone
        const dateFmt = new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" });
        const todayStr = dateFmt.format(today);

        const todayEvents = rawEvents.filter(ev => {
          const evStartStr = dateFmt.format(ev.startDate);
          const evEndStr = dateFmt.format(ev.endDate);
          return evStartStr <= todayStr && evEndStr >= todayStr;
        });

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

        const formatter = new Intl.DateTimeFormat("es-ES", { timeZone: tz, weekday: "long", day: "numeric", month: "long" });
        const todayFormattedES = formatter.format(today);

        await sendEmail({
          to: user.email,
          subject: `📅 Tu resumen del día — ${todayFormattedES}`,
          html: dailyDigestTemplate(user.name, todayEvents, pendingTasks, tz),
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
