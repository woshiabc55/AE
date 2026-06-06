// 衍生作品数据生成器
// 程序化生成 + 真实作品注入
import type { DerivativeWork, WorkType, Region } from './types';
import { GAME_IPS } from './ips';

function makeRng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const WORK_TYPES: WorkType[] = [
  'anime', 'movie', 'manga', 'novel', 'stage',
  'figure', 'goods', 'ost', 'mobile', 'live',
];

const REGION_POOL = [
  'Japan', 'USA', 'China', 'Korea', 'Europe', 'Global',
  'Sweden', 'UK', 'Poland', 'France', 'Czech', 'Germany',
  'Ukraine', 'Russia', 'Taiwan', 'Canada', 'Australia',
  'Belgium', 'Estonia', 'Netherlands', 'Finland',
] as Region[];

const TAGS_POOL = [
  '原创', '改编', 'OVA', 'OAD', '剧场版', '总集篇', '续作', '前传', '外传',
  '重制', '高清化', '纪念版', '联动', '季番', '半年番', '周更', '完结',
  '限定', '豪华版', '初回限定', '特别版', '完全版', 'Fan Disc', '蓝光', '原声',
  '典藏', '联动特典', '黏土人', '景品', 'GK', 'figma', '可动手办', '雕像',
  '毛绒', '徽章', '亚克力', '镭射票', '色纸', '明信片', '书签',
];

const PLATFORM_MAP: Record<WorkType, string[]> = {
  anime: ['TV', 'Web', 'OVA', 'OAD'],
  movie: ['剧场版', '总集篇', '完全新作', '真人电影', 'IMAX'],
  manga: ['周刊连载', '月刊连载', '单行本', '全彩版', 'Web 连载', '四格'],
  novel: ['轻小说', '正传', '外传', '短篇集', '设定集', '公式书', 'Fan Book'],
  stage: ['2.5 次元', '音乐剧', '舞台剧', '朗读剧', '声优朗读'],
  figure: ['1/7 比例', '1/4 比例', '粘土人', 'figma', 'Q 版', '景品', '雕像', 'SD'],
  goods: ['亚克力周边', '抱枕', '徽章套装', '色纸套装', '明信片套装', '卡牌套装'],
  ost: ['原声碟', '角色歌', '印象曲', 'BGM 合集', '主题歌集'],
  mobile: ['衍生手游', '联动游戏', '放置手游', '卡牌手游', '音游'],
  live: ['真人剧集', '真人电影', '网络剧', '特摄剧'],
};

const TYPE_TEMPLATES: Record<WorkType, string[]> = {
  anime: [
    '{ip} TV 动画', '{ip} OVA', '{ip} 续篇', '{ip} 第二季', '{ip} 第三季',
    '{ip} 完结篇', '{ip} 短篇动画', '{ip} 特别篇', '{ip} 异世界篇',
    '{ip} 星之篇', '{ip} 命运之夜', '{ip} 黎明之章', '{ip} 苍之编',
  ],
  movie: [
    '{ip} 剧场版', '{ip} 序章', '{ip} 终章', '{ip} 觉醒', '{ip} 无限',
    '{ip} 破晓', '{ip} 真人电影版', '{ip} IMAX 版', '{ip} 终焉', '{ip} 起源',
    '{ip} 完整剪辑版', '{ip} 重制版',
  ],
  manga: [
    '{ip} 漫画版', '{ip} 外传', '{ip} 官方漫画', '{ip} 衍生四格', '{ip} 番外篇',
    '{ip} 全彩版', '{ip} 重置版', '{ip} 星之漫画', '{ip} 短篇集',
  ],
  novel: [
    '{ip} 轻小说', '{ip} 外传', '{ip} 短篇集', '{ip} 设定集', '{ip} 公式书',
    '{ip} 前传', '{ip} 后传', '{ip} 角色小说',
  ],
  stage: [
    '{ip} 音乐剧', '{ip} 2.5 次元舞台剧', '{ip} 朗读剧', '{ip} 舞台剧',
    '{ip} Live Spectacle', '{ip} 声优朗读会',
  ],
  figure: [
    '{ip} 主角色手办', '{ip} 1/7 比例手办', '{ip} 粘土人', '{ip} 景品',
    '{ip} 雕像', '{ip} figma 可动手办', '{ip} Q 版公仔', '{ip} 周年纪念手办',
  ],
  goods: [
    '{ip} 亚克力立牌套装', '{ip} 徽章套装', '{ip} 镭射票套装', '{ip} 主题抱枕',
    '{ip} 明信片套装', '{ip} 卡牌套装', '{ip} 周年纪念周边',
  ],
  ost: [
    '{ip} 原声大碟', '{ip} BGM 合集', '{ip} 角色歌专辑', '{ip} 印象曲集',
    '{ip} 主题歌集', '{ip} 交响音乐会录音',
  ],
  mobile: [
    '{ip} 衍生手游', '{ip} 联动手游', '{ip} 节奏手游', '{ip} 放置手游',
    '{ip} 卡牌手游', '{ip} 像素手游', '{ip} 放置挂机',
  ],
  live: [
    '{ip} 真人剧', '{ip} 真人电影', '{ip} 网剧', '{ip} 特摄剧', '{ip} 真人舞台剧',
  ],
};

