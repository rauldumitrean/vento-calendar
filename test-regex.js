const responseText = `[
  { "title": "Math" }
]
This is an array bracket [ and another ].`;

const match = responseText.match(/\[[\s\S]*\]/);
const jsonText = match ? match[0] : responseText;
console.log("Extracted JSON text:", jsonText);

try {
  JSON.parse(jsonText);
  console.log("Success!");
} catch (e) {
  console.log("Failed:", e.message);
}
