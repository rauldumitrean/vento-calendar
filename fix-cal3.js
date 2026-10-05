const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarView.tsx', 'utf8');

const regex = /setSelectedEvent\(null\);[\s\S]*?setNlInput\(\"\"\);/;
const replacement = `// Send the parsed data directly to create the event
          const createRes = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(parsed),
          });
          
          if (createRes.ok) {
            toast.success("¡Evento creado y guardado en tu calendario!");
            setNlInput("");
            fetchEvents();
          } else {
            toast.error("Error al guardar el evento en la base de datos");
          }`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/components/calendar/CalendarView.tsx', content);
