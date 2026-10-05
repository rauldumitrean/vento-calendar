const fs = require('fs');
let content = fs.readFileSync('src/components/ai/AIChat.tsx', 'utf8');

const replacement = `      const data = await res.json();
      
      let finalContent = data.error ? \`Error: \${data.error}\` : (data.response ?? "Lo siento, hubo un error.");

      // Check if response contains a create_event JSON block
      const match = finalContent.match(/\`\`\`json([\\s\\S]*?)\`\`\`/);
      if (match) {
        try {
          const events = JSON.parse(match[1]);
          if (Array.isArray(events)) {
            let createdCount = 0;
            for (const evt of events) {
              if (evt.action === "create_event") {
                const res = await fetch("/api/events", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(evt),
                });
                if (res.ok) createdCount++;
              }
            }
            if (createdCount > 0) {
              // Strip JSON block from content and add success message
              finalContent = finalContent.replace(match[0], \`\\n\\n? **¡He creado \${createdCount} evento(s) en tu calendario!**\`);
            }
          }
        } catch(e) {
          console.error("Error parsing AI JSON action:", e);
        }
      }

      setMessages(prev => [...prev, {
        role: "assistant",
        content: finalContent,
      }]);`;

const regex = /const data = await res\.json\(\);[\s\S]*?\}\]\);/;
content = content.replace(regex, replacement);

fs.writeFileSync('src/components/ai/AIChat.tsx', content);
