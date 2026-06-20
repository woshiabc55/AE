const $ = (id) => document.getElementById(id);

async function api(path, options = {}) {
  const res = await fetch(path, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

function setOutput(data) {
  $('output').textContent = typeof data === 'string' ? data : JSON.stringify(data, null, 2);
}

function setStatus(connected, error, tools) {
  const el = $('status');
  if (connected) {
    el.className = 'status ok';
    el.textContent = `已连接 MCP Server，可用工具 ${tools.length} 个`;
  } else {
    el.className = 'status error';
    el.textContent = `连接失败: ${error || '未知错误'}`;
  }
  renderTools(tools);
}

function renderTools(tools) {
  const list = $('toolsList');
  list.innerHTML = '';
  tools.forEach((t) => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${t.name}</strong>: ${t.description || '无描述'}`;
    list.appendChild(li);
  });
}

async function loadStatus() {
  try {
    const status = await api('/api/status');
    setStatus(status.connected, status.error, status.tools);
  } catch (err) {
    setStatus(false, err.message, []);
  }
}

$('navigateBtn').addEventListener('click', async () => {
  const url = $('urlInput').value;
  if (!url) return;
  setOutput('正在导航...');
  const result = await api('/api/navigate', { method: 'POST', body: { url } });
  setOutput(result);
});

$('snapshotBtn').addEventListener('click', async () => {
  setOutput('正在获取快照...');
  const result = await api('/api/snapshot', { method: 'POST' });
  setOutput(result);
});

$('screenshotBtn').addEventListener('click', async () => {
  setOutput('正在截图...');
  const result = await api('/api/screenshot', { method: 'POST' });
  setOutput(result);
  const imgContent = result.content?.find((c) => c.type === 'image');
  if (imgContent) {
    $('screenshotContainer').innerHTML = `<img src="data:${imgContent.mimeType};base64,${imgContent.data}" alt="screenshot" />`;
  } else {
    $('screenshotContainer').innerHTML = '';
  }
});

$('backBtn').addEventListener('click', async () => {
  setOutput('正在后退...');
  const result = await api('/api/call', {
    method: 'POST',
    body: { name: 'browser_navigate_back', args: {} },
  });
  setOutput(result);
});

$('clickBtn').addEventListener('click', async () => {
  const ref = $('refInput').value;
  if (!ref) return;
  setOutput(`正在点击: ${ref}`);
  const result = await api('/api/click', { method: 'POST', body: { ref } });
  setOutput(result);
});

$('typeBtn').addEventListener('click', async () => {
  const ref = $('refTypeInput').value;
  const text = $('textInput').value;
  if (!ref) return;
  setOutput(`正在输入: ${text}`);
  const result = await api('/api/type', { method: 'POST', body: { ref, text } });
  setOutput(result);
});

$('evaluateBtn').addEventListener('click', async () => {
  const script = $('scriptInput').value;
  if (!script) return;
  setOutput(`正在执行: ${script}`);
  const result = await api('/api/evaluate', { method: 'POST', body: { script } });
  setOutput(result);
});

$('callToolBtn').addEventListener('click', async () => {
  const name = $('toolNameInput').value;
  const argsText = $('toolArgsInput').value;
  if (!name) return;
  let args = {};
  if (argsText) {
    try {
      args = JSON.parse(argsText);
    } catch (e) {
      setOutput('参数 JSON 解析失败: ' + e.message);
      return;
    }
  }
  setOutput(`调用工具: ${name}`);
  const result = await api('/api/call', { method: 'POST', body: { name, args } });
  setOutput(result);
});

$('reloadToolsBtn').addEventListener('click', loadStatus);

loadStatus();
