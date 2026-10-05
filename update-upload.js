const fs = require("fs");
let code = fs.readFileSync("src/app/api/schedule/upload/route.ts", "utf8");

code = code.replace(
  /model: "gemini-flash-latest",/,
  `model: "gemini-3.5-flash-lite",`
);

fs.writeFileSync("src/app/api/schedule/upload/route.ts", code);
console.log("Updated upload/route.ts");
