const fs = require('fs');
let content = fs.readFileSync('src/app/api/schedule/upload/route.ts', 'utf8');

content = content.replace(/import \{ calendarEvents \} from \"@\/lib\/db\/schema\";/g, 'import { schedules } from "@/lib/db/schema";');

const oldDbInsert = `      return {
        userId: session.user.id,
        title: evt.title,
        description: "Clase importada",
        startDate: start,
        endDate: end,
        location: evt.location || null,
        color: colorMap.get(evt.title),
        recurrenceFreq: "weekly",
      };
    });

    await db.insert(calendarEvents).values(dbEvents);`;

const newDbInsert = `      return {
        userId: session.user.id,
        title: evt.title,
        dayOfWeek: Number(evt.dayOfWeek),
        startTime: evt.startTime,
        endTime: evt.endTime,
        location: evt.location || null,
        color: colorMap.get(evt.title) || "blue",
      };
    });

    await db.insert(schedules).values(dbEvents);`;

content = content.replace(oldDbInsert, newDbInsert);
content = content.replace(/const start = parse\(evt\.startTime[\s\S]*?;/, '');

fs.writeFileSync('src/app/api/schedule/upload/route.ts', content);
