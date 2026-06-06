// 游戏 IP 衍生作品数据生成器
// 输出 data.js

const fs = require('fs');

// Mulberry32 deterministic PRNG
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = seed;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

const rng = mulberry32(20260608);
const ri = (min, max) => Math.floor(rng() * (max - min + 1)) + min;
const pick = (arr) => arr[Math.floor(rng() * arr.length)];

// 游戏 IP 池
const GAME_IPS = [
  { name: '宝可梦', company: 'The Pokémon Company / 任天堂 / Game Freak', region: '日本', popularity: 10, ip: '宝可梦' },
  { name: '超级马里奥', company: '任天堂 / 照明娱乐 / 环球', region: '日本', popularity: 10, ip: '超级马里奥' },
  { name: '塞尔达传说', company: '任天堂 / 小学馆', region: '日本', popularity: 10, ip: '塞尔达传说' },
  { name: '动物森友会', company: '任天堂', region: '日本', popularity: 9, ip: '动物森友会' },
  { name: '星之卡比', company: 'HAL Laboratory / 任天堂', region: '日本', popularity: 8, ip: '星之卡比' },
  { name: '火焰纹章', company: 'Intelligent Systems / 任天堂', region: '日本', popularity: 8, ip: '火焰纹章' },
  { name: '任天堂明星大乱斗', company: '任天堂 / Bandai Namco', region: '日本', popularity: 9, ip: '任天堂明星大乱斗' },
  { name: '异度神剑', company: 'Monolith Soft / 任天堂', region: '日本', popularity: 7, ip: '异度神剑' },
  { name: '喷射战士', company: '任天堂', region: '日本', popularity: 7, ip: '喷射战士' },
  { name: '马里奥赛车', company: '任天堂', region: '日本', popularity: 9, ip: '马里奥赛车' },
  { name: '银河战士', company: 'MercurySteam / 任天堂', region: '日本', popularity: 7, ip: '银河战士' },
  { name: '最后生还者', company: 'Naughty Dog / PlayStation Productions / HBO', region: '美国', popularity: 10, ip: '最后生还者' },
  { name: '神秘海域', company: 'Naughty Dog / PlayStation Productions / 索尼影业', region: '美国', popularity: 9, ip: '神秘海域' },
  { name: '战神', company: 'Santa Monica Studio / PlayStation Productions / 索尼', region: '美国', popularity: 10, ip: '战神' },
  { name: '对马岛之魂', company: 'Sucker Punch / PlayStation Productions / 索尼', region: '美国', popularity: 9, ip: '对马岛之魂' },
  { name: '漫威蜘蛛侠', company: 'Insomniac / PlayStation Productions / 索尼影业', region: '美国', popularity: 9, ip: '漫威蜘蛛侠' },
  { name: '瑞奇与叮当', company: 'Insomniac / 索尼', region: '美国', popularity: 7, ip: '瑞奇与叮当' },
  { name: '地平线', company: 'Guerrilla Games / 索尼', region: '荷兰', popularity: 8, ip: '地平线' },
  { name: '往日不再', company: 'Bend Studio / 索尼', region: '美国', popularity: 7, ip: '往日不再' },
  { name: '死亡回归', company: 'Housemarque / 索尼', region: '芬兰', popularity: 6, ip: '死亡回归' },
  { name: '血源诅咒', company: 'FromSoftware / 索尼', region: '日本', popularity: 9, ip: '血源诅咒' },
  { name: '恶魔之魂', company: 'FromSoftware / 索尼', region: '日本', popularity: 8, ip: '恶魔之魂' },
  { name: '光环', company: '343 Industries / Showtime / 微软', region: '美国', popularity: 9, ip: '光环' },
  { name: '极限竞速', company: 'Turn 10 / 微软', region: '美国', popularity: 8, ip: '极限竞速' },
  { name: '战争机器', company: 'The Coalition / 微软', region: '美国', popularity: 8, ip: '战争机器' },
  { name: '我的世界', company: 'Mojang / 微软 / 华纳兄弟', region: '瑞典', popularity: 10, ip: '我的世界' },
  { name: '帝国时代', company: 'Ensemble Studios / Xbox Game Studios', region: '美国', popularity: 8, ip: '帝国时代' },
  { name: '飞行模拟', company: 'Asobo Studio / Xbox Game Studios', region: '美国', popularity: 7, ip: '飞行模拟' },
  { name: '神鬼寓言', company: 'Lionhead / Playground Games / Xbox', region: '英国', popularity: 6, ip: '神鬼寓言' },
  { name: '街头霸王', company: 'Capcom / 集英社 / GSC', region: '日本', popularity: 9, ip: '街头霸王' },
  { name: '生化危机', company: 'Capcom / 索尼影业 / Constantin Film', region: '日本', popularity: 10, ip: '生化危机' },
  { name: '鬼泣', company: 'Capcom / 集英社 / 普罗米修斯', region: '日本', popularity: 9, ip: '鬼泣' },
  { name: '怪物猎人', company: 'Capcom / 东宝 / 集英社', region: '日本', popularity: 10, ip: '怪物猎人' },
  { name: '逆转裁判', company: 'Capcom / A-1 Pictures', region: '日本', popularity: 8, ip: '逆转裁判' },
  { name: '洛克人', company: 'Capcom / Xebec', region: '日本', popularity: 8, ip: '洛克人' },
  { name: '战国BASARA', company: 'Capcom / Production I.G', region: '日本', popularity: 6, ip: '战国BASARA' },
  { name: '丧尸围城', company: 'Capcom / Studio Hamburg', region: '日本', popularity: 6, ip: '丧尸围城' },
  { name: '拳皇', company: 'SNK / ABSTRACT / Production I.G', region: '日本', popularity: 8, ip: '拳皇' },
  { name: '饿狼传说', company: 'SNK / ABSTRACT', region: '日本', popularity: 7, ip: '饿狼传说' },
  { name: '合金弹头', company: 'SNK / Nazca Corporation', region: '日本', popularity: 8, ip: '合金弹头' },
  { name: '侍魂', company: 'SNK / ABSTRACT', region: '日本', popularity: 6, ip: '侍魂' },
  { name: '月华剑士', company: 'SNK', region: '日本', popularity: 5, ip: '月华剑士' },
  { name: '高达', company: '万代南梦宫 / 创通 / 创映 / 阳光', region: '日本', popularity: 9, ip: '高达' },
  { name: '海贼无双', company: '万代南梦宫 / Koei Tecmo', region: '日本', popularity: 7, ip: '海贼无双' },
  { name: '火影忍者', company: '万代南梦宫 / CyberConnect2 / Pierrot', region: '日本', popularity: 8, ip: '火影忍者' },
  { name: '龙珠', company: '万代南梦宫 / 东映动画', region: '日本', popularity: 9, ip: '龙珠' },
  { name: '数码宝贝', company: '万代南梦宫 / 东映动画', region: '日本', popularity: 8, ip: '数码宝贝' },
  { name: '假面骑士', company: '万代南梦宫 / 东映', region: '日本', popularity: 7, ip: '假面骑士' },
  { name: '超级机器人大战', company: '万代南梦宫 / B.B. Studio', region: '日本', popularity: 7, ip: '超级机器人大战' },
  { name: '传说系列', company: '万代南梦宫 / Nude Maker / ufotable', region: '日本', popularity: 8, ip: '传说系列' },
  { name: '噬神者', company: '万代南梦宫 / Shift / ufotable', region: '日本', popularity: 6, ip: '噬神者' },
  { name: '偶像大师', company: '万代南梦宫 / A-1 Pictures / Aniplex', region: '日本', popularity: 8, ip: '偶像大师' },
  { name: '铁拳', company: '万代南梦宫 / Project Soul', region: '日本', popularity: 8, ip: '铁拳' },
  { name: '灵魂能力', company: '万代南梦宫 / Project Soul', region: '日本', popularity: 7, ip: '灵魂能力' },
  { name: '传说对决', company: '腾讯天美 / Garena / 万代南梦宫', region: '全球', popularity: 7, ip: '传说对决' },
  { name: '吃豆人', company: '万代南梦宫 / 世嘉', region: '日本', popularity: 9, ip: '吃豆人' },
  { name: '最终幻想', company: 'Square Enix / 索尼影业 / 集英社', region: '日本', popularity: 10, ip: '最终幻想' },
  { name: '勇者斗恶龙', company: 'Square Enix / 集英社 / 东映', region: '日本', popularity: 9, ip: '勇者斗恶龙' },
  { name: '尼尔', company: 'Square Enix / Aniplex / A-1 Pictures', region: '日本', popularity: 8, ip: '尼尔' },
  { name: '王国之心', company: 'Square Enix / 迪士尼 / Studio Bones', region: '日本', popularity: 8, ip: '王国之心' },
  { name: '古墓丽影', company: 'Crystal Dynamics / Square Enix / 米高梅 / 派拉蒙', region: '英国', popularity: 9, ip: '古墓丽影' },
  { name: '杀出重围', company: 'Eidos Montreal / Square Enix / Marvel', region: '加拿大', popularity: 6, ip: '杀出重围' },
  { name: '正当防卫', company: 'Avalanche Studios / Square Enix', region: '瑞典', popularity: 6, ip: '正当防卫' },
  { name: '星之海洋', company: 'Square Enix / tri-Ace', region: '日本', popularity: 5, ip: '星之 ocean' },
  { name: '刺客信条', company: '育碧 / 20世纪福克斯 / 育碧影业', region: '法国', popularity: 10, ip: '刺客信条' },
  { name: '孤岛惊魂', company: '育碧 / Ubisoft Pictures', region: '法国', popularity: 8, ip: '孤岛惊魂' },
  { name: '看门狗', company: '育碧 / New Regency', region: '法国', popularity: 6, ip: '看门狗' },
  { name: '彩虹六号', company: '育碧 / Ubisoft Pictures', region: '法国', popularity: 8, ip: '彩虹六号' },
  { name: '全境封锁', company: 'Massive / 育碧', region: '瑞典', popularity: 7, ip: '全境封锁' },
  { name: '波斯王子', company: '育碧 / 迪士尼 / 派拉蒙', region: '法国', popularity: 7, ip: '波斯王子' },
  { name: '雷曼', company: '育碧 / 法国动画', region: '法国', popularity: 6, ip: '雷曼' },
  { name: '舞力全开', company: '育碧', region: '法国', popularity: 8, ip: '舞力全开' },
  { name: '细胞分裂', company: '育碧 / Ubisoft Pictures', region: '法国', popularity: 7, ip: '细胞分裂' },
  { name: '幽灵行动', company: '育碧 / Ubisoft Pictures', region: '法国', popularity: 7, ip: '幽灵行动' },
  { name: 'EA SPORTS FC', company: 'EA / EA Sports / 20世纪福克斯', region: '美国', popularity: 10, ip: 'EA SPORTS FC' },
  { name: '极品飞车', company: 'EA / Criterion / 梦工厂', region: '英国', popularity: 8, ip: '极品飞车' },
  { name: '战地', company: 'EA / DICE / 20世纪福克斯', region: '瑞典', popularity: 9, ip: '战地' },
  { name: '模拟人生', company: 'EA / Maxis / 20世纪福克斯', region: '美国', popularity: 9, ip: '模拟人生' },
  { name: '模拟城市', company: 'EA / Maxis', region: '美国', popularity: 7, ip: '模拟城市' },
  { name: '泰坦陨落', company: 'Respawn / EA / 20世纪福克斯', region: '美国', popularity: 6, ip: '泰坦陨落' },
  { name: 'Apex 英雄', company: 'Respawn / EA / 索尼', region: '美国', popularity: 9, ip: 'Apex 英雄' },
  { name: '死亡空间', company: 'EA / Motive / 20世纪福克斯', region: '美国', popularity: 7, ip: '死亡空间' },
  { name: '质量效应', company: 'BioWare / EA / 传奇影业', region: '加拿大', popularity: 8, ip: '质量效应' },
  { name: '龙腾世纪', company: 'BioWare / EA', region: '加拿大', popularity: 7, ip: '龙腾世纪' },
  { name: '星球大战', company: 'EA / 卢卡斯影业 / 迪士尼', region: '美国', popularity: 9, ip: '星球大战' },
  { name: '麦登橄榄球', company: 'EA / EA Tiburon', region: '美国', popularity: 7, ip: '麦登橄榄球' },
  { name: '命令与征服', company: 'EA / Westwood / 25×7', region: '美国', popularity: 7, ip: '命令与征服' },
  { name: '植物大战僵尸', company: 'PopCap / EA / 宝开', region: '美国', popularity: 8, ip: '植物大战僵尸' },
  { name: '双人成行', company: 'Hazelight / EA', region: '瑞典', popularity: 7, ip: '双人成行' },
  { name: '侠盗猎车手', company: 'Rockstar / Take-Two / 派拉蒙', region: '美国', popularity: 10, ip: '侠盗猎车手' },
  { name: '荒野大镖客', company: 'Rockstar / Take-Two', region: '美国', popularity: 9, ip: '荒野大镖客' },
  { name: 'NBA 2K', company: 'Visual Concepts / Take-Two', region: '美国', popularity: 7, ip: 'NBA 2K' },
  { name: '无主之地', company: 'Gearbox / Take-Two / 狮门', region: '美国', popularity: 7, ip: '无主之地' },
  { name: '文明', company: 'Firaxis / Take-Two / 2K', region: '美国', popularity: 9, ip: '文明' },
  { name: '生化奇兵', company: 'Irrational / Take-Two / 2K', region: '美国', popularity: 7, ip: '生化奇兵' },
  { name: '四海兄弟', company: 'Hangar 13 / Take-Two / 2K', region: '捷克', popularity: 6, ip: '四海兄弟' },
  { name: 'XCOM', company: 'Firaxis / Take-Two / 2K', region: '美国', popularity: 7, ip: 'XCOM' },
  { name: '黑暗之魂', company: 'FromSoftware / 万代南梦宫', region: '日本', popularity: 10, ip: '黑暗之魂' },
  { name: '艾尔登法环', company: 'FromSoftware / 万代南梦宫', region: '日本', popularity: 10, ip: '艾尔登法环' },
  { name: '只狼', company: 'FromSoftware / 动视', region: '日本', popularity: 9, ip: '只狼' },
  { name: '装甲核心', company: 'FromSoftware / 万代南梦宫', region: '日本', popularity: 6, ip: '装甲核心' },
  { name: '赛博朋克2077', company: 'CD Projekt / Trigger / Netflix', region: '波兰', popularity: 9, ip: '赛博朋克2077' },
  { name: '巫师', company: 'CD Projekt / Netflix / WB', region: '波兰', popularity: 10, ip: '巫师' },
  { name: '英雄联盟', company: 'Riot Games / 腾讯 / Fortiche', region: '美国', popularity: 10, ip: '英雄联盟' },
  { name: '无畏契约', company: 'Riot Games / 腾讯', region: '美国', popularity: 8, ip: '无畏契约' },
  { name: '云顶之弈', company: 'Riot Games / 腾讯', region: '美国', popularity: 8, ip: '云顶之弈' },
  { name: '符文之地', company: 'Riot Games / 腾讯', region: '美国', popularity: 6, ip: '符文之地' },
  { name: '英雄联盟手游', company: 'Riot Games / 腾讯', region: '美国', popularity: 7, ip: '英雄联盟手游' },
  { name: '反恐精英', company: 'Valve / Warner Bros', region: '美国', popularity: 10, ip: '反恐精英' },
  { name: 'DOTA', company: 'Valve / Netflix', region: '美国', popularity: 9, ip: 'DOTA' },
  { name: '半衰期', company: 'Valve', region: '美国', popularity: 9, ip: '半衰期' },
  { name: '传送门', company: 'Valve', region: '美国', popularity: 8, ip: '传送门' },
  { name: '求生之路', company: 'Valve', region: '美国', popularity: 8, ip: '求生之路' },
  { name: '军团要塞', company: 'Valve', region: '美国', popularity: 7, ip: '军团要塞' },
  { name: 'CS2', company: 'Valve', region: '美国', popularity: 10, ip: 'CS2' },
  { name: '魔兽世界', company: '暴雪 / 传奇影业 / 腾讯影业 / Netflix', region: '美国', popularity: 10, ip: '魔兽世界' },
  { name: '暗黑破坏神', company: '暴雪 / 微软', region: '美国', popularity: 10, ip: '暗黑破坏神' },
  { name: '星际争霸', company: '暴雪 / 微软 / Blizzard Cinema', region: '美国', popularity: 9, ip: '星际争霸' },
  { name: '守望先锋', company: '暴雪 / 微软 / 网易', region: '美国', popularity: 8, ip: '守望先锋' },
  { name: '炉石传说', company: '暴雪 / 网易 / 微软', region: '美国', popularity: 8, ip: '炉石传说' },
  { name: '风暴英雄', company: '暴雪 / 微软', region: '美国', popularity: 5, ip: '风暴英雄' },
  { name: '使命召唤', company: '动视 / 微软 / 派拉蒙', region: '美国', popularity: 10, ip: '使命召唤' },
  { name: '糖果传奇', company: 'King / 微软 / 动视暴雪', region: '瑞典', popularity: 9, ip: '糖果传奇' },
  { name: '原神', company: '米哈游 / 飞碟社 / Yostar / 哔哩哔哩', region: '中国', popularity: 10, ip: '原神' },
  { name: '崩坏3', company: '米哈游 / 飞碟社 / Aniplex', region: '中国', popularity: 9, ip: '崩坏3' },
  { name: '崩坏：星穹铁道', company: '米哈游 / 飞碟社 / Aniplex', region: '中国', popularity: 10, ip: '崩坏：星穹铁道' },
  { name: '绝区零', company: '米哈游 / MAPPA / Aniplex', region: '中国', popularity: 9, ip: '绝区零' },
  { name: '未定事件簿', company: '米哈游', region: '中国', popularity: 6, ip: '未定事件簿' },
  { name: '王者荣耀', company: '腾讯天美 / 企鹅影视 / 阅文', region: '中国', popularity: 10, ip: '王者荣耀' },
  { name: '和平精英', company: '腾讯光子', region: '中国', popularity: 9, ip: '和平精英' },
  { name: 'DNF / 地下城与勇士', company: 'Neople / 腾讯', region: '韩国', popularity: 10, ip: 'DNF' },
  { name: '穿越火线', company: 'SmileGate / 腾讯 / 派拉蒙', region: '韩国', popularity: 9, ip: '穿越火线' },
  { name: 'QQ飞车', company: '腾讯琳琅天上', region: '中国', popularity: 7, ip: 'QQ飞车' },
  { name: '天涯明月刀', company: '腾讯北极光', region: '中国', popularity: 6, ip: '天涯明月刀' },
  { name: '天涯明月刀手游', company: '腾讯北极光', region: '中国', popularity: 6, ip: '天涯明月刀手游' },
  { name: '逆水寒', company: '网易雷火', region: '中国', popularity: 7, ip: '逆水寒' },
  { name: 'PUBG', company: 'KRAFTON / 腾讯 / Aniplex', region: '韩国', popularity: 10, ip: 'PUBG' },
  { name: '部落冲突', company: 'Supercell / 腾讯', region: '芬兰', popularity: 9, ip: '部落冲突' },
  { name: '皇室战争', company: 'Supercell / 腾讯', region: '芬兰', popularity: 8, ip: '皇室战争' },
  { name: '荒野乱斗', company: 'Supercell / 腾讯', region: '芬兰', popularity: 8, ip: '荒野乱斗' },
  { name: '金铲铲之战', company: '拳头 / 腾讯', region: '中国', popularity: 7, ip: '金铲铲之战' },
  { name: '阴阳师', company: '网易 / 网易游戏 / Pierrot', region: '中国', popularity: 9, ip: '阴阳师' },
  { name: '梦幻西游', company: '网易', region: '中国', popularity: 8, ip: '梦幻西游' },
  { name: '大话西游', company: '网易', region: '中国', popularity: 6, ip: '大话西游' },
  { name: '第五人格', company: '网易 / Pierrot', region: '中国', popularity: 8, ip: '第五人格' },
  { name: '永劫无间', company: '24 Entertainment / 网易 / Aniplex', region: '中国', popularity: 7, ip: '永劫无间' },
  { name: '蛋仔派对', company: '网易', region: '中国', popularity: 8, ip: '蛋仔派对' },
  { name: '明日之后', company: '网易', region: '中国', popularity: 5, ip: '明日之后' },
  { name: '哈利波特：魔法觉醒', company: '网易 / WB Games / 哈利波特工作室', region: '中国', popularity: 7, ip: '哈利波特：魔法觉醒' },
  { name: '率土之滨', company: '网易', region: '中国', popularity: 6, ip: '率土之滨' },
  { name: '明日方舟', company: '鹰角网络 / Hypergryph / Yostar', region: '中国', popularity: 9, ip: '明日方舟' },
  { name: '鸣潮', company: '库洛游戏', region: '中国', popularity: 8, ip: '鸣潮' },
  { name: '战双帕弥什', company: '库洛游戏', region: '中国', popularity: 7, ip: '战双帕弥什' },
  { name: '闪耀暖暖', company: '叠纸游戏', region: '中国', popularity: 7, ip: '闪耀暖暖' },
  { name: '奇迹暖暖', company: '叠纸游戏', region: '中国', popularity: 6, ip: '奇迹暖暖' },
  { name: '恋与制作人', company: '叠纸游戏', region: '中国', popularity: 6, ip: '恋与制作人' },
  { name: '少女前线', company: '散爆网络 / MICA Team / Warner Bros', region: '中国', popularity: 7, ip: '少女前线' },
  { name: '少女前线2：追放', company: '散爆网络 / MICA Team', region: '中国', popularity: 7, ip: '少女前线2：追放' },
  { name: '碧蓝航线', company: '蛮啾游戏 / 哔哩哔哩 / Yostar', region: '中国', popularity: 8, ip: '碧蓝航线' },
  { name: '碧蓝档案', company: 'NEXON Games / Yostar / Bibury', region: '日本', popularity: 7, ip: '碧蓝档案' },
  { name: '尘白禁区', company: '西山居 / Amazing Seasun', region: '中国', popularity: 6, ip: '尘白禁区' },
  { name: '剑网3', company: '西山居 / Seasun', region: '中国', popularity: 8, ip: '剑网3' },
  { name: '剑侠情缘', company: '西山居', region: '中国', popularity: 6, ip: '剑侠情缘' },
  { name: '幻塔', company: '完美世界 / Hotta', region: '中国', popularity: 6, ip: '幻塔' },
  { name: '诛仙', company: '完美世界 / 爱奇艺', region: '中国', popularity: 6, ip: '诛仙' },
  { name: '完美世界', company: '完美世界 / 腾讯视频', region: '中国', popularity: 6, ip: '完美世界' },
  { name: '火炬之光：无限', company: '心动网络 / 完美世界', region: '中国', popularity: 6, ip: '火炬之光：无限' },
  { name: '仙境传说RO', company: 'Gravity / 心动网络', region: '韩国', popularity: 7, ip: '仙境传说RO' },
  { name: '不思议迷宫', company: '青瓷游戏', region: '中国', popularity: 5, ip: '不思议迷宫' },
  { name: '光与夜之恋', company: '腾讯北极光', region: '中国', popularity: 5, ip: '光与夜之恋' },
  { name: '恋与深空', company: '叠纸游戏', region: '中国', popularity: 8, ip: '恋与深空' },
  { name: '无期迷途', company: 'AISNO Games', region: '中国', popularity: 6, ip: '无期迷途' },
  { name: '深空之眼', company: '勇仕网络 / 字节跳动', region: '中国', popularity: 5, ip: '深空之眼' },
  { name: '重返未来：1999', company: '蓝洞网络', region: '中国', popularity: 7, ip: '重返未来：1999' },
  { name: '坎公骑冠剑', company: 'Kong Studios / 哔哩哔哩', region: '韩国', popularity: 6, ip: '坎公骑冠剑' },
  { name: '公主连结', company: 'Cygames / Aniplex / Bilibili', region: '日本', popularity: 7, ip: '公主连结' },
  { name: '赛马娘', company: 'Cygames / Aniplex / P.A. Works', region: '日本', popularity: 9, ip: '赛马娘' },
  { name: '碧蓝幻想', company: 'Cygames / A-1 Pictures / Aniplex', region: '日本', popularity: 8, ip: '碧蓝幻想' },
  { name: '影之诗', enName: 'Shadowverse', company: 'Cygames / Zexcs', region: '日本', popularity: 6, ip: '影之诗' },
  { name: '暗区突围', company: '腾讯魔方', region: '中国', popularity: 6, ip: '暗区突围' },
  { name: 'AFK 剑与远征', company: '莉莉丝', region: '中国', popularity: 7, ip: 'AFK 剑与远征' },
  { name: '万国觉醒', company: '莉莉丝', region: '中国', popularity: 7, ip: '万国觉醒' },
  { name: 'Dislyte 神觉者', company: '莉莉丝', region: '中国', popularity: 5, ip: 'Dislyte 神觉者' },
  { name: '黑神话：悟空', company: '游戏科学 / Game Science / 网易云音乐 / 哔哩哔哩', region: '中国', popularity: 10, ip: '黑神话：悟空' },
  { name: '光明记忆', company: 'FYQD-Studio / 飞燕群岛', region: '中国', popularity: 5, ip: '光明记忆' },
  { name: '仙剑奇侠传', company: '大宇资讯 / 上海软星 / 北京软星 / 企鹅影视 / 腾讯视频', region: '中国', popularity: 9, ip: '仙剑奇侠传' },
  { name: '古剑奇谭', company: '上海烛龙 / 网元圣唐 / 欢瑞 / 哔哩哔哩', region: '中国', popularity: 8, ip: '古剑奇谭' },
  { name: '轩辕剑', company: '大宇资讯 / DOMO Studio / 企鹅影视', region: '中国', popularity: 7, ip: '轩辕剑' },
  { name: '幻想三国志', company: '宇峻奥汀 / 凤凰游戏', region: '中国', popularity: 5, ip: '幻想三国志' },
  { name: '刀剑神域', company: '万代南梦宫 / 川原砾 / Aniplex / A-1 Pictures', region: '日本', popularity: 8, ip: '刀剑神域' },
  { name: 'Overlord', company: 'Kadokawa / 丸山くがね / Madhouse', region: '日本', popularity: 5, ip: 'Overlord' },
  { name: 'Re:Zero', company: 'SE / 长月达平 / White Fox', region: '日本', popularity: 6, ip: 'Re:Zero' },
  { name: '命运之夜', company: 'TYPE-MOON / Aniplex / ufotable / Studio DEEN', region: '日本', popularity: 9, ip: '命运之夜' },
  { name: '女神异闻录', company: 'Atlus / Aniplex / A-1 Pictures / CloverWorks', region: '日本', popularity: 9, ip: '女神异闻录' },
  { name: '真·女神转生', company: 'Atlus / SEGA', region: '日本', popularity: 7, ip: '真·女神转生' },
  { name: '如龙', company: '世嘉 / Like a Dragon / 东宝', region: '日本', popularity: 8, ip: '如龙' },
  { name: '索尼克', company: '世嘉 / Paramount / 派拉蒙', region: '日本', popularity: 8, ip: '索尼克' },
  { name: '寂静岭', company: 'Konami / 三池崇史', region: '日本', popularity: 7, ip: '寂静岭' },
  { name: '合金装备', company: 'Konami / 小岛工作室 / 索尼影业', region: '日本', popularity: 9, ip: '合金装备' },
  { name: '实况足球', company: 'Konami', region: '日本', popularity: 7, ip: '实况足球' },
  { name: '魂斗罗', company: 'Konami / 好莱坞', region: '日本', popularity: 7, ip: '魂斗罗' },
  { name: '恶魔城', company: 'Konami / Netflix / Powerhouse Animation', region: '日本', popularity: 7, ip: '恶魔城' },
  { name: '游戏王', company: 'Konami / Studio Gallop / 集英社 / ブリッジ', region: '日本', popularity: 8, ip: '游戏王' },
  { name: '爱相随', company: 'Konami / Konami Digital Entertainment', region: '日本', popularity: 5, ip: '爱相随' },
  { name: '潜龙谍影', company: 'Konami / 小岛工作室', region: '日本', popularity: 9, ip: '潜龙谍影' },
  { name: '茶杯头', company: 'Studio MDHR / Netflix / 黑马漫画', region: '加拿大', popularity: 8, ip: '茶杯头' },
  { name: '蔚蓝', company: 'Matt Makes Games / Extremely OK Games', region: '加拿大', popularity: 7, ip: '蔚蓝' },
  { name: '空洞骑士', company: 'Team Cherry / Fangamer', region: '澳大利亚', popularity: 8, ip: '空洞骑士' },
  { name: '丝之歌', company: 'Team Cherry / Fangamer', region: '澳大利亚', popularity: 8, ip: '丝之歌' },
  { name: '死亡细胞', company: 'Motion Twin / 哔哩哔哩', region: '法国', popularity: 7, ip: '死亡细胞' },
  { name: '哈迪斯', company: 'Supergiant Games / Fangamer', region: '美国', popularity: 8, ip: '哈迪斯' },
  { name: '哈迪斯2', company: 'Supergiant Games / Fangamer', region: '美国', popularity: 8, ip: '哈迪斯2' },
  { name: '极乐迪斯科', company: 'ZA/UM / C&C PP / 映欧卡那影业', region: '爱沙尼亚', popularity: 7, ip: '极乐迪斯科' },
  { name: '星际拓荒', company: 'Mobius Digital / Annapurna Interactive', region: '美国', popularity: 7, ip: '星际拓荒' },
  { name: '传说之下', company: 'Toby Fox / Fangamer', region: '美国', popularity: 8, ip: '传说之下' },
  { name: '雨世界', company: 'Videocult / Akupara Games', region: '美国', popularity: 5, ip: '雨世界' },
  { name: '潜水员戴夫', company: 'Mintrocket / 光荣', region: '韩国', popularity: 7, ip: '潜水员戴夫' },
  { name: '幻兽帕鲁', company: 'Pocketpair / 集英社', region: '日本', popularity: 9, ip: '幻兽帕鲁' },
  { name: '真三国无双', company: '光荣 / Koei Tecmo / 暗荣', region: '日本', popularity: 8, ip: '真三国无双' },
  { name: '三国志', company: '光荣 / Koei Tecmo', region: '日本', popularity: 7, ip: '三国志' },
  { name: '信长之野望', company: '光荣 / Koei Tecmo', region: '日本', popularity: 6, ip: '信长之野望' },
  { name: '太阁立志传', company: '光荣 / Koei Tecmo', region: '日本', popularity: 5, ip: '太阁立志传' },
  { name: '死或生', company: '光荣 / Team Ninja', region: '日本', popularity: 5, ip: '死或生' },
  { name: '忍者龙剑传', company: '光荣 / Team Ninja / 角川', region: '日本', popularity: 6, ip: '忍者龙剑传' },
  { name: '炼金术士', company: '光荣 / Gust', region: '日本', popularity: 6, ip: '炼金术士' },
  { name: '莱莎的炼金工房', company: '光荣 / Gust', region: '日本', popularity: 6, ip: '莱莎的炼金工房' },
  { name: '战锤', company: 'Games Workshop / Focus / 黑马漫画', region: '英国', popularity: 8, ip: '战锤' },
  { name: '全面战争', company: 'Creative Assembly / SEGA', region: '英国', popularity: 8, ip: '全面战争' },
  { name: '中土世界', company: 'Monolith / WB Games / New Line', region: '美国', popularity: 7, ip: '中土世界' },
  { name: '真人快打', company: 'NetherRealm / WB Games / New Line / 派拉蒙', region: '美国', popularity: 8, ip: '真人快打' },
  { name: '蝙蝠侠', company: 'Rocksteady / WB Games / DC / 漫改', region: '英国', popularity: 8, ip: '蝙蝠侠' },
  { name: '乐高', company: 'TT Games / WB Games / 华纳', region: '英国', popularity: 7, ip: '乐高' },
  { name: '霍格沃茨之遗', company: 'Avalanche / WB Games / HBO / 哈利波特工作室', region: '美国', popularity: 9, ip: '霍格沃茨之遗' },
  { name: '死亡搁浅', company: 'Kojima Productions / 索尼 / Aniplex', region: '日本', popularity: 7, ip: '死亡搁浅' },
  { name: '黑色沙漠', company: 'Pearl Abyss / Aniplex', region: '韩国', popularity: 7, ip: '黑色沙漠' },
  { name: '命运方舟', company: 'SmileGate / 亚马逊 / 网易', region: '韩国', popularity: 7, ip: '命运方舟' },
  { name: '冒险岛', company: 'Nexon / Madhouse / Aniplex', region: '韩国', popularity: 8, ip: '冒险岛' },
  { name: '冒险岛2', company: 'Nexon', region: '韩国', popularity: 5, ip: '冒险岛2' },
  { name: '地下城与勇士', company: 'Neople / SmileGate / 腾讯', region: '韩国', popularity: 10, ip: '地下城与勇士' },
  { name: '失落的方舟', company: 'SmileGate / 亚马逊', region: '韩国', popularity: 7, ip: '失落的方舟' },
  { name: '永恒之塔', company: 'NCSoft', region: '韩国', popularity: 5, ip: '永恒之塔' },
  { name: '剑灵', company: 'NCSoft / Netflix', region: '韩国', popularity: 6, ip: '剑灵' },
  { name: '天堂', company: 'NCSoft / Aniplex', region: '韩国', popularity: 7, ip: '天堂' },
  { name: '天堂2', company: 'NCSoft', region: '韩国', popularity: 6, ip: '天堂2' },
  { name: '洛奇', company: 'Nexon / devCAT', region: '韩国', popularity: 5, ip: '洛奇' },
  { name: 'DNF手游', company: 'Neople / 腾讯', region: '韩国', popularity: 9, ip: 'DNF手游' },
  { name: '王者荣耀世界', company: '腾讯天美', region: '中国', popularity: 9, ip: '王者荣耀世界' },
  { name: '代号：致金庸', company: '腾讯 / 搜狐畅游', region: '中国', popularity: 7, ip: '代号：致金庸' },
  { name: '代号：鸢', company: '灵犀互娱', region: '中国', popularity: 7, ip: '代号：鸢' },
  { name: '燕云十六声', company: '网易 / Everstone', region: '中国', popularity: 7, ip: '燕云十六声' },
  { name: '无限暖暖', company: '叠纸游戏', region: '中国', popularity: 8, ip: '无限暖暖' },
  { name: '命运2', company: 'Bungie / 索尼 / Activision', region: '美国', popularity: 8, ip: '命运2' },
  { name: '无人深空', company: 'Hello Games / Bandai Namco', region: '英国', popularity: 7, ip: '无人深空' },
  { name: '深海迷航', company: 'Unknown Worlds / Bandai Namco', region: '美国', popularity: 7, ip: '深海迷航' },
  { name: '英灵神殿', company: 'Iron Gate / Coffee Stain', region: '瑞典', popularity: 7, ip: '英灵神殿' },
  { name: 'Rust', company: 'Facepunch / Double Eleven', region: '英国', popularity: 7, ip: 'Rust' },
  { name: '方舟：生存进化', company: 'Studio Wildcard / Snail Games / Aniplex', region: '美国', popularity: 7, ip: '方舟：生存进化' },
  { name: '森林', company: 'Endnight Games', region: '加拿大', popularity: 6, ip: '森林' },
  { name: '森林之子', company: 'Endnight Games', region: '加拿大', popularity: 7, ip: '森林之子' },
  { name: '七日杀', company: 'The Fun Pimps / Telltale', region: '美国', popularity: 6, ip: '七日杀' },
  { name: '星露谷物语', company: 'ConcernedApe / Fangamer / 黑马', region: '美国', popularity: 8, ip: '星露谷物语' },
  { name: '戴森球计划', company: 'Youthcat', region: '中国', popularity: 8, ip: '戴森球计划' },
  { name: '异星工厂', company: 'Wube Software / Coffee Stain', region: '捷克', popularity: 8, ip: '异星工厂' },
  { name: '幸福工厂', company: 'Coffee Stain / 黑马', region: '瑞典', popularity: 7, ip: '幸福工厂' },
  { name: '缺氧', company: 'Klei / 微软', region: '加拿大', popularity: 7, ip: '缺氧' },
  { name: '饥荒', company: 'Klei / 微软 / 黑马', region: '加拿大', popularity: 7, ip: '饥荒' },
  { name: '绝地求生', company: 'KRAFTON / 腾讯 / Aniplex', region: '韩国', popularity: 10, ip: '绝地求生' },
  { name: '堡垒之夜', company: 'Epic Games / 黑马', region: '美国', popularity: 10, ip: '堡垒之夜' },
  { name: '糖豆人', company: 'Mediatonic / Epic Games', region: '英国', popularity: 7, ip: '糖豆人' },
  { name: '鹅鸭杀', company: 'Gaggle Studios', region: '美国', popularity: 7, ip: '鹅鸭杀' },
  { name: 'Among Us', company: 'InnerSloth / 黑马', region: '美国', popularity: 8, ip: 'Among Us' },
  { name: '黎明杀机', company: 'Behaviour / 漫改', region: '加拿大', popularity: 7, ip: '黎明杀机' },
  { name: '恐鬼症', company: 'Kinetic Games / 黑马', region: '英国', popularity: 7, ip: '恐鬼症' },
  { name: '失忆症', company: 'Frictional Games', region: '瑞典', popularity: 6, ip: '失忆症' },
  { name: '逃生', company: 'Red Barrels / 黑马', region: '加拿大', popularity: 6, ip: '逃生' },
  { name: '直到黎明', company: 'Supermassive / 索尼 / 派拉蒙', region: '英国', popularity: 6, ip: '直到黎明' },
  { name: '小小梦魇', company: 'Tarsier Studios / 万代', region: '瑞典', popularity: 7, ip: '小小梦魇' },
  { name: '咩咩启示录', company: 'Massive Monster / Devolver', region: '澳大利亚', popularity: 7, ip: '咩咩启示录' },
  { name: '咒术回战', company: '集英社 / MAPPA / Shueisha / 东宝', region: '日本', popularity: 9, ip: '咒术回战' },
  { name: '鬼灭之刃', company: '集英社 / ufotable / 东宝 / Aniplex / 索尼影业', region: '日本', popularity: 9, ip: '鬼灭之刃' },
  { name: '间谍过家家', company: '集英社 / WIT Studio / 东宝 / Aniplex', region: '日本', popularity: 8, ip: '间谍过家家' },
  { name: '链锯人', company: '集英社 / MAPPA / Aniplex', region: '日本', popularity: 7, ip: '链锯人' },
  { name: '孤独摇滚', company: '芳文社 / CloverWorks / Aniplex', region: '日本', popularity: 7, ip: '孤独摇滚' },
  { name: '蓝色监狱', company: '讲谈社 / Eight Bit / 集英社 / Aniplex', region: '日本', popularity: 6, ip: '蓝色监狱' },
  { name: '海贼王', company: '集英社 / 东映动画 / 富士 / Netflix', region: '日本', popularity: 9, ip: '海贼王' },
  { name: '火影忍者', company: '集英社 / Pierrot / 东京映画 / Aniplex', region: '日本', popularity: 8, ip: '火影忍者' },
  { name: '死神', company: '集英社 / Pierrot / Aniplex / 东京映画 / WB', region: '日本', popularity: 8, ip: '死神' },
  { name: '进击的巨人', company: '讲谈社 / WIT / MAPPA / 集英社', region: '日本', popularity: 8, ip: '进击的巨人' },
  { name: '名侦探柯南', company: '小学馆 / TMS / Yomiuri Telecasting Corporation / 东宝', region: '日本', popularity: 8, ip: '名侦探柯南' },
  { name: '灌篮高手', company: '集英社 / 东映动画 / 东宝', region: '日本', popularity: 8, ip: '灌篮高手' },
  { name: '龙珠', company: '集英社 / 东映动画 / 富士 / Toei / 集英社', region: '日本', popularity: 9, ip: '龙珠' },
  { name: '数码宝贝', company: '万代 / 东映动画 / 集英社', region: '日本', popularity: 8, ip: '数码宝贝' },
  { name: '圣斗士星矢', company: '集英社 / 东映动画 / 集英社', region: '日本', popularity: 7, ip: '圣斗士星矢' },
  { name: '奥特曼', company: '圆谷制作 / 万代 / 集英社', region: '日本', popularity: 8, ip: '奥特曼' },
  { name: '新世纪福音战士', company: 'GAINAX / Khara / 庵野秀明 / 集英社 / 角川', region: '日本', popularity: 8, ip: '新世纪福音战士' },
  { name: '钢之炼金术师', company: 'GAGA / Bones / 集英社 / Aniplex', region: '日本', popularity: 8, ip: '钢之炼金术师' },
  { name: '变形金刚', company: 'TAKARA TOMY / 孩之宝 / 派拉蒙 / Netflix', region: '美国', popularity: 8, ip: '变形金刚' },
];

