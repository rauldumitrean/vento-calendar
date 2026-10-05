const fs = require('fs');
const content = fs.readFileSync('C:/ventoo-calendar/src/app/(dashboard)/schedule/page.tsx', 'utf8');

// Find handleUpload
const idx = content.indexOf('const handleUpload = async');
if (idx === -1) {
  console.log('NOT FOUND');
} else {
  console.log(content.substring(idx, idx + 800));
}
