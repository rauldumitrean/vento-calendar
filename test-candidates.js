const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

const textModels = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-flash-latest"
];

const imageModels = [
  "gemini-3.1-flash-image",
  "gemini-omni-1.1-flash",
  "gemini-flash-latest",
  "gemini-3.5-flash-lite"
];

async function testText(modelName) {
  try {
    const start = Date.now();
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent("Test. Respond OK");
    console.log(`[Text] ${modelName}: OK (${Date.now() - start}ms)`);
  } catch (err) {
    console.log(`[Text] ${modelName}: Error - ${err.message.split("[")[1] || err.message}`);
  }
}

async function testImage(modelName) {
  try {
    const start = Date.now();
    const model = genAI.getGenerativeModel({ model: modelName });
    const imagePath = "C:/Users/raul/.gemini/antigravity/brain/a048c7db-da3f-447e-a8cc-5ade26538cba/.user_uploaded/media_1791211441962.png";
    const imageBase64 = fs.readFileSync(imagePath).toString("base64");
    
    const result = await model.generateContent([
      "Test. Respond OK",
      { inlineData: { data: imageBase64, mimeType: "image/png" } }
    ]);
    console.log(`[Image] ${modelName}: OK (${Date.now() - start}ms)`);
  } catch (err) {
    console.log(`[Image] ${modelName}: Error - ${err.message.split("[")[1] || err.message}`);
  }
}

async function run() {
  console.log("--- TEXT TESTS ---");
  for (const m of textModels) await testText(m);
  console.log("--- IMAGE TESTS ---");
  for (const m of imageModels) await testImage(m);
}
run();
