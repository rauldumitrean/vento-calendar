const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
  
  // 1x1 transparent png
  const b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXY3jP4PgfAAWpA6FpW3+JAAAAAElFTkSuQmCC";
  
  try {
    const result = await model.generateContent([
      { inlineData: { data: b64, mimeType: "image/png" } },
      "What is this image?"
    ]);
    console.log("Success Image:", result.response.text());
  } catch (err) {
    console.error("Error Image:", err.message);
  }
}
run();
