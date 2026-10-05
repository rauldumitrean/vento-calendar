const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
require('dotenv').config({ path: '.env.local' });

async function run() {
  const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });
  
  // Create a dummy PDF
  const dummyPdf = "%PDF-1.0\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj 2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj 3 0 obj<</Type/Page/MediaBox[0 0 3 3]>>endobj\nxref\n0 4\n0000000000 65535 f\n0000000010 00000 n\n0000000053 00000 n\n0000000102 00000 n\ntrailer<</Size 4/Root 1 0 R>>\nstartxref\n149\n%%EOF";
  const b64 = Buffer.from(dummyPdf).toString("base64");
  
  try {
    const result = await model.generateContent([
      { inlineData: { data: b64, mimeType: "application/pdf" } },
      "Extrae los datos"
    ]);
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Strategy 1 failed:", err);
    try {
      const result2 = await model.generateContent([
        { inlineData: { data: b64, mimeType: "application/pdf" } },
        "Retry extract"
      ]);
      console.log("Success 2:", result2.response.text());
    } catch (err2) {
      console.error("Strategy 2 failed:", err2);
    }
  }
}
run();
