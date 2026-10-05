const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

async function run() {
  try {
    const result = await model.generateContent("Di hola");
    console.log("Success:", result.response.text());
  } catch(e) {
    console.error("Error:", e.message);
  }
}
run();
