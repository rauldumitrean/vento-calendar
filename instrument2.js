const fs = require('fs');
let content = fs.readFileSync('src/app/api/ai/parse/route.ts', 'utf8');

const replacement = \  } catch (error: any) {
    console.error("AI parse error FULL:", error, "\\nMessage:", error?.message, "\\nStack:", error?.stack);
    const fs = require('fs');
    try {
      fs.writeFileSync('error-ai.txt', String(error?.stack || error?.message || error));
      fs.writeFileSync('E:/08. Proyectos/ventoo-calendar/error-ai.txt', String(error?.stack || error?.message || error));
    } catch(e) {}
    return NextResponse.json({ error: "No se pudo interpretar el texto" }, { status: 500 });
  }\;

content = content.replace(/  } catch \(error\) \{[\s\S]*?status: 500 \}\);\n  \}/, replacement);
fs.writeFileSync('src/app/api/ai/parse/route.ts', content);
