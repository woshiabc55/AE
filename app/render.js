// EJS 渲染器：封装 ejs.renderFile 与全局 helpers
import ejs from 'ejs';
import path from 'node:path';
import { helpers } from './utils/helpers.js';

const VIEWS_ROOT = path.resolve(process.cwd(), 'src/views');

/**
 * 渲染模板到 HTML 字符串
 * @param {string} templatePath - 模板绝对路径
 * @param {object} data - 注入数据
 */
export function renderTemplate(templatePath, data = {}) {
  // 合并 helpers 作为全局可访问的 EJS 变量
  const merged = { ...helpers, ...data };
  return ejs.renderFile(templatePath, merged, {
    async: true,
    root: [VIEWS_ROOT, path.dirname(templatePath)],
    views: [VIEWS_ROOT, path.dirname(templatePath)],
  });
}

/**
 * 渲染布局（page + layout）
 * @param {object} opts
 * @param {string} opts.layout - 布局模板绝对路径
 * @param {string} opts.page - 页面模板绝对路径
 * @param {object} opts.data - 数据
 */
export async function renderWithLayout({ layout, page, data }) {
  const merged = { ...helpers, ...data };
  const pageHtml = await ejs.renderFile(page, merged, {
    async: true,
    root: [VIEWS_ROOT, path.dirname(page)],
    views: [VIEWS_ROOT, path.dirname(page)],
  });
  return ejs.renderFile(layout, { ...merged, body: pageHtml }, {
    async: true,
    root: [VIEWS_ROOT, path.dirname(layout)],
    views: [VIEWS_ROOT, path.dirname(layout)],
  });
}

export { helpers, VIEWS_ROOT };
