const http = require('http');
require('dotenv').config({ path: '.env.local' });

// We need a session token or we can just mock it, but Next.js requires auth.
// Let's just bypass auth in a local copy of route.ts to test Drizzle delete.
const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');
const { eq, and } = require('drizzle-orm');
const schema = require('./src/lib/db/schema');

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql, { schema });

async function run() {
  const id = 'ftkzx013936hmcviqfmeet7m';
  const userId = '1';
  
  console.log('Attempting delete for id:', id, 'userId:', userId);
  const deleted = await db
    .delete(schema.calendarEvents)
    .where(and(eq(schema.calendarEvents.id, id), eq(schema.calendarEvents.userId, userId)))
    .returning();
    
  console.log('Result:', deleted);
}
run();
