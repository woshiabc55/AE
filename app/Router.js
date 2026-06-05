// 路由包装：在 Express Router 之上增加命名空间与中间件
import { Router as ExpressRouter } from 'express';

export class Router {
  constructor(prefix = '') {
    this.prefix = prefix;
    this.router = ExpressRouter();
  }

  get(path, ...handlers) { this.router.get(path, ...handlers); return this; }
  post(path, ...handlers) { this.router.post(path, ...handlers); return this; }
  put(path, ...handlers) { this.router.put(path, ...handlers); return this; }
  delete(path, ...handlers) { this.router.delete(path, ...handlers); return this; }
  use(...args) { this.router.use(...args); return this; }

  mount(app, base = '') {
    app.use(this.prefix || base, this.router);
  }
}
