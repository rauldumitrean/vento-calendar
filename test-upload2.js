const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

async function run() {
  const imagePath = "C:/Users/raul/.gemini/antigravity/brain/a048c7db-da3f-447e-a8cc-5ade26538cba/.user_uploaded/media_1791211441962.png";
  const base64Data = fs.readFileSync(imagePath).toString("base64");
  
  const models = ["gemini-3.5-flash-lite", "gemini-3.8-flash", "gemini-3.7-flash", "gemini-3.6-flash"];
  
  for (const m of models) {
    try {
      console.log("Testing:", m);
      const model = genAI.getGenerativeModel({ model: m });
      const result = await model.generateContent([
        { inlineData: { data: base64Data, mimeType: "image/png" } },
        "Say hi"
      ]);
      console.log(m, "WORKS:", result.response.text());
      return; // Exit if one works
    } catch (err) {
      console.error(m, "FAILED:", err.message.split("[")[1] || err.message);
    }
  }
}
run();
