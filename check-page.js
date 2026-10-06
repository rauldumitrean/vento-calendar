const fs = require("fs");
const content = fs.readFileSync("src/app/page.tsx", "utf-8");
const lines = content.split("\n");
lines.forEach((line, i) => {
  if (line.match(/h-screen|max-h-screen|fixed|absolute.*inset/)) {
    console.log(`${i+1}: ${line.trim()}`);
  }
});
