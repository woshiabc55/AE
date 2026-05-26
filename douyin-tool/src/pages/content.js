const contentPage = {
  mount(container, params) {
    this.container = container;
    this._render();
    this._bindEvents();
    this._loadVideos();
  },

  _render() {
    this.container.innerHTML = `
      <div class="page-content">
        <div class="content-header">
          <h2>内容管理</h2>
          <div class="content-actions">
            <button class="btn btn-primary" id="btn-upload">上传视频</button>
            <button class="btn btn-secondary" id="btn-refresh">刷新</button>
          </div>
        </div>
        <div class="content-filters">
          <div class="filter-group">
            <button class="filter-btn active" data-filter="all">全部</button>
            <button class="filter-btn" data-filter="published">已发布</button>
            <button class="filter-btn" data-filter="draft">草稿</button>
            <button class="filter-btn" data-filter="review">审核中</button>
          </div>
          <div class="search-box">
            <input type="text" id="content-search" placeholder="搜索视频...">
          </div>
        </div>
        <div class="video-grid" id="video-grid"></div>
        <div class="content-pagination" id="pagination"></div>
      </div>
    `;
  },

  _bindEvents() {
    document.getElementById('btn-refresh').addEventListener('click', () => this._loadVideos());
    document.getElementById('btn-upload').addEventListener('click', () => {
      window.location.hash = '/upload';
    });

    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this._loadVideos(btn.dataset.filter);
      });
    });

    document.getElementById('content-search').addEventListener('input', (e) => {
      this._searchVideos(e.target.value);
    });
  },

  _loadVideos(filter) {
    const grid = document.getElementById('video-grid');
    const mockVideos = this._getMockVideos(filter);

    grid.innerHTML = mockVideos.map(v => `
      <div class="video-card">
        <div class="video-thumb" style="background:${v.thumbColor}">
          <div class="video-duration">${v.duration}</div>
          <div class="video-status ${v.status}">${v.statusText}</div>
        </div>
        <div class="video-info">
          <h4 class="video-title">${v.title}</h4>
          <div class="video-meta">
            <span>▶ ${v.views}</span>
            <span>❤ ${v.likes}</span>
            <span>💬 ${v.comments}</span>
          </div>
          <div class="video-date">${v.date}</div>
        </div>
      </div>
    `).join('');
  },

  _getMockVideos(filter) {
    const allVideos = [
      { id: 1, title: '春日穿搭分享', duration: '00:45', status: 'published', statusText: '已发布', views: '12.3K', likes: '1.2K', comments: '234', date: '2025-01-15', thumbColor: 'linear-gradient(135deg,#ff6b6b,#ee5a24)' },
      { id: 2, title: '美食制作教程', duration: '01:30', status: 'published', statusText: '已发布', views: '8.5K', likes: '890', comments: '156', date: '2025-01-14', thumbColor: 'linear-gradient(135deg,#ffa502,#ff6348)' },
      { id: 3, title: '旅行Vlog - 京都', duration: '02:15', status: 'review', statusText: '审核中', views: '--', likes: '--', comments: '--', date: '2025-01-13', thumbColor: 'linear-gradient(135deg,#7bed9f,#2ed573)' },
      { id: 4, title: '产品开箱测评', duration: '03:00', status: 'draft', statusText: '草稿', views: '--', likes: '--', comments: '--', date: '2025-01-12', thumbColor: 'linear-gradient(135deg,#70a1ff,#1e90ff)' },
      { id: 5, title: '健身打卡 Day 30', duration: '00:30', status: 'published', statusText: '已发布', views: '5.2K', likes: '456', comments: '89', date: '2025-01-11', thumbColor: 'linear-gradient(135deg,#a29bfe,#6c5ce7)' },
      { id: 6, title: '读书笔记分享', duration: '01:00', status: 'published', statusText: '已发布', views: '3.1K', likes: '321', comments: '67', date: '2025-01-10', thumbColor: 'linear-gradient(135deg,#fd79a8,#e84393)' },
    ];

    if (!filter || filter === 'all') return allVideos;
    return allVideos.filter(v => v.status === filter);
  },

  _searchVideos(keyword) {
    const cards = document.querySelectorAll('.video-card');
    cards.forEach(card => {
      const title = card.querySelector('.video-title').textContent.toLowerCase();
      card.style.display = title.includes(keyword.toLowerCase()) ? '' : 'none';
    });
  },

  unmount() {},
};

module.exports = contentPage;
