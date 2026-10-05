const fs = require('fs');
let content = fs.readFileSync('src/app/(dashboard)/schedule/page.tsx', 'utf8');

const oldFetch = `      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualForm.title,
          description: "Clase añadida manualmente",
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          allDay: false,
          location: manualForm.location || null,
          color: manualForm.color,
          recurrenceFreq: "weekly",
        }),
      });`;

const newFetch = `      const res = await fetch("/api/schedules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: manualForm.title,
          dayOfWeek: manualForm.dayOfWeek,
          startTime: manualForm.startTime,
          endTime: manualForm.endTime,
          location: manualForm.location || null,
          color: manualForm.color,
        }),
      });`;

content = content.replace(oldFetch, newFetch);

// Also remove the unused startDate endDate calculations
content = content.replace(/const today = new Date\(\);[\s\S]*?const endDate = new Date\(nextDate\);\s*endDate\.setHours\(Number\(endH\), Number\(endM\), 0, 0\);/g, '');

fs.writeFileSync('src/app/(dashboard)/schedule/page.tsx', content);
