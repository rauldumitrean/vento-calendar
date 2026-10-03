import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-3.5-flash",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
  },
});

async function main() {
  try {
    const res = await model.generateContent("Respond with an empty JSON array []");
    console.log("Response:", res.response.text());
  } catch (err: any) {
    console.error("Error with gemini-3.5-flash:", err.message);
  }
}
main();
