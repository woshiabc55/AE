// API 控制器 — 返回 JSON
import { skillGroupService } from '../services/skillGroup.service.js';
import { timelineService } from '../services/timeline.service.js';

export const apiController = {
  // GET /api/groups
  listGroups(_req, res) {
    res.json({ ok: true, data: skillGroupService.listGroups() });
  },

  // GET /api/groups/:id
  getGroup(req, res) {
    try {
      const g = skillGroupService.getGroup(req.params.id);
      res.json({ ok: true, data: g });
    } catch (e) {
      res.status(404).json({ ok: false, error: e.message });
    }
  },

  // POST /api/groups/:id/batch
  // body: { action: 'upgrade'|'equip'|'unlock'|'lock', packIds: string[] }
  batchAction(req, res) {
    try {
      const { action, packIds } = req.body || {};
      const result = skillGroupService.batchAction({ groupId: req.params.id, action, packIds });
      res.json({ ok: true, data: result });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message });
    }
  },

  // GET /api/timeline
  timeline(_req, res) {
    res.json({ ok: true, data: timelineService.list(24) });
  },

  // POST /api/inspector/:packId/apply-all
  applyToAll(req, res) {
    try {
      const result = skillGroupService.applyToAll(req.params.packId);
      res.json({ ok: true, data: result });
    } catch (e) {
      res.status(404).json({ ok: false, error: e.message });
    }
  },

  // DELETE /api/packs/:packId
  removePack(req, res) {
    try {
      const result = skillGroupService.removePack(req.params.packId);
      res.json({ ok: true, data: result });
    } catch (e) {
      res.status(404).json({ ok: false, error: e.message });
    }
  },

  // GET /api/export/:groupId
  exportConfig(req, res) {
    try {
      const g = skillGroupService.getGroup(req.params.groupId);
      const payload = {
        group: g.code,
        ts: Date.now(),
        count: g.packs.length,
        packs: g.packs.map((p) => ({ id: p.id, code: p.code, level: p.level, rarity: p.rarity })),
      };
      res.setHeader('Content-Disposition', `attachment; filename="batch-ops-${g.id}-${Date.now()}.json"`);
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(payload, null, 2));
    } catch (e) {
      res.status(404).json({ ok: false, error: e.message });
    }
  },
};
