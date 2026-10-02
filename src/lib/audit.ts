import { db } from "@/lib/db";
import { auditLogs } from "@/lib/db/schema";
import { sendEmail, auditEmailTemplate } from "@/lib/email";
import { neon } from "@neondatabase/serverless";
import type { AuditLog } from "@/types";

const sql = neon(process.env.DATABASE_URL!);

interface LogAuditOptions {
  userId: string;
  action: AuditLog["action"];
  metadata?: Record<string, unknown>;
  ip?: string;
  userAgent?: string;
}

export async function logAuditEvent(options: LogAuditOptions) {
  try {
    await db.insert(auditLogs).values({
      userId: options.userId,
      action: options.action,
      metadata: options.metadata ?? null,
      ip: options.ip ?? null,
      userAgent: options.userAgent ?? null,
    });

    // Send security alert email to the USER
    if (options.action === "login") {
      const users = await sql`
        SELECT name, email FROM "User" WHERE id = ${Number(options.userId)} LIMIT 1
      `;
      if (users.length > 0) {
        const user = users[0];
        const { userSecurityAlertTemplate } = await import("./email");
        await sendEmail({
          to: user.email, // Send to the user who logged in, not the admin
          subject: "Alerta de seguridad: Nuevo inicio de sesión en Ventoo Calendar",
          html: userSecurityAlertTemplate(user.name),
        }).catch(console.error);
      }
    }
  } catch (error) {
    console.error("Audit log error:", error);
  }
}
