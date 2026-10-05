const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/ai/parse',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', data);
  });
});

req.on('error', error => {
  console.error(error);
});

req.write(JSON.stringify({ text: 'Examen de lengua dia 11 de octubre a las 9' }));
req.end();