// 衍生作品类型池
const DERIVATIVE_TYPES = [
  { type: 'TV 动画', popularity: 9, weight: 1.0 },
  { type: '动画电影', popularity: 8, weight: 0.8 },
  { type: 'OVA', popularity: 5, weight: 0.4 },
  { type: '剧场版', popularity: 7, weight: 0.6 },
  { type: '动画短片', popularity: 6, weight: 0.5 },
  { type: '网络动画', popularity: 6, weight: 0.5 },
  { type: '真人电影', popularity: 7, weight: 0.6 },
  { type: '真人剧集', popularity: 8, weight: 0.7 },
  { type: '网络剧', popularity: 6, weight: 0.4 },
  { type: '纪录片', popularity: 5, weight: 0.3 },
  { type: '官方漫画', popularity: 7, weight: 0.7 },
  { type: '公式书', popularity: 6, weight: 0.5 },
  { type: '设定集', popularity: 6, weight: 0.5 },
  { type: '攻略本', popularity: 5, weight: 0.4 },
  { type: '画集', popularity: 5, weight: 0.4 },
  { type: '前传小说', popularity: 6, weight: 0.5 },
  { type: '外传小说', popularity: 6, weight: 0.6 },
  { type: '轻小说', popularity: 7, weight: 0.6 },
  { type: '续作小说', popularity: 5, weight: 0.3 },
  { type: '广播剧', popularity: 5, weight: 0.4 },
  { type: '舞台剧', popularity: 6, weight: 0.5 },
  { type: '音乐剧', popularity: 6, weight: 0.4 },
  { type: '朗读剧', popularity: 4, weight: 0.3 },
  { type: '主题乐园', popularity: 7, weight: 0.3 },
  { type: '主题餐厅', popularity: 5, weight: 0.3 },
  { type: '主题咖啡厅', popularity: 6, weight: 0.5 },
  { type: '主题快闪店', popularity: 5, weight: 0.5 },
  { type: '主题展览', popularity: 6, weight: 0.5 },
  { type: '手办', popularity: 8, weight: 1.0 },
  { type: '景品手办', popularity: 5, weight: 0.4 },
  { type: '盲盒', popularity: 6, weight: 0.6 },
  { type: '集换式卡牌', popularity: 7, weight: 0.5 },
  { type: '黏土人', popularity: 6, weight: 0.6 },
  { type: 'figma', popularity: 5, weight: 0.4 },
  { type: '拼装模型', popularity: 6, weight: 0.5 },
  { type: '毛绒玩偶', popularity: 5, weight: 0.4 },
  { type: '联动咖啡', popularity: 6, weight: 0.5 },
  { type: '联名饮料', popularity: 5, weight: 0.4 },
  { type: '联名食品', popularity: 5, weight: 0.4 },
  { type: '联名服饰', popularity: 5, weight: 0.4 },
  { type: '联名美妆', popularity: 4, weight: 0.3 },
  { type: '联名酒店', popularity: 4, weight: 0.2 },
  { type: '联名交通', popularity: 4, weight: 0.3 },
  { type: '联动活动', popularity: 6, weight: 0.6 },
  { type: '跨界合作', popularity: 6, weight: 0.5 },
  { type: '声优见面会', popularity: 4, weight: 0.3 },
  { type: '粉丝见面会', popularity: 4, weight: 0.3 },
  { type: '演唱会', popularity: 6, weight: 0.4 },
  { type: 'OST 原声大碟', popularity: 7, weight: 0.7 },
  { type: '印象曲', popularity: 5, weight: 0.4 },
  { type: '角色歌', popularity: 5, weight: 0.4 },
  { type: '交响乐', popularity: 4, weight: 0.3 },
  { type: '虚拟偶像', popularity: 7, weight: 0.4 },
  { type: '虚拟主播', popularity: 6, weight: 0.4 },
  { type: '主题邮轮', popularity: 3, weight: 0.2 },
  { type: '续作游戏', popularity: 9, weight: 0.5 },
  { type: '前传游戏', popularity: 7, weight: 0.3 },
  { type: '外传游戏', popularity: 7, weight: 0.5 },
  { type: '重制版', popularity: 8, weight: 0.3 },
  { type: '重置版', popularity: 7, weight: 0.3 },
  { type: 'DLC 资料片', popularity: 7, weight: 0.5 },
  { type: '衍生手游', popularity: 8, weight: 0.7 },
  { type: '衍生端游', popularity: 6, weight: 0.3 },
  { type: '衍生页游', popularity: 4, weight: 0.2 },
  { type: '跨媒体企划', popularity: 7, weight: 0.3 },
  { type: '官方同人志', popularity: 4, weight: 0.2 },
];

