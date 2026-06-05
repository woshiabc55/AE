// 入口：启动 RHODES 框架
import { App } from './app/App.js';
import { dashboardController } from './src/controllers/dashboard.controller.js';
import { apiRouter } from './src/routes/index.js';
import { config } from './config/index.js';

const app = new App({ port: config.port, host: config.host, views: config.views, publicDir: config.publicDir });

// 页面路由
app.page('/', dashboardController.index);

// API 路由
app.use('/api', apiRouter.router);

app.start();
