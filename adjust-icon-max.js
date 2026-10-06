const fs = require("fs");
let svg = fs.readFileSync("src/app/icon.svg", "utf-8");
svg = svg.replace("<g transform=\"translate(-38.4, -38.4) scale(1.15)\">", "<g transform=\"translate(-46.56, -59.45) scale(1.24)\">");
fs.writeFileSync("src/app/icon.svg", svg, "utf-8");
console.log("Icon adjusted to 1.24x (maximum centered)");
