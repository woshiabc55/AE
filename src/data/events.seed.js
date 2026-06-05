// 时间轴种子
export const seedEvents = [
  { id: 'evt-0', code: 'EVT-001', ts: Date.now() - 320000, level: 'OK',   message: 'GROP A 已编入主战序列，载弹 100%' },
  { id: 'evt-1', code: 'EVT-002', ts: Date.now() - 280000, level: 'INFO', message: '检测到 12 个新可升级目标，等级阈值 E2' },
  { id: 'evt-2', code: 'EVT-003', ts: Date.now() - 240000, level: 'WARN', message: 'SK-018 "裂空" 进入锁定态，需手动解锁' },
  { id: 'evt-3', code: 'EVT-004', ts: Date.now() - 180000, level: 'INFO', message: '指挥官 [DR-091] 上线，权限 Lv.4' },
  { id: 'evt-4', code: 'EVT-005', ts: Date.now() - 90000,  level: 'CRIT', message: '神经同步率跌至 87%，请检查终端链路' },
  { id: 'evt-5', code: 'EVT-006', ts: Date.now() - 12000,  level: 'OK',   message: '批量写入配置成功，生成 EVT 回执 #6F2A' },
];

export const hud = {
  operator: 'DR-091 · 博士',
  security: 'L4',
  power: 78,
  sync: 91.4,
};
