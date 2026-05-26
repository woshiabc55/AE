const { invoke } = window.__TAURI__.core;

let sandboxes = [];
let modules = [];

function showToast(message, type) {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function switchPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(`page-${pageId}`).classList.add('active');
  document.querySelector(`[data-page="${pageId}"]`).classList.add('active');

  if (pageId === 'dashboard') loadDashboard();
  if (pageId === 'sandbox') loadSandboxes();
  if (pageId === 'modules') loadModules();
  if (pageId === 'terminal') updateSandboxSelect();
}

async function loadDashboard() {
  try {
    const info = await invoke('get_system_info');
    const infoGrid = document.getElementById('system-info');
    infoGrid.innerHTML = Object.entries(info).map(([k, v]) => `
      <div class="info-item">
        <span class="info-key">${k}</span>
        <span class="info-value">${v}</span>
      </div>
    `).join('');
    document.getElementById('stat-memory').textContent = info.available_memory_mb + ' MB';
    document.getElementById('stat-cpu').textContent = info.cpu_count;
  } catch (e) {
    console.error('Failed to load system info:', e);
  }

  try {
    const list = await invoke('list_sandboxes');
    document.getElementById('stat-sandboxes').textContent = list.length;
  } catch (e) {
    console.error('Failed to load sandboxes:', e);
  }
}

async function loadSandboxes() {
  try {
    sandboxes = await invoke('list_sandboxes');
    renderSandboxes();
  } catch (e) {
    showToast('加载沙箱列表失败: ' + e, 'error');
  }
}

function renderSandboxes() {
  const grid = document.getElementById('sandbox-list');
  if (sandboxes.length === 0) {
    grid.innerHTML = '<div style="color:var(--text-muted);text-align:center;padding:40px">暂无沙箱，点击上方按钮创建</div>';
    return;
  }
  grid.innerHTML = sandboxes.map(sb => {
    const stateClass = sb.state.toLowerCase().replace(/[^a-z]/g, '');
    return `
      <div class="sandbox-card">
        <div class="sandbox-card-header">
          <span class="sandbox-card-name">${sb.config.name}</span>
          <span class="sandbox-card-state ${stateClass}">${sb.state}</span>
        </div>
        <div class="sandbox-card-meta">
          <div>内存限制: ${sb.config.memory_limit_mb} MB</div>
          <div>CPU 限制: ${sb.config.cpu_time_limit_ms} ms</div>
          <div>网络: ${sb.config.network_enabled ? '已启用' : '已禁用'}</div>
          <div>创建时间: ${sb.created_at}</div>
        </div>
        <div class="sandbox-card-actions">
          <button class="btn btn-danger btn-sm" data-destroy="${sb.config.id}">销毁</button>
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-destroy]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.destroy;
      try {
        await invoke('destroy_sandbox', { sandboxId: id });
        showToast('沙箱已销毁', 'success');
        loadSandboxes();
      } catch (e) {
        showToast('销毁失败: ' + e, 'error');
      }
    });
  });
}

async function loadModules() {
  try {
    modules = await invoke('get_module_registry');
    renderModules();
  } catch (e) {
    showToast('加载模块列表失败: ' + e, 'error');
  }
}

function renderModules() {
  const grid = document.getElementById('module-list');
  grid.innerHTML = modules.map(m => {
    const stateClass = m.state === 'Loaded' ? 'loaded' : 'unloaded';
    return `
      <div class="module-card">
        <div class="module-card-header">
          <span class="module-card-name">${m.manifest.name}</span>
          <span class="module-card-version">${m.manifest.version}</span>
        </div>
        <div class="module-card-desc">${m.manifest.description}</div>
        <div style="display:flex;justify-content:space-between;align-items:center">
          <span class="module-card-state ${stateClass}">${m.state}</span>
          ${m.state === 'Loaded'
            ? `<button class="btn btn-secondary btn-sm" data-unload="${m.manifest.id}">卸载</button>`
            : `<button class="btn btn-primary btn-sm" data-load="${m.manifest.id}">加载</button>`
          }
        </div>
        <div class="module-permissions">
          ${m.manifest.permissions.map(p => `<span class="perm-tag">${p}</span>`).join('')}
        </div>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-load]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await invoke('load_module', { moduleId: btn.dataset.load });
        showToast('模块已加载', 'success');
        loadModules();
      } catch (e) {
        showToast('加载失败: ' + e, 'error');
      }
    });
  });

  grid.querySelectorAll('[data-unload]').forEach(btn => {
    btn.addEventListener('click', async () => {
      try {
        await invoke('unload_module', { moduleId: btn.dataset.unload });
        showToast('模块已卸载', 'success');
        loadModules();
      } catch (e) {
        showToast('卸载失败: ' + e, 'error');
      }
    });
  });
}

function updateSandboxSelect() {
  const select = document.getElementById('terminal-sandbox-select');
  select.innerHTML = '<option value="">选择沙箱...</option>' +
    sandboxes.map(sb => `<option value="${sb.config.id}">${sb.config.name}</option>`).join('');
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => switchPage(item.dataset.page));
  });

  document.getElementById('btn-create-sandbox').addEventListener('click', () => {
    document.getElementById('create-sandbox-form').classList.toggle('hidden');
  });

  document.getElementById('btn-cancel-create').addEventListener('click', () => {
    document.getElementById('create-sandbox-form').classList.add('hidden');
  });

  document.getElementById('btn-confirm-create').addEventListener('click', async () => {
    const name = document.getElementById('sandbox-name').value || 'sandbox-' + Date.now();
    const memory = parseInt(document.getElementById('sandbox-memory').value) || 256;
    const cpu = parseInt(document.getElementById('sandbox-cpu').value) || 5000;
    const network = document.getElementById('sandbox-network').checked;

    try {
      await invoke('create_sandbox', {
        name,
        memoryLimitMb: memory,
        cpuTimeLimitMs: cpu,
        networkEnabled: network,
      });
      showToast('沙箱创建成功', 'success');
      document.getElementById('create-sandbox-form').classList.add('hidden');
      loadSandboxes();
    } catch (e) {
      showToast('创建失败: ' + e, 'error');
    }
  });

  document.getElementById('btn-refresh-sandboxes').addEventListener('click', loadSandboxes);

  document.getElementById('btn-execute').addEventListener('click', async () => {
    const sandboxId = document.getElementById('terminal-sandbox-select').value;
    const code = document.getElementById('code-editor').value;
    const language = document.getElementById('terminal-language').value;
    const output = document.getElementById('terminal-output');

    if (!sandboxId) {
      showToast('请先选择一个沙箱', 'error');
      return;
    }
    if (!code.trim()) {
      showToast('请输入代码', 'error');
      return;
    }

    output.textContent = '执行中...';

    try {
      const result = await invoke('execute_in_sandbox', {
        sandboxId,
        code,
        language,
      });
      output.textContent = JSON.stringify(result, null, 2);
    } catch (e) {
      output.textContent = '错误: ' + e;
    }
  });

  document.getElementById('btn-save-settings').addEventListener('click', () => {
    showToast('设置已保存', 'success');
  });

  loadDashboard();
});
