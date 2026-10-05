const fs = require('fs');
let readme = fs.readFileSync('C:\\ventoo-calendar\\README.md', 'utf8');
const regex = /<img src="data:image\/svg\+xml,([^"]+)" width="([^"]+)" align="top"\/>/g;

if (!fs.existsSync('C:\\ventoo-calendar\\public\\icons')) {
  fs.mkdirSync('C:\\ventoo-calendar\\public\\icons', { recursive: true });
}

let counter = 1;
readme = readme.replace(regex, (match, data, width) => {
  const decoded = decodeURIComponent(data);
  const filename = `icon-${counter++}.svg`;
  fs.writeFileSync(`C:\\ventoo-calendar\\public\\icons\\${filename}`, decoded);
  return `<img src="./public/icons/${filename}" width="${width}" align="top"/>`;
});

fs.writeFileSync('C:\\ventoo-calendar\\README.md', readme);
console.log("Done extracting SVGs");
