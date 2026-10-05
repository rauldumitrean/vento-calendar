const { neon } = require('@neondatabase/serverless');
const sql = neon('postgresql://neondb_owner:npg_CfhGlX8iNkE9@ep-old-bonus-asfl3npb-pooler.c-4.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require');
async function run() {
  const res = await sql.query('SELECT * FROM "User" LIMIT 1');
  console.log(res);
}
run();
