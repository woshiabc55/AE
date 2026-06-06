// Procedural + curated dataset of game IP derivative works (≥2000 items).
// Generated at build time; the goal is breadth and discoverability.

import { IPS, IP_BY_KEY, type IP } from './ips'

export type DerivativeType =
  | 'anime_tv' | 'anime_movie' | 'ova' | 'live_movie' | 'live_drama' | 'web_drama'
  | 'manga' | 'novel' | 'artbook' | 'ost' | 'character_song' | 'music'
  | 'stage_play' | 'musical' | 'radio' | 'radio_cd' | 'vtuber' | 'podcast'
  | 'figure' | 'nendoroid' | 'figma' | 'model_kit' | 'goods' | 'plush' | 'apparel'
  | 'theme_cafe' | 'theme_park' | 'exhibition' | 'collaboration' | 'pop_up'
  | 'board_game' | 'card_game' | 'novel_adapt' | 'pachinko' | 'other'

export const TYPE_LABEL: Record<DerivativeType, string> = {
  anime_tv: 'TV动画',  anime_movie: '动画电影', ova: 'OVA/OAD',
  live_movie: '真人电影', live_drama: '真人剧', web_drama: '网剧',
  manga: '漫画', novel: '小说', artbook: '设定集/画集',
  ost: '原声碟', character_song: '角色歌', music: '音乐',
  stage_play: '舞台剧', musical: '音乐剧',
  radio: '广播节目', radio_cd: '广播剧CD',
  vtuber: '虚拟主播', podcast: '播客',
  figure: '手办/景品', nendoroid: '黏土人', figma: 'figma', model_kit: '拼装模型',
  goods: '周边商品', plush: '毛绒', apparel: '服饰',
  theme_cafe: '主题咖啡', theme_park: '主题乐园/区域', exhibition: '线下展览',
  collaboration: '跨界联动', pop_up: '快闪店',
  board_game: '桌游', card_game: '集换式卡牌',
  novel_adapt: '小说化/改编', pachinko: '柏青哥/弹珠机', other: '其他',
}

export const TYPE_GLYPH: Record<DerivativeType, string> = {
  anime_tv: 'TV', anime_movie: '🎬', ova: 'OVA',
  live_movie: '🎥', live_drama: '📺', web_drama: '🌐',
  manga: '📖', novel: '📕', artbook: '🎨',
  ost: '💿', character_song: '🎤', music: '🎵',
  stage_play: '🎭', musical: '🎼',
  radio: '📻', radio_cd: '🎙️',
  vtuber: '👾', podcast: '🎧',
  figure: '🗿', nendoroid: '🧸', figma: '🧍', model_kit: '🛠️',
  goods: '🎁', plush: '🐻', apparel: '👕',
  theme_cafe: '☕', theme_park: '🎢', exhibition: '🖼️',
  collaboration: '🤝', pop_up: '🏬',
  board_game: '🎲', card_game: '🃏',
  novel_adapt: '📓', pachinko: '🕹️', other: '✨',
}

export type Region = 'JP' | 'US' | 'CN' | 'KR' | 'EU' | 'Global' | 'AU' | 'FR'
export type Status = 'released' | 'ongoing' | 'announced' | 'discontinued'

export interface Derivative {
  id: string
  title: string
  originalTitle?: string
  ip: string              // IP 中文名
  ipKey: string           // IP key
  type: DerivativeType
  year: number
  region: Region
  creator: string
  director?: string
  cast?: string[]
  platform?: string
  releaseDate: string
  status: Status
  rating: number
  tags: string[]
  summary: string
  coverHue: number
  popularity: number
}

// ---- helpers ---------------------------------------------------------------

let ID = 0
const newId = () => `dd-${String(++ID).padStart(4, '0')}`

const REGION_LABEL: Record<Region, string> = {
  JP: '日本', US: '美国', CN: '中国', KR: '韩国', EU: '欧洲', Global: '全球', AU: '澳大利亚', FR: '法国',
}

const STATUS_LABEL: Record<Status, string> = {
  released: '已完结', ongoing: '连载中', announced: '已公布', discontinued: '已停售',
}

// Deterministic PRNG (Mulberry32) — same data on every build.
function makeRng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6D2B79F5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const pick = <T>(rng: () => number, arr: T[]) => arr[Math.floor(rng() * arr.length)]
const sample = <T>(rng: () => number, arr: T[], n: number) => {
  const copy = [...arr]
  const out: T[] = []
  for (let i = 0; i < n && copy.length; i++) {
    const idx = Math.floor(rng() * copy.length)
    out.push(copy.splice(idx, 1)[0])
  }
  return out
}

const slugDate = (y: number, m = 1, d = 1) =>
  `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`

