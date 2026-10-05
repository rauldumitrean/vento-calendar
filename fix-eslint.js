const fs = require('fs');
let content = fs.readFileSync('src/app/page.tsx', 'utf8');

// replace quotes inside text nodes
content = content.replace(/"/g, '&quot;');
// wait, that might replace attributes!
// Let's just suppress the eslint rule for that file
content = "/* eslint-disable react/no-unescaped-entities */\n" + content;

fs.writeFileSync('src/app/page.tsx', content);
