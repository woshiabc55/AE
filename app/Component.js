// 组件基类 — 框架核心抽象
import path from 'node:path';
import { renderTemplate, helpers } from './render.js';

/**
 * Component 抽象
 *  - template: 相对 views/ 的模板路径 (e.g. 'partials/_hud.ejs')
 *  - defaultData(): 默认数据
 *  - 子类可覆盖 prepareData() 进行数据加工
 */
export class Component {
  template = '';
  props = {};

  constructor(props = {}) {
    this.props = props;
  }

  defaultData() {
    return {};
  }

  async prepareData() {
    return { ...this.defaultData(), ...this.props, _helpers: helpers };
  }

  /** 静态调用：直接渲染 */
  static async render({ template, views, data = {} }) {
    const tplPath = path.join(views, template);
    return renderTemplate(tplPath, data);
  }

  /** 实例调用 */
  async render(viewsDir) {
    const tplPath = path.join(viewsDir, this.template);
    const data = await this.prepareData();
    return renderTemplate(tplPath, data);
  }
}

/**
 * PageComponent：页面级组件 = 模板 + 布局
 */
export class PageComponent extends Component {
  layout = 'layouts/base.ejs';

  async renderWithLayout({ views }) {
    const data = await this.prepareData();
    const pagePath = path.join(views, this.template);
    const layoutPath = path.join(views, this.layout);
    const { renderWithLayout } = await import('./render.js');
    return renderWithLayout({ layout: layoutPath, page: pagePath, data });
  }
}
