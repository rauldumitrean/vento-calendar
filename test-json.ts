import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");
const model = genAI.getGenerativeModel({
  model: "gemini-3.8-flash",
  generationConfig: {
    temperature: 0.1,
    maxOutputTokens: 4096,
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.ARRAY,
      items: {
        type: SchemaType.OBJECT,
        properties: {
          title: { type: SchemaType.STRING },
          dayOfWeek: { type: SchemaType.INTEGER },
          startTime: { type: SchemaType.STRING },
          endTime: { type: SchemaType.STRING },
          location: { type: SchemaType.STRING, nullable: true },
        },
        required: ["title", "dayOfWeek", "startTime", "endTime"],
      }
    }
  },
});

async function main() {
  try {
    const res = await model.generateContent("Create a fake 1 item schedule. Return only the JSON.");
    let responseText = res.response.text();
    console.log("Raw Response:");
    console.log(responseText);
    
    responseText = responseText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/```\s*$/, "")
      .trim();

    const match = responseText.match(/\[[\s\S]*\]/);
    const jsonText = match ? match[0] : responseText;
    console.log("JSON TEXT:\n", jsonText);
    const parsed = JSON.parse(jsonText);
    console.log("Parsed!", parsed);
  } catch (err: any) {
    console.error("Error:", err.message);
  }
}
main();
