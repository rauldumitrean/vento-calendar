const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const users = await sql`SELECT id, email FROM "User" LIMIT 5`;
  console.log("Users:", users);
  const events = await sql`SELECT id, user_id, title, start_date FROM calendar_events`;
  console.log("Events:", events);
  const schedules = await sql`SELECT id, user_id, title, day_of_week FROM calendar_schedules`;
  console.log("Schedules:", schedules);
}
run();