// 状态池与权重
const STATUS = {
  'TV 动画': [['已完结', 0.4], ['连载中', 0.2], ['制作中', 0.2], ['计划中', 0.2]],
  '动画电影': [['已发行', 0.6], ['制作中', 0.2], ['计划中', 0.2]],
  'OVA': [['已发行', 0.7], ['已完结', 0.2], ['限定', 0.1]],
  '剧场版': [['已发行', 0.6], ['计划中', 0.2], ['制作中', 0.2]],
  '动画短片': [['已发行', 0.7], ['限定', 0.2], ['已完结', 0.1]],
  '网络动画': [['连载中', 0.3], ['已完结', 0.3], ['已发行', 0.2], ['制作中', 0.1], ['计划中', 0.1]],
  '真人电影': [['已发行', 0.6], ['制作中', 0.2], ['计划中', 0.2]],
  '真人剧集': [['已完结', 0.3], ['连载中', 0.3], ['制作中', 0.2], ['计划中', 0.2]],
  '网络剧': [['已发行', 0.4], ['连载中', 0.3], ['已完结', 0.3]],
  '纪录片': [['已发行', 0.7], ['制作中', 0.2], ['计划中', 0.1]],
  '官方漫画': [['连载中', 0.3], ['已完结', 0.4], ['制作中', 0.1], ['计划中', 0.1], ['已发行', 0.1]],
  '公式书': [['已发行', 0.85], ['限定', 0.1], ['制作中', 0.05]],
  '设定集': [['已发行', 0.85], ['限定', 0.1], ['制作中', 0.05]],
  '攻略本': [['已发行', 0.85], ['已下架', 0.1], ['制作中', 0.05]],
  '画集': [['已发行', 0.8], ['限定', 0.15], ['制作中', 0.05]],
  '前传小说': [['已完结', 0.4], ['连载中', 0.2], ['已发行', 0.2], ['制作中', 0.1], ['计划中', 0.1]],
  '外传小说': [['已完结', 0.4], ['连载中', 0.25], ['已发行', 0.2], ['制作中', 0.1], ['计划中', 0.05]],
  '轻小说': [['连载中', 0.3], ['已完结', 0.4], ['已发行', 0.2], ['制作中', 0.05], ['计划中', 0.05]],
  '续作小说': [['已完结', 0.4], ['连载中', 0.2], ['已发行', 0.2], ['制作中', 0.1], ['计划中', 0.1]],
  '广播剧': [['已发行', 0.7], ['限定', 0.2], ['已下架', 0.1]],
  '舞台剧': [['已完结', 0.3], ['已发行', 0.3], ['制作中', 0.2], ['计划中', 0.1], ['限定', 0.1]],
  '音乐剧': [['已发行', 0.4], ['已完结', 0.2], ['制作中', 0.2], ['计划中', 0.1], ['限定', 0.1]],
  '朗读剧': [['已发行', 0.6], ['限定', 0.3], ['已下架', 0.1]],
  '主题乐园': [['已发行', 0.7], ['计划中', 0.15], ['制作中', 0.15]],
  '主题餐厅': [['已发行', 0.4], ['已下架', 0.4], ['限定', 0.2]],
  '主题咖啡厅': [['已发行', 0.4], ['已下架', 0.3], ['限定', 0.2], ['制作中', 0.1]],
  '主题快闪店': [['已下架', 0.5], ['限定', 0.4], ['已发行', 0.1]],
  '主题展览': [['已完结', 0.4], ['已发行', 0.3], ['计划中', 0.15], ['制作中', 0.15]],
  '手办': [['已发行', 0.75], ['限定', 0.2], ['制作中', 0.05]],
  '景品手办': [['已发行', 0.75], ['限定', 0.2], ['已下架', 0.05]],
  '盲盒': [['已发行', 0.6], ['限定', 0.25], ['已下架', 0.1], ['制作中', 0.05]],
  '集换式卡牌': [['已发行', 0.7], ['已下架', 0.1], ['限定', 0.15], ['制作中', 0.05]],
  '黏土人': [['已发行', 0.8], ['限定', 0.15], ['制作中', 0.05]],
  'figma': [['已发行', 0.8], ['限定', 0.15], ['制作中', 0.05]],
  '拼装模型': [['已发行', 0.75], ['限定', 0.2], ['制作中', 0.05]],
  '毛绒玩偶': [['已发行', 0.75], ['限定', 0.2], ['已下架', 0.05]],
  '联动咖啡': [['已完结', 0.3], ['已发行', 0.3], ['限定', 0.3], ['已下架', 0.1]],
  '联名饮料': [['已下架', 0.4], ['限定', 0.4], ['已发行', 0.2]],
  '联名食品': [['已下架', 0.4], ['限定', 0.4], ['已发行', 0.2]],
  '联名服饰': [['已发行', 0.6], ['限定', 0.3], ['已下架', 0.1]],
  '联名美妆': [['已发行', 0.5], ['限定', 0.4], ['已下架', 0.1]],
  '联名酒店': [['已完结', 0.4], ['限定', 0.4], ['已发行', 0.2]],
  '联名交通': [['已完结', 0.45], ['限定', 0.45], ['已发行', 0.1]],
  '联动活动': [['已完结', 0.5], ['限定', 0.3], ['已发行', 0.2]],
  '跨界合作': [['已完结', 0.4], ['已发行', 0.3], ['限定', 0.2], ['计划中', 0.1]],
  '声优见面会': [['已完结', 0.7], ['限定', 0.2], ['计划中', 0.1]],
  '粉丝见面会': [['已完结', 0.7], ['限定', 0.2], ['计划中', 0.1]],
  '演唱会': [['已完结', 0.6], ['限定', 0.2], ['已发行', 0.1], ['计划中', 0.1]],
  'OST 原声大碟': [['已发行', 0.85], ['限定', 0.1], ['已下架', 0.05]],
  '印象曲': [['已发行', 0.8], ['限定', 0.15], ['已下架', 0.05]],
  '角色歌': [['已发行', 0.8], ['限定', 0.15], ['已下架', 0.05]],
  '交响乐': [['已发行', 0.5], ['已完结', 0.3], ['限定', 0.15], ['计划中', 0.05]],
  '虚拟偶像': [['已发行', 0.4], ['制作中', 0.2], ['计划中', 0.2], ['连载中', 0.2]],
  '虚拟主播': [['已发行', 0.4], ['制作中', 0.2], ['计划中', 0.2], ['连载中', 0.2]],
  '主题邮轮': [['限定', 0.5], ['已完结', 0.3], ['已发行', 0.2]],
  '续作游戏': [['已发行', 0.7], ['制作中', 0.15], ['计划中', 0.1], ['重制中', 0.05]],
  '前传游戏': [['已发行', 0.6], ['制作中', 0.2], ['计划中', 0.15], ['重制中', 0.05]],
  '外传游戏': [['已发行', 0.6], ['制作中', 0.2], ['计划中', 0.15], ['重制中', 0.05]],
  '重制版': [['已发行', 0.55], ['制作中', 0.25], ['计划中', 0.15], ['重制中', 0.05]],
  '重置版': [['已发行', 0.6], ['制作中', 0.2], ['计划中', 0.15], ['重制中', 0.05]],
  'DLC 资料片': [['已发行', 0.75], ['制作中', 0.15], ['计划中', 0.1]],
  '衍生手游': [['已发行', 0.65], ['制作中', 0.2], ['已下架', 0.1], ['计划中', 0.05]],
  '衍生端游': [['已发行', 0.6], ['制作中', 0.25], ['计划中', 0.15]],
  '衍生页游': [['已下架', 0.5], ['已发行', 0.3], ['计划中', 0.2]],
  '跨媒体企划': [['已发行', 0.4], ['制作中', 0.2], ['连载中', 0.2], ['计划中', 0.15], ['已完结', 0.05]],
  '官方同人志': [['已发行', 0.55], ['限定', 0.35], ['已下架', 0.1]],
};

