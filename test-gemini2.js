const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });
async function test() {
  try {
    const res = await model.generateContent('Hola');
    console.log('Success:', res.response.text());
  } catch (e) {
    console.log('Gemini Error:', e.message);
  }
}
test();
