const DOUYIN_OPEN_BASE = 'https://open.douyin.com';
const DOUYIN_API_BASE = 'https://open.douyin.com';

class DouyinSDK {
  constructor(config) {
    this.clientKey = config.clientKey || '';
    this.clientSecret = config.clientSecret || '';
    this.redirectUri = config.redirectUri || '';
    this.scope = config.scope || 'user_info';
    this._accessToken = null;
    this._refreshToken = null;
    this._openId = null;
  }

  getAuthUrl(state) {
    const params = new URLSearchParams({
      client_key: this.clientKey,
      response_type: 'code',
      scope: this.scope,
      redirect_uri: this.redirectUri,
      state: state || 'douyin_auth_' + Date.now(),
    });
    return `${DOUYIN_OPEN_BASE}/platform/oauth/connect/?${params.toString()}`;
  }

  async getAccessToken(code) {
    try {
      const response = await this._request('POST', '/oauth/access_token/', {
        client_key: this.clientKey,
        client_secret: this.clientSecret,
        code,
        grant_type: 'authorization_code',
      });
      if (response.data && response.data.access_token) {
        this._accessToken = response.data.access_token;
        this._refreshToken = response.data.refresh_token;
        this._openId = response.data.open_id;
      }
      return response;
    } catch (error) {
      throw new Error(`获取AccessToken失败: ${error.message}`);
    }
  }

  async refreshAccessToken() {
    if (!this._refreshToken) {
      throw new Error('无refreshToken，请重新授权');
    }
    try {
      const response = await this._request('POST', '/oauth/refresh_token/', {
        client_key: this.clientKey,
        refresh_token: this._refreshToken,
        grant_type: 'refresh_token',
      });
      if (response.data && response.data.access_token) {
        this._accessToken = response.data.access_token;
        this._refreshToken = response.data.refresh_token;
      }
      return response;
    } catch (error) {
      throw new Error(`刷新Token失败: ${error.message}`);
    }
  }

  async getUserInfo() {
    this._ensureAuth();
    return this._request('GET', '/api/douyin/v1/user/info/', {
      open_id: this._openId,
    }, this._accessToken);
  }

  async getVideoList(cursor, count) {
    this._ensureAuth();
    return this._request('GET', '/api/douyin/v1/video/video_list/', {
      open_id: this._openId,
      cursor: cursor || 0,
      count: count || 10,
    }, this._accessToken);
  }

  async uploadVideo(videoData) {
    this._ensureAuth();
    return this._request('POST', '/api/douyin/v1/video/upload_video/', {
      open_id: this._openId,
      video: videoData,
    }, this._accessToken);
  }

  async createVideo(params) {
    this._ensureAuth();
    return this._request('POST', '/api/douyin/v1/video/create_video/', {
      open_id: this._openId,
      ...params,
    }, this._accessToken);
  }

  async searchContent(keyword, cursor, count) {
    this._ensureAuth();
    return this._request('GET', '/api/douyin/v1/content/search/', {
      open_id: this._openId,
      keyword,
      cursor: cursor || 0,
      count: count || 10,
    }, this._accessToken);
  }

  async getInteractionData(itemId) {
    this._ensureAuth();
    return this._request('GET', '/api/douyin/v1/interaction/data/', {
      open_id: this._openId,
      item_id: itemId,
    }, this._accessToken);
  }

  _ensureAuth() {
    if (!this._accessToken) {
      throw new Error('未授权，请先调用 getAccessToken()');
    }
  }

  async _request(method, path, data, token) {
    const url = `${DOUYIN_API_BASE}${path}`;
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = { method, headers };
    if (method === 'GET' && data) {
      const params = new URLSearchParams(data);
      const fetchUrl = `${url}?${params.toString()}`;
      const response = await fetch(fetchUrl, options);
      return response.json();
    } else if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
      const response = await fetch(url, options);
      return response.json();
    }

    const response = await fetch(url, options);
    return response.json();
  }
}

module.exports = DouyinSDK;
