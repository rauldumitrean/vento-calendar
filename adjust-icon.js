const fs = require("fs");
let svg = fs.readFileSync("src/app/icon.svg", "utf-8");
svg = svg.replace("<g transform=\"translate(-51.2, -51.2) scale(1.2)\">", "<g transform=\"translate(-38.4, -38.4) scale(1.15)\">");
fs.writeFileSync("src/app/icon.svg", svg, "utf-8");
console.log("Icon adjusted to 1.15x");
