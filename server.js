const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, 'dist');

const MIME = {
  '.html': 'text/html',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.ico':  'image/x-icon',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.svg':  'image/svg+xml',
  '.json': 'application/json',
};

const PRIVACY_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>Privacy Policy — Refill</title>
  <style>
    body { font-family: -apple-system, sans-serif; max-width: 680px; margin: 0 auto; padding: 40px 24px; color: #2A3E2A; line-height: 1.7; }
    h1 { color: #4A7A5E; } h2 { color: #4A7A5E; margin-top: 32px; }
    a { color: #7B9E87; }
  </style>
</head>
<body>
  <h1>Privacy Policy — Refill</h1>
  <p><strong>Last updated: July 1, 2026</strong></p>
  <p>Refill is a teacher wellness app built by Kennady Scott. We take your privacy seriously.</p>
  <h2>What we collect</h2>
  <p>When you create an account, we collect your <strong>email address</strong> and <strong>first name</strong>. We also store the wellness data you create: daily goal check-ins, water intake, journal entries, mood and energy ratings, and streak history.</p>
  <h2>How we use it</h2>
  <p>We use your data only to provide the app experience — to sync your data across devices, keep you signed in, and send account-related emails (confirmation, password reset). We do not sell your data, share it with third parties for advertising, or use it to train AI models.</p>
  <h2>Where your data is stored</h2>
  <p>Your data is stored securely using <a href="https://supabase.com">Supabase</a>, a SOC 2 Type II certified cloud database provider based in the United States.</p>
  <h2>Data retention</h2>
  <p>Your data is kept for as long as your account is active. You can request deletion at any time by emailing <a href="mailto:kennady@cleark12.com">kennady@cleark12.com</a> — we will permanently delete all your data within 30 days.</p>
  <h2>Children's privacy</h2>
  <p>Refill is designed for teachers (adults). We do not knowingly collect data from anyone under 13.</p>
  <h2>Contact</h2>
  <p>Questions? Email <a href="mailto:kennady@cleark12.com">kennady@cleark12.com</a></p>
</body>
</html>`;

http.createServer((req, res) => {
  if (req.url === '/privacy') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(PRIVACY_HTML);
    return;
  }

  let filePath = path.join(DIST, req.url === '/' ? 'index.html' : req.url);

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentType = MIME[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}).listen(PORT, () => console.log(`Serving on port ${PORT}`));
