const fs = require('fs');
let lines = fs.readFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', 'utf8').split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('toast.error("No se detect')) {
    lines[i] = '            toast.error("No se detectó ningún evento válido.");';
  }
  if (lines[i].includes('toast.success(`')) {
    lines[i] = '            toast.success(`¡${successCount} evento(s) guardado(s)!`);';
  }
  if (lines[i].includes('label: "D') && lines[i].includes('a"')) {
    lines[i] = '    { key: "day", label: "Día" },';
  }
}

// And add the window event listener
let finalContent = lines.join('\n');
const useEffectOld = `  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);`;
  
const useEffectNew = `  useEffect(() => {
    fetchEvents();
    const handler = () => fetchEvents();
    window.addEventListener("ventoo-events-updated", handler);
    return () => window.removeEventListener("ventoo-events-updated", handler);
  }, [fetchEvents]);`;

finalContent = finalContent.replace(useEffectOld, useEffectNew);

fs.writeFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', finalContent);
