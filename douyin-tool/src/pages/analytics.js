const analyticsPage = {
  mount(container, params) {
    this.container = container;
    this._render();
    this._loadAnalytics();
  },

  _render() {
    this.container.innerHTML = `
      <div class="page-analytics">
        <div class="analytics-header">
          <h2>数据分析</h2>
          <div class="analytics-period">
            <button class="period-btn active" data-period="7d">7天</button>
            <button class="period-btn" data-period="30d">30天</button>
            <button class="period-btn" data-period="90d">90天</button>
          </div>
        </div>
        <div class="analytics-summary" id="analytics-summary"></div>
        <div class="analytics-charts">
          <div class="chart-card">
            <h3>播放趋势</h3>
            <div class="chart-container" id="chart-views"></div>
          </div>
          <div class="chart-card">
            <h3>粉丝增长</h3>
            <div class="chart-container" id="chart-followers"></div>
          </div>
        </div>
        <div class="analytics-detail">
          <div class="chart-card full-width">
            <h3>视频表现排行</h3>
            <div class="ranking-table" id="ranking-table"></div>
          </div>
        </div>
      </div>
    `;

    document.querySelectorAll('.period-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.period-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._loadAnalytics(btn.dataset.period);
      });
    });
  },

  _loadAnalytics(period) {
    this._renderSummary(period);
    this._renderCharts(period);
    this._renderRanking();
  },

  _renderSummary(period) {
    const summary = document.getElementById('analytics-summary');
    const data = {
      '7d': { views: '86.2K', likes: '8.9K', comments: '1.2K', shares: '3.4K' },
      '30d': { views: '345.6K', likes: '35.2K', comments: '4.8K', shares: '12.1K' },
      '90d': { views: '1.02M', likes: '102K', comments: '14.5K', shares: '38.7K' },
    };
    const d = data[period || '7d'];
    summary.innerHTML = `
      <div class="summary-card"><div class="summary-value">${d.views}</div><div class="summary-label">总播放量</div></div>
      <div class="summary-card"><div class="summary-value">${d.likes}</div><div class="summary-label">总点赞数</div></div>
      <div class="summary-card"><div class="summary-value">${d.comments}</div><div class="summary-label">总评论数</div></div>
      <div class="summary-card"><div class="summary-value">${d.shares}</div><div class="summary-label">总分享数</div></div>
    `;
  },

  _renderCharts(period) {
    const viewsChart = document.getElementById('chart-views');
    const followersChart = document.getElementById('chart-followers');

    const days = period === '90d' ? 12 : period === '30d' ? 10 : 7;
    const viewsData = Array.from({ length: days }, () => Math.floor(Math.random() * 15000 + 5000));
    const followersData = Array.from({ length: days }, () => Math.floor(Math.random() * 500 + 100));
    const maxViews = Math.max(...viewsData);
    const maxFollowers = Math.max(...followersData);

    viewsChart.innerHTML = `<div class="bar-chart">${viewsData.map((v, i) => `
      <div class="bar-item">
        <div class="bar" style="height:${(v / maxViews * 100).toFixed(0)}%;background:linear-gradient(to top,rgba(0,229,255,.3),var(--accent-cyan));animation-delay:${i * 50}ms"></div>
        <span class="bar-label">D${i + 1}</span>
      </div>
    `).join('')}</div>`;

    followersChart.innerHTML = `<div class="bar-chart">${followersData.map((v, i) => `
      <div class="bar-item">
        <div class="bar" style="height:${(v / maxFollowers * 100).toFixed(0)}%;background:linear-gradient(to top,rgba(168,85,247,.3),var(--accent-violet));animation-delay:${i * 50}ms"></div>
        <span class="bar-label">D${i + 1}</span>
      </div>
    `).join('')}</div>`;
  },

  _renderRanking() {
    const table = document.getElementById('ranking-table');
    const rankings = [
      { rank: 1, title: '春日穿搭分享', views: '12.3K', likes: '1.2K', engagement: '11.4%' },
      { rank: 2, title: '美食制作教程', views: '8.5K', likes: '890', engagement: '10.5%' },
      { rank: 3, title: '健身打卡 Day 30', views: '5.2K', likes: '456', engagement: '8.8%' },
      { rank: 4, title: '读书笔记分享', views: '3.1K', likes: '321', engagement: '10.4%' },
      { rank: 5, title: '日常分享', views: '2.8K', likes: '234', engagement: '8.4%' },
    ];

    table.innerHTML = `
      <div class="table-header">
        <span>排名</span><span>标题</span><span>播放</span><span>点赞</span><span>互动率</span>
      </div>
      ${rankings.map(r => `
        <div class="table-row">
          <span class="rank-num ${r.rank <= 3 ? 'top' : ''}">${r.rank}</span>
          <span>${r.title}</span>
          <span>${r.views}</span>
          <span>${r.likes}</span>
          <span style="color:var(--accent-emerald)">${r.engagement}</span>
        </div>
      `).join('')}
    `;
  },

  unmount() {},
};

module.exports = analyticsPage;
