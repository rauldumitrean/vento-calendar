const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  
  // 1x1 transparent png
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3jP4PgfAAWpA6FpW3+JAAAAAElFTkSuQmCC";
  
  const models = ["gemini-3.5-flash", "gemini-3.1-flash-image", "gemini-flash-latest"];
  
  for (const modelName of models) {
    console.log("Testing:", modelName);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent([
        { inlineData: { data: b64, mimeType: "image/png" } },
        "What is this image?"
      ]);
      console.log("Success with", modelName, ":", result.response.text());
    } catch (err) {
      console.error("Error with", modelName, ":", err.message);
    }
  }
}
run();
