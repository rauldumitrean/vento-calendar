import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq, and } from 'drizzle-orm';
import { calendarEvents } from './src/lib/db/schema';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function run() {
  const id = 'ftkzx013936hmcviqfmeet7m';
  const userId = '1';
  
  console.log('Attempting delete for id:', id, 'userId:', userId);
  const deleted = await db
    .delete(calendarEvents)
    .where(and(eq(calendarEvents.id, id), eq(calendarEvents.userId, userId)))
    .returning();
    
  console.log('Result:', deleted);
}
run();
