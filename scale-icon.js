const fs = require("fs");
let svg = fs.readFileSync("src/app/icon.svg", "utf-8");
svg = svg.replace("<svg width=\"512\" height=\"512\" viewBox=\"0 0 512 512\" xmlns=\"http://www.w3.org/2000/svg\">", 
`<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <g transform="translate(-51.2, -51.2) scale(1.2)">`);
svg = svg.replace("</svg>", "  </g>\n</svg>");
fs.writeFileSync("src/app/icon.svg", svg, "utf-8");
console.log("Icon scaled up");
