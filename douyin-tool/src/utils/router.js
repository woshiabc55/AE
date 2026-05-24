class Router {
  constructor() {
    this.routes = {};
    this.currentPage = null;
    this.container = null;
    this.beforeHooks = [];
    this.afterHooks = [];
  }

  register(path, pageModule) {
    this.routes[path] = pageModule;
  }

  init(containerId) {
    this.container = document.getElementById(containerId);
    window.addEventListener('hashchange', () => this._handleRoute());
    window.addEventListener('popstate', () => this._handleRoute());
    this._handleRoute();
  }

  navigate(path, params) {
    if (params) {
      const query = new URLSearchParams(params).toString();
      window.location.hash = `${path}?${query}`;
    } else {
      window.location.hash = path;
    }
  }

  beforeEach(hook) {
    this.beforeHooks.push(hook);
  }

  afterEach(hook) {
    this.afterHooks.push(hook);
  }

  getCurrentPage() {
    return this.currentPage;
  }

  getParams() {
    const hash = window.location.hash.slice(1);
    const [path, query] = hash.split('?');
    if (!query) return {};
    const params = {};
    new URLSearchParams(query).forEach((v, k) => { params[k] = v; });
    return params;
  }

  async _handleRoute() {
    const hash = window.location.hash.slice(1) || '/home';
    const [path] = hash.split('?');

    for (const hook of this.beforeHooks) {
      const result = await hook(path, this.currentPage);
      if (result === false) return;
    }

    const pageModule = this.routes[path];
    if (!pageModule) {
      this._renderNotFound();
      return;
    }

    if (this.currentPage && this.currentPage.unmount) {
      this.currentPage.unmount();
    }

    this.currentPage = pageModule;

    if (pageModule.mount) {
      await pageModule.mount(this.container, this.getParams());
    }

    for (const hook of this.afterHooks) {
      await hook(path, pageModule);
    }

    this._updateNavActive(path);
  }

  _renderNotFound() {
    if (this.container) {
      this.container.innerHTML = `
        <div class="not-found">
          <div class="not-found-icon">🔍</div>
          <h2>页面未找到</h2>
          <p>请检查路径是否正确</p>
          <button class="btn btn-primary" onclick="window.location.hash='/home'">返回首页</button>
        </div>
      `;
    }
  }

  _updateNavActive(path) {
    document.querySelectorAll('.tab-item').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.path === path);
    });
  }
}

module.exports = Router;
