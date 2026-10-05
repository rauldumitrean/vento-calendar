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

// ── SVGs ──────────────────────────────────────────────────────────────
const icons = {
  calendar: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  check: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`,
  mapPin: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
  bell: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>`,
  lock: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  logIn: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>`,
  logOut: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`,
  smile: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>`,
  circleRed: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#ef4444" stroke="none"><circle cx="12" cy="12" r="10"></circle></svg>`,
  circleYellow: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#f59e0b" stroke="none"><circle cx="12" cy="12" r="10"></circle></svg>`,
  circleGreen: `<svg width="12" height="12" viewBox="0 0 24 24" fill="#22c55e" stroke="none"><circle cx="12" cy="12" r="10"></circle></svg>`
};

// ── Templates ──────────────────────────────────────────────────────────────

export function dailyDigestTemplate(userName: string, events: Array<{title: string; startDate: Date; endDate: Date; location?: string | null}>, tasks: Array<{title: string; dueDate?: Date | null; priority: string}>, timezone: string = "Europe/Madrid") {
  const today = new Date().toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  });

  const eventsHtml = events.length > 0
    ? events.map(e => `
      <div style="padding:12px;margin:8px 0;background:#f8fafc;border-left:4px solid #3b82f6;border-radius:4px;">
        <strong style="color:#1e293b;">${e.title}</strong><br>
        <span style="color:#64748b;font-size:14px;display:flex;align-items:center;gap:4px;margin-top:4px;">
          ${new Date(e.startDate).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: timezone })} –
          ${new Date(e.endDate).toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit", timeZone: timezone })}
          ${e.location ? `<span style="display:inline-flex;align-items:center;margin-left:8px;">${icons.mapPin} ${e.location}</span>` : ""}
        </span>
      </div>`).join("")
    : `<p style="color:#94a3b8;font-style:italic;display:flex;align-items:center;gap:8px;">${icons.smile} No tienes eventos para hoy</p>`;

  const tasksHtml = tasks.length > 0
    ? tasks.map(t => `
      <div style="padding:12px;margin:8px 0;background:#f8fafc;border-left:4px solid ${t.priority === "high" ? "#ef4444" : t.priority === "medium" ? "#f59e0b" : "#22c55e"};border-radius:4px;">
        <strong style="color:#1e293b;">${t.title}</strong><br>
        <span style="color:#64748b;font-size:14px;display:flex;align-items:center;gap:4px;margin-top:4px;">Prioridad: ${t.priority === "high" ? icons.circleRed + " Alta" : t.priority === "medium" ? icons.circleYellow + " Media" : icons.circleGreen + " Baja"}
        ${t.dueDate ? ` | Vence: ${new Date(t.dueDate).toLocaleDateString("es-ES", { timeZone: timezone })}` : ""}</span>
      </div>`).join("")
    : `<p style="color:#94a3b8;font-style:italic;display:flex;align-items:center;gap:8px;">${icons.smile} No tienes tareas pendientes para hoy</p>`;

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:600px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);padding:32px;text-align:center;">
          <div style="color:white;margin-bottom:12px;display:inline-block;">${icons.calendar}</div>
          <h1 style="color:white;margin:0;font-size:24px;font-weight:700;">Ventoo Calendar</h1>
          <p style="color:rgba(255,255,255,0.85);margin:8px 0 0;font-size:16px;">Tu resumen del día</p>
        </div>
        <div style="padding:32px;">
          <p style="color:#334155;font-size:18px;">Hola, <strong>${userName}</strong></p>
          <p style="color:#64748b;">Hoy es <strong>${today}</strong>. Aquí tienes tu resumen:</p>

          <h2 style="color:#1e293b;font-size:16px;margin-top:24px;margin-bottom:12px;display:flex;align-items:center;gap:8px;"><span style="width:20px;height:20px;display:inline-block;">${icons.calendar}</span> Eventos de hoy</h2>
          ${eventsHtml}

          <h2 style="color:#1e293b;font-size:16px;margin-top:24px;margin-bottom:12px;display:flex;align-items:center;gap:8px;"><span style="width:20px;height:20px;display:inline-block;">${icons.check}</span> Tareas pendientes</h2>
          ${tasksHtml}

          <div style="margin-top:32px;text-align:center;">
            <a href="${process.env.NEXTAUTH_URL}" style="background:#667eea;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
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
  const actionDetails: Record<string, { label: string, icon: string }> = {
    login: { label: "Inicio de sesión", icon: icons.logIn },
    logout: { label: "Cierre de sesión", icon: icons.logOut },
    event_create: { label: "Evento creado", icon: icons.calendar },
    event_update: { label: "Evento modificado", icon: icons.edit },
    event_delete: { label: "Evento eliminado", icon: icons.trash },
    task_create: { label: "Tarea creada", icon: icons.check },
    task_update: { label: "Tarea modificada", icon: icons.edit },
    task_delete: { label: "Tarea eliminada", icon: icons.trash },
  };

  const detail = actionDetails[action] ?? { label: action, icon: icons.bell };
  const now = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });

  return `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:500px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="background:#1e293b;padding:24px;display:flex;align-items:center;gap:12px;">
          <div style="color:white;width:24px;height:24px;">${icons.bell}</div>
          <h1 style="color:white;margin:0;font-size:18px;">Actividad en Ventoo Calendar</h1>
        </div>
        <div style="padding:24px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:16px;">
            <div style="color:#1e293b;width:20px;height:20px;">${detail.icon}</div>
            <p style="font-size:20px;font-weight:600;color:#1e293b;margin:0;">${detail.label}</p>
          </div>
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
        <div style="background:#2563eb;padding:24px;display:flex;align-items:center;gap:12px;">
          <div style="color:white;width:24px;height:24px;">${icons.lock}</div>
          <h1 style="color:white;margin:0;font-size:18px;">Alerta de Seguridad</h1>
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
          <p style="font-size:18px;color:#1e293b;">Hola, <strong>${name}</strong></p>
          <p style="color:#64748b;line-height:1.6;">Bienvenido/a a <strong>Ventoo Calendar</strong>. Tu cuenta se ha creado correctamente y ya puedes empezar a organizar tu vida con la ayuda de la IA.</p>
          <div style="margin:28px 0;text-align:center;">
            <a href="${process.env.AUTH_URL ?? process.env.NEXTAUTH_URL ?? 'https://vento-calendar.vercel.app'}/calendar"
               style="background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;padding:14px 32px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;display:inline-block;">
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
