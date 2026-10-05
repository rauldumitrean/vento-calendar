const { neon } = require("@neondatabase/serverless");
require("dotenv").config({ path: ".env.local" });
const sql = neon(process.env.DATABASE_URL);
async function run() {
  const events = await sql`SELECT id, user_id, title FROM calendar_events`;
  console.log("All Events:", events);
}
run();
