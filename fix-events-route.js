const fs = require('fs');

let content = fs.readFileSync('src/app/api/events/route.ts', 'utf8');

// The field should be recurrence, not recurrenceFreq in DB insertion
content = content.replace(/recurrenceFreq,/, 'recurrence: recurrenceFreq ? { frequency: recurrenceFreq } : null,');

fs.writeFileSync('src/app/api/events/route.ts', content);
