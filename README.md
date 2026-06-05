# RHODES // 批量技能包组 — Node.js 框架

> 明日方舟风格的「批量技能包组」中央调度终端，基于自研 Node.js + Express + EJS 模板框架，**服务端渲染 (SSR)** 输出。

## 运行

```bash
npm install
npm start            # http://localhost:3000
npm run dev          # node --watch 自动重启
```

## 框架结构

```
/workspace
├── server.js                          # 入口
├── config/index.js                    # 端口 / 路径配置
├── app/                               # 框架核心
│   ├── App.js                         #   App 应用类
│   ├── Router.js                      #   路由包装
│   ├── Component.js                   #   Component 基类
│   ├── render.js                      #   EJS 渲染器 (含 helpers)
│   └── utils/{logger,helpers}.js
└── src/
    ├── routes/index.js                # 路由注册
    ├── controllers/                   # 控制器
    │   ├── dashboard.controller.js    # 渲染主面板
    │   └── api.controller.js          # JSON API
    ├── services/                      # 服务层
    │   ├── skillGroup.service.js
    │   └── timeline.service.js
    ├── data/                          # 种子数据
    │   ├── groups.seed.js
    │   └── events.seed.js
    ├── views/                         # EJS 模板
    │   ├── layouts/base.ejs
    │   ├── pages/dashboard.ejs
    │   └── partials/
    │       ├── _hud.ejs
    │       ├── _groupRoster.ejs
    │       ├── _skillMatrix.ejs
    │       ├── _skillCard.ejs
    │       ├── _actionConsole.ejs
    │       ├── _inspector.ejs
    │       └── _timeline.ejs
    └── public/                        # 静态资源
        ├── css/app.css
        ├── js/app.js
        └── favicon.svg
```

## 框架 API

### App 应用类

```js
import { App } from './app/App.js';

const app = new App({ port: 3000, views: 'src/views', publicDir: 'src/public' });

// 页面路由
app.page('/', dashboardController.index);

// API 路由
app.use('/api', apiRouter.router);

app.start();
```

### Router 包装

```js
import { Router } from './app/Router.js';
const api = new Router('/api');
api.get('/groups', controller.list);
api.post('/groups/:id/batch', controller.batch);
api.mount(app);   // app.use('/api', api.router)
```

### Component 基类

```js
import { Component } from './app/Component.js';

class HudBar extends Component {
  template = 'partials/_hud.ejs';
  defaultData() { return { operator: 'DR-091' }; }
}
const html = await new HudBar({ operator: 'DR-091' }).render('src/views');
```

### 渲染器

```js
import { renderTemplate, renderWithLayout } from './app/render.js';
const html = await renderTemplate('src/views/pages/dashboard.ejs', { ... });
const html2 = await renderWithLayout({
  layout: 'src/views/layouts/base.ejs',
  page: 'src/views/pages/dashboard.ejs',
  data: { ... },
});
```

## EJS Helpers

模板中可直接使用：

| Helper | 说明 |
|--------|------|
| `pad2(n)` / `pad3(n)` | 数字补零 |
| `clock()` / `date()` | UTC 时钟 / 日期 |
| `timeAgo(ts)` | 友好时间 |
| `num(n)` | 千分位 |
| `json(v)` | JSON 安全输出 |
| `esc(s)` | HTML 转义 |
| `len(arr)` / `sum(arr, key)` / `avg(arr, key)` | 数组统计 |
| `count(arr, pred)` | 条件计数 |
| `range(n)` | 范围数组 |
| `eq/ne/gt/lt` | 比较 |

## 路由

| Method | Path | 说明 |
|--------|------|------|
| GET | `/` | 主面板 |
| GET | `/api/groups` | 所有组 |
| GET | `/api/groups/:id` | 单组 |
| POST | `/api/groups/:id/batch` | 批量操作 |
| GET | `/api/timeline` | 时间轴 |
| POST | `/api/inspector/:packId/apply-all` | 应用至全组 |
| DELETE | `/api/packs/:packId` | 移除技能包 |
| GET | `/api/export/:groupId` | 导出 JSON |

## 交互

- 拖拽框选：技能包矩阵内按下并拖动，多选
- 单击：单选 + 打开详情浮层
- 过滤：稀有度 (T2~T6) / 关键词搜索
- 批量：BATCH UPGRADE / EQUIP / UNLOCK / LOCK
- 导出：下载当前选中配置为 JSON
- 观察员模式：`?mode=observe` 禁用所有操作按钮
