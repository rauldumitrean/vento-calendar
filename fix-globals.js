const fs = require("fs");
let content = fs.readFileSync("src/app/globals.css", "utf-8");
content = content.replace("  overscroll-behavior: none;\n  overflow-x: hidden;", "");
fs.writeFileSync("src/app/globals.css", content, "utf-8");
console.log("Fixed globals.css");