const REAL_WORKS: Record<string, Partial<DerivativeWork>[]> = {
  'ip-001': [
    { title: '超级马里奥兄弟 超级秀', type: 'movie', year: 2023, region: 'USA', platform: '剧场版', popularity: 92, description: '马里奥与路易吉踏入蘑菇王国的全新大电影。' },
    { title: '马里奥赛车 CG 短篇', type: 'anime', year: 2014, region: 'Japan', platform: '短篇动画', popularity: 70, description: 'Mario Kart 宣传短片。' },
  ],
  'ip-003': [
    { title: '宝可梦 旅途', type: 'anime', year: 2019, region: 'Japan', platform: 'TV', popularity: 85, description: '小智与皮卡丘踏上新冒险。' },
    { title: '宝可梦 超梦的逆袭', type: 'movie', year: 1998, region: 'Japan', platform: '剧场版', popularity: 90, description: '初代剧场版经典。' },
    { title: '宝可梦：皮卡丘与可可的冒险', type: 'movie', year: 2020, region: 'Japan', platform: '剧场版', popularity: 88, description: '森林与宝可梦的羁绊故事。' },
    { title: '宝可梦 漫画特别篇', type: 'manga', year: 1997, region: 'Japan', platform: '单行本', popularity: 80, description: '小智冒险的漫画化呈现。' },
  ],
  'ip-020': [
    { title: '最终幻想 7 圣子降临', type: 'movie', year: 2005, region: 'Japan', platform: '完全新作', popularity: 92, description: '克劳德一行人对抗星痕的续篇。' },
    { title: '最终幻想 15 兄弟情', type: 'anime', year: 2016, region: 'Japan', platform: 'OVA', popularity: 75, description: '诺克提斯冒险前的故事。' },
    { title: '最终幻想 14 父女羁绊', type: 'movie', year: 2019, region: 'Japan', platform: '完全新作', popularity: 80, description: '光之战士与芝诺斯的对决。' },
  ],
  'ip-030': [
    { title: '女神异闻录 5 动画版', type: 'anime', year: 2018, region: 'Japan', platform: 'TV', popularity: 90, description: 'Joker 怪盗团的故事。' },
    { title: '女神异闻录 4 黄金版', type: 'anime', year: 2014, region: 'Japan', platform: 'TV', popularity: 88, description: '八十稻羽镇的连续杀人事件。' },
    { title: 'P3 剧场版', type: 'movie', year: 2013, region: 'Japan', platform: '总集篇', popularity: 80, description: '特别篇的剧场版总集。' },
  ],
  'ip-041': [
    { title: '生化危机：死亡岛', type: 'movie', year: 2023, region: 'Japan', platform: '完全新作', popularity: 80, description: '里昂与吉尔的新冒险。' },
    { title: '生化危机：诅咒', type: 'movie', year: 2012, region: 'Japan', platform: '完全新作', popularity: 75, description: '里昂在东斯拉夫调查。' },
    { title: '生化危机：恶化', type: 'movie', year: 2008, region: 'Japan', platform: '完全新作', popularity: 72, description: 'CG 电影初代。' },
    { title: '生化危机 真人电影系列', type: 'live', year: 2002, region: 'USA', platform: '真人电影', popularity: 78, description: '米拉·乔沃维奇主演六部曲。' },
  ],
  'ip-042': [
    { title: '街头霸王 真人电影', type: 'live', year: 2009, region: 'USA', platform: '真人电影', popularity: 50, description: '春丽与隆的银幕对决。' },
    { title: '街头霸王 动画版', type: 'anime', year: 1994, region: 'Japan', platform: 'TV', popularity: 80, description: '街霸 2 时代经典动画。' },
  ],
  'ip-064': [
    { title: '艾尔登法环 官方艺术设定集 Vol.1', type: 'novel', year: 2022, region: 'Global', platform: '公式书', popularity: 92, description: '交界地的艺术档案。' },
    { title: '艾尔登法环 漫画版', type: 'manga', year: 2022, region: 'Japan', platform: '单行本', popularity: 78, description: '褪色者的冒险记录。' },
  ],
  'ip-084': [
    { title: 'Fate/stay night', type: 'anime', year: 2006, region: 'Japan', platform: 'TV', popularity: 92, description: 'Saber 与卫宫士郎的圣杯战争。' },
    { title: 'Fate/Zero', type: 'anime', year: 2011, region: 'Japan', platform: 'TV', popularity: 95, description: '第四次圣杯战争前传，虚渊玄执笔。' },
    { title: 'Fate/Apocrypha', type: 'anime', year: 2017, region: 'Japan', platform: 'TV', popularity: 78, description: '大圣杯召唤的七骑 vs 七骑。' },
    { title: 'Fate/Grand Order 绝对魔兽战线', type: 'anime', year: 2019, region: 'Japan', platform: 'TV', popularity: 90, description: '人理续存保障机构第七号。' },
    { title: 'Fate/stay night Heaven\u0027s Feel', type: 'movie', year: 2017, region: 'Japan', platform: '剧场版', popularity: 92, description: '间桐樱线路剧场版三章。' },
  ],
  'ip-091': [
    { title: '英雄联盟：双城之战', type: 'anime', year: 2021, region: 'USA', platform: 'Web', popularity: 96, description: '皮尔特沃夫与祖安的双城史诗。' },
    { title: '奥术 第二季', type: 'anime', year: 2024, region: 'USA', platform: 'Web', popularity: 95, description: '双城之战续篇。' },
  ],
  'ip-092': [
    { title: 'DOTA：龙之血', type: 'anime', year: 2021, region: 'USA', platform: 'Web', popularity: 84, description: '龙骑士 Davion 的史诗。' },
    { title: 'DOTA：龙之血 第二季', type: 'anime', year: 2022, region: 'USA', platform: 'Web', popularity: 82, description: '龙之血续篇。' },
  ],
  'ip-100': [
    { title: '魔兽电影', type: 'live', year: 2016, region: 'USA', platform: '真人电影', popularity: 78, description: '暴雪与传奇影业合作的史诗巨作。' },
    { title: '魔兽世界 漫画', type: 'manga', year: 2007, region: 'USA', platform: '单行本', popularity: 75, description: 'Wildstorm 出品的官方漫画。' },
  ],
  'ip-140': [
    { title: '赛博朋克：边缘行者', type: 'anime', year: 2022, region: 'Poland', platform: 'Web', popularity: 95, description: '大卫·马丁内斯的夜之城挽歌。' },
    { title: '赛博朋克 2077 公式书', type: 'novel', year: 2020, region: 'Poland', platform: '公式书', popularity: 85, description: '夜之城的完整世界设定。' },
  ],
  'ip-141': [
    { title: '巫师 狮鹫特攻队', type: 'live', year: 2025, region: 'Poland', platform: '网络剧', popularity: 80, description: '杰洛特在学徒时期的故事。' },
    { title: '巫师：狼之噩梦', type: 'movie', year: 2021, region: 'Poland', platform: '完全新作', popularity: 78, description: '维瑟米尔的悲剧起源。' },
  ],
  'ip-200': [
    { title: '原神 官方艺术设定集 Vol.1', type: 'novel', year: 2021, region: 'China', platform: '公式书', popularity: 92, description: '提瓦特大陆的视觉档案。' },
    { title: '原神 漫画版', type: 'manga', year: 2020, region: 'China', platform: 'Web 连载', popularity: 78, description: '官方推出的衍生漫画。' },
    { title: '原神 交响音乐会', type: 'ost', year: 2022, region: 'China', platform: '音乐会录音', popularity: 88, description: '陈致逸指挥的现场版原声。' },
    { title: '原神 短篇动画', type: 'anime', year: 2022, region: 'China', platform: 'Web', popularity: 80, description: '米哈游出品的小剧场动画。' },
  ],
  'ip-205': [
    { title: '王者荣耀 官方动画', type: 'anime', year: 2020, region: 'China', platform: 'Web', popularity: 78, description: '王者英雄们的衍生动画。' },
  ],
  'ip-216': [
    { title: '明日方舟 漫画版', type: 'manga', year: 2020, region: 'China', platform: '单行本', popularity: 80, description: '泰拉大陆的衍生漫画。' },
  ],
  'ip-219': [
    { title: '碧蓝航线 漫画', type: 'manga', year: 2018, region: 'China', platform: 'Web 连载', popularity: 78, description: '舰娘们日常的衍生漫画。' },
  ],
  'ip-222': [
    { title: 'FGO 漫画版', type: 'manga', year: 2016, region: 'Japan', platform: '单行本', popularity: 80, description: '迦勒底的衍生漫画。' },
  ],
  'ip-233': [
    { title: '黑神话：悟空 艺术设定集', type: 'novel', year: 2024, region: 'China', platform: '公式书', popularity: 95, description: '西游题材的视觉档案。' },
    { title: '黑神话 钟馗 CG 短片', type: 'anime', year: 2024, region: 'China', platform: '短篇动画', popularity: 86, description: '游戏科学的 CG 短片。' },
  ],
  'ip-234': [
    { title: '仙剑奇侠传 电视剧', type: 'live', year: 2005, region: 'China', platform: '网剧', popularity: 88, description: '胡歌、刘亦菲主演经典仙侠剧。' },
    { title: '仙剑奇侠传三 电视剧', type: 'live', year: 2009, region: 'China', platform: '网剧', popularity: 86, description: '景天与雪见的冒险。' },
  ],
  'ip-511': [
    { title: 'LoveLive! 校园偶像计划', type: 'anime', year: 2013, region: 'Japan', platform: 'TV', popularity: 92, description: 'μ\u0027s 的校园偶像故事。' },
    { title: 'LoveLive! Sunshine!!', type: 'anime', year: 2016, region: 'Japan', platform: 'TV', popularity: 88, description: '沼津的 Aqours 篇章。' },
    { title: 'LoveLive! 虹咲学园', type: 'anime', year: 2020, region: 'Japan', platform: 'TV', popularity: 82, description: '东京的虹咲篇章。' },
    { title: 'LoveLive! 莲之空', type: 'anime', year: 2023, region: 'Japan', platform: 'TV', popularity: 78, description: '涩谷的莲之空篇章。' },
  ],
  'ip-744': [
    { title: '蜘蛛侠 平行宇宙', type: 'movie', year: 2018, region: 'USA', platform: '完全新作', popularity: 92, description: '迈尔斯·莫拉莱斯的起源。' },
    { title: '蜘蛛侠：纵横宇宙', type: 'movie', year: 2023, region: 'USA', platform: '完全新作', popularity: 95, description: '迈尔斯的多元宇宙冒险。' },
  ],
  'ip-747': [
    { title: '最后生还者 真人剧', type: 'live', year: 2023, region: 'USA', platform: '网剧', popularity: 90, description: 'HBO 改编的乔尔与艾莉的故事。' },
  ],
};

