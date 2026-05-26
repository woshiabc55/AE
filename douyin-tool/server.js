const express = require('express');
const path = require('path');
const DouyinSDK = require('./src/sdk/douyin');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const sdkInstances = new Map();

app.get('/callback', (req, res) => {
  const { code, state } = req.query;
  if (!code) {
    return res.status(400).send('Authorization failed: no code received');
  }
  res.send(`
    <html><body style="font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;background:#0a0e1a;color:#e8ecf4">
      <div style="text-align:center">
        <h1 style="color:#10b981">授权成功</h1>
        <p>授权码: ${code}</p>
        <p>状态: ${state || 'N/A'}</p>
        <p>请返回工具页面继续操作</p>
        <script>if(window.opener){window.opener.postMessage({type:'douyin_auth',code:'${code}'},'*');}</script>
      </div>
    </body></html>
  `);
});

app.post('/api/auth/url', (req, res) => {
  const { clientKey, clientSecret, redirectUri, scope } = req.body;
  const sdk = new DouyinSDK({ clientKey, clientSecret, redirectUri, scope });
  const authUrl = sdk.getAuthUrl();
  res.json({ authUrl });
});

app.post('/api/auth/token', async (req, res) => {
  const { clientKey, clientSecret, redirectUri, code } = req.body;
  const sdk = new DouyinSDK({ clientKey, clientSecret, redirectUri });
  try {
    const result = await sdk.getAccessToken(code);
    sdkInstances.set(result.data.open_id, sdk);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/user/:openId', async (req, res) => {
  const sdk = sdkInstances.get(req.params.openId);
  if (!sdk) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const result = await sdk.getUserInfo();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/video/:openId', async (req, res) => {
  const sdk = sdkInstances.get(req.params.openId);
  if (!sdk) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const result = await sdk.getVideoList(req.query.cursor, req.query.count);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/search/:openId', async (req, res) => {
  const sdk = sdkInstances.get(req.params.openId);
  if (!sdk) return res.status(401).json({ error: 'Not authenticated' });
  try {
    const result = await sdk.searchContent(req.query.keyword, req.query.cursor, req.query.count);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Douyin Tool Server running at http://localhost:${PORT}`);
  console.log(`Callback URL: http://localhost:${PORT}/callback`);
});
