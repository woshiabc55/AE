// 全局搜索索引 - 跨 6 款游戏聚合搜索
// 字段: g(游戏id), gid(游戏名), t(类型:char=角色/skin=皮肤), k(关键词), n(名称), s(副标题/称号), u(URL)
const SEARCH_INDEX = (() => {
  const items = [];
  const META_MAP = {};
  GAMES_META.forEach(g => META_MAP[g.id] = g);

  // 角色 + 皮肤
  Object.entries(DATA_MAP).forEach(([gid, heroes]) => {
    const gmeta = META_MAP[gid];
    heroes.forEach(h => {
      items.push({
        g: gid, gid: gmeta.name, gid_en: gmeta.en_name,
        t: 'char', n: h.cname, s: h.title || '',
        type: h.type, type2: h.type2, count: (h.skins || []).length,
        cover: h.portrait || ''
      });
      // 皮肤
      (h.skins || []).forEach(sk => {
        items.push({
          g: gid, gid: gmeta.name, gid_en: gmeta.en_name,
          t: 'skin', n: sk.name, s: h.cname,
          type: h.type, char: h.cname, img: sk.img
        });
      });
    });
  });
  return items;
})();

// MCP 服务面板
const MCP_SERVICES = [
  { id: 'pvp',     name: '王者荣耀数据',  source: 'pvp.qq.com',                    type: 'REST/JSON', status: 'online',  latency: 120,  desc: '官方英雄/皮肤/出装数据' },
  { id: 'ddragon', name: '英雄联盟 PC',   source: 'ddragon.leagueoflegends.com',   type: 'CDN/JSON',  status: 'online',  latency: 85,   desc: 'Riot Data Dragon 全英雄' },
  { id: 'lolm',    name: '英雄联盟手游',   source: 'game.gtimg.cn/lgamem',          type: 'CDN/JSON',  status: 'online',  latency: 95,   desc: '国服英雄/皮肤/分路' },
  { id: 'dota2',   name: 'Dota 2',        source: 'api.opendota.com',              type: 'REST/JSON', status: 'online',  latency: 200,  desc: 'OpenDota 公开英雄数据' },
  { id: 'starrail',name: '星穹铁道',       source: 'StarRailStaticAPI',             type: 'GitHub Pages', status: 'online', latency: 250, desc: 'miHoYo 角色静态数据' },
  { id: 'prts',    name: '明日方舟 PRTS', source: 'prts.wiki',                     type: 'MediaWiki API', status: 'online', latency: 180, desc: '社区 wiki 干员数据' },
  { id: 'steam',   name: 'Steam 新闻',     source: 'api.steampowered.com',         type: 'REST/XML',  status: 'online',  latency: 320,  desc: 'LoL/Dota2/CFM 等端游动态' },
  { id: 'rss',     name: '资讯聚合',      source: 'rss.biligame.com / gw.gd',      type: 'RSS/Atom',  status: 'online',  latency: 410,  desc: 'B 站 wiki / 公告聚合' },
];

// 持续上线 - 动态内容流 (模拟实时数据 + 真实节点)
const LIVE_FEED = [
  { ts: 'live',  icon: 'pulse',   title: '实时同步中', desc: '6 个数据源持续拉取英雄/皮肤更新，自动并入图鉴' },
  { ts: '12:08', icon: 'add',     title: '【新英雄】银灰 · 假日威龙', desc: '明日方舟 PRTS 同步：新增干员 + 时装 2 套', source: 'prts' },
  { ts: '11:42', icon: 'update',  title: '【皮肤更新】星穹铁道 v3.5', desc: '新增 14 款角色立绘, 22 款星魂图', source: 'starrail' },
  { ts: '11:30', icon: 'add',     title: '【数据扩充】Dota 2 7.36c', desc: '新增 2 名英雄, 6 个英雄平衡性调整', source: 'dota2' },
  { ts: '10:55', icon: 'event',   title: '【版本】王者荣耀 S37 赛季', desc: '战令皮肤 · 段位结算 · 12 名英雄调整', source: 'pvp' },
  { ts: '10:20', icon: 'update',  title: '【更新】LoL 16.12 版本', desc: '新增 3 名英雄, 21 款新皮肤', source: 'ddragon' },
  { ts: '09:48', icon: 'event',   title: '【活动】LoL 手游 · 星之守护者', desc: '12 款主题皮肤限时上线', source: 'lolm' },
  { ts: '09:00', icon: 'sync',    title: '【同步】全量索引重建', desc: '跨 6 款游戏 1053 角色 · 10000+ 皮肤', source: 'system' },
];

// 内容分类增强 - 多维度标签
const TAG_SYSTEM = {
  gameplay: ['PVP', 'PVE', 'MOBA', 'MMO', '卡牌', '策略', '动作', '射击', '塔防', '回合', '竞技'],
  style:    ['国风', '二次元', '和风', '欧式', '科幻', '奇幻', '都市', '武侠', '赛博朋克', '神话'],
  platform: ['手游', '端游', '网页', '主机', 'Steam', 'PS5', 'Switch'],
  audience: ['全年龄', '青少年', '成人', '硬核', '休闲', '社交'],
  feature:  ['IP联动', '联机', '单机', '剧情', '多人', '公会', '皮肤系统', '英雄系统'],
};

// 全站时间轴 - 显示内容上线记录
const TIMELINE = [
  { date: '2026-06-17', event: '上线「MCP 服务面板」+ 全局搜索 + 实时同步流', count: '+4 模块' },
  { date: '2026-06-17', event: '接入 Dota 2 完整图鉴 (OpenDota + Valve CDN)', count: '+127 角色' },
  { date: '2026-06-17', event: '接入 明日方舟 干员图鉴 (PRTS Wiki)', count: '+429 干员' },
  { date: '2026-06-17', event: '为 43 款游戏生成 SVG 主题封面', count: '+43 素材' },
  { date: '2026-06-17', event: '构建 30+ 游戏元数据库 + 11 分类', count: '+37 款' },
  { date: '2026-06-17', event: '接入 LoL PC/手游 + 星穹铁道 完整数据', count: '+367 角色' },
  { date: '2026-06-17', event: 'v1.0 王者荣耀图鉴上线', count: '+130 角色' },
];
