const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

async function run() {
  try {
    const res = await fetch("https://generativelanguage.googleapis.com/v1beta/models?key=" + process.env.GOOGLE_AI_API_KEY);
    const data = await res.json();
    if (data.models) {
      console.log(data.models.map(m => m.name).join("\n"));
    } else {
      console.log(data);
    }
  } catch (err) {
    console.error(err);
  }
}
run();
