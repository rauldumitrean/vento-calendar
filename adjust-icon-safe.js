const fs = require("fs");
let svg = fs.readFileSync("src/app/icon.svg", "utf-8");
svg = svg.replace("<g transform=\"translate(-46.56, -59.45) scale(1.24)\">", "<g transform=\"translate(-41.66, -54.35) scale(1.22)\">");
fs.writeFileSync("src/app/icon.svg", svg, "utf-8");
console.log("Icon adjusted to 1.22x with padding");
