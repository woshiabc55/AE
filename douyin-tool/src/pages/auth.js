const authPage = {
  mount(container, params) {
    this.container = container;
    this._render();
    this._bindEvents();
  },

  _render() {
    this.container.innerHTML = `
      <div class="page-auth">
        <div class="auth-container">
          <div class="auth-card">
            <div class="auth-header">
              <div class="auth-logo">🎵</div>
              <h2>接入抖音账号</h2>
              <p>授权后可使用完整功能</p>
            </div>
            <div class="auth-form">
              <div class="form-group">
                <label>Client Key</label>
                <input type="text" id="auth-client-key" placeholder="输入抖音开放平台 Client Key">
              </div>
              <div class="form-group">
                <label>Client Secret</label>
                <input type="password" id="auth-client-secret" placeholder="输入抖音开放平台 Client Secret">
              </div>
              <div class="form-group">
                <label>回调地址</label>
                <input type="text" id="auth-redirect-uri" placeholder="https://your-domain.com/callback" value="http://localhost:3000/callback">
              </div>
              <div class="form-group">
                <label>授权范围</label>
                <div class="scope-options">
                  <label class="scope-item"><input type="checkbox" checked value="user_info"> 用户信息</label>
                  <label class="scope-item"><input type="checkbox" checked value="video.list"> 视频列表</label>
                  <label class="scope-item"><input type="checkbox" value="video.create"> 发布视频</label>
                  <label class="scope-item"><input type="checkbox" value="video.data"> 视频数据</label>
                </div>
              </div>
              <button class="btn btn-primary btn-block" id="btn-start-auth">开始授权</button>
            </div>
            <div class="auth-status" id="auth-status"></div>
            <div class="auth-help">
              <h4>如何获取 Client Key？</h4>
              <ol>
                <li>前往 <strong>抖音开放平台</strong> (open.douyin.com) 注册开发者账号</li>
                <li>创建应用并获取 Client Key 和 Client Secret</li>
                <li>配置回调地址为当前服务地址</li>
                <li>选择需要的权限范围</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _bindEvents() {
    const btn = document.getElementById('btn-start-auth');
    if (btn) {
      btn.addEventListener('click', () => this._startAuth());
    }
  },

  _startAuth() {
    const clientKey = document.getElementById('auth-client-key').value;
    const clientSecret = document.getElementById('auth-client-secret').value;
    const redirectUri = document.getElementById('auth-redirect-uri').value;
    const scopes = Array.from(document.querySelectorAll('.scope-item input:checked')).map(cb => cb.value);

    if (!clientKey || !clientSecret) {
      this._showStatus('请填写 Client Key 和 Client Secret', 'error');
      return;
    }

    const config = { clientKey, clientSecret, redirectUri, scope: scopes.join(',') };
    localStorage.setItem('douyin_sdk_config', JSON.stringify(config));

    const authUrl = `https://open.douyin.com/platform/oauth/connect/?client_key=${clientKey}&response_type=code&scope=${scopes.join(',')}&redirect_uri=${encodeURIComponent(redirectUri)}&state=douyin_auth_${Date.now()}`;

    this._showStatus('正在跳转授权页面...', 'info');

    setTimeout(() => {
      window.open(authUrl, '_blank');
    }, 500);
  },

  _showStatus(message, type) {
    const status = document.getElementById('auth-status');
    if (status) {
      status.className = `auth-status ${type}`;
      status.textContent = message;
    }
  },

  unmount() {},
};

module.exports = authPage;
