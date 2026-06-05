// 主面板控制器 — 渲染 EJS
import { skillGroupService } from '../services/skillGroup.service.js';
import { timelineService } from '../services/timeline.service.js';
import { renderTemplate } from '../../app/render.js';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const VIEWS_DIR = path.resolve(__dirname, '../views');

export const dashboardController = {
  async index(req, res) {
    const groups = skillGroupService.listGroups();
    const activeId = req.query.group || groups[0].id;
    const active = groups.find((g) => g.id === activeId) || groups[0];
    const hud = skillGroupService.getHud();
    const events = timelineService.list(12);
    const isObserver = req.query.mode === 'observe';

    const pagePath = path.join(VIEWS_DIR, 'pages/dashboard.ejs');
    const html = await renderTemplate(pagePath, {
      groups,
      active,
      hud,
      events,
      isObserver,
      title: 'RHODES // 批量技能包组 - 中央调度终端',
    });
    res.send(html);
  },
};
