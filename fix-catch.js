const fs = require('fs');

let content = fs.readFileSync('src/app/api/ai/chat/route.ts', 'utf8');
content = content.replace(/catch \(error\)/, 'catch (error: any)');
fs.writeFileSync('src/app/api/ai/chat/route.ts', content);

let content2 = fs.readFileSync('src/app/api/ai/parse/route.ts', 'utf8');
if (!content2.includes('catch (error: any)')) {
    content2 = content2.replace(/catch \(error\)/, 'catch (error: any)');
    fs.writeFileSync('src/app/api/ai/parse/route.ts', content2);
}