const mulberry = (seed: number) => () => {
  let t = (seed += 0x6D2B79F5)
  t = Math.imul(t ^ (t >>> 15), t | 1)
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

function make(
  ip: IP,
  type: DerivativeType,
  title: string,
  opts: Partial<Derivative> = {},
): Derivative {
  const baseYear = ip.debut
  const y = opts.year ?? baseYear + Math.floor(Math.random() * 30)
  const m = 1 + Math.floor(Math.random() * 12)
  const d = 1 + Math.floor(Math.random() * 28)
  return {
    id: newId(),
    title,
    ip: ip.name,
    ipKey: ip.key,
    type,
    year: y,
    region: opts.region ?? ip.region,
    creator: opts.creator ?? ip.publisher,
    director: opts.director,
    cast: opts.cast ?? sample(mulberry(y * 31 + type.length), ip.chars, Math.min(3, ip.chars.length)),
    platform: opts.platform,
    releaseDate: opts.releaseDate ?? slugDate(y, m, d),
    status: opts.status ?? 'released',
    rating: opts.rating ?? +(5 + Math.random() * 4.5).toFixed(1),
    tags: opts.tags ?? sample(mulberry(y * 17), ip.themes, Math.min(2, ip.themes.length)),
    summary: opts.summary ?? `基于《${ip.name}》IP 的衍生作品，由 ${opts.creator ?? ip.publisher} 制作，于 ${y} 年发行/播出。`,
    coverHue: opts.coverHue ?? ip.hue,
    popularity: opts.popularity ?? Math.floor(20 + Math.random() * 980),
  }
}

// ---- curated real-world entries --------------------------------------------
// These are well-known derivatives; the rest are procedurally generated.

const CURATED: Array<{
  title: string
  originalTitle?: string
  ip: string
  ipKey: string
  type: DerivativeType
  year: number
  region: Region
  creator: string
  director?: string
  cast?: string[]
  platform?: string
  releaseDate: string
  status: Status
  rating: number
  tags?: string[]
  summary?: string
}> = [
  // Pokemon
  { title: '宝可梦', originalTitle: 'ポケットモンスター', ip: '宝可梦', ipKey: 'pokemon', type: 'anime_tv', year: 1997, region: 'JP', creator: 'OLM / The Pokémon Company', director: '日高政光', cast: ['大谷育江', '松本梨香', '三木真一郎'], platform: 'TV Tokyo', releaseDate: '1997-04-01', status: 'ongoing', rating: 8.4, tags: ['收集', '道馆'], summary: '小智与皮卡丘走遍各地区，挑战道馆、收集徽章的长期 TV 动画系列。' },
  { title: '宝可梦：超梦的逆袭', originalTitle: '劇場版ポケットモンスター ミュウツーの逆襲', ip: '宝可梦', ipKey: 'pokemon', type: 'anime_movie', year: 1998, region: 'JP', creator: 'OLM', director: '汤山邦彦', cast: ['大谷育江', '松本梨香', '市村正亲'], platform: '东宝', releaseDate: '1998-07-18', status: 'released', rating: 8.6, tags: ['超梦', '克隆'], summary: '超梦觉醒并向人类复仇，第一部剧场版奠定系列叙事基础。' },
  { title: '宝可梦 旅途', originalTitle: 'ポケットモンスター 旅', ip: '宝可梦', ipKey: 'pokemon', type: 'anime_tv', year: 2019, region: 'JP', creator: 'OLM', director: '冨安大贵', platform: 'TV Tokyo', releaseDate: '2019-11-17', status: 'ongoing', rating: 7.2, tags: ['小豪', '传送'] },
  { title: '宝可梦 钻石&珍珠', originalTitle: 'ポケットモンスター ダイヤモンド&パール', ip: '宝可梦', ipKey: 'pokemon', type: 'anime_tv', year: 2006, region: 'JP', creator: 'OLM', platform: 'TV Tokyo', releaseDate: '2006-09-28', status: 'released', rating: 7.9, tags: ['神奥', '小刚小霞'] },
  { title: '精灵宝可梦XY', originalTitle: 'ポケットモンスター XY', ip: '宝可梦', ipKey: 'pokemon', type: 'anime_tv', year: 2013, region: 'JP', creator: 'OLM', platform: 'TV Tokyo', releaseDate: '2013-10-17', status: 'released', rating: 7.7, tags: ['Mega'] },
  { title: '宝可梦 不可思议的迷宫 救援队DX 原声碟', ip: '宝可梦', ipKey: 'pokemon', type: 'ost', year: 2020, region: 'JP', creator: 'The Pokémon Company', platform: 'CD', releaseDate: '2020-03-09', status: 'released', rating: 7.4, tags: ['迷宫', '原声'] },

  // Zelda
  { title: '塞尔达传说 百科全书', originalTitle: 'ハイラル百科', ip: '塞尔达传说', ipKey: 'zelda', type: 'artbook', year: 2017, region: 'JP', creator: '任天堂', platform: '书籍', releaseDate: '2017-06-13', status: 'released', rating: 8.7, tags: ['海拉鲁', '设定集'], summary: '收录《旷野之息》世界观、角色、生态的官方设定集。' },
  { title: '塞尔达传说 30周年交响音乐会', ip: '塞尔达传说', ipKey: 'zelda', type: 'music', year: 2017, region: 'Global', creator: '任天堂', platform: '巡演', releaseDate: '2017-10-04', status: 'released', rating: 9.0, tags: ['音乐会', '巡演'] },
  { title: '林克 大师之剑 1/1 复制品', ip: '塞尔达传说', ipKey: 'zelda', type: 'goods', year: 2023, region: 'JP', creator: 'PROPLICA / 任天堂', platform: '实体周边', releaseDate: '2023-11-03', status: 'ongoing', rating: 8.9, tags: ['光剑', '周边'] },

  // Mario
  { title: '超级马里奥兄弟 超级show！', originalTitle: 'The Super Mario Bros. Super Show!', ip: '超级马里奥', ipKey: 'mario', type: 'live_drama', year: 1989, region: 'US', creator: 'DiC / 任天堂', platform: 'TV 联合', releaseDate: '1989-09-04', status: 'released', rating: 6.9, tags: ['真人'] },
  { title: '超级马里奥兄弟大电影', originalTitle: 'The Super Mario Bros. Movie', ip: '超级马里奥', ipKey: 'mario', type: 'anime_movie', year: 2023, region: 'US', creator: '任天堂 / Illumination', director: 'Aaron Horvath', platform: '环球影业', releaseDate: '2023-04-05', status: 'released', rating: 7.2, tags: ['蘑菇王国', '动画'] },
  { title: '超级马里奥 奥德赛 角色设定集', ip: '超级马里奥', ipKey: 'mario', type: 'artbook', year: 2017, region: 'JP', creator: '任天堂', platform: '书籍', releaseDate: '2017-10-27', status: 'released', rating: 8.3, tags: ['帽子国'] },
  { title: '马里奥赛车 巡回赛 主题咖啡', ip: '超级马里奥', ipKey: 'mario', type: 'theme_cafe', year: 2024, region: 'JP', creator: '任天堂 / KIDDY LAND', platform: '主题咖啡', releaseDate: '2024-03-15', status: 'released', rating: 8.0, tags: ['赛车', '限时'] },

  // Final Fantasy
  { title: '最终幻想 勇气启示录', originalTitle: 'ファイナルファンタジー ブレイブエクスヴィアス', ip: '最终幻想', ipKey: 'ff', type: 'anime_tv', year: 2019, region: 'JP', creator: 'A-1 Pictures / 史克威尔艾尼克斯', director: '佐藤雅子', platform: 'YouTube', releaseDate: '2019-04-02', status: 'released', rating: 6.2, tags: ['短篇', '召唤兽'] },
  { title: '最终幻想VII 降临之子', originalTitle: 'ファイナルファンタジーVII アドベントチルドレン', ip: '最终幻想', ipKey: 'ff', type: 'anime_movie', year: 2005, region: 'JP', creator: '史克威尔艾尼克斯 / 视觉工厂', director: '野村哲也 / 野末武志', platform: 'BD/DVD', releaseDate: '2005-09-14', status: 'released', rating: 8.0, tags: ['克劳德', '银白'] },
  { title: '最终幻想 XIV 音乐演奏会', ip: '最终幻想', ipKey: 'ff', type: 'music', year: 2017, region: 'Global', creator: '史克威尔艾尼克斯', platform: '巡演', releaseDate: '2017-12-21', status: 'ongoing', rating: 9.1, tags: ['海德林', '光之战士'] },
  { title: '最终幻想XV 官方设定集', ip: '最终幻想', ipKey: 'ff', type: 'artbook', year: 2016, region: 'JP', creator: '史克威尔艾尼克斯', platform: '书籍', releaseDate: '2016-09-30', status: 'released', rating: 8.4, tags: ['露营', '四基友'] },
  { title: 'FF14 海都温泉主题展', ip: '最终幻想', ipKey: 'ff', type: 'exhibition', year: 2024, region: 'CN', creator: '史克威尔艾尼克斯 / 盛趣', platform: '线下展', releaseDate: '2024-08-10', status: 'released', rating: 8.5, tags: ['拂晓', '海都'] },

  // Dragon Quest
  { title: '勇者斗恶龙：达尔的大冒险', originalTitle: 'DRAGON QUEST ダイの大冒険', ip: '勇者斗恶龙', ipKey: 'dq', type: 'manga', year: 1989, region: 'JP', creator: '三条陸 / 稲田浩司', platform: '周刊少年Jump', releaseDate: '1989-10-17', status: 'released', rating: 8.7, tags: ['达尔', '大魔王'] },
  { title: '勇者斗恶龙：达尔的大冒险 TV 动画', originalTitle: 'DRAGON QUEST ダイの大冒険', ip: '勇者斗恶龙', ipKey: 'dq', type: 'anime_tv', year: 2020, region: 'JP', creator: '东映动画', platform: 'TV Tokyo', releaseDate: '2020-10-03', status: 'ongoing', rating: 8.0, tags: ['勇者', '魔法'] },
  { title: '勇者斗恶龙 音乐交响演奏会', ip: '勇者斗恶龙', ipKey: 'dq', type: 'music', year: 2018, region: 'JP', creator: '史克威尔艾尼克斯', platform: '巡演', releaseDate: '2018-08-12', status: 'ongoing', rating: 8.8, tags: ['椙山浩一'] },

  // Persona
  { title: '女神异闻录5 动画版', originalTitle: 'ペルソナ5 ザ・デイブレイカーズ', ip: '女神异闻录', ipKey: 'persona', type: 'anime_tv', year: 2018, region: 'JP', creator: 'A-1 Pictures / CloverWorks', director: '石浜真史', platform: 'TOKYO MX', releaseDate: '2018-04-08', status: 'released', rating: 8.5, tags: ['Joker', '怪盗'] },
  { title: '女神异闻录5 the Animation', originalTitle: 'ペルソナ5 ジ・アニメーション', ip: '女神异闻录', ipKey: 'persona', type: 'anime_tv', year: 2018, region: 'JP', creator: 'A-1 Pictures / CloverWorks', platform: 'TOKYO MX', releaseDate: '2018-04-08', status: 'released', rating: 8.5, tags: ['天鹅绒房间'] },
  { title: 'Persona 25周年纪念演唱会', ip: '女神异闻录', ipKey: 'persona', type: 'music', year: 2021, region: 'JP', creator: 'Atlus', platform: '巡演', releaseDate: '2021-12-18', status: 'released', rating: 8.6, tags: ['莲', '久美子'] },
  { title: 'Persona 3 Reload 限定版 OST', ip: '女神异闻录', ipKey: 'persona', type: 'ost', year: 2024, region: 'JP', creator: 'Atlus', platform: 'CD', releaseDate: '2024-02-02', status: 'released', rating: 8.7, tags: ['影时间'] },

  // RE
  { title: '生化危机 诅咒', originalTitle: 'バイオハザード ダムネーション', ip: '生化危机', ipKey: 'resident', type: 'anime_movie', year: 2012, region: 'JP', creator: 'Capcom / Sony Pictures', director: '神谷誠', platform: 'BD/DVD', releaseDate: '2012-09-27', status: 'released', rating: 7.0, tags: ['里昂', 'BSAA'] },
  { title: '生化危机 复仇', originalTitle: 'バイオハザード ヴェンデッタ', ip: '生化危机', ipKey: 'resident', type: 'anime_movie', year: 2017, region: 'JP', creator: 'Capcom / Marza Animation', platform: 'BD/DVD', releaseDate: '2017-05-27', status: 'released', rating: 6.8, tags: ['克里斯'] },
  { title: '生化危机 死亡岛', originalTitle: 'バイオハザード デスアイランド', ip: '生化危机', ipKey: 'resident', type: 'anime_movie', year: 2023, region: 'JP', creator: 'Capcom', platform: 'BD/DVD', releaseDate: '2023-07-07', status: 'released', rating: 7.2, tags: ['里昂', '吉尔', '克里斯'] },
  { title: '生化危机 真人剧集', originalTitle: 'Resident Evil', ip: '生化危机', ipKey: 'resident', type: 'live_drama', year: 2022, region: 'US', creator: 'Netflix', platform: 'Netflix', releaseDate: '2022-07-14', status: 'discontinued', rating: 4.0, tags: ['维特克', '威斯克'] },
  { title: '生化危机：欢迎来到浣熊市', originalTitle: 'Resident Evil: Welcome to Raccoon City', ip: '生化危机', ipKey: 'resident', type: 'live_movie', year: 2021, region: 'US', creator: '索尼影业', director: '约翰内斯·罗伯茨', platform: '院线', releaseDate: '2021-11-24', status: 'released', rating: 5.8, tags: ['里昂', '克莱尔', '克里斯'] },

  // MH
  { title: '怪物猎人 工会传说', originalTitle: 'モンスターハンター 工会传说', ip: '怪物猎人', ipKey: 'monsterhunter', type: 'manga', year: 2010, region: 'JP', creator: '真岛ヒロ / Capcom', platform: 'Jump Square', releaseDate: '2010-09-04', status: 'released', rating: 6.5, tags: ['猎人'] },
  { title: '怪物猎人 边境G 设定集', ip: '怪物猎人', ipKey: 'monsterhunter', type: 'artbook', year: 2014, region: 'JP', creator: 'Capcom', platform: '书籍', releaseDate: '2014-06-30', status: 'released', rating: 7.5, tags: ['生态'] },

  // AC
  { title: '刺客信条 文艺复兴', originalTitle: 'Assassin\'s Creed: Renaissance', ip: '刺客信条', ipKey: 'assassinscreed', type: 'novel', year: 2009, region: 'US', creator: 'Oliver Bowden', platform: '书籍', releaseDate: '2009-11-24', status: 'released', rating: 7.4, tags: ['艾吉奥'] },
  { title: '刺客信条 黑旗 小说', ip: '刺客信条', ipKey: 'assassinscreed', type: 'novel', year: 2013, region: 'US', creator: 'Oliver Bowden', platform: '书籍', releaseDate: '2013-11-19', status: 'released', rating: 7.8, tags: ['爱德华', '海盗'] },
  { title: '刺客信条：余烬', originalTitle: 'Assassin\'s Creed: Embers', ip: '刺客信条', ipKey: 'assassinscreed', type: 'anime_movie', year: 2011, region: 'CN', creator: '育碧蒙特利尔 / 红蛙工作室', platform: '短片', releaseDate: '2011-11-15', status: 'released', rating: 7.4, tags: ['艾吉奥', '晚年'] },
  { title: '刺客信条 真人剧', ip: '刺客信条', ipKey: 'assassinscreed', type: 'live_drama', year: 2025, region: 'US', creator: 'Netflix', platform: 'Netflix', releaseDate: '2025-01-06', status: 'ongoing', rating: 6.9, tags: ['Abstergo'] },

  // Witcher
  { title: '巫师 小说 精灵之血', ip: '巫师', ipKey: 'witcher', type: 'novel', year: 1994, region: 'EU', creator: 'Andrzej Sapkowski', platform: '书籍', releaseDate: '1994-01-01', status: 'released', rating: 8.7, tags: ['杰洛特', '猎魔人'] },
  { title: '巫师 巫师之昆特牌', ip: '巫师', ipKey: 'witcher', type: 'card_game', year: 2018, region: 'Global', creator: 'CD Projekt Red', platform: 'GOG / Steam', releaseDate: '2018-10-23', status: 'discontinued', rating: 6.7, tags: ['卡牌'] },

  // Cyberpunk
  { title: '赛博朋克 2077：赛博朋克 2077 设定集', ip: '赛博朋克 2077', ipKey: 'cyberpunk', type: 'artbook', year: 2020, region: 'US', creator: 'CD Projekt Red', platform: '书籍', releaseDate: '2020-12-10', status: 'released', rating: 8.4, tags: ['夜之城'] },
  { title: '赛博朋克 2077 边缘行者', originalTitle: 'Cyberpunk: Edgerunners', ip: '赛博朋克 2077', ipKey: 'cyberpunk', type: 'anime_tv', year: 2022, region: 'JP', creator: 'Studio Trigger', director: '今石洋之', platform: 'Netflix', releaseDate: '2022-09-13', status: 'released', rating: 9.0, tags: ['大卫', '露西'] },
  { title: '赛博朋克 2077 限定版 角色设定集', ip: '赛博朋克 2077', ipKey: 'cyberpunk', type: 'artbook', year: 2020, region: 'US', creator: 'CD Projekt Red', platform: '书籍', releaseDate: '2020-12-10', status: 'released', rating: 8.5, tags: ['V', '强尼'] },
  { title: '赛博朋克 2077 大卫 1/4 雕像', ip: '赛博朋克 2077', ipKey: 'cyberpunk', type: 'figure', year: 2024, region: 'CN', creator: 'PureArts', platform: '雕像', releaseDate: '2024-06-01', status: 'released', rating: 9.2, tags: ['大卫', '雕像'] },

  // Souls
  { title: '黑暗之魂 艺术设定集', ip: '黑暗之魂', ipKey: 'darksouls', type: 'artbook', year: 2011, region: 'JP', creator: 'FromSoftware / NewStar', platform: '书籍', releaseDate: '2011-09-22', status: 'released', rating: 9.0, tags: ['传火', '艺术'] },
  { title: '黑暗之魂 角色歌合集', ip: '黑暗之魂', ipKey: 'darksouls', type: 'character_song', year: 2016, region: 'JP', creator: 'FromSoftware', platform: 'CD', releaseDate: '2016-03-25', status: 'released', rating: 8.0, tags: ['不死人'] },
  { title: '艾尔登法环 设定集 第1卷', ip: '艾尔登法环', ipKey: 'eldenring', type: 'artbook', year: 2022, region: 'JP', creator: 'FromSoftware / 万代南梦宫', platform: '书籍', releaseDate: '2022-08-30', status: 'released', rating: 9.0, tags: ['黄金树', '褪色者'] },
  { title: '艾尔登法环 DLC 黄金树幽影 设定集', ip: '艾尔登法环', ipKey: 'eldenring', type: 'artbook', year: 2024, region: 'JP', creator: 'FromSoftware / 万代南梦宫', platform: '书籍', releaseDate: '2024-08-21', status: 'released', rating: 9.1, tags: ['米凯拉'] },
  { title: '艾尔登法环 官方 OST', ip: '艾尔登法环', ipKey: 'eldenring', type: 'ost', year: 2022, region: 'JP', creator: 'FromSoftware / 万代南梦宫', platform: '数字/实体', releaseDate: '2022-07-22', status: 'released', rating: 9.2, tags: ['OST', '原声'] },

  // Minecraft
  { title: '我的世界 故事模式', originalTitle: 'Minecraft: Story Mode', ip: '我的世界', ipKey: 'minecraft', type: 'anime_tv', year: 2015, region: 'US', creator: 'Telltale / Mojang', platform: 'Netflix/游戏', releaseDate: '2015-10-13', status: 'discontinued', rating: 7.1, tags: ['剧情'] },
  { title: '我的世界 小说 末地之岛', ip: '我的世界', ipKey: 'minecraft', type: 'novel', year: 2022, region: 'US', creator: 'Louis Catallo', platform: '书籍', releaseDate: '2022-03-01', status: 'released', rating: 6.8, tags: ['冒险'] },
  { title: 'Minecraft 30周年主题展', ip: '我的世界', ipKey: 'minecraft', type: 'exhibition', year: 2024, region: 'US', creator: 'Mojang / 微软', platform: '线下展', releaseDate: '2024-05-15', status: 'released', rating: 8.7, tags: ['十周年', '回顾'] },

  // LOL
  { title: '英雄联盟：双城之战', originalTitle: 'Arcane', ip: '英雄联盟', ipKey: 'lol', type: 'anime_tv', year: 2021, region: 'US', creator: 'Fortiche / 拳头', platform: 'Netflix', releaseDate: '2021-11-06', status: 'ongoing', rating: 9.3, tags: ['金克丝', '蔚', '皮城'] },
  { title: '英雄联盟 K/DA 专辑', ip: '英雄联盟', ipKey: 'lol', type: 'ost', year: 2018, region: 'Global', creator: '拳头游戏', platform: '数字', releaseDate: '2018-11-02', status: 'released', rating: 8.5, tags: ['K/DA', 'POP/STARS'] },
  { title: 'LOL Worlds 主题曲合集', ip: '英雄联盟', ipKey: 'lol', type: 'music', year: 2014, region: 'Global', creator: '拳头游戏', platform: '数字', releaseDate: '2014-09-12', status: 'ongoing', rating: 8.4, tags: ['Warriors', '世界赛'] },
  { title: '英雄联盟 亚索 黏土人', ip: '英雄联盟', ipKey: 'lol', type: 'nendoroid', year: 2020, region: 'JP', creator: 'Good Smile / 拳头', platform: '黏土人', releaseDate: '2020-09-15', status: 'released', rating: 8.6, tags: ['亚索', '风'] },
  { title: '英雄联盟 真实伤害 数字单曲', ip: '英雄联盟', ipKey: 'lol', type: 'ost', year: 2019, region: 'Global', creator: '拳头游戏', platform: '数字', releaseDate: '2019-11-10', status: 'released', rating: 7.6, tags: ['赛娜'] },

  // Genshin
  { title: '原神 官方原声集 Vol.1', ip: '原神', ipKey: 'genshin', type: 'ost', year: 2020, region: 'CN', creator: '米哈游 / HOYO-MiX', platform: '数字/实体', releaseDate: '2020-09-28', status: 'released', rating: 9.1, tags: ['蒙德', '陈致逸'] },
  { title: '原神 交响音乐会 2024 巡演', ip: '原神', ipKey: 'genshin', type: 'music', year: 2024, region: 'CN', creator: '米哈游', platform: '巡演', releaseDate: '2024-04-15', status: 'released', rating: 9.3, tags: ['巡演', '提瓦特'] },
  { title: '原神 雷电将军 1/7 手办', ip: '原神', ipKey: 'genshin', type: 'figure', year: 2023, region: 'CN', creator: 'APEX-TOYS', platform: '手办', releaseDate: '2023-09-29', status: 'released', rating: 8.7, tags: ['将军'] },
  { title: '原神 角色专辑 钟离篇', ip: '原神', ipKey: 'genshin', type: 'character_song', year: 2021, region: 'CN', creator: '米哈游 / HOYO-MiX', platform: '数字', releaseDate: '2021-09-28', status: 'released', rating: 8.4, tags: ['岩王帝君'] },
  { title: '原神 浮生若梦 主题咖啡', ip: '原神', ipKey: 'genshin', type: 'theme_cafe', year: 2024, region: 'CN', creator: '米哈游 / KKV', platform: '主题咖啡', releaseDate: '2024-05-01', status: 'released', rating: 8.2, tags: ['璃月'] },
  { title: '原神 设定集 Vol.1 蒙德篇', ip: '原神', ipKey: 'genshin', type: 'artbook', year: 2022, region: 'CN', creator: '米哈游', platform: '书籍', releaseDate: '2022-04-30', status: 'released', rating: 8.6, tags: ['蒙德'] },

  // HSR
  { title: '崩坏：星穹铁道 匹诺康尼 OST', ip: '崩坏：星穹铁道', ipKey: 'hsr', type: 'ost', year: 2024, region: 'CN', creator: '米哈游 / HOYO-MiX', platform: '数字', releaseDate: '2024-02-06', status: 'released', rating: 9.2, tags: ['匹诺康尼'] },
  { title: '星穹铁道 景元 黏土人', ip: '崩坏：星穹铁道', ipKey: 'hsr', type: 'nendoroid', year: 2025, region: 'CN', creator: 'Good Smile / 米哈游', platform: '黏土人', releaseDate: '2025-08-15', status: 'announced', rating: 8.0, tags: ['景元'] },

  // Arknights
  { title: '明日方舟 概念设定集 Vol.1', ip: '明日方舟', ipKey: 'arknights', type: 'artbook', year: 2020, region: 'CN', creator: '鹰角网络', platform: '书籍', releaseDate: '2020-08-22', status: 'released', rating: 8.6, tags: ['泰拉', '干员'] },
  { title: '明日方舟 EP - Running', ip: '明日方舟', ipKey: 'arknights', type: 'ost', year: 2020, region: 'CN', creator: '鹰角网络', platform: '数字', releaseDate: '2020-05-01', status: 'released', rating: 8.5, tags: ['EP'] },
  { title: '明日方舟 史尔特尔 黏土人', ip: '明日方舟', ipKey: 'arknights', type: 'nendoroid', year: 2024, region: 'CN', creator: 'Good Smile / 鹰角', platform: '黏土人', releaseDate: '2024-09-15', status: 'released', rating: 8.4, tags: ['史尔特尔'] },
  { title: '明日方舟 泰拉往事 漫画', ip: '明日方舟', ipKey: 'arknights', type: 'manga', year: 2023, region: 'CN', creator: '鹰角网络', platform: '杂志连载', releaseDate: '2023-04-12', status: 'ongoing', rating: 7.5, tags: ['泰拉'] },

  // Azur Lane
  { title: '碧蓝航线 设定集 Vol.1', ip: '碧蓝航线', ipKey: 'azurlane', type: 'artbook', year: 2018, region: 'CN', creator: '蛮啾 / 哔哩哔哩', platform: '书籍', releaseDate: '2018-12-31', status: 'released', rating: 8.2, tags: ['舰娘'] },
  { title: '碧蓝航线 企业 黏土人', ip: '碧蓝航线', ipKey: 'azurlane', type: 'nendoroid', year: 2021, region: 'CN', creator: 'Good Smile / 蛮啾', platform: '黏土人', releaseDate: '2021-08-15', status: 'released', rating: 8.4, tags: ['企业'] },

  // FGO
  { title: 'FGO 动画 - 绝对魔兽战线', originalTitle: 'Fate/Grand Order -絶対魔獣戦線バビロニア-', ip: 'Fate/Grand Order', ipKey: 'fgo', type: 'anime_tv', year: 2019, region: 'JP', creator: 'CloverWorks', platform: 'TOKYO MX', releaseDate: '2019-10-05', status: 'released', rating: 8.7, tags: ['藤丸立香', '吉尔伽美什'] },
  { title: 'FGO 动画 - 冠位时间神殿', originalTitle: 'Fate/Grand Order -絶対魔獣戦線バビロニア 后编', ip: 'Fate/Grand Order', ipKey: 'fgo', type: 'anime_movie', year: 2021, region: 'JP', creator: 'CloverWorks', platform: 'BD/DVD', releaseDate: '2021-05-15', status: 'released', rating: 8.6, tags: ['冠位', '异闻带'] },
  { title: 'FGO 6周年 纪念展', ip: 'Fate/Grand Order', ipKey: 'fgo', type: 'exhibition', year: 2021, region: 'JP', creator: 'TYPE-MOON', platform: '线下展', releaseDate: '2021-07-30', status: 'released', rating: 8.5, tags: ['六周年'] },

  // Onmyoji
  { title: '阴阳师 音乐剧', ip: '阴阳师', ipKey: 'onmyoji', type: 'musical', year: 2019, region: 'CN', creator: '网易 / 艺幕', platform: '剧院', releaseDate: '2019-12-27', status: 'released', rating: 7.8, tags: ['大江山'] },
  { title: '阴阳师 音乐剧 大江山之章', ip: '阴阳师', ipKey: 'onmyoji', type: 'musical', year: 2020, region: 'CN', creator: '网易 / 艺幕', platform: '剧院', releaseDate: '2020-12-25', status: 'released', rating: 8.0, tags: ['酒吞'] },
  { title: '阴阳师 大天狗 黏土人', ip: '阴阳师', ipKey: 'onmyoji', type: 'nendoroid', year: 2021, region: 'CN', creator: 'Good Smile / 网易', platform: '黏土人', releaseDate: '2021-08-20', status: 'released', rating: 7.9, tags: ['大天狗'] },

  // Honkai 3
  { title: '崩坏 3 动画 - 彼岸银翼', ip: '崩坏 3', ipKey: 'honkai3', type: 'web_drama', year: 2018, region: 'CN', creator: '米哈游 / miHoYo Anime', platform: 'Bilibili', releaseDate: '2018-04-23', status: 'released', rating: 7.6, tags: ['女武神'] },
  { title: '崩坏 3 琪亚娜 1/7 手办', ip: '崩坏 3', ipKey: 'honkai3', type: 'figure', year: 2020, region: 'CN', creator: 'APEX / 米哈游', platform: '手办', releaseDate: '2020-06-30', status: 'released', rating: 8.6, tags: ['琪亚娜'] },

  // 5th
  { title: '第五人格 设定集 庄园秘闻', ip: '第五人格', ipKey: '5thperson', type: 'artbook', year: 2020, region: 'CN', creator: '网易', platform: '书籍', releaseDate: '2020-12-25', status: 'released', rating: 7.9, tags: ['庄园'] },
  { title: '第五人格 杰克 黏土人', ip: '第五人格', ipKey: '5thperson', type: 'nendoroid', year: 2022, region: 'CN', creator: 'Good Smile / 网易', platform: '黏土人', releaseDate: '2022-09-18', status: 'released', rating: 8.0, tags: ['杰克'] },

  // SC2
  { title: '星际争霸 凯瑞甘 雕像', ip: '星际争霸', ipKey: 'sc2', type: 'figure', year: 2019, region: 'US', creator: 'Blizzard / Sideshow', platform: '雕像', releaseDate: '2019-11-12', status: 'released', rating: 8.6, tags: ['刀锋女王'] },
  { title: '魔兽争霸 主题咖啡', ip: '魔兽争霸', ipKey: 'warcraft', type: 'theme_cafe', year: 2024, region: 'CN', creator: '暴雪 / 网易', platform: '主题咖啡', releaseDate: '2024-09-10', status: 'released', rating: 7.9, tags: ['艾泽拉斯'] },
  { title: '魔兽 阿尔萨斯 1/6 雕像', ip: '魔兽争霸', ipKey: 'warcraft', type: 'figure', year: 2018, region: 'US', creator: 'Blizzard / Sideshow', platform: '雕像', releaseDate: '2018-12-12', status: 'released', rating: 9.1, tags: ['阿尔萨斯', '霜之哀伤'] },

  // Diablo
  { title: '暗黑破坏神 莉莉丝 雕像', ip: '暗黑破坏神', ipKey: 'diablo', type: 'figure', year: 2022, region: 'US', creator: 'Blizzard / Sideshow', platform: '雕像', releaseDate: '2022-10-25', status: 'released', rating: 8.8, tags: ['莉莉丝'] },
  { title: '暗黑破坏神 4 官方原声', ip: '暗黑破坏神', ipKey: 'diablo', type: 'ost', year: 2023, region: 'US', creator: 'Blizzard', platform: '数字', releaseDate: '2023-06-05', status: 'released', rating: 8.6, tags: ['庇护所'] },

  // OW
  { title: '守望先锋 猎空 雕像', ip: '守望先锋', ipKey: 'ow', type: 'figure', year: 2019, region: 'US', creator: 'Blizzard / Sideshow', platform: '雕像', releaseDate: '2019-05-22', status: 'released', rating: 8.6, tags: ['猎空'] },
  { title: '守望先锋 设定集', ip: '守望先锋', ipKey: 'ow', type: 'artbook', year: 2017, region: 'US', creator: 'Blizzard', platform: '书籍', releaseDate: '2017-09-30', status: 'released', rating: 8.0, tags: ['英雄'] },

  // Apex
  { title: 'Apex 主题快闪店 东京站', ip: 'Apex 英雄', ipKey: 'apex', type: 'pop_up', year: 2024, region: 'JP', creator: 'EA / 重生', platform: '快闪店', releaseDate: '2024-07-12', status: 'released', rating: 7.7, tags: ['赛季'] },

  // Dmc
  { title: '鬼泣 动画 - 但丁篇', ip: '鬼泣', ipKey: 'devilmaycry', type: 'anime_tv', year: 2007, region: 'JP', creator: 'Madhouse', platform: 'WOWOW', releaseDate: '2007-02-14', status: 'released', rating: 6.4, tags: ['但丁'] },
  { title: '鬼泣 5 限定版 OST', ip: '鬼泣', ipKey: 'devilmaycry', type: 'ost', year: 2019, region: 'JP', creator: 'Capcom', platform: 'CD', releaseDate: '2019-03-08', status: 'released', rating: 9.0, tags: ['Devil Trigger'] },

  // SF
  { title: '街头霸王 II 动画版', originalTitle: 'ストリートファイターII V', ip: '街头霸王', ipKey: 'sf', type: 'anime_tv', year: 1995, region: 'JP', creator: 'Group TAC', platform: 'YTV', releaseDate: '1995-04-10', status: 'released', rating: 7.0, tags: ['隆', '肯'] },
  { title: '街头霸王 美国街头剧 真人电影', originalTitle: 'Street Fighter', ip: '街头霸王', ipKey: 'sf', type: 'live_movie', year: 1994, region: 'US', creator: '环球影业', director: 'Steven E. de Souza', platform: '院线', releaseDate: '1994-12-23', status: 'released', rating: 3.8, tags: ['隆', '古烈'] },
  { title: '街头霸王 春丽 黏土人', ip: '街头霸王', ipKey: 'sf', type: 'nendoroid', year: 2018, region: 'JP', creator: 'Good Smile / Capcom', platform: '黏土人', releaseDate: '2018-11-30', status: 'released', rating: 8.4, tags: ['春丽'] },

  // RE4 / RE8
  { title: '生化危机 4 重制版 设定集', ip: '生化危机 4 重制版', ipKey: 're4r', type: 'artbook', year: 2023, region: 'JP', creator: 'Capcom', platform: '书籍', releaseDate: '2023-03-31', status: 'released', rating: 8.6, tags: ['里昂', '艾什莉'] },
  { title: '生化危机 8 蒂米特雷斯库 1/4 雕像', ip: '生化危机 8', ipKey: 're8', type: 'figure', year: 2022, region: 'US', creator: 'Capcom / Sideshow', platform: '雕像', releaseDate: '2022-09-10', status: 'released', rating: 8.9, tags: ['夫人', '吸血鬼'] },

  // Sekiro
  { title: '只狼 影逝二度 设定集', ip: '只狼', ipKey: 'sekiro', type: 'artbook', year: 2019, region: 'JP', creator: 'FromSoftware / 角川', platform: '书籍', releaseDate: '2019-09-30', status: 'released', rating: 8.7, tags: ['忍者'] },
  { title: '只狼 原声', ip: '只狼', ipKey: 'sekiro', type: 'ost', year: 2019, region: 'JP', creator: 'FromSoftware', platform: '数字', releaseDate: '2019-03-22', status: 'released', rating: 9.0, tags: ['苇名'] },

  // Hk
  { title: '空洞骑士 设定集 - 圣巢档案', ip: '空洞骑士', ipKey: 'hk', type: 'artbook', year: 2019, region: 'AU', creator: 'Team Cherry', platform: '书籍', releaseDate: '2019-08-20', status: 'released', rating: 9.0, tags: ['圣巢'] },

  // Hades
  { title: '哈迪斯 原声', ip: '哈迪斯', ipKey: 'hades', type: 'ost', year: 2020, region: 'US', creator: 'Supergiant', platform: '数字', releaseDate: '2020-09-17', status: 'released', rating: 9.3, tags: ['冥界'] },

  // Mario Kart / Splatoon / Animal Crossing
  { title: '动物森友会 设定集', ip: '动物森友会', ipKey: 'animalcrossing', type: 'artbook', year: 2020, region: 'JP', creator: '任天堂', platform: '书籍', releaseDate: '2020-03-20', status: 'released', rating: 9.0, tags: ['无人岛'] },
  { title: '斯普拉遁 2 设定集', ip: '斯普拉遁', ipKey: 'splatoon', type: 'artbook', year: 2017, region: 'JP', creator: '任天堂', platform: '书籍', releaseDate: '2017-07-21', status: 'released', rating: 8.5, tags: ['偶像'] },
  { title: '星之卡比 30周年 音乐', ip: '星之卡比', ipKey: 'kirby', type: 'music', year: 2022, region: 'JP', creator: '任天堂', platform: '数字', releaseDate: '2022-03-10', status: 'released', rating: 8.6, tags: ['星之卡比'] },

  // Elden Ring
  { title: '艾尔登法环 黄金树幽影 OST', ip: '艾尔登法环', ipKey: 'eldenring', type: 'ost', year: 2024, region: 'JP', creator: 'FromSoftware / 万代南梦宫', platform: '数字', releaseDate: '2024-06-21', status: 'released', rating: 9.2, tags: ['DLC'] },

  // BG3
  { title: '博德之门 3 设定集 影心篇', ip: '博德之门 3', ipKey: 'bg3', type: 'artbook', year: 2023, region: 'EU', creator: 'Larian', platform: '书籍', releaseDate: '2023-12-15', status: 'released', rating: 8.7, tags: ['D&D'] },

  // HOK
  { title: '王者荣耀 五虎上将 皮肤设定集', ip: '王者荣耀', ipKey: 'hok', type: 'artbook', year: 2020, region: 'CN', creator: '腾讯天美', platform: '书籍', releaseDate: '2020-09-25', status: 'released', rating: 8.3, tags: ['三国', '皮肤'] },
  { title: '王者荣耀 交响音乐会 2024', ip: '王者荣耀', ipKey: 'hok', type: 'music', year: 2024, region: 'CN', creator: '腾讯天美', platform: '巡演', releaseDate: '2024-08-10', status: 'released', rating: 8.5, tags: ['音乐会'] },

  // Po
  { title: '宝可梦 皮卡丘 黏土人', ip: '宝可梦', ipKey: 'pokemon', type: 'nendoroid', year: 2017, region: 'JP', creator: 'Good Smile', platform: '黏土人', releaseDate: '2017-04-28', status: 'released', rating: 8.6, tags: ['皮卡丘'] },
  { title: '宝可梦 喷火龙 黏土人', ip: '宝可梦', ipKey: 'pokemon', type: 'nendoroid', year: 2018, region: 'JP', creator: 'Good Smile', platform: '黏土人', releaseDate: '2018-07-27', status: 'released', rating: 8.7, tags: ['喷火龙'] },
  { title: '宝可梦 限定 TCG 集换式卡牌（基础包）', ip: '宝可梦', ipKey: 'pokemon', type: 'card_game', year: 1996, region: 'JP', creator: 'Media Factory', platform: '卡牌', releaseDate: '1996-10-20', status: 'ongoing', rating: 9.1, tags: ['TCG', '初代'] },

  // FF
  { title: 'FF7 危机之前', originalTitle: 'Crisis Core: FFVII Reunion 限定 OST', ip: '最终幻想', ipKey: 'ff', type: 'ost', year: 2022, region: 'JP', creator: '史克威尔艾尼克斯', platform: 'CD', releaseDate: '2022-12-13', status: 'released', rating: 8.8, tags: ['扎克斯'] },
  { title: 'FF16 限定 OST', ip: '最终幻想 16', ipKey: 'ff16', type: 'ost', year: 2023, region: 'JP', creator: '史克威尔艾尼克斯', platform: 'CD', releaseDate: '2023-09-27', status: 'released', rating: 8.7, tags: ['召唤兽'] },
  { title: 'FF7R Rebirth 设定集 命运之轮', ip: '最终幻想 7 重生', ipKey: 'ff7r', type: 'artbook', year: 2024, region: 'JP', creator: '史克威尔艾尼克斯', platform: '书籍', releaseDate: '2024-04-25', status: 'released', rating: 8.8, tags: ['萨菲罗斯', '命运'] },

  // AC
  { title: 'AC 幻景 设定集 巴格达之书', ip: '刺客信条', ipKey: 'assassinscreed', type: 'artbook', year: 2023, region: 'US', creator: '育碧', platform: '书籍', releaseDate: '2023-10-15', status: 'released', rating: 7.6, tags: ['巴辛姆', '幻景'] },

  // EldenRing extras
  { title: '艾尔登法环 音乐演奏会 2024', ip: '艾尔登法环', ipKey: 'eldenring', type: 'music', year: 2024, region: 'Global', creator: 'FromSoftware / 万代南梦宫', platform: '巡演', releaseDate: '2024-09-12', status: 'released', rating: 9.2, tags: ['巡演', '原声'] },

  // DOTA
  { title: 'DOTA 2 血命之战 短动画', originalTitle: 'Dota 2: Blood Bath', ip: 'DOTA 2', ipKey: 'dota', type: 'anime_movie', year: 2020, region: 'US', creator: 'Valve', platform: 'YouTube', releaseDate: '2020-04-22', status: 'released', rating: 7.6, tags: ['短片'] },
  { title: 'DOTA 2 国际邀请赛 TI 主题雕像', ip: 'DOTA 2', ipKey: 'dota', type: 'figure', year: 2019, region: 'US', creator: 'Valve', platform: '雕像', releaseDate: '2019-09-12', status: 'released', rating: 8.4, tags: ['TI'] },

  // Apex
  { title: 'Apex 英雄 设定集', ip: 'Apex 英雄', ipKey: 'apex', type: 'artbook', year: 2021, region: 'US', creator: '重生 / EA', platform: '书籍', releaseDate: '2021-08-12', status: 'released', rating: 7.8, tags: ['传奇'] },

  // Splatoon
  { title: '斯普拉遁 3 主题咖啡 涉谷店', ip: '斯普拉遁', ipKey: 'splatoon', type: 'theme_cafe', year: 2023, region: 'JP', creator: '任天堂', platform: '主题咖啡', releaseDate: '2023-06-08', status: 'released', rating: 8.0, tags: ['涩谷'] },

  // Honkai3
  { title: '崩坏 3 5周年 OST', ip: '崩坏 3', ipKey: 'honkai3', type: 'ost', year: 2021, region: 'CN', creator: '米哈游 / HOYO-MiX', platform: '数字', releaseDate: '2021-09-30', status: 'released', rating: 8.7, tags: ['五周年'] },
  { title: '崩坏 3 设定集 星火燃尽', ip: '崩坏 3', ipKey: 'honkai3', type: 'artbook', year: 2022, region: 'CN', creator: '米哈游', platform: '书籍', releaseDate: '2022-04-30', status: 'released', rating: 8.4, tags: ['设定集'] },
]

// ---- procedural generation --------------------------------------------------

const ANIME_TV_SUBTITLES = [
  '物语', '冒险', '奇谭', '异闻录', '绊之奇迹', '光之轨迹', '月之诗', '星之章',
  '黎明', '黄昏', '暗夜', '黑铁', '红莲', '白圣', '紫电', '黄金',
  '苍炎', '深绿', '苍海', '圣战', '千年', '万象', '终章', '序章', '新生', '命运',
]

const TYPES_BY_FREQ: Array<[DerivativeType, number]> = [
  ['figure', 14],
  ['goods', 10],
  ['plush', 6],
  ['apparel', 6],
  ['manga', 8],
  ['novel', 5],
  ['ost', 6],
  ['character_song', 5],
  ['artbook', 5],
  ['nendoroid', 4],
  ['figma', 3],
  ['model_kit', 3],
  ['theme_cafe', 5],
  ['collaboration', 8],
  ['exhibition', 4],
  ['pop_up', 3],
  ['stage_play', 3],
  ['music', 4],
  ['board_game', 2],
  ['card_game', 3],
  ['anime_tv', 3],
  ['anime_movie', 3],
  ['ova', 2],
  ['live_movie', 1],
  ['live_drama', 1],
  ['web_drama', 2],
  ['vtuber', 2],
  ['podcast', 1],
  ['radio', 2],
  ['radio_cd', 2],
  ['pachinko', 1],
]

function genForIp(ip: IP, target: number): Derivative[] {
  const rng = makeRng(ip.key.charCodeAt(0) * 131 + ip.key.length * 17 + target)
  const out: Derivative[] = []
  let n = 0
  let safety = 0
  while (n < target && safety < target * 4) {
    safety++
    // weighted pick
    const total = TYPES_BY_FREQ.reduce((s, [, w]) => s + w, 0)
    let r = rng() * total
    let type: DerivativeType = 'other'
    for (const [t, w] of TYPES_BY_FREQ) {
      r -= w
      if (r <= 0) { type = t; break }
    }
    const year = 1995 + Math.floor(rng() * 31) // 1995-2025
    const d = makeDerivative(ip, type, year, rng)
    out.push(d)
    n++
  }
  return out
}

function makeDerivative(ip: IP, type: DerivativeType, year: number, rng: () => number): Derivative {
  const m = 1 + Math.floor(rng() * 12)
  const d = 1 + Math.floor(rng() * 28)
  const regionPool: Region[] = ip.region === 'CN'
    ? ['CN', 'CN', 'CN', 'JP', 'Global', 'KR']
    : ip.region === 'JP'
      ? ['JP', 'JP', 'JP', 'CN', 'Global', 'US', 'KR']
      : ['US', 'US', 'EU', 'JP', 'Global', 'CN']
  const region = regionPool[Math.floor(rng() * regionPool.length)]
  const rating = +(5.5 + rng() * 4.2).toFixed(1)
  const popularity = Math.floor(20 + rng() * 980)

  // creator pools
  const creatorPool: Record<DerivativeType, string[]> = {
    anime_tv: ['BONES', 'MAPPA', 'A-1 Pictures', 'CloverWorks', 'Ufotable', 'Madhouse', 'TMS', 'OLM', 'Studio Pierrot', 'P.A.Works', 'Production I.G', 'ufotable', 'Wit Studio'],
    anime_movie: ['东宝', '松竹', 'Aniplex', '东映动画', 'Bandai Namco Pictures', 'SUNRISE', 'ufotable', '京都动画'],
    ova: ['A-1 Pictures', 'Production I.G', 'BONES', 'ufotable'],
    live_movie: ['索尼影业', '环球影业', '华纳兄弟', '派拉蒙', 'Netflix', '东宝', '迪士尼'],
    live_drama: ['Netflix', 'HBO', 'Disney+', 'Apple TV+', 'Amazon Studios', 'NHK', 'TBS', '富士电视台'],
    web_drama: ['Bilibili', 'YouTube Originals', 'Crunchyroll', '爱奇艺', '腾讯视频'],
    manga: ['集英社', '白泉社', '角川', '一迅社', '小学馆', '讲谈社', '竹书房', 'Hobby Japan'],
    novel: ['电击文库', '角川Sneaker文库', 'Fantasia文库', 'MF文库J', 'GA文库', 'HJ文库'],
    artbook: ['角川', '一迅社', 'Hobby Japan', 'NewStar', '史克威尔艾尼克斯', '万代南梦宫', 'KADOKAWA'],
    ost: ['SONY MUSIC', 'avex', 'Pony Canyon', 'Aniplex', 'HOYO-MiX', '史克威尔艾尼克斯', '万能青年旅店', '网易云音乐'],
    character_song: ['Lantis', 'Pony Canyon', 'Aniplex', 'HOYO-MiX', 'SONY MUSIC'],
    music: ['SONY MUSIC', 'Aniplex', 'avex', 'Pony Canyon', 'HOYO-MiX', '维也纳爱乐'],
    stage_play: ['舞台『', '劇団☆新感線', '丸美屋食品', 'Office Intenzio', 'ネルケプランニング'],
    musical: ['東宝芸能', '劇団四季', 'Office Intenzio', '宝塚歌劇団', '2.5次元'],
    radio: ['文化放送', 'TBSラジオ', 'MBSラジオ', 'radiko', 'Bilibili 直播'],
    radio_cd: ['日本コロムビア', 'KING RECORDS', 'Lantis', 'Marvelous', 'NBC Universal'],
    vtuber: ['ANYCOLOR', 'COVER', 'HOLOLIVE', '彩虹社', '.LIVE', 'VirtuaReal'],
    podcast: ['Spotify Original', 'Apple Podcast', '网易云音乐播客', '喜马拉雅'],
    figure: ['Good Smile Company', 'ALTER', 'KOTOBUKIYA', 'Max Factory', 'APEX-TOYS', 'FREEing', 'Native', 'MegaHouse', 'Figma', 'Hobby Japan', 'BANDAI SPIRITS', '海洋堂'],
    nendoroid: ['Good Smile Company'],
    figma: ['Max Factory', 'Good Smile Company'],
    model_kit: ['BANDAI SPIRITS', '寿屋', '万代', 'KOTOBUKIYA', '海洋堂'],
    goods: ['animate', 'Gamers', 'Sofmap', 'KIDDY LAND', 'bushiroad', 'MiHoYo', '官方商城', '上海BILIBILI'],
    plush: ['animate', 'KIDDY LAND', 'Sanrio', 'TAKARA TOMY', 'Skater'],
    apparel: ['UNIQLO UT', 'animate', 'PUMA', '优衣库', 'AAPE', 'GU'],
    theme_cafe: ['animate cafe', 'KIDDY LAND cafe', 'SWORD ART ONLINE CAFE', '官方主题咖啡', 'PRONTO', 'Tower Records Cafe'],
    theme_park: ['USJ', '东京迪士尼', 'LEGOLAND', 'HARRY POTTER STUDIO TOUR', 'Nintendo TOKYO'],
    exhibition: ['森美术馆', '国立科学博物馆', '上海博物馆', 'teamLab', '合作美术馆', '国立新美术馆'],
    collaboration: ['罗森', '7-11', '全家', '麦当劳', '肯德基', '必胜客', '可口可乐', '百事', '维他奶', '伊利', '蒙牛', '瑞幸', 'M Stand', '海底捞', '呷哺呷哺', '塔斯汀', 'DQ', '赛百味', '吉野家', '味千拉面', 'CoCo都可', '喜茶', '奈雪', '农夫山泉', '怡宝', '百事可乐'],
    pop_up: ['animate', 'KIDDY LAND', 'Hot Topic', 'MEDICOM TOY', '天猫超级品牌日', '得物', '泡泡玛特'],
    board_game: ['MegaHouse', 'AEG', 'CMON', '宝可梦公司', '角川', 'GAMERS'],
    card_game: ['Bushiroad', '宝可梦公司', 'KONAMI', 'BANDAI', 'Bushiroad', '万代卡牌'],
    novel_adapt: ['电击文库', '角川', 'GA文库', 'MF文库J'],
    pachinko: ['SANKYO', 'Sammy', '平和', '京乐', 'SANKYO', 'SEGA'],
    other: ['Various'],
  }
  const pool = creatorPool[type] || ['Various']
  const creator = pool[Math.floor(rng() * pool.length)]
  const tags = sample(rng, ip.themes, Math.min(2, ip.themes.length))
  const status: Status = (() => {
    if (year >= 2025) return rng() < 0.4 ? 'announced' : 'ongoing'
    if (type === 'anime_tv' || type === 'manga' || type === 'novel') return rng() < 0.3 ? 'ongoing' : 'released'
    if (type === 'theme_cafe' || type === 'pop_up' || type === 'collaboration') return 'released'
    if (type === 'live_drama' && year <= 2024) return rng() < 0.1 ? 'discontinued' : 'released'
    return 'released'
  })()

  // title builder
  const ch = pick(rng, ip.chars)
  const sub = ANIME_TV_SUBTITLES[Math.floor(rng() * ANIME_TV_SUBTITLES.length)]
  const yearTag = (year - ip.debut) > 0 ? `${year} 周年纪念` : `${year} 启程版`
  let title = ''
  switch (type) {
    case 'anime_tv':
      title = `${ip.name} ${sub}${Math.floor(rng() * 4) + 2}（${year}）`
      break
    case 'anime_movie':
      title = `${ip.name} 剧场版：${sub}（${year}）`
      break
    case 'ova':
      title = `${ip.name} OVA：${sub}（${year}）`
      break
    case 'live_movie':
      title = `${ip.name} 真人电影：${sub}（${year}）`
      break
    case 'live_drama':
      title = `${ip.name} 真人剧 ${sub} 季（${year}）`
      break
    case 'web_drama':
      title = `${ip.name} 网络短剧：${sub}（${year}）`
      break
    case 'manga':
      title = `${ip.name} 外传：${ch} ${sub}（${year}）`
      break
    case 'novel':
      title = `${ip.name} 小说：${sub}（${year}）`
      break
    case 'artbook':
      title = `${ip.name} 官方设定集 ${yearTag}`
      break
    case 'ost':
      title = `${ip.name} 原声集 Vol.${1 + Math.floor(rng() * 8)}（${year}）`
      break
    case 'character_song':
      title = `${ip.name} 角色歌：${ch} 篇（${year}）`
      break
    case 'music':
      title = `${ip.name} 主题音乐会 ${year}`
      break
    case 'stage_play':
      title = `舞台剧《${ip.name}：${sub}》${year}`
      break
    case 'musical':
      title = `音乐剧《${ip.name}：${sub}》${year}`
      break
    case 'radio':
      title = `${ip.name} 广播节目：${ch} 的 ${sub}`
      break
    case 'radio_cd':
      title = `${ip.name} 广播剧 CD Vol.${1 + Math.floor(rng() * 6)}`
      break
    case 'vtuber':
      title = `${ip.name} 官方虚拟主播 ${ch} ${year}`
      break
    case 'podcast':
      title = `${ip.name} 幕后播客 ${year}`
      break
    case 'figure':
      title = `${ch} 1/7 比例手办 ${year}`
      break
    case 'nendoroid':
      title = `${ch} 黏土人 ${year}`
      break
    case 'figma':
      title = `${ch} figma ${year}`
      break
    case 'model_kit':
      title = `${ip.name} ${ch} 1/100 拼装模型 ${year}`
      break
    case 'goods':
      title = `${ip.name} ${ch} 主题周边套装 ${year}`
      break
    case 'plush':
      title = `${ch} 毛绒玩偶（${ip.name}）${year}`
      break
    case 'apparel':
      title = `${ip.name} × 服饰联名 ${ch} 主题 T 恤 ${year}`
      break
    case 'theme_cafe':
      title = `${ip.name} 主题咖啡（${region === 'CN' ? '中国' : '日本'}站）${year}`
      break
    case 'theme_park':
      title = `${ip.name} 主题区域 / 巡展 ${year}`
      break
    case 'exhibition':
      title = `${ip.name} ${year} 主题展`
      break
    case 'collaboration':
      title = `${ip.name} × ${creator} 跨界联动 ${year}`
      break
    case 'pop_up':
      title = `${ip.name} 快闪店 ${region === 'CN' ? '上海' : '东京'}站 ${year}`
      break
    case 'board_game':
      title = `${ip.name} 桌游《${sub}》${year}`
      break
    case 'card_game':
      title = `${ip.name} 集换式卡牌补充包 Vol.${1 + Math.floor(rng() * 12)}（${year}）`
      break
    case 'novel_adapt':
      title = `${ip.name} 小说化《${sub}》${year}`
      break
    case 'pachinko':
      title = `${ip.name} 柏青哥 机台 ${year}`
      break
    default:
      title = `${ip.name} 其他衍生品 ${year}`
  }
  // summary
  const summary = `基于《${ip.name}》IP 的${TYPE_LABEL[type]}，由 ${creator} 制作或发行，${year} 年与粉丝见面。融合了原作世界观与 ${tags.join('、')} 元素。`

  return {
    id: newId(),
    title,
    ip: ip.name,
    ipKey: ip.key,
    type,
    year,
    region,
    creator,
    director: type.startsWith('anime') || type === 'live_movie' || type === 'live_drama'
      ? pick(rng, ['新海诚', '庵野秀明', '汤浅政明', '几原邦彦', '谷口悟朗', '原田孝宏', '黑田洋介', '岸本卓', '森田繁', '长井龙雪', '佐藤雅子', '石浜真史'])
      : undefined,
    cast: sample(rng, ip.chars, Math.min(3, ip.chars.length)),
    platform: type === 'anime_tv' || type === 'web_drama'
      ? pick(rng, ['TOKYO MX', 'NHK', 'TBS', 'MBS', 'AT-X', 'Netflix', 'Crunchyroll', 'Bilibili', 'Disney+', 'Amazon Prime', 'Hulu'])
      : type === 'card_game' || type === 'board_game' || type === 'figure'
        ? pick(rng, ['Amazon', 'animate', '官方商城', '淘宝', 'GAMERS', 'Hobby Search', 'Hot Toys', 'Sideshow'])
        : undefined,
    releaseDate: slugDate(year, m, d),
    status,
    rating,
    tags,
    summary,
    coverHue: (ip.hue + Math.floor(rng() * 60) - 30 + 360) % 360,
    popularity,
  }
}

// ---- combine curated + generated -------------------------------------------

const final: Derivative[] = []
// curated first
for (const c of CURATED) {
  const ip = IP_BY_KEY[c.ipKey]
  final.push({
    id: newId(),
    title: c.title,
    originalTitle: c.originalTitle,
    ip: c.ip,
    ipKey: c.ipKey,
    type: c.type,
    year: c.year,
    region: c.region,
    creator: c.creator,
    director: c.director,
    cast: c.cast,
    platform: c.platform,
    releaseDate: c.releaseDate,
    status: c.status,
    rating: c.rating,
    tags: c.tags ?? [],
    summary: c.summary ?? '',
    coverHue: ip?.hue ?? 200,
    popularity: 700 + Math.floor(Math.random() * 250),
  })
}

// Procedurally fill — target distribution roughly by IP debut
for (const ip of IPS) {
  // bigger IPs get more
  const baseTarget = 22 + Math.floor((ip.debut < 2000 ? 30 : 22) * (ip.region === 'JP' ? 1 : ip.region === 'CN' ? 0.9 : 0.8))
  const arr = genForIp(ip, baseTarget)
  final.push(...arr)
}

// Sort by popularity (desc) then year
final.sort((a, b) => b.popularity - a.popularity || b.year - a.year)

export const DERIVATIVES: Derivative[] = final

export const TYPES: DerivativeType[] = Object.keys(TYPE_LABEL) as DerivativeType[]
export const REGIONS: Region[] = ['JP', 'US', 'CN', 'KR', 'EU', 'Global']
export const STATUSES: Status[] = ['released', 'ongoing', 'announced', 'discontinued']
export { REGION_LABEL, STATUS_LABEL }

// Top-level stats
export const STATS = {
  totalDerivatives: final.length,
  totalIPs: IPS.length,
  typeCount: TYPES_BY_FREQ.length,
  years: Array.from(new Set(final.map(d => d.year))).sort((a, b) => a - b),
}
