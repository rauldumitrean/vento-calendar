import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(options: EmailOptions) {
  try {
    await transporter.sendMail({
      from: `"Ventoo Calendar" <${process.env.GMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

// ── Templates ──────────────────────────────────────────────────────────────

export function dailyDigestTemplate(userName: string, events: Array<{title: string; startDate: Date; endDate: Date; location?: string | null}>, tasks: Array<{title: string; dueDate?: Date | null; priority: string}>) {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const eventsHtml = events.length > 0
    ? events.map(e => `
      <div style="padding:12px;margin:8px 0;background:#f8fafc;border-left:4px solid #3b82f6;border-radius:4px;">
        <strong style="color:#1e293b;">${e.title}</strong><br>
        <span style="color:#64748b;font-size:14px;">
          ${new Date(e.startDate).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })} –
          ${new Date(e.endDate).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })}
          ${e.location ? `· 📍 ${e.location}` : ""}
        </span>
      </div>`).join("")
    : `<p style="color:#94a3b8;font-style:italic;">No tienes eventos para hoy 🎉</p>`;

  const tasksHtml = tasks.length > 0
    ? tasks.map(t => `
      <div style="padding:12px;margin:8px 0;background:#f8fafc;border-left:4px solid ${t.priority === "high" ? "#ef4444" : t.priority === "medium" ? "#f59e0b" : "#22c55e"};border-radius:4px;">
        <strong style="color:#1e293b;">${t.title}</strong><br>
        <span style="color:#64748b;font-size:14px;">Prioridad: ${t.priority === "high" ? "🔴 Alta" : t.priority === "medium" ? "🟡 Media" : "🟢 Baja"}
        ${t.dueDate ? ` · Vence: ${new Date(t.dueDate).toLocaleDateString("es-ES")}` : ""}</span>
      </div>`).join("")
    : `<p style="color:#94a3b8;font-style:italic;">No tienes tareas pendientes para hoy 👏</p>`;

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">📅 Ventoo Calendar</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px;">Tu resumen del día</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#334155;font-size:18px;">Hola, <strong>${userName}</strong> 👋</p>
          <p style="color:#64748b;">Hoy es <strong>${today}</strong>. Aquí tienes tu resumen:</p>

          <h2 style="color:#1e293b;font-size:16px;margin-top:24px;margin-bottom:12px;">📆 Eventos de hoy</h2>
          ${eventsHtml}

          <h2 style="color:#1e293b;font-size:16px;margin-top:24px;margin-bottom:12px;">✅ Tareas pendientes</h2>
          ${tasksHtml}

          <div style="margin-top:32px;text-align:center;">
            <a href="${process.env.NEXTAUTH_URL}" style="background:#667eea;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
              Abrir Ventoo Calendar →
            </a>
          </div>
        </div>
        <div style="background:#f8fafc;padding:16px;text-align:center;">
          <p style="color:#94a3b8;font-size:12px;margin:0;">
            Puedes cambiar tus preferencias de notificación en la configuración.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function auditEmailTemplate(action: string, userName: string, userEmail: string, metadata?: Record<string, unknown>) {
  const actionLabels: Record<string, string> = {
    login: "🔐 Inicio de sesión",
    logout: "🚪 Cierre de sesión",
    event_create: "📅 Evento creado",
    event_update: "✏️ Evento modificado",
    event_delete: "🗑️ Evento eliminado",
    task_create: "✅ Tarea creada",
    task_update: "✏️ Tarea modificada",
    task_delete: "🗑️ Tarea eliminada",
  };

  const label = actionLabels[action] ?? action;
  const now = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:500px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="background:#1e293b;padding:24px;">
          <h1 style="color:white;margin:0;font-size:18px;">🔔 Actividad en Ventoo Calendar</h1>
        </div>
        <div style="padding:24px;">
          <p style="font-size:20px;font-weight:600;color:#1e293b;">${label}</p>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;width:120px;">Usuario</td><td style="color:#1e293b;font-weight:500;">${userName}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Email</td><td style="color:#1e293b;">${userEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#64748b;">Fecha/hora</td><td style="color:#1e293b;">${now}</td></tr>
            ${metadata ? Object.entries(metadata).map(([k, v]) => `<tr><td style="padding:8px 0;color:#64748b;">${k}</td><td style="color:#1e293b;">${v}</td></tr>`).join("") : ""}
          </table>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function userSecurityAlertTemplate(userName: string) {
  const now = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:500px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="background:#2563eb;padding:24px;">
          <h1 style="color:white;margin:0;font-size:18px;">🔒 Alerta de Seguridad</h1>
        </div>
        <div style="padding:24px;">
          <p style="font-size:16px;color:#1e293b;">Hola <strong>${userName}</strong>,</p>
          <p style="color:#64748b;line-height:1.5;">Hemos detectado un nuevo inicio de sesión en tu cuenta de Ventoo Calendar.</p>
          <div style="background:#f8fafc;padding:12px;border-radius:8px;margin:16px 0;">
            <p style="margin:0;color:#334155;"><strong>Fecha y hora:</strong> ${now}</p>
          </div>
          <p style="color:#64748b;font-size:14px;">Si has sido tú, puedes ignorar este correo. Si no reconoces este inicio de sesión, te recomendamos cambiar tu contraseña inmediatamente.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}


// ═══════════════════════════════════════════════════════════════════
// Welcome Email
// ═══════════════════════════════════════════════════════════════════
export async function sendWelcomeEmail({ name, email }: { name: string; email: string }) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:540px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.07);">
        <div style="background:linear-gradient(135deg,#7c3aed 0%,#9333ea 100%);padding:36px;text-align:center;">
          <h1 style="color:white;margin:0;font-size:26px;font-weight:800;">Ventoo Calendar</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:15px;">Tu calendario inteligente con IA</p>
        </div>
        <div style="padding:32px;">
          <p style="font-size:18px;color:#1e293b;">Hola, <strong>${name}</strong> 👋</p>
          <p style="color:#64748b;line-height:1.6;">Bienvenido/a a <strong>Ventoo Calendar</strong>. Tu cuenta se ha creado correctamente y ya puedes empezar a organizar tu vida con la ayuda de la IA.</p>
          <div style="margin:28px 0;text-align:center;">
            <a href="${process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? 'https://vento-calendar.vercel.app'}/calendar"
               style="background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;">
              Abrir mi Calendario &rarr;
            </a>
          </div>
          <p style="color:#94a3b8;font-size:13px;text-align:center;">Si no has creado esta cuenta, ignora este correo.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendEmail({ to: email, subject: "¡Bienvenido/a a Ventoo Calendar!", html });
}