const THEMES = [
  '主角成长', '伙伴羁绊', '世界观扩展', '前传起源', '后传故事',
  '日常喜剧', '黑暗史诗', '异世界穿越', '宿敌对决', '寻找真相',
  '救赎之旅', '家族温情', '英雄起源', '黑暗冒险', '羁绊与牺牲',
];

const TYPE_ZH: Record<WorkType, string> = {
  anime: '动画', movie: '电影', manga: '漫画', novel: '小说',
  stage: '舞台剧', figure: '手办', goods: '周边', ost: '音乐',
  mobile: '手游', live: '真人剧',
};

let counter = 1;
const works: DerivativeWork[] = [];
const rng = makeRng(20260608);

// 1) 真实作品注入
for (const ip of GAME_IPS) {
  const real = REAL_WORKS[ip.id] || [];
  for (const r of real) {
    works.push({
      id: `w-${String(counter++).padStart(5, '0')}`,
      title: r.title!,
      ipId: ip.id,
      ipName: ip.name,
      type: r.type!,
      year: r.year!,
      region: r.region!,
      platform: r.platform!,
      tags: r.tags || ['官方', '真实作品'],
      popularity: r.popularity!,
      description: r.description!,
      cover: ip.color,
    });
  }
}

// 2) 程序化生成 - 每个 IP 8-15 个，确保超过 2000 条
for (const ip of GAME_IPS) {
  const count = 8 + Math.floor(rng() * 8);
  for (let i = 0; i < count; i++) {
    const type = WORK_TYPES[Math.floor(rng() * WORK_TYPES.length)];
    const tpl = TYPE_TEMPLATES[type][Math.floor(rng() * TYPE_TEMPLATES[type].length)];
    const title = tpl.replace('{ip}', ip.name);
    const platforms = PLATFORM_MAP[type];
    const platform = platforms[Math.floor(rng() * platforms.length)];

    const minYear = Math.max(ip.year, 1990);
    const year = minYear + Math.floor(rng() * (2026 - minYear + 1));

    const regionRoll = rng();
    let region: Region = ip.region;
    if (regionRoll < 0.5) region = ip.region;
    else if (regionRoll < 0.7) region = 'Japan';
    else if (regionRoll < 0.82) region = 'USA';
    else if (regionRoll < 0.9) region = 'China';
    else if (regionRoll < 0.95) region = 'Korea';
    else region = REGION_POOL[Math.floor(rng() * REGION_POOL.length)];

    const tagCount = 1 + Math.floor(rng() * 3);
    const tags: string[] = [];
    for (let t = 0; t < tagCount; t++) {
      const tag = TAGS_POOL[Math.floor(rng() * TAGS_POOL.length)];
      if (!tags.includes(tag)) tags.push(tag);
    }

    const popularity = Math.max(20, Math.min(99, Math.floor(ip.popularity * (0.4 + rng() * 0.7))));
    const theme = THEMES[Math.floor(rng() * THEMES.length)];
    const desc = `${ip.name} 系列的${TYPE_ZH[type]}衍生作品，聚焦"${theme}"主题，深受玩家与粉丝喜爱。`;

    works.push({
      id: `w-${String(counter++).padStart(5, '0')}`,
      title,
      ipId: ip.id,
      ipName: ip.name,
      type,
      year,
      region,
      platform,
      tags,
      popularity,
      description: desc,
      cover: ip.color,
    });
  }
}

export const WORKS: DerivativeWork[] = works;
export const TOTAL_WORKS = works.length;
export const TOTAL_IPS = GAME_IPS.length;
