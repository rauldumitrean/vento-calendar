const fs = require("fs");
let code = fs.readFileSync("src/lib/gemini.ts", "utf8");

code = code.replace(
  /export const geminiModel = genAI\.getGenerativeModel\(\{\s*model: "gemini-3\.5-flash",\s*\}\);/,
  `const nlpModel = genAI.getGenerativeModel({ model: "gemini-3.5-flash-lite" });\nconst chatModel = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });\nconst summaryModel = genAI.getGenerativeModel({ model: "gemini-3.8-flash" });`
);

let count = 0;
code = code.replace(
  /const result = await geminiModel\.generateContent\(prompt\);/g,
  () => {
    count++;
    if (count === 1) return "const result = await nlpModel.generateContent(prompt);";
    if (count === 2) return "const result = await summaryModel.generateContent(prompt);";
    if (count === 3) return "const result = await chatModel.generateContent(prompt);";
  }
);

fs.writeFileSync("src/lib/gemini.ts", code);
console.log("Updated src/lib/gemini.ts");
