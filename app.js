/**
 * Game Asset Reference Hub
 * 游戏素材参考库 - 主应用逻辑
 */

const App = (() => {
  // 状态
  const state = {
    assets: [],
    games: [],
    filteredAssets: [],
    filter: 'all', // all | favorites | recent | game:xxx | category:xxx:xxx | tag:xxx
    searchQuery: '',
    sortBy: 'newest',
    viewMode: 'grid', // grid | masonry
    theme: 'dark',
    selectedAssetId: null,
    userData: {
      favorites: new Set(),
      notes: {}
    }
  };

  // DOM 引用
  const els = {};

  // 初始化
  async function init() {
    cacheElements();
    loadUserData();
    loadTheme();
    await loadSampleData();
    bindEvents();
    renderSidebar();
    renderTagCloud();
    applyFilter('all');
    updateCounts();
  }

  function cacheElements() {
    els.assetGrid = document.getElementById('assetGrid');
    els.emptyState = document.getElementById('emptyState');
    els.gameNav = document.getElementById('gameNav');
    els.tagCloud = document.getElementById('tagCloud');
    els.searchInput = document.getElementById('searchInput');
    els.sortSelect = document.getElementById('sortSelect');
    els.breadcrumbs = document.getElementById('breadcrumbs');
    els.viewToggle = document.getElementById('viewToggle');
    els.themeToggle = document.getElementById('themeToggle');
    els.menuToggle = document.getElementById('menuToggle');
    els.sidebar = document.getElementById('sidebar');
    els.importBtn = document.getElementById('importBtn');
    els.exportBtn = document.getElementById('exportBtn');
    els.drawer = document.getElementById('detailDrawer');
    els.drawerOverlay = document.getElementById('drawerOverlay');
    els.drawerClose = document.getElementById('drawerClose');
    els.drawerContent = document.getElementById('drawerContent');
    els.modal = document.getElementById('importModal');
    els.modalOverlay = document.getElementById('modalOverlay');
    els.modalClose = document.getElementById('modalClose');
    els.cancelImport = document.getElementById('cancelImport');
    els.confirmImport = document.getElementById('confirmImport');
    els.jsonInput = document.getElementById('jsonInput');
    els.fileInput = document.getElementById('fileInput');
    els.fileDropzone = document.getElementById('fileDropzone');
    els.toast = document.getElementById('toast');
    els.toastMsg = document.getElementById('toastMsg');
    els.countAll = document.getElementById('countAll');
    els.countFavorites = document.getElementById('countFavorites');
    els.countRecent = document.getElementById('countRecent');
    els.navItems = document.querySelectorAll('.nav-item[data-filter]');
    els.importTabs = document.querySelectorAll('.import-tab');
    els.importPanels = document.querySelectorAll('.import-panel');
  }

  async function loadSampleData() {
    try {
      const response = await fetch('data/sample.json');
      if (!response.ok) throw new Error('无法加载示例数据');
      const data = await response.json();
      state.games = data.games || [];
      state.assets = (data.assets || []).map(asset => ({
        ...asset,
        favorited: state.userData.favorites.has(asset.id),
        note: state.userData.notes[asset.id] || ''
      }));
    } catch (error) {
      console.error('加载数据失败:', error);
      showToast('示例数据加载失败，请检查 data/sample.json');
      state.games = [];
      state.assets = [];
    }
  }

  function loadUserData() {
    try {
      const favorites = JSON.parse(localStorage.getItem('garh_favorites') || '[]');
      const notes = JSON.parse(localStorage.getItem('garh_notes') || '{}');
      state.userData.favorites = new Set(favorites);
      state.userData.notes = notes;
    } catch (error) {
      console.error('读取用户数据失败:', error);
    }
  }

  function saveUserData() {
    try {
      localStorage.setItem('garh_favorites', JSON.stringify([...state.userData.favorites]));
      localStorage.setItem('garh_notes', JSON.stringify(state.userData.notes));
      localStorage.setItem('garh_viewMode', state.viewMode);
      localStorage.setItem('garh_theme', state.theme);
    } catch (error) {
      console.error('保存用户数据失败:', error);
    }
  }

  function loadTheme() {
    const savedTheme = localStorage.getItem('garh_theme') || 'dark';
    const savedView = localStorage.getItem('garh_viewMode') || 'grid';
    state.theme = savedTheme;
    state.viewMode = savedView;
    document.documentElement.setAttribute('data-theme', state.theme);
    updateViewToggleIcon();
  }

  function bindEvents() {
    // 搜索防抖
    let searchTimeout;
    els.searchInput.addEventListener('input', (e) => {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        state.searchQuery = e.target.value.trim().toLowerCase();
        applyFilter(state.filter, false);
      }, 200);
    });

    // 搜索框聚焦快捷键
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        els.searchInput.focus();
      }
      if (e.key === 'Escape') {
        closeDrawer();
        closeModal();
      }
    });

    // 排序
    els.sortSelect.addEventListener('change', (e) => {
      state.sortBy = e.target.value;
      applyFilter(state.filter, false);
    });

    // 视图切换
    els.viewToggle.addEventListener('click', toggleViewMode);

    // 主题切换
    els.themeToggle.addEventListener('click', toggleTheme);

    // 移动端菜单
    if (els.menuToggle && els.sidebar) {
      els.menuToggle.addEventListener('click', () => {
        els.sidebar.classList.toggle('open');
      });
    }

    // 导入/导出
    els.importBtn.addEventListener('click', openModal);
    els.exportBtn.addEventListener('click', exportData);
    els.modalClose.addEventListener('click', closeModal);
    els.cancelImport.addEventListener('click', closeModal);
    els.modalOverlay.addEventListener('click', closeModal);
    els.confirmImport.addEventListener('click', handleImport);

    // 导入标签切换
    els.importTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;
        els.importTabs.forEach(t => t.classList.toggle('active', t === tab));
        els.importPanels.forEach(p => p.classList.toggle('active', p.dataset.panel === target));
      });
    });

    // 文件拖拽/选择
    els.fileDropzone.addEventListener('click', () => els.fileInput.click());
    els.fileDropzone.addEventListener('dragover', (e) => {
      e.preventDefault();
      els.fileDropzone.style.borderColor = 'var(--accent-cyan)';
    });
    els.fileDropzone.addEventListener('dragleave', () => {
      els.fileDropzone.style.borderColor = '';
    });
    els.fileDropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      els.fileDropzone.style.borderColor = '';
      const file = e.dataTransfer.files[0];
      if (file) readImportFile(file);
    });
    els.fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) readImportFile(file);
    });

    // 抽屉
    els.drawerClose.addEventListener('click', closeDrawer);
    els.drawerOverlay.addEventListener('click', closeDrawer);

    // 快捷入口
    els.navItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        applyFilter(item.dataset.filter);
        updateActiveNav(item);
      });
    });
  }

  function renderSidebar() {
    const tree = document.createElement('div');
    tree.className = 'game-tree';

    state.games.forEach(game => {
      const node = document.createElement('div');
      node.className = 'game-node';
      node.dataset.game = game.name;

      const header = document.createElement('div');
      header.className = 'game-header';
      header.innerHTML = `
        <span class="game-indicator" style="background-color: ${game.accentColor}; color: ${game.accentColor}"></span>
        <span>${game.name}</span>
        <svg class="game-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      `;

      const children = document.createElement('div');
      children.className = 'game-children';
      game.categories.forEach(category => {
        const count = state.assets.filter(a => a.game === game.name && a.category === category).length;
        const catItem = document.createElement('div');
        catItem.className = 'category-item';
        catItem.dataset.game = game.name;
        catItem.dataset.category = category;
        catItem.textContent = `${category} (${count})`;
        catItem.addEventListener('click', () => {
          applyFilter(`category:${game.name}:${category}`);
          updateActiveCategory(catItem);
        });
        children.appendChild(catItem);
      });

      header.addEventListener('click', () => {
        node.classList.toggle('expanded');
      });

      // 点击游戏名也可以筛选全部该游戏
      const gameNameSpan = header.querySelector('span:nth-child(2)');
      gameNameSpan.addEventListener('click', (e) => {
        e.stopPropagation();
        applyFilter(`game:${game.name}`);
      });

      node.appendChild(header);
      node.appendChild(children);
      tree.appendChild(node);
    });

    els.gameNav.innerHTML = '';
    els.gameNav.appendChild(tree);
  }

  function renderTagCloud() {
    const tagCounts = {};
    state.assets.forEach(asset => {
      asset.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    const sortedTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20);

    els.tagCloud.innerHTML = '';
    sortedTags.forEach(([tag, count]) => {
      const chip = document.createElement('button');
      chip.className = 'tag-chip';
      chip.textContent = `${tag} (${count})`;
      chip.addEventListener('click', () => {
        applyFilter(`tag:${tag}`);
        updateActiveTag(chip);
      });
      els.tagCloud.appendChild(chip);
    });
  }

  function applyFilter(filterKey, resetSearch = true) {
    state.filter = filterKey;
    if (resetSearch) {
      state.searchQuery = '';
      els.searchInput.value = '';
    }
    // 移动端点击筛选后自动关闭侧边栏
    if (window.innerWidth <= 640 && els.sidebar) {
      els.sidebar.classList.remove('open');
    }

    let result = [...state.assets];

    // 分类筛选
    if (filterKey === 'favorites') {
      result = result.filter(a => state.userData.favorites.has(a.id));
    } else if (filterKey === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter(a => new Date(a.addedAt) >= sevenDaysAgo);
    } else if (filterKey.startsWith('game:')) {
      const gameName = filterKey.replace('game:', '');
      result = result.filter(a => a.game === gameName);
    } else if (filterKey.startsWith('category:')) {
      const [, gameName, category] = filterKey.split(':');
      result = result.filter(a => a.game === gameName && a.category === category);
    } else if (filterKey.startsWith('tag:')) {
      const tag = filterKey.replace('tag:', '');
      result = result.filter(a => a.tags.includes(tag));
    }

    // 搜索筛选
    if (state.searchQuery) {
      result = result.filter(a => {
        const text = `${a.name} ${a.game} ${a.category} ${a.character} ${a.tags.join(' ')}`.toLowerCase();
        return text.includes(state.searchQuery);
      });
    }

    // 排序
    result = sortAssets(result);

    state.filteredAssets = result;
    renderAssets(result);
    updateBreadcrumbs(filterKey);
  }

  function sortAssets(assets) {
    switch (state.sortBy) {
      case 'name':
        return assets.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
      case 'game':
        return assets.sort((a, b) => a.game.localeCompare(b.game, 'zh-CN') || a.name.localeCompare(b.name, 'zh-CN'));
      case 'newest':
      default:
        return assets.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
    }
  }

  function renderAssets(assets) {
    els.assetGrid.innerHTML = '';

    if (assets.length === 0) {
      els.assetGrid.classList.add('hidden');
      els.emptyState.classList.remove('hidden');
      return;
    }

    els.assetGrid.classList.remove('hidden');
    els.emptyState.classList.add('hidden');

    assets.forEach((asset, index) => {
      const card = createAssetCard(asset, index);
      els.assetGrid.appendChild(card);
    });

    updateViewMode();
  }

  function createAssetCard(asset, index) {
    const card = document.createElement('div');
    card.className = 'asset-card';
    card.style.animationDelay = `${Math.min(index * 0.03, 0.5)}s`;
    card.dataset.id = asset.id;

    const isFavorited = state.userData.favorites.has(asset.id);
    const imageSrc = asset.imageUrl || generatePlaceholder(asset.placeholderColor || '#333', asset.name);

    card.innerHTML = `
      <div class="asset-image">
        <img src="${imageSrc}" alt="${asset.name}" loading="lazy">
        <div class="asset-game-badge">${asset.game}</div>
        <button class="asset-favorite ${isFavorited ? 'active' : ''}" data-id="${asset.id}" title="收藏">
          <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </button>
        <div class="asset-overlay">
          <span style="color: var(--accent-cyan); font-size: 12px; font-family: var(--font-display); letter-spacing: 1px;">查看详情</span>
        </div>
      </div>
      <div class="asset-info">
        <h3 class="asset-name">${asset.name}</h3>
        <p class="asset-meta">${asset.category}${asset.character ? ` · ${asset.character}` : ''}</p>
        <div class="asset-tags">
          ${asset.tags.slice(0, 3).map(tag => `<span class="asset-tag">${tag}</span>`).join('')}
        </div>
      </div>
    `;

    // 卡片点击打开详情
    card.addEventListener('click', (e) => {
      if (e.target.closest('.asset-favorite')) return;
      openDrawer(asset.id);
    });

    // 收藏按钮
    const favBtn = card.querySelector('.asset-favorite');
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleFavorite(asset.id);
      favBtn.classList.toggle('active');
      updateCounts();
      if (state.filter === 'favorites') {
        applyFilter('favorites', false);
      }
    });

    return card;
  }

  function generatePlaceholder(color, text) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
        <defs>
          <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:${color};stop-opacity:0.25" />
            <stop offset="100%" style="stop-color:${color};stop-opacity:0.05" />
          </linearGradient>
        </defs>
        <rect width="400" height="500" fill="url(#g)" />
        <rect x="20" y="20" width="360" height="460" fill="none" stroke="${color}" stroke-width="1" stroke-opacity="0.3" rx="12" />
        <circle cx="200" cy="200" r="60" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.4" />
        <path d="M160 240 L200 180 L240 240" fill="none" stroke="${color}" stroke-width="1.5" stroke-opacity="0.4" />
        <text x="200" y="340" font-family="sans-serif" font-size="14" fill="${color}" fill-opacity="0.6" text-anchor="middle" letter-spacing="2">${text}</text>
      </svg>
    `;
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
  }

  function updateBreadcrumbs(filterKey) {
    let text = '全部素材';
    if (filterKey === 'favorites') text = '收藏夹';
    else if (filterKey === 'recent') text = '最近添加';
    else if (filterKey.startsWith('game:')) text = filterKey.replace('game:', '');
    else if (filterKey.startsWith('category:')) {
      const [, game, category] = filterKey.split(':');
      text = `${game} · ${category}`;
    } else if (filterKey.startsWith('tag:')) {
      text = `标签 · ${filterKey.replace('tag:', '')}`;
    }
    if (state.searchQuery) {
      text += ` · "${state.searchQuery}"`;
    }
    els.breadcrumbs.innerHTML = `<span>${text}</span>`;
  }

  function updateActiveNav(activeItem) {
    els.navItems.forEach(item => item.classList.remove('active'));
    activeItem.classList.add('active');
    // 清除分类和标签的激活状态
    document.querySelectorAll('.category-item.active, .tag-chip.active').forEach(el => el.classList.remove('active'));
  }

  function updateActiveCategory(activeItem) {
    document.querySelectorAll('.category-item').forEach(el => el.classList.remove('active'));
    activeItem.classList.add('active');
    els.navItems.forEach(item => item.classList.remove('active'));
  }

  function updateActiveTag(activeItem) {
    document.querySelectorAll('.tag-chip').forEach(el => el.classList.remove('active'));
    activeItem.classList.add('active');
    els.navItems.forEach(item => item.classList.remove('active'));
  }

  function updateCounts() {
    els.countAll.textContent = state.assets.length;
    els.countFavorites.textContent = state.userData.favorites.size;
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    els.countRecent.textContent = state.assets.filter(a => new Date(a.addedAt) >= sevenDaysAgo).length;
  }

  function toggleFavorite(assetId) {
    if (state.userData.favorites.has(assetId)) {
      state.userData.favorites.delete(assetId);
    } else {
      state.userData.favorites.add(assetId);
    }
    saveUserData();
  }

  function toggleViewMode() {
    state.viewMode = state.viewMode === 'grid' ? 'masonry' : 'grid';
    updateViewMode();
    updateViewToggleIcon();
    saveUserData();
  }

  function updateViewMode() {
    els.assetGrid.classList.toggle('masonry', state.viewMode === 'masonry');
  }

  function updateViewToggleIcon() {
    const isGrid = state.viewMode === 'grid';
    els.viewToggle.innerHTML = isGrid
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"></rect><line x1="12" y1="4" x2="12" y2="20"></line></svg>`;
    els.viewToggle.title = isGrid ? '切换为瀑布流' : '切换为网格';
  }

  function toggleTheme() {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', state.theme);
    saveUserData();
  }

  function openDrawer(assetId) {
    const asset = state.assets.find(a => a.id === assetId);
    if (!asset) return;
    state.selectedAssetId = assetId;

    const isFavorited = state.userData.favorites.has(assetId);
    const imageSrc = asset.imageUrl || generatePlaceholder(asset.placeholderColor || '#333', asset.name);

    els.drawerContent.innerHTML = `
      <div class="drawer-image">
        <img src="${imageSrc}" alt="${asset.name}">
      </div>
      <div class="drawer-body">
        <h2 class="drawer-title">${asset.name}</h2>
        <p class="drawer-subtitle">${asset.game} · ${asset.category}${asset.character ? ` · ${asset.character}` : ''}</p>
        
        <div class="drawer-section">
          <h4>标签</h4>
          <div class="drawer-tags">
            ${asset.tags.map(tag => `<span class="drawer-tag">${tag}</span>`).join('')}
          </div>
        </div>

        <div class="drawer-section">
          <h4>来源链接</h4>
          <a href="${asset.sourceUrl || '#'}" target="_blank" class="drawer-link ${asset.sourceUrl ? '' : 'empty'}">
            ${asset.sourceUrl || '未设置来源链接'}
          </a>
        </div>

        <div class="drawer-section drawer-note">
          <h4>备注</h4>
          <textarea id="noteInput" placeholder="添加你的参考备注...">${asset.note || ''}</textarea>
        </div>

        <div class="drawer-actions">
          <button class="btn btn-secondary" id="drawerFavBtn">
            ${isFavorited ? '取消收藏' : '加入收藏'}
          </button>
          <button class="btn btn-primary" id="drawerSaveBtn">保存备注</button>
        </div>
      </div>
    `;

    document.getElementById('drawerFavBtn').addEventListener('click', () => {
      toggleFavorite(assetId);
      const btn = document.getElementById('drawerFavBtn');
      btn.textContent = state.userData.favorites.has(assetId) ? '取消收藏' : '加入收藏';
      updateCounts();
      applyFilter(state.filter, false);
    });

    document.getElementById('drawerSaveBtn').addEventListener('click', () => {
      const note = document.getElementById('noteInput').value;
      state.userData.notes[assetId] = note;
      const assetIndex = state.assets.findIndex(a => a.id === assetId);
      if (assetIndex >= 0) state.assets[assetIndex].note = note;
      saveUserData();
      showToast('备注已保存');
    });

    els.drawerOverlay.classList.remove('hidden');
    requestAnimationFrame(() => {
      els.drawerOverlay.classList.add('show');
      els.drawer.classList.add('open');
    });
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    els.drawer.classList.remove('open');
    els.drawerOverlay.classList.remove('show');
    setTimeout(() => {
      els.drawerOverlay.classList.add('hidden');
      state.selectedAssetId = null;
    }, 300);
    document.body.style.overflow = '';
  }

  function openModal() {
    els.modalOverlay.classList.remove('hidden');
    els.modal.classList.remove('hidden');
    requestAnimationFrame(() => {
      els.modalOverlay.classList.add('show');
      els.modal.classList.add('show');
    });
  }

  function closeModal() {
    els.modal.classList.remove('show');
    els.modalOverlay.classList.remove('show');
    setTimeout(() => {
      els.modal.classList.add('hidden');
      els.modalOverlay.classList.add('hidden');
      els.jsonInput.value = '';
      els.fileInput.value = '';
    }, 300);
  }

  function readImportFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      els.jsonInput.value = e.target.result;
      showToast('文件已读取');
    };
    reader.onerror = () => showToast('文件读取失败');
    reader.readAsText(file);
  }

  function handleImport() {
    const jsonText = els.jsonInput.value.trim();
    if (!jsonText) {
      showToast('请输入或选择 JSON 数据');
      return;
    }

    try {
      const data = JSON.parse(jsonText);
      if (!Array.isArray(data.assets)) {
        throw new Error('JSON 格式错误：缺少 assets 数组');
      }

      // 合并游戏
      if (Array.isArray(data.games)) {
        data.games.forEach(newGame => {
          if (!state.games.find(g => g.id === newGame.id)) {
            state.games.push(newGame);
          }
        });
      }

      // 合并素材，避免重复
      data.assets.forEach(newAsset => {
        const existingIndex = state.assets.findIndex(a => a.id === newAsset.id);
        const assetWithDefaults = {
          ...newAsset,
          tags: newAsset.tags || [],
          favorited: state.userData.favorites.has(newAsset.id),
          note: state.userData.notes[newAsset.id] || ''
        };
        if (existingIndex >= 0) {
          state.assets[existingIndex] = assetWithDefaults;
        } else {
          state.assets.push(assetWithDefaults);
        }
      });

      renderSidebar();
      renderTagCloud();
      applyFilter('all');
      updateCounts();
      closeModal();
      showToast(`成功导入 ${data.assets.length} 条素材`);
      saveUserData();
    } catch (error) {
      showToast(`导入失败: ${error.message}`);
    }
  }

  function exportData() {
    const data = {
      games: state.games,
      assets: state.assets.map(asset => ({
        id: asset.id,
        name: asset.name,
        game: asset.game,
        category: asset.category,
        character: asset.character,
        tags: asset.tags,
        sourceUrl: asset.sourceUrl,
        imageUrl: asset.imageUrl,
        placeholderColor: asset.placeholderColor,
        addedAt: asset.addedAt
      }))
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `game-asset-reference-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('数据已导出');
  }

  let toastTimeout;
  function showToast(message) {
    els.toastMsg.textContent = message;
    els.toast.classList.remove('hidden');
    requestAnimationFrame(() => els.toast.classList.add('show'));
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      els.toast.classList.remove('show');
      setTimeout(() => els.toast.classList.add('hidden'), 300);
    }, 2500);
  }

  return { init };
})();

document.addEventListener('DOMContentLoaded', App.init);
