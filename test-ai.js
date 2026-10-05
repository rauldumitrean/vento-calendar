const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function testModel(modelName) {
  try {
    const start = Date.now();
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Hola, esto es una prueba. Responde solo con la palabra OK.");
    const text = result.response.text().trim();
    const time = Date.now() - start;
    console.log(`[${modelName}] Time: ${time}ms | Response: ${text}`);
  } catch (err) {
    console.error(`[${modelName}] Error:`, err.message);
  }
}

async function run() {
  await testModel("gemini-2.5-flash");
  await testModel("gemini-2.5-pro");
  await testModel("gemini-3.5-flash");
  await testModel("gemini-3.8-flash");
}
run();