function pickStatus(type) {
  const pool = STATUS[type] || [['已发行', 0.5], ['已完结', 0.3], ['计划中', 0.2]];
  const r = rng();
  let acc = 0;
  for (const [s, w] of pool) {
    acc += w;
    if (r < acc) return s;
  }
  return pool[0][0];
}

// 名称模板
function makeName(type, ip) {
  const t = (ip.name || '').replace(/\s/g, '');
  const templates = {
    'TV 动画': [`${t}`, `${t} 动画版`, `${t} 旅途篇`, `${t} The Animation`, `${t} 异闻录`, `${t} 物语系列`, `欢迎来到 ${t} 宇宙`, `${t} 群英传`],
    '动画电影': [`${t} 电影版`, `${t}：破晓之战`, `${t} The Movie`, `${t} 剧场版`, `${t}：最后的冒险`, `${t} 完整版`],
    'OVA': [`${t} OVA`, `${t}：番外篇`, `${t} 特典动画`],
    '剧场版': [`${t} 剧场版`, `${t}：终章`, `${t} 全新剧场版`],
    '动画短片': [`${t} 短篇`, `${t} Cinematic`, `${t} 短动画集`],
    '网络动画': [`${t} Web版`, `${t} 网络动画`, `${t} 番外 Web`],
    '真人电影': [`${t} 真人版`, `${t} 电影`, `${t} Live Action`, `${t} 真人剧场版`],
    '真人剧集': [`${t} 真人剧`, `${t} The Series`, `${t} 连续剧`, `${t} 真人改编剧集`],
    '网络剧': [`${t} 网络剧`, `${t} Web剧`],
    '纪录片': [`${t} 制作纪录片`, `${t} 幕后之旅`, `${t} 创世纪`],
    '官方漫画': [`${t} 官方漫画`, `${t} 衍生漫画`, `${t} The Manga`, `${t} 异闻录`],
    '公式书': [`${t} 官方完全攻略`, `${t} 公式设定集`],
    '设定集': [`${t} 美术设定集`, `${t} Concept Art`],
    '攻略本': [`${t} 完全攻略本`, `${t} 官方攻略指南`],
    '画集': [`${t} 画集`, `${t} Art Collection`],
    '前传小说': [`${t} 前传`, `${t}：黎明之前`, `${t} Genesis`],
    '外传小说': [`${t} 外传`, `${t}：异端之书`, `${t} Side Story`],
    '轻小说': [`${t} 轻小说`, `${t} Another Story`, `${t} 校园篇`],
    '续作小说': [`${t} 续章`, `${t} 第二纪`],
    '广播剧': [`${t} Drama CD`, `${t} 广播剧`],
    '舞台剧': [`${t} 舞台剧`, `${t} Stage Play`, `${t} 2.5 次元音乐剧`],
    '音乐剧': [`${t} 音乐剧`, `${t} The Musical`],
    '朗读剧': [`${t} 朗读剧`, `${t} 声之宴`],
    '主题乐园': [`${t} 主题乐园`, `${t} Wonder Land`, `${t} Theme Park`],
    '主题餐厅': [`${t} 主题餐厅`, `${t} Cafe & Dine`],
    '主题咖啡厅': [`${t} 主题咖啡厅`, `${t} Collab Cafe`],
    '主题快闪店': [`${t} 限时快闪店`, `${t} Pop-up Store`],
    '主题展览': [`${t} 主题展`, `${t} Anniversary Exhibition`, `${t} 沉浸式展览`],
    '手办': [`${t} 主角 1/7 手办`, `${t} 周年庆典手办`, `${t} 角色雕像`],
    '景品手办': [`${t} 景品手办`, `${t} 一番赏 手办`],
    '盲盒': [`${t} 盲盒系列`, `${t} 扭蛋`, `${t} 迷你盲盒`],
    '集换式卡牌': [`${t} TCG`, `${t} 集换式卡牌`],
    '黏土人': [`${t} 黏土人`],
    'figma': [`${t} figma`],
    '拼装模型': [`${t} 拼装模型`, `${t} MG 模型`, `${t} RG 模型`],
    '毛绒玩偶': [`${t} 毛绒玩偶`, `${t} 角色绒毛`],
    '联动咖啡': [`${t} x 咖啡 联动`],
    '联名饮料': [`${t} 联名饮料`],
    '联名食品': [`${t} 联名零食`, `${t} 联名甜点`],
    '联名服饰': [`${t} x 服装品牌 联名`, `${t} 联名 T 恤系列`],
    '联名美妆': [`${t} 联名彩妆`],
    '联名酒店': [`${t} 主题酒店`, `${t} 联名客房`],
    '联名交通': [`${t} 联名地铁`, `${t} 主题列车`],
    '联动活动': [`${t} 联动活动`, `${t} 跨界合作活动`],
    '跨界合作': [`${t} x 异业品牌 跨界`],
    '声优见面会': [`${t} 声优见面会`],
    '粉丝见面会': [`${t} Fan Meeting`],
    '演唱会': [`${t} 主题演唱会`, `${t} Live Concert`],
    'OST 原声大碟': [`${t} OST Vol.${ri(1, 4)}`, `${t} Original Soundtrack`, `${t} 完整原声带`],
    '印象曲': [`${t} 印象曲`],
    '角色歌': [`${t} 角色歌专辑`],
    '交响乐': [`${t} 交响音乐会`, `${t} Orchestral Concert`],
    '虚拟偶像': [`${t} 虚拟偶像`, `${t} AI 偶像`],
    '虚拟主播': [`${t} VTuber`],
    '主题邮轮': [`${t} 主题邮轮`],
    '续作游戏': [`${t} 2`, `${t} 续作`, `${t} The Sequel`, `${t} 全新篇章`],
    '前传游戏': [`${t}：起源`, `${t} 前传`, `${t} Zero`],
    '外传游戏': [`${t} Spin-off`, `${t} 外传`, `${t} Another`],
    '重制版': [`${t} Remake`, `${t} 重制版`],
    '重置版': [`${t} Remastered`, `${t} 高清重置`],
    'DLC 资料片': [`${t} DLC：深渊之章`, `${t} DLC：觉醒`, `${t} DLC：新世界`, `${t} 资料片 I`, `${t} 资料片 II`],
    '衍生手游': [`${t} 手游版`, `${t} Mobile`, `${t}：口袋版`],
    '衍生端游': [`${t} Online`, `${t} 客户端版`],
    '衍生页游': [`${t} Web版`, `${t} 页游`],
    '跨媒体企划': [`${t} 跨媒体企划`, `${t} Project Universe`],
    '官方同人志': [`${t} 官方同人志`],
  };
  const list = templates[type] || [`${t} 衍生作品`];
  return list[Math.floor(rng() * list.length)];
}

