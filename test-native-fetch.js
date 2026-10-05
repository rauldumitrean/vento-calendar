require('dotenv').config({ path: '.env.local' });

async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GOOGLE_AI_API_KEY}`;
  const res = await fetch(url);
  const data = await res.json();
  data.models.forEach(m => console.log(m.name, m.supportedGenerationMethods));
}
run();
