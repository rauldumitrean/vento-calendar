import { chatWithCalendarAI } from './src/lib/gemini';
chatWithCalendarAI('Hola', {upcomingEvents: [], pendingTasks: []}).then(console.log).catch(console.error);