function makeDescription(type, ip, year) {
  const t = ip.name;
  const descs = {
    'TV 动画': [
      `讲述 ${t} 宇宙中主要角色群像的冒险群像剧，${year} 年首播。`,
      `聚焦 ${t} 主角群的青春日常与战斗，是世界观扩展的核心内容。`,
      `从 ${t} 衍生而来的全新长篇 TV 动画，剧情独立但与游戏主线呼应。`,
      `${t} 系列的官方动画化企划，完整再现游戏中的经典场景与角色。`,
    ],
    '动画电影': [
      `总投资过亿美元的 ${t} 动画电影巨制，全球同步上映。`,
      `集结顶级声优与制作团队打造的 ${t} 动画剧场版。`,
      `为 ${t} 粉丝与全年龄段观众精心打造的奇幻冒险长片。`,
    ],
    '剧场版': [
      `${t} 系列的最新剧场版动画，IMAX/杜比视界同步上映。`,
      `延续 ${t} 经典设定，讲述一段全新剧场版篇章。`,
    ],
    '真人电影': [
      `好莱坞 A 级制作的 ${t} 真人电影，豪华阵容出演。`,
      `将 ${t} 经典故事搬上银幕的真人化改编电影。`,
    ],
    '真人剧集': [
      `${t} 改编的高品质真人剧集，多季连载中。`,
      `顶级流媒体平台播出的 ${t} 真人连续剧。`,
    ],
    '官方漫画': [
      `连载于主流漫画杂志的 ${t} 官方漫画作品。`,
      `由漫画名家绘制的 ${t} 衍生漫画系列。`,
    ],
    '公式书': [
      `收录 ${t} 全系列角色、武器、设定的官方权威公式书。`,
      `${t} 系列十周年纪念公式书，限定版含丰富赠品。`,
    ],
    '设定集': [
      `由原画师团队精心整理的 ${t} 美术设定集。`,
      `${t} 历代主要场景与角色的完整概念设定资料。`,
    ],
    '轻小说': [
      `由知名轻小说作家执笔的 ${t} 外传轻小说系列。`,
      `以 ${t} 中的人气角色群为主角的衍生轻小说。`,
    ],
    '前传小说': [
      `讲述 ${t} 主线故事发生之前的关键篇章。`,
      `${t} 时间线最早期事件的官方前传小说。`,
    ],
    '外传小说': [
      `从配角视角展开的 ${t} 衍生外传长篇小说。`,
      `${t} 世界观下全新原创角色的冒险篇章。`,
    ],
    '舞台剧': [
      `2.5 次元舞台剧改编的人气 IP，由当红演员出演。`,
      `${t} 系列首部官方舞台剧，巡演场次已突破 100 场。`,
    ],
    '音乐剧': [
      `${t} 改编的中文/日文音乐剧，集合顶级歌手阵容。`,
      `现场演奏的 ${t} 原创音乐剧，巡演多国。`,
    ],
    '主题乐园': [
      `占地超 10 万平方米的 ${t} 主题乐园，融合游乐设施、表演、餐饮。`,
      `位于日本/中国/美国的 ${t} 大型主题乐园，5 大主题区。`,
    ],
    '主题咖啡厅': [
      `限时半年开业的 ${t} 主题咖啡厅，提供独家菜单与限定周边。`,
      `位于秋叶原/原宿/上海的 ${t} 主题咖啡厅，预约制入场。`,
    ],
    '主题展览': [
      `为期 3 个月的 ${t} 主题展览，展出大量原画、模型与互动装置。`,
      `${t} 周年纪念主题展览，巡展至多个城市。`,
    ],
    '手办': [
      `原型师精心打造的 ${t} 角色 1/7 比例手办，附带豪华底座。`,
      `高端手办品牌推出的 ${t} 角色雕像，限定编号 500 体。`,
    ],
    '黏土人': [
      `粘土人系列推出的 ${t} 角色 Q 版可动人偶，附多种表情与配件。`,
    ],
    '集换式卡牌': [
      `${t} 集换式卡牌游戏（TCG），含数百张稀有卡与对战系统。`,
    ],
    'OST 原声大碟': [
      `收录 ${t} 全 BGM 与主题曲的完整原声大碟，由知名作曲家打造。`,
      `${t} 系列十周年纪念原声带，3CD 豪华版包装。`,
    ],
    '虚拟偶像': [
      `基于 ${t} 角色设计的虚拟偶像组合，定期发布单曲与直播。`,
    ],
    '虚拟主播': [
      `${t} 官方运营的虚拟主播企划，多平台同步直播。`,
    ],
    '续作游戏': [
      `万众期待的 ${t} 续作，承接上一作剧情与系统进化。`,
      `全新引擎打造的 ${t} 续作，登陆多平台。`,
    ],
    '外传游戏': [
      `讲述 ${t} 配角故事的衍生外传游戏，独立成篇。`,
    ],
    '重制版': [
      `使用现代引擎完全重制的 ${t} 重制版，画面与系统全面进化。`,
    ],
    'DLC 资料片': [
      `为 ${t} 追加数十小时新内容的大型资料片。`,
    ],
    '衍生手游': [
      `专为移动平台打造的 ${t} 衍生手游，简体中文同步上线。`,
    ],
    '联动活动': [
      `${t} 与其它 IP/品牌的跨界联动活动，限定皮肤与道具上线。`,
    ],
    '跨媒体企划': [
      `集动画、游戏、小说、漫画、周边一体的 ${t} 大型跨媒体企划。`,
    ],
  };
  const list = descs[type] || [`${t} 的衍生 ${type} 作品`];
  return list[Math.floor(rng() * list.length)];
}

