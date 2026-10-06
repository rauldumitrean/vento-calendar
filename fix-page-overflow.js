const fs = require("fs");
let content = fs.readFileSync("src/app/page.tsx", "utf-8");
content = content.replace("font-sans overflow-hidden", "font-sans overflow-x-hidden");
fs.writeFileSync("src/app/page.tsx", content, "utf-8");
console.log("Fixed overflow in page.tsx securely");
