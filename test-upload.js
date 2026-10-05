const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

async function run() {
  try {
    const imagePath = "C:/Users/raul/.gemini/antigravity/brain/a048c7db-da3f-447e-a8cc-5ade26538cba/.user_uploaded/media_1791211441962.png";
    const base64Data = fs.readFileSync(imagePath).toString("base64");
    
    console.log("Sending request to Gemini...");
    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "image/png",
        },
      },
      "Extract schedule..."
    ]);
    console.log("Response:", result.response.text());
  } catch (err) {
    console.error("ERROR:", err.message);
  }
}
run();
