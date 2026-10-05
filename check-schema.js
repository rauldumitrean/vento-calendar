const { neon } = require('@neondatabase/serverless');
require('dotenv').config({ path: '.env.local' });
const sql = neon(process.env.DATABASE_URL);
async function checkSchema() {
  const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'User'`;
  console.log(JSON.stringify(cols, null, 2));
}
checkSchema().catch(console.error);