// 生成数据
function generate() {
  const works = [];
  let id = 1;
  const today = 2026;

  for (const ip of GAME_IPS) {
    // 每个 IP 平均生成 12-25 个衍生作品
    const count = ri(10, 20) + Math.floor(ip.popularity * 0.5);
    for (let i = 0; i < count; i++) {
      // 按权重选择类型
      const weights = DERIVATIVE_TYPES.map(d => d.weight);
      const total = weights.reduce((a, b) => a + b, 0);
      let r = rng() * total;
      let chosen = DERIVATIVE_TYPES[0];
      for (let j = 0; j < DERIVATIVE_TYPES.length; j++) {
        r -= weights[j];
        if (r <= 0) { chosen = DERIVATIVE_TYPES[j]; break; }
      }

      const type = chosen.type;
      // 流行 IP 偏向高流行类型
      const yearBase = Math.max(ip.firstYear || 2000, 2000);
      // 大部分作品在 2010-2026 之间
      const year = ri(2010, 2026);
      const status = pickStatus(type);
      // 评分：基于 IP 流行度 + 类型 + 状态
      let rating = (ip.popularity / 10) * 5 + chosen.popularity * 0.4;
      rating += rng() * 1.5 - 0.5;
      if (status === '已下架' || status === '已完结') rating += 0.1;
      if (status === '计划中' || status === '制作中') rating += 0.05;
      rating = Math.max(4.5, Math.min(9.8, Math.round(rating * 10) / 10));

      const name = makeName(type, ip);
      const description = makeDescription(type, ip, year);
      // 发行方：使用公司字段
      const publisher = ip.company;
      // 地区：IP 地区为主，少数其他地区
      const region = rng() < 0.85 ? ip.region : pick(['中国', '日本', '美国', '韩国', '全球', '英国', '法国']);

      // 标签
      const tags = [ip.name, type, region, status];
      if (rng() < 0.3) tags.push(pick(['限定', '周年纪念', '首发', '首发特典', '豪华版', '收藏版', '完全版']));
      if (rng() < 0.2) tags.push(pick(['S+ 级', 'S 级', 'A 级', 'B 级']));

      works.push({
        id: id++,
        name,
        ip: ip.name,
        type,
        year,
        region,
        status,
        rating: Math.round(rating * 10) / 10,
        publisher,
        description,
        tags,
      });
    }
  }

  return works;
}

const works = generate();

// 输出
const header = `// 游戏 IP 衍生作品资料库
// 数据生成时间：2026-06-08
// 总计：${works.length} 条目
// 覆盖 IP：${GAME_IPS.length}+
`;
const body = 'window.DATA = ' + JSON.stringify(works, null, 0) + ';\n';

fs.writeFileSync('/workspace/data.js', header + body);
console.log(`已生成 ${works.length} 条数据`);

