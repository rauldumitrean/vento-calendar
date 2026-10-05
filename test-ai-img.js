const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function testImage(modelName) {
  try {
    const start = Date.now();
    const model = genAI.getGenerativeModel({ model: modelName });
    
    const imagePath = "C:/Users/raul/.gemini/antigravity/brain/a048c7db-da3f-447e-a8cc-5ade26538cba/.user_uploaded/media_1791211441962.png";
    const imageBase64 = fs.readFileSync(imagePath).toString("base64");
    
    const result = await model.generateContent([
      "Describe esta imagen en 3 palabras.",
      { inlineData: { data: imageBase64, mimeType: "image/png" } }
    ]);
    const text = result.response.text().trim();
    const time = Date.now() - start;
    console.log(`[${modelName}] Time: ${time}ms | Response: ${text}`);
  } catch (err) {
    console.error(`[${modelName}] Error:`, err.message);
  }
}

async function run() {
  await testImage("gemini-3.1-pro-preview");
  await testImage("gemini-3.8-flash");
}
run();
