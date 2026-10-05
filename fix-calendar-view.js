const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarView.tsx', 'utf8');

const regex = /const handleNLSubmit = async \([\s\S]*?\} catch \{[\s\S]*?toast\.error\("Error al interpretar el texto"\);\s*\}/;

const replacement = `const handleNLSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!nlInput.trim()) return;
      setParsingNL(true);
      try {
        const res = await fetch("/api/ai/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: nlInput }),
        });
        const parsedData = await res.json();
        
        if (parsedData.error) {
          toast.error(parsedData.error);
        } else {
          const eventsToCreate = Array.isArray(parsedData) ? parsedData : [parsedData];
          if (eventsToCreate.length === 0) {
            toast.error("No se detectó ningún evento válido.");
            setParsingNL(false);
            return;
          }
          let successCount = 0;
          for (const evt of eventsToCreate) {
            const createRes = await fetch("/api/events", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(evt),
            });
            if (createRes.ok) successCount++;
          }
          if (successCount > 0) {
            toast.success(\`¡\${successCount} evento(s) guardado(s)!\`);
            setNlInput("");
            fetchEvents();
          } else {
            toast.error("Error al guardar los eventos");
          }
        }
      } catch {
        toast.error("Error al interpretar el texto");
      } finally {
        setParsingNL(false);
      }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/calendar/CalendarView.tsx', content);
