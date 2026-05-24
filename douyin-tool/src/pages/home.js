const homePage = {
  mount(container, params) {
    container.innerHTML = `
      <div class="page-home">
        <div class="home-header">
          <div class="home-banner">
            <div class="banner-content">
              <h1>抖音创作者工具</h1>
              <p>一站式内容管理与数据分析平台</p>
              <div class="banner-actions">
                <button class="btn btn-primary" id="btn-auth">接入抖音账号</button>
                <button class="btn btn-secondary" id="btn-learn">了解更多</button>
              </div>
            </div>
            <div class="banner-visual">
              <div class="visual-ring ring-1"></div>
              <div class="visual-ring ring-2"></div>
              <div class="visual-ring ring-3"></div>
              <div class="visual-center">🎬</div>
            </div>
          </div>
        </div>
        <div class="home-features">
          <h2>核心功能</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon" style="background:rgba(0,229,255,.1);color:#00e5ff">📊</div>
              <h3>数据分析</h3>
              <p>实时查看视频播放量、点赞数、评论数等核心数据指标</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon" style="background:rgba(168,85,247,.1);color:#a855f7">🎬</div>
              <h3>内容管理</h3>
              <p>管理已发布视频，上传新内容，编辑视频信息</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon" style="background:rgba(255,179,0,.1);color:#ffb300">🔍</div>
              <h3>内容搜索</h3>
              <p>搜索热门内容，发现趋势话题和灵感</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon" style="background:rgba(16,185,129,.1);color:#10b981">💬</div>
              <h3>互动管理</h3>
              <p>查看和管理评论、私信等用户互动数据</p>
            </div>
          </div>
        </div>
        <div class="home-quick-stats">
          <h2>快速统计</h2>
          <div class="quick-stats-grid" id="quick-stats"></div>
        </div>
      </div>
    `;

    document.getElementById('btn-auth').addEventListener('click', () => {
      window.location.hash = '/auth';
    });

    this._loadQuickStats();
  },

  _loadQuickStats() {
    const statsContainer = document.getElementById('quick-stats');
    if (!statsContainer) return;

    const stats = [
      { label: '今日播放', value: '12,345', trend: '+15%', color: '#00e5ff' },
      { label: '新增粉丝', value: '234', trend: '+8%', color: '#a855f7' },
      { label: '互动率', value: '4.2%', trend: '+0.3%', color: '#ffb300' },
      { label: '视频总数', value: '56', trend: '+2', color: '#10b981' },
    ];

    statsContainer.innerHTML = stats.map(s => `
      <div class="quick-stat-card">
        <div class="stat-label">${s.label}</div>
        <div class="stat-value" style="color:${s.color}">${s.value}</div>
        <div class="stat-trend" style="color:${s.color}">${s.trend}</div>
      </div>
    `).join('');
  },

  unmount() {},
};

module.exports = homePage;
