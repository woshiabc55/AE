const http = require('http');

function request(path, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method,
      headers: { 'Content-Type': 'application/json' },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log('Testing MCP browser demo...\n');

  const status = await request('/api/status');
  console.log('Status:', status.connected ? 'connected' : 'disconnected');
  if (!status.connected) {
    throw new Error('MCP not connected: ' + status.error);
  }

  const tools = await request('/api/tools');
  console.log('Tools count:', tools.tools.length);

  const nav = await request('/api/navigate', 'POST', { url: 'https://example.com' });
  console.log('Navigate:', nav.content[0].text.split('\n')[0]);

  const snapshot = await request('/api/snapshot', 'POST', {});
  console.log('Snapshot lines:', snapshot.content[0].text.split('\n').length);

  const evaluate = await request('/api/evaluate', 'POST', { script: 'document.title' });
  console.log('Evaluate:', evaluate.content[0].text);

  const screenshot = await request('/api/screenshot', 'POST', {});
  const hasImage = screenshot.content.some((c) => c.type === 'image');
  console.log('Screenshot has image:', hasImage);

  console.log('\nAll tests passed.');
}

runTests().catch((err) => {
  console.error('Test failed:', err.message);
  process.exit(1);
});
