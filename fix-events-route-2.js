const fs = require('fs');
let content = fs.readFileSync('src/app/api/events/route.ts', 'utf8');
content = content.replace(/recurrenceFreq: recurrenceFreq \?\? null,/g, 'recurrence: recurrenceFreq ? { frequency: recurrenceFreq } : null,');
fs.writeFileSync('src/app/api/events/route.ts', content);
