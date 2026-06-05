// App 应用类 — 框架入口
import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../config/index.js';
import { renderTemplate } from './render.js';
import { logger } from './utils/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export class App {
  constructor(opts = {}) {
    this.port = opts.port ?? config.port;
    this.host = opts.host ?? config.host;
    this.views = opts.views ?? config.views;
    this.publicDir = opts.publicDir ?? config.publicDir;
    this.express = express();
    this.setupEngine();
    this.setupMiddleware();
  }

  setupEngine() {
    this.express.set('view engine', 'ejs');
    this.express.set('views', this.views);
  }

  setupMiddleware() {
    this.express.use(express.json({ limit: '1mb' }));
    this.express.use(express.urlencoded({ extended: true }));
    this.express.use((req, _res, next) => {
      logger.tag('HTTP', `${req.method} ${req.url}`);
      next();
    });
    this.express.use(express.static(this.publicDir, { maxAge: '1h' }));
  }

  /** 注册路由 */
  use(path, router) {
    this.express.use(path, router);
    return this;
  }

  /** 注册一个页面（GET） */
  page(path, handler) {
    this.express.get(path, async (req, res, next) => {
      try {
        await handler(req, res, next);
      } catch (e) {
        next(e);
      }
    });
    return this;
  }

  /** 渲染 EJS 模板到响应 */
  async render(res, view, data = {}) {
    const tplPath = path.join(this.views, view);
    const html = await renderTemplate(tplPath, { ...data, _views: this.views });
    res.send(html);
  }

  /** 渲染页面 (含 layout) */
  async renderPage(res, { layout = 'layouts/base.ejs', page, data = {} }) {
    const layoutPath = path.join(this.views, layout);
    const pagePath = path.join(this.views, page);
    const { renderWithLayout } = await import('./render.js');
    const html = await renderWithLayout({ layout: layoutPath, page: pagePath, data: { ...data, _views: this.views } });
    res.send(html);
  }

  /** JSON 响应 */
  json(res, data, init = { status: 200 }) {
    res.status(init.status).json(data);
  }

  start() {
    this.express.listen(this.port, this.host, () => {
      logger.ok(`RHODES 框架已启动`);
      logger.info(`监听: http://${this.host}:${this.port}`);
      logger.info(`视图: ${this.views}`);
      logger.info(`静态: ${this.publicDir}`);
    });
  }
}
