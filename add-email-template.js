const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/lib/email.ts', 'utf8');

const newTemplate = `
export function userSecurityAlertTemplate(userName: string) {
  const now = new Date().toLocaleString("es-ES", { timeZone: "Europe/Madrid" });
  return \`
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"></head>
    <body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f1f5f9;margin:0;padding:20px;">
      <div style="max-width:500px;margin:0 auto;background:white;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,0.05);">
        <div style="background:#2563eb;padding:24px;">
          <h1 style="color:white;margin:0;font-size:18px;">🔒 Alerta de Seguridad</h1>
        </div>
        <div style="padding:24px;">
          <p style="font-size:16px;color:#1e293b;">Hola <strong>\${userName}</strong>,</p>
          <p style="color:#64748b;line-height:1.5;">Hemos detectado un nuevo inicio de sesión en tu cuenta de Ventoo Calendar.</p>
          <div style="background:#f8fafc;padding:12px;border-radius:8px;margin:16px 0;">
            <p style="margin:0;color:#334155;"><strong>Fecha y hora:</strong> \${now}</p>
          </div>
          <p style="color:#64748b;font-size:14px;">Si has sido tú, puedes ignorar este correo. Si no reconoces este inicio de sesión, te recomendamos cambiar tu contraseña inmediatamente.</p>
        </div>
      </div>
    </body>
    </html>
  \`;
}
`;

content = content + newTemplate;
fs.writeFileSync('C:/ventoo-calendar/src/lib/email.ts', content);
