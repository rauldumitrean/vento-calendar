const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/lib/audit.ts', 'utf8');

const oldLogic = `// Send audit email for auth events
    if (options.action === "login" || options.action === "logout") {
      const users = await sql\`
        SELECT name, email FROM "User" WHERE id = \${Number(options.userId)} LIMIT 1
      \`;
      if (users.length > 0) {
        const user = users[0];
        const adminEmail = process.env.AUDIT_EMAIL ?? process.env.GMAIL_USER!;
        await sendEmail({
          to: adminEmail,
          subject: \`[Ventoo Calendar] \${options.action === "login" ? "Nuevo inicio de sesión" : "Cierre de sesión"} - \${user.name}\`,
          html: auditEmailTemplate(options.action, user.name, user.email, options.metadata),
        }).catch(console.error);
      }
    }`;

const newLogic = `// Send security alert email to the USER
    if (options.action === "login") {
      const users = await sql\`
        SELECT name, email FROM "User" WHERE id = \${Number(options.userId)} LIMIT 1
      \`;
      if (users.length > 0) {
        const user = users[0];
        const { userSecurityAlertTemplate } = await import("./email");
        await sendEmail({
          to: user.email, // Send to the user who logged in, not the admin
          subject: "Alerta de seguridad: Nuevo inicio de sesión en Ventoo Calendar",
          html: userSecurityAlertTemplate(user.name),
        }).catch(console.error);
      }
    }`;

content = content.replace(/\/\/ Send audit email[\s\S]+?\}\n    \}/, newLogic);
fs.writeFileSync('C:/ventoo-calendar/src/lib/audit.ts', content);
