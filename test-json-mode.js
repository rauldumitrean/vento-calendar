const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: '.env.local' });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ 
    model: "gemini-3.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });
  
  try {
    const result = await model.generateContent("Give me a schedule array with 1 class. Format: [{title, dayOfWeek, startTime, endTime}]");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err.message);
  }
}
run();
