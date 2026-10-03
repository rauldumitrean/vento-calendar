import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "dummy_key");

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
      },
    },
  },
});

async function main() {
  try {
    const result = await model.generateContent("Return an empty schedule array: []");
    console.log("Raw output length:", result.response.text().length);
    console.log("Raw output:");
    console.log(result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}
main();
