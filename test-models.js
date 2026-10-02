require('dotenv').config({ path: '.env.local' });
async function run() {
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GOOGLE_AI_API_KEY);
  const data = await res.json();
  if (data.error) console.error(data.error);
  else console.log(data.models.map(m => m.name));
}
run();
