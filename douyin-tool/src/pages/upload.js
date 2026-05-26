const uploadPage = {
  mount(container, params) {
    this.container = container;
    this._render();
    this._bindEvents();
  },

  _render() {
    this.container.innerHTML = `
      <div class="page-upload">
        <div class="upload-header">
          <h2>上传视频</h2>
        </div>
        <div class="upload-container">
          <div class="upload-dropzone" id="dropzone">
            <div class="dropzone-icon">📁</div>
            <h3>拖拽视频文件到此处</h3>
            <p>或点击选择文件</p>
            <p class="dropzone-hint">支持 MP4、MOV 格式，最大 4GB</p>
            <input type="file" id="file-input" accept="video/mp4,video/quicktime" hidden>
          </div>
          <div class="upload-form" id="upload-form" style="display:none">
            <div class="upload-preview" id="upload-preview">
              <div class="preview-placeholder">视频预览</div>
            </div>
            <div class="form-group">
              <label>视频标题</label>
              <input type="text" id="video-title" placeholder="输入视频标题" maxlength="55">
              <span class="char-count"><span id="title-count">0</span>/55</span>
            </div>
            <div class="form-group">
              <label>视频描述</label>
              <textarea id="video-desc" placeholder="添加视频描述..." maxlength="500" rows="4"></textarea>
            </div>
            <div class="form-group">
              <label>话题标签</label>
              <div class="tags-input" id="tags-input">
                <input type="text" id="tag-input-field" placeholder="输入标签后按回车">
              </div>
            </div>
            <div class="form-group">
              <label>可见范围</label>
              <div class="visibility-options">
                <label class="radio-item"><input type="radio" name="visibility" value="public" checked> 公开</label>
                <label class="radio-item"><input type="radio" name="visibility" value="friends"> 朋友可见</label>
                <label class="radio-item"><input type="radio" name="visibility" value="private"> 私密</label>
              </div>
            </div>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" id="allow-comment" checked> 允许评论
              </label>
              <label class="checkbox-label">
                <input type="checkbox" id="allow-duet"> 允许合拍
              </label>
            </div>
            <div class="form-actions">
              <button class="btn btn-primary" id="btn-publish">发布视频</button>
              <button class="btn btn-secondary" id="btn-save-draft">保存草稿</button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  _bindEvents() {
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const titleInput = document.getElementById('video-title');

    dropzone.addEventListener('click', () => fileInput.click());
    dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('dragover'); });
    dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
    dropzone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropzone.classList.remove('dragover');
      this._handleFile(e.dataTransfer.files[0]);
    });

    fileInput.addEventListener('change', (e) => {
      if (e.target.files[0]) this._handleFile(e.target.files[0]);
    });

    titleInput.addEventListener('input', () => {
      document.getElementById('title-count').textContent = titleInput.value.length;
    });

    document.getElementById('tag-input-field').addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && e.target.value.trim()) {
        e.preventDefault();
        this._addTag(e.target.value.trim());
        e.target.value = '';
      }
    });

    document.getElementById('btn-publish').addEventListener('click', () => this._publish());
    document.getElementById('btn-save-draft').addEventListener('click', () => this._saveDraft());
  },

  _handleFile(file) {
    if (!file) return;
    document.getElementById('dropzone').style.display = 'none';
    document.getElementById('upload-form').style.display = 'block';
    document.getElementById('video-title').value = file.name.replace(/\.[^.]+$/, '');
    document.getElementById('title-count').textContent = file.name.replace(/\.[^.]+$/, '').length;
  },

  _addTag(tag) {
    const container = document.getElementById('tags-input');
    const input = document.getElementById('tag-input-field');
    const tagEl = document.createElement('span');
    tagEl.className = 'tag-item';
    tagEl.innerHTML = `#${tag} <span class="tag-remove">&times;</span>`;
    tagEl.querySelector('.tag-remove').addEventListener('click', () => tagEl.remove());
    container.insertBefore(tagEl, input);
  },

  _publish() {
    alert('视频发布功能需要接入抖音SDK后使用');
  },

  _saveDraft() {
    alert('草稿已保存');
  },

  unmount() {},
};

module.exports = uploadPage;
