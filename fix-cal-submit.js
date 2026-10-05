const fs = require('fs');
let content = fs.readFileSync('src/components/calendar/CalendarView.tsx', 'utf8');

const regex = /setSelectedEvent\(null\);\s*setSelectedDate\(new Date\(parsed\.startDate\)\);\s*setPrefillData\(parsed\);\s*setShowModal\(true\);\s*toast\.success\(\"Evento interpretado!\"\);\s*setNlInput\(\"\"\);/;

const replacement = \// Send the parsed data directly to create the event
        const createRes = await fetch("/api/events", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed),
        });
        
        if (createRes.ok) {
          toast.success("Evento creado automáticamente con IA");
          setNlInput("");
          fetchEvents(); // Refresh calendar
        } else {
          toast.error("Error al guardar el evento en la base de datos");
        }\;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync('src/components/calendar/CalendarView.tsx', content);
  console.log("Success replacing modal logic");
} else {
  console.log("Regex didn't match!");
}
