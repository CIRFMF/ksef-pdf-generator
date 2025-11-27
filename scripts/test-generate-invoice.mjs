import fs from 'fs';

const url = process.env.URL || 'http://localhost:3001/generate-invoice';
const filePath = process.env.FILE || 'assets/invoice.xml';

const form = new FormData();
form.append('file', fs.createReadStream(filePath));
form.append('additionalData', JSON.stringify({ test: true }));
form.append('formatType', 'base64');

console.log(`Posting ${filePath} -> ${url}`);

const res = await fetch(url, { method: 'POST', body: form });
const contentType = res.headers.get('content-type') || '';

if (contentType.includes('application/pdf')) {
  const arr = await res.arrayBuffer();
  fs.writeFileSync('out.pdf', Buffer.from(arr));
  console.log('Saved out.pdf (PDF response)');
} else {
  const body = await res.json().catch(() => null);
  if (body && body.base64) {
    fs.writeFileSync('out.pdf', Buffer.from(body.base64, 'base64'));
    console.log('Saved out.pdf (from base64)');
  } else {
    console.log('Response:', body ?? await res.text());
  }
}
