require('dotenv').config({ path: '.env.local' });
const { parseNaturalLanguageEvent } = require('./src/lib/gemini.ts');

// I need to compile gemini.ts or just run it with ts-node/tsx if available.
