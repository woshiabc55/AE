// 43+ 游戏元信息 + 已上线图鉴的游戏
// 每个游戏: id, name, en_name, publisher, category, tags, has_data, data_file, official

const GAMES_META = [
  // ========== MOBA / 竞技 ==========
  { id: 'hok',       name: '王者荣耀',         en_name: 'Honor of Kings',         publisher: '腾讯游戏',    category: 'moba',     tags: ['MOBA','5v5','竞技'], has_data: true,  data_file: 'hero_data.js',       official: 'https://pvp.qq.com/' },
  { id: 'lolpc',     name: '英雄联盟',         en_name: 'League of Legends',      publisher: 'Riot Games',  category: 'moba',     tags: ['MOBA','5v5','端游'], has_data: true,  data_file: 'lolpc_data.js',      official: 'https://lol.qq.com/' },
  { id: 'lolm',      name: '英雄联盟手游',     en_name: 'LoL: Wild Rift',         publisher: '腾讯/Riot',   category: 'moba',     tags: ['MOBA','手游','5v5'], has_data: true,  data_file: 'lolm_data.js',       official: 'https://lolm.qq.com/' },
  { id: 'dota2',     name: 'Dota 2',           en_name: 'Dota 2',                 publisher: 'Valve',       category: 'moba',     tags: ['MOBA','5v5','端游'], has_data: true,  data_file: 'dota2_data.js',      official: 'https://www.dota2.com/' },
  { id: 'naraka',    name: '永劫无间',         en_name: 'Naraka: Bladepoint',     publisher: '24 Entertainment', category: 'action', tags: ['冷兵器','吃鸡','武侠'], has_data: true,  data_file: 'naraka_data.js',     official: 'https://www.narakathegame.com/' },
  { id: 'valorant',  name: '无畏契约',         en_name: 'Valorant',               publisher: 'Riot Games',  category: 'fps',      tags: ['FPS','5v5','战术'],  has_data: true,  data_file: 'valorant_data.js',    official: 'https://val.qq.com/' },
  { id: 'hots',      name: '风暴英雄',         en_name: 'Heroes of the Storm',    publisher: 'Blizzard',    category: 'moba',     tags: ['MOBA','团队'],       has_data: true,  data_file: 'hots_data.js',        official: 'https://heroesofthestorm.com/' },

  // ========== RPG / 二次元 ==========
  { id: 'genshin',   name: '原神',             en_name: 'Genshin Impact',         publisher: 'miHoYo',      category: 'rpg',      tags: ['开放世界','RPG','元素'], has_data: true,  data_file: 'genshin_data.js',    official: 'https://ys.mihoyo.com/' },
  { id: 'starrail',  name: '崩坏：星穹铁道',   en_name: 'Honkai: Star Rail',      publisher: 'miHoYo',      category: 'rpg',      tags: ['回合制','RPG','科幻'], has_data: true,  data_file: 'starrail_data.js',  official: 'https://sr.mihoyo.com/' },
  { id: 'zzz',       name: '绝区零',           en_name: 'Zenless Zone Zero',      publisher: 'miHoYo',      category: 'rpg',      tags: ['ARPG','都市','动作'], has_data: true,  data_file: 'zzz_data.js',         official: 'https://zzz.mihoyo.com/' },
  { id: 'hi3',       name: '崩坏3',            en_name: 'Honkai Impact 3rd',      publisher: 'miHoYo',      category: 'rpg',      tags: ['ARPG','动作','二次元'], has_data: true,  data_file: 'hi3_data.js',         official: 'https://bh3.mihoyo.com/' },
  { id: 'arknights', name: '明日方舟',         en_name: 'Arknights',              publisher: '鹰角网络',    category: 'rpg',      tags: ['塔防','策略','二次元'], has_data: true,  data_file: 'arknights_data.js',  official: 'https://ak.hypergryph.com/' },
  { id: 'wuthering', name: '鸣潮',             en_name: 'Wuthering Waves',        publisher: '库洛游戏',    category: 'rpg',      tags: ['开放世界','ARPG','动作'], has_data: true,  data_file: 'wuthering_data.js',   official: 'https://wutheringwaves.kurogames.com/' },
  { id: 'snowbreak', name: '尘白禁区',         en_name: 'Snowbreak: Containment', publisher: '西山居',      category: 'rpg',      tags: ['射击','ARPG','二次元'], has_data: true,  data_file: 'snowbreak_data.js',   official: 'https://www.snowbreak.com/' },
  { id: 'gfl',       name: '少女前线',         en_name: 'Girls Frontline',        publisher: '散爆网络',    category: 'rpg',      tags: ['策略','卡牌','二次元'], has_data: true,  data_file: 'gfl_data.js',         official: 'https://gf-cn.sunborngame.com/' },
  { id: 'gfl2',      name: '少女前线2',        en_name: 'Girls Frontline 2',      publisher: '散爆网络',    category: 'rpg',      tags: ['策略','3D','二次元'], has_data: true,  data_file: 'gfl2_data.js',        official: 'https://gf2-cn.sunborngame.com/' },
  { id: 'azurlane',  name: '碧蓝航线',         en_name: 'Azur Lane',              publisher: '蛮啾游戏',    category: 'rpg',      tags: ['卡牌','养成','二次元'], has_data: true,  data_file: 'azurlane_data.js',    official: 'https://www.blhx.org/' },
  { id: 'ba',        name: '碧蓝档案',         en_name: 'Blue Archive',           publisher: 'Nexon',       category: 'rpg',      tags: ['RPG','二次元','日系'], has_data: true,  data_file: 'ba_data.js',          official: 'https://bluearchive.nexon.com/' },
  { id: 'fgo',       name: 'Fate/Grand Order', en_name: 'FGO',                    publisher: 'TYPE-MOON',   category: 'rpg',      tags: ['卡牌','剧情','日系'], has_data: true,  data_file: 'fgo_data.js',         official: 'https://www.fgo.jp/' },
  { id: 'onmyoji',   name: '阴阳师',           en_name: 'Onmyoji',                publisher: '网易',        category: 'rpg',      tags: ['卡牌','回合','和风'], has_data: true,  data_file: 'onmyoji_data.js',     official: 'https://yys.163.com/' },
  { id: 'towerfantasy', name:'幻塔',           en_name: 'Tower of Fantasy',       publisher: '完美世界',    category: 'rpg',      tags: ['开放世界','MMO','科幻'], has_data: true,  data_file: 'towerfantasy_data.js',official: 'https://www.toweroffantasy-global.com/' },
  { id: 'reverse1999', name:'重返未来：1999',   en_name: 'Reverse: 1999',          publisher: '蓝图网络',    category: 'rpg',      tags: ['卡牌','策略','剧情'], has_data: true,  data_file: 'reverse1999_data.js', official: 'https://re1999.bluepoch.com/' },
  { id: 'ptn',       name: '白荆回廊',         en_name: 'Path to Nowhere',        publisher: '烛龙',        category: 'rpg',      tags: ['策略','卡牌','二次元'], has_data: true,  data_file: 'ptn_data.js',         official: 'https://www.pathtonowhere.com/' },
  { id: 'mga',       name: '物华弥新',         en_name: 'Murasaki',               publisher: '心动网络',    category: 'rpg',      tags: ['策略','卡牌','国风'], has_data: true,  data_file: 'mga_data.js',         official: 'https://www.mga-game.com/' },
  { id: 'worldbeyond',name:'世界之外',         en_name: 'World Beyond',           publisher: '网易',        category: 'rpg',      tags: ['剧情','互动','悬疑'], has_data: true,  data_file: 'worldbeyond_data.js', official: 'https://wb.163.com/' },

  // ========== FPS / 射击 ==========
  { id: 'pubgm',     name: '和平精英',         en_name: 'Game for Peace',         publisher: '腾讯',        category: 'fps',      tags: ['吃鸡','射击','战术'], has_data: true,  data_file: 'pubgm_data.js',       official: 'https://gp.qq.com/' },
  { id: 'cf',        name: '穿越火线',         en_name: 'CrossFire',              publisher: 'Smilegate',   category: 'fps',      tags: ['FPS','射击','端游'], has_data: true,  data_file: 'cf_data.js',          official: 'https://cf.qq.com/' },
  { id: 'cfm',       name: '穿越火线：枪战王者', en_name: 'CrossFire Mobile',     publisher: '腾讯',        category: 'fps',      tags: ['FPS','射击','手游'], has_data: true,  data_file: 'cfm_data.js',         official: 'https://cfm.qq.com/' },
  { id: 'codm',      name: '使命召唤手游',     en_name: 'CoD Mobile',             publisher: '动视',        category: 'fps',      tags: ['FPS','射击','战术'], has_data: true,  data_file: 'codm_data.js',        official: 'https://www.callofduty.com/' },
  { id: 'arenabreakout', name:'暗区突围',     en_name: 'Arena Breakout',         publisher: '腾讯/Morefun', category: 'fps',      tags: ['生存','射击','硬核'], has_data: true,  data_file: 'arenabreakout_data.js', official: 'https://arenabreakout.com/' },
  { id: 'lostlight', name: '萤火突击',         en_name: 'Lost Light',             publisher: '腾讯/NExT',   category: 'fps',      tags: ['生存','射击'],       has_data: true,  data_file: 'lostlight_data.js',   official: 'https://www.lostlight.com/' },

  // ========== 生存 / 沙盒 / 恐怖 ==========
  { id: 'idv',       name: '第五人格',         en_name: 'Identity V',             publisher: '网易',        category: 'horror',   tags: ['非对称','恐怖','竞技'], has_data: true,  data_file: 'idv_data.js',         official: 'https://id5.163.com/' },
  { id: 'sky',       name: '光遇',             en_name: 'Sky: Children of the Light', publisher: 'thatgamecompany', category: 'adventure', tags: ['冒险','社交','治愈'], has_data: true,  data_file: 'sky_data.js',         official: 'https://www.thatskygame.com/' },
  { id: 'eggy',      name: '蛋仔派对',         en_name: 'Eggy Party',             publisher: '网易',        category: 'party',    tags: ['派对','休闲','竞技'], has_data: true,  data_file: 'eggy_data.js',        official: 'https://party.163.com/' },

  // ========== 卡牌 / 策略 ==========
  { id: 'tft',       name: '金铲铲之战',       en_name: 'Teamfight Tactics',      publisher: '腾讯/Riot',   category: 'strategy', tags: ['自走棋','策略','卡牌'], has_data: true,  data_file: 'tft_data.js',         official: 'https://tft.qq.com/' },
  { id: 'sgs',       name: '三国杀',           en_name: 'Sanguosha',              publisher: '游卡桌游',    category: 'card',     tags: ['桌游','卡牌','策略'], has_data: true,  data_file: 'sgs_data.js',         official: 'https://www.sanguosha.com/' },
  { id: 'naruto',    name: '火影忍者手游',     en_name: 'Naruto Mobile',          publisher: '腾讯/Masashi', category: 'fighting', tags: ['格斗','IP','动漫'],   has_data: true,  data_file: 'naruto_data.js',      official: 'https://naro.qq.com/' },
  { id: 'bl',        name: '影之刃',           en_name: 'Blade of God',           publisher: '灵游坊',      category: 'action',   tags: ['ARPG','国风','动作'], has_data: true,  data_file: 'bl_data.js',          official: 'https://www.b1game.com/' },

  // ========== MMO ==========
  { id: 'ty',        name: '天涯明月刀',       en_name: 'Moonlight Blade',        publisher: '腾讯北极光',  category: 'mmo',      tags: ['MMO','武侠','开放世界'], has_data: true,  data_file: 'ty_data.js',         official: 'https://wuxia.qq.com/' },
  { id: 'nsxj',      name: '逆水寒',           en_name: 'Justice Online',         publisher: '网易',        category: 'mmo',      tags: ['MMO','武侠','古风'],   has_data: true,  data_file: 'nsxj_data.js',        official: 'https://n.163.com/' },
  { id: 'jx3',       name: '剑网3',            en_name: 'JX3',                    publisher: '西山居',      category: 'mmo',      tags: ['MMO','武侠','古风'],   has_data: true,  data_file: 'jx3_data.js',         official: 'https://www.jx3.seasun.com/' },

  // ========== 竞速 / 休闲 ==========
  { id: 'qqspeed',   name: 'QQ飞车',           en_name: 'QQ Speed',               publisher: '腾讯',        category: 'racing',   tags: ['竞速','休闲','道具'], has_data: true,  data_file: 'qqspeed_data.js',     official: 'https://speed.qq.com/' },
  { id: 'dfjs',      name: '巅峰极速',         en_name: 'Racing Master',          publisher: '网易',        category: 'racing',   tags: ['竞速','写实','赛车'], has_data: true,  data_file: 'dfjs_data.js',        official: 'https://dfjs.163.com/' },
];

// 分类元信息
const CATEGORIES = {
  moba:     { name: 'MOBA / 竞技', icon: '⚔' },
  rpg:      { name: 'RPG / 二次元', icon: '✨' },
  fps:      { name: 'FPS / 射击',  icon: '🎯' },
  action:   { name: '动作',         icon: '🗡' },
  horror:   { name: '恐怖 / 解谜', icon: '👻' },
  adventure:{ name: '冒险 / 探索', icon: '🗺' },
  party:    { name: '派对 / 休闲', icon: '🎉' },
  strategy: { name: '策略 / 自走棋', icon: '♟' },
  card:     { name: '卡牌 / 桌游',  icon: '🃏' },
  fighting: { name: '格斗',         icon: '🥊' },
  mmo:      { name: 'MMO / 武侠',  icon: '🏯' },
  racing:   { name: '竞速',         icon: '🏎' },
};
