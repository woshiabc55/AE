// 技能包组服务
import { seedGroups } from '../data/groups.seed.js';
import { timelineService } from './timeline.service.js';
import { hud as hudSeed } from '../data/events.seed.js';
import { logger } from '../../app/utils/logger.js';

// 内存数据（启动时载入种子）
const groups = JSON.parse(JSON.stringify(seedGroups));
const hud = { ...hudSeed };

function findGroup(id) {
  const g = groups.find((g) => g.id === id);
  if (!g) throw new Error(`Skill group not found: ${id}`);
  return g;
}

function findPack(packId) {
  for (const g of groups) {
    const p = g.packs.find((p) => p.id === packId);
    if (p) return { group: g, pack: p };
  }
  throw new Error(`Skill pack not found: ${packId}`);
}

export const skillGroupService = {
  // 查询
  listGroups() {
    return groups.map((g) => ({
      ...g,
      stats: {
        total: g.packs.length,
        equipped: g.packs.filter((p) => p.equipped).length,
        t6: g.packs.filter((p) => p.rarity === 'T6').length,
        avgLevel: Math.round(g.packs.reduce((a, p) => a + p.level, 0) / g.packs.length),
      },
    }));
  },
  getGroup(id) {
    return findGroup(id);
  },
  getHud() {
    return { ...hud };
  },

  // 批量操作
  batchAction({ groupId, action, packIds }) {
    const group = findGroup(groupId);
    if (!Array.isArray(packIds) || packIds.length === 0) {
      return { changed: 0, action };
    }
    let changed = 0;
    for (const id of packIds) {
      const p = group.packs.find((p) => p.id === id);
      if (!p) continue;
      switch (action) {
        case 'upgrade':
          if (p.locked) continue;
          p.level = Math.min(90, p.level + 1);
          p.cost += 8;
          break;
        case 'equip':
          p.equipped = true;
          break;
        case 'unlock':
          p.locked = false;
          break;
        case 'lock':
          p.locked = true;
          break;
        default:
          throw new Error(`Unknown action: ${action}`);
      }
      changed += 1;
    }

    // 时间轴 + HUD 同步率
    const labelMap = {
      upgrade: '批量升级',
      equip: '批量装配',
      unlock: '解除锁定',
      lock: '批量锁定',
    };
    const levelMap = { upgrade: 'OK', equip: 'OK', unlock: 'WARN', lock: 'CRIT' };
    timelineService.push({
      level: levelMap[action] || 'INFO',
      message: `${labelMap[action] || action} ${changed} 个目标`,
    });
    if (action === 'upgrade') hud.sync = Math.min(100, hud.sync + 0.6);

    logger.tag('BATCH', `${group.code} / ${action} / n=${changed}`);
    return { changed, action };
  },

  applyToAll(packId) {
    const { group, pack } = findPack(packId);
    let changed = 0;
    for (const p of group.packs) {
      p.level = Math.min(90, p.level + 2);
      changed += 1;
    }
    timelineService.push({ level: 'OK', message: `${pack.code} 已应用至全组，等级 +2` });
    logger.tag('APPLY', `${group.code} / ${pack.id} / +2`);
    return { groupId: group.id, changed };
  },

  removePack(packId) {
    for (const g of groups) {
      const i = g.packs.findIndex((p) => p.id === packId);
      if (i >= 0) {
        const [p] = g.packs.splice(i, 1);
        timelineService.push({ level: 'INFO', message: `移除技能包 ${p.id}` });
        return { groupId: g.id, removed: p.id };
      }
    }
    throw new Error(`Pack not found: ${packId}`);
  },
};
