const fs = require('fs');
let content = fs.readFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', 'utf8');

// Fix characters
content = content.replace(/No se detect ningn evento vlido\./g, 'No se detectó ningún evento válido.');
content = content.replace(/\$\{successCount\} evento\(s\) guardado\(s\)!/g, '¡${successCount} evento(s) guardado(s)!');
content = content.replace(/Da/g, 'Día');

// Listen to custom event
const useEffectOld = `  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);`;
  
const useEffectNew = `  useEffect(() => {
    fetchEvents();
    const handler = () => fetchEvents();
    window.addEventListener("ventoo-events-updated", handler);
    return () => window.removeEventListener("ventoo-events-updated", handler);
  }, [fetchEvents]);`;

content = content.replace(useEffectOld, useEffectNew);

fs.writeFileSync('C:/ventoo-calendar/src/components/calendar/CalendarView.tsx', content);
