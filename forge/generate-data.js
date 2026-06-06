// 剧本工厂 SCRIPT.FORGE — 数据生成器
// 用法：node generate-data.js [count] [outfile]
// 默认：count=2200  outfile=./data.js
// 种子：20260608 (与 IP.ARC 项目保持一致)
'use strict';

const fs = require('fs');
const path = require('path');

const COUNT = parseInt(process.argv[2] || '2200', 10);
const OUT = process.argv[3] || path.join(__dirname, 'data.js');
const SEED = 20260608;

// ---------- Mulberry32 PRNG ----------
function mulberry32(a) {
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rng = mulberry32(SEED);
const rand = (min, max) => min + Math.floor(rng() * (max - min + 1));
const pick = (arr) => arr[Math.floor(rng() * arr.length)];
const pickN = (arr, n) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
};
const pad = (n, w = 4) => String(n).padStart(w, '0');

// ============================================================
// 资料池 1：题材 (Genre Pool) — 60+
// ============================================================
const GENRES = [
  { name: '硬科幻',   en: 'Hard Sci-Fi',     templates: { logline: ['在{near_future}的{place}，当{tech}被{action}，一位{role}必须{quest}以阻止{disaster}。', '当{tech}突破物理边界，{role}在{place}面对{disaster}的{pressure}。'] } },
  { name: '软科幻',   en: 'Soft Sci-Fi',     templates: { logline: ['一位{role}在{near_future}的{place}，发现{tech}背后的{secret}，陷入{conflict}。'] } },
  { name: '高奇幻',   en: 'High Fantasy',    templates: { logline: ['在{magical}的{kingdom}，被选中的{role}必须{task}以对抗{dark_lord}的{invasion}。'] } },
  { name: '低奇幻',   en: 'Low Fantasy',     templates: { logline: ['在{modern}的{place}，{role}偶然介入一场{wrong}，并被卷入{conflict}。'] } },
  { name: '黑暗奇幻', en: 'Dark Fantasy',    templates: { logline: ['在{broken}的世界，{role}为{price}出卖{soul}，却发现{truth}。'] } },
  { name: '都市奇幻', en: 'Urban Fantasy',   templates: { logline: ['在{city}的霓虹深处，{role}的{ordinary}生活被{intrusion}打碎。'] } },
  { name: '悬疑',     en: 'Mystery',         templates: { logline: ['一位{detective}在{place}调查{crime}，当{clue}浮出水面，{twist}颠覆一切。'] } },
  { name: '心理悬疑', en: 'Psychological',   templates: { logline: ['{role}在{mind}的{place}与{alter}对峙，却发现{observer}才是{patient}。'] } },
  { name: '本格推理', en: 'Honkaku',         templates: { logline: ['密室之中，{role}必须{cunning}推理出{killer}的{identity}。'] } },
  { name: '社会派',   en: 'Social',          templates: { logline: ['一桩{crime}牵出{society}的{rot}，{role}在{truth}与{safety}之间选择。'] } },
  { name: '惊悚',     en: 'Thriller',        templates: { logline: ['{role}在{ticking}的{deadline}内与{hunter}周旋，{stakes}悬于一线。'] } },
  { name: '恐怖',     en: 'Horror',          templates: { logline: ['在{cursed}的{place}，{role}遭遇{entity}的{manifestation}，{sanity}崩塌。'] } },
  { name: '超自然',   en: 'Supernatural',    templates: { logline: ['{role}在{ordinary}的世界撞见{otherworld}的裂缝，{cost}在所难免。'] } },
  { name: '爱情',     en: 'Romance',         templates: { logline: ['两位{unlikely}的{role}在{place}的{encounter}中{rivalry}，最终{fall}。'] } },
  { name: '青春爱情', en: 'YA Romance',      templates: { logline: ['{role}在{school}的{season}遇见{the_one}，{test}在夏天逼近。'] } },
  { name: '古典罗曼史', en: 'Period Romance', templates: { logline: ['{period}的{era}，{role}与{the_one}的{forbidden}之恋掀起{scandal}。'] } },
  { name: '悲剧爱情', en: 'Tragic Romance',  templates: { logline: ['{role}与{the_one}的{passion}在{circumstance}面前被{wrenched}分开。'] } },
  { name: '喜剧',     en: 'Comedy',          templates: { logline: ['{role}的{plan}被{obstacle}搅乱，{chaos}中{mishap}接连发生。'] } },
  { name: '黑色幽默', en: 'Dark Comedy',     templates: { logline: ['在{bleak}的{place}，{role}用{absurd}对抗{meaningless}。'] } },
  { name: '讽刺',     en: 'Satire',          templates: { logline: ['{role}在{hypocrisy}的{society}中扮演{role2}，揭露{rot}。'] } },
  { name: '历史',     en: 'Historical',      templates: { logline: ['{era}的{event}中，{role}在{change}的{storm}里做出{choice}。'] } },
  { name: '架空历史', en: 'Alt-History',     templates: { logline: ['若{event}未发生，{role}在{alternate}的{era}改写{history}。'] } },
  { name: '史诗',     en: 'Epic',            templates: { logline: ['{era}的{empire}陷于{war}，{role}的{choice}将{shape}一个时代。'] } },
  { name: '战争',     en: 'War',             templates: { logline: ['{role}在{front}的{conflict}中，亲历{horror}与{sacrifice}。'] } },
  { name: '谍战',     en: 'Espionage',       templates: { logline: ['{role}在{organization}的{mission}中，{loyalty}与{ideology}撕裂彼此。'] } },
  { name: '冒险',     en: 'Adventure',       templates: { logline: ['{role}踏上{quest}的{journey}，{terrain}与{enemy}环伺。'] } },
  { name: '公路',     en: 'Road',            templates: { logline: ['{role}驾{vehicle}横穿{terrain}，{companion}的{conflict}在{mile}中累积。'] } },
  { name: '生存',     en: 'Survival',        templates: { logline: ['{role}在{harsh}的{place}挣扎{survival}，{threat}无处不在。'] } },
  { name: '校园',     en: 'School',          templates: { logline: ['{role}在{school}的{year}面对{pressure}，在{friendship}中{finding}自我。'] } },
  { name: '职场',     en: 'Workplace',       templates: { logline: ['{role}在{company}的{career}中攀爬，{office}政治与{morality}同时考验。'] } },
  { name: '家庭',     en: 'Family',          templates: { logline: ['一个{family}在{event}后{binding}又{tearing}，{generation}的{gap}浮出水面。'] } },
  { name: '医疗',     en: 'Medical',         templates: { logline: ['在{ward}，{role}与{cases}的{life}与{dignity}之间做出{choice}。'] } },
  { name: '法律',     en: 'Legal',           templates: { logline: ['{role}在{court}为{client}辩护，{truth}与{law}的对峙进入{jury}的{verdict}。'] } },
  { name: '犯罪',     en: 'Crime',           templates: { logline: ['{role}在{underworld}的{ladder}攀升，{ambition}与{paranoia}同时灼烧。'] } },
  { name: '黑帮',     en: 'Gangster',        templates: { logline: ['在{territory}的{clan}中，{role}以{loyalty}换取{respect}，最终{price}。'] } },
  { name: '末日',     en: 'Apocalyptic',     templates: { logline: ['{event}的{countdown}中，{role}与{survivors}寻找{haven}。'] } },
  { name: '后末日',   en: 'Post-Apoc',       templates: { logline: ['{event}后的{year}，{role}在{wasteland}重建{meaning}。'] } },
  { name: '废土',     en: 'Wasteland',       templates: { logline: ['{role}在{radiation}与{raider}横行的{terrain}寻找{cache}。'] } },
  { name: '赛博朋克', en: 'Cyberpunk',       templates: { logline: ['在{neon}的{megacity}，{role}的{chrome}藏有{secret}，{corp}紧追不舍。'] } },
  { name: '蒸汽朋克', en: 'Steampunk',       templates: { logline: ['{era}的{empire}以{steam}驱动，{role}的{invention}将{change}一切。'] } },
  { name: '柴油朋克', en: 'Dieselpunk',      templates: { logline: ['{era}的{theater}硝烟弥漫，{role}在{propaganda}与{resistance}之间周旋。'] } },
  { name: '太阳朋克', en: 'Solarpunk',       templates: { logline: ['{era}的{utopia}并非完美，{role}发现{underbelly}的{rot}。'] } },
  { name: '克苏鲁',   en: 'Lovecraftian',    templates: { logline: ['{role}在{isolated}的{place}目睹{unspeakable}，{sanity}的{fraying}开始。'] } },
  { name: '仙侠',     en: 'Xianxia',         templates: { logline: ['{role}踏上{cultivation}的{path}，{tribulation}与{encounter}塑造{destiny}。'] } },
  { name: '修真',     en: 'Cultivation',     templates: { logline: ['{role}在{immortal}的{realm}追求{breakthrough}，{heart_demon}难以逾越。'] } },
  { name: '武侠',     en: 'Wuxia',           templates: { logline: ['{era}的{jianghu}，{role}的{blade}卷入{sect}的{war}，{righteous}之路险峻。'] } },
  { name: '机甲',     en: 'Mecha',           templates: { logline: ['{role}驾驭{mech}在{war}的{front}出击，{pilot}与{machine}的{bond}超越{wire}。'] } },
  { name: '怪兽',     en: 'Kaiju',           templates: { logline: ['当{kaiju}从{abyss}升起，{role}与{team}必须以{weapon}拯救{city}。'] } },
  { name: '偶像',     en: 'Idol',            templates: { logline: ['{role}在{stage}的{light}下绽放，{price}与{dream}在{backstage}的{tear}中撕扯。'] } },
  { name: '竞技',     en: 'Sports',          templates: { logline: ['{role}在{arena}的{competition}中挑战{limit}，{rival}亦敌亦友。'] } },
  { name: '美食',     en: 'Gourmet',         templates: { logline: ['{role}以{ingredient}与{technique}创造{dish}，{taste}背后是{memory}。'] } },
  { name: '旅行',     en: 'Travel',          templates: { logline: ['{role}穿越{place}的{season}，{encounter}的{stranger}留下{scar}。'] } },
  { name: '音乐',     en: 'Music',           templates: { logline: ['{role}在{stage}上{compose}，{melody}与{trauma}的{frequency}纠缠。'] } },
  { name: '舞蹈',     en: 'Dance',           templates: { logline: ['{role}在{studio}的{movement}中{express}，身体与{soul}的{boundary}模糊。'] } },
  { name: '神话',     en: 'Mythology',       templates: { logline: ['{era}的{god}行走{earth}，{role}的{worship}与{doubt}在{trial}中被考验。'] } },
  { name: '童话',     en: 'Fairy Tale',      templates: { logline: ['一位{innocent}的{role}踏上{quest}，{helper}与{witch}轮番登场。'] } },
  { name: '寓言',     en: 'Fable',           templates: { logline: ['在{moral}的{forest}，{role}的{choice}将{teach}一代{listener}。'] } },
  { name: '传记',     en: 'Biography',       templates: { logline: ['{role}的{life}从{humble}到{apex}，{price}与{legacy}在{chapter}间回荡。'] } },
  { name: '纪录片',   en: 'Documentary',     templates: { logline: ['{role}追踪{subject}的{year}，{truth}在{lens}背后慢慢{emerge}。'] } },
  { name: '动作',     en: 'Action',          templates: { logline: ['{role}在{sequence}的{chase}中突破{limit}，{stunt}与{stake}齐飞。'] } },
  { name: '实验',     en: 'Experimental',    templates: { logline: ['{format}的{boundary}被{role}推到{edge}，观众与{artist}的{contract}被打破。'] } },
];

// ============================================================
// 资料池 2：时代 (Era Pool) — 18+
// ============================================================
const ERAS = [
  { name: '上古神话', place: ['昆仑之巅', '蓬莱仙岛', '奥林匹斯山', '北方雪山', '九霄云外'] },
  { name: '古代王朝', place: ['长安', '洛阳', '罗马', '君士坦丁堡', '巴比伦'] },
  { name: '春秋战国', place: ['临淄', '邯郸', '咸阳', '曲阜', '郢都'] },
  { name: '秦汉', place: ['咸阳宫', '未央宫', '长城', '丝绸之路', '洛阳城'] },
  { name: '三国', place: ['许昌', '建业', '成都', '赤壁', '汉中'] },
  { name: '魏晋南北朝', place: ['建康', '平城', '邺城', '江陵', '洛阳'] },
  { name: '隋唐五代', place: ['长安', '洛阳', '扬州', '成都', '汴京'] },
  { name: '宋元明清', place: ['汴京', '临安', '大都', '金陵', '京师'] },
  { name: '民国', place: ['上海滩', '北平', '天津', '广州', '南京'] },
  { name: '近现代', place: ['纽约', '伦敦', '巴黎', '柏林', '上海'] },
  { name: '当代', place: ['东京', '首尔', '北京', '深圳', '柏林'] },
  { name: '近未来', place: ['新东京', '上海三区', '海上平台', '北极高站', '月面基地'] },
  { name: '远未来', place: ['猎户座星港', '银河联邦', '半人马殖民', '仙女座前线', '银河外环'] },
  { name: '末日废土', place: ['死城', '辐射带', '沙暴走廊', '崩坏海岸', '寂静原'] },
  { name: '后启示录', place: ['新生城', '光明谷', '锈带', '沉默海岸', '破碎山'] },
  { name: '平行宇宙', place: ['镜像上海', '镜中伦敦', '裂隙京都', '影子纽约', '倒置北平'] },
  { name: '时间穿越', place: ['1873 巴黎', '1942 延安', '2003 北京', '1347 佛罗伦萨', '2049 香港'] },
  { name: '异世界', place: ['漂浮大陆', '倒置海洋', '影子王国', '梦境之城', '机械森林'] },
];

// ============================================================
// 资料池 3：视角 (Perspective)
// ============================================================
const PERSPECTIVES = [
  { name: '第一人称',       desc: '单一主角的内心独白推进故事' },
  { name: '第三人称限制',   desc: '跟随单一角色的有限视野' },
  { name: '第三人称全知',   desc: '作者俯瞰所有人心的全知视角' },
  { name: '多线 POV',       desc: '三条以上主线的交叠推进' },
  { name: '群像 POV',       desc: '多个次要角色分担叙事' },
  { name: '倒叙',           desc: '从结局或中段回溯展开' },
  { name: '插叙',           desc: '主线中插入回忆或并行事件' },
  { name: '信件/日记体',    desc: '由第一人称记录构成' },
];

// ============================================================
// 资料池 4：基调 (Tone)
// ============================================================
const TONES = [
  { name: '黑暗',     desc: '在道德灰区中凝视' },
  { name: '冷峻',     desc: '克制笔触，沉默的张力' },
  { name: '温暖',     desc: '在寒冬中守护微光' },
  { name: '明亮',     desc: '夏日午后的清澈' },
  { name: '幽默',     desc: '荒诞中的轻盈' },
  { name: '讽刺',     desc: '针砭时弊的反讽' },
  { name: '史诗',     desc: '大时代洪流中的命运' },
  { name: '抒情',     desc: '诗化独白的内心流' },
  { name: '紧张',     desc: '倒计时中的窒息' },
  { name: '诡异',     desc: '日常之下的不祥' },
  { name: '小清新',   desc: '青涩、治愈、留白' },
  { name: '悲怆',     desc: '直视苦难的崇高' },
  { name: '浪漫',     desc: '理想化情感的浓烈' },
  { name: '荒诞',     desc: '无意义中的爆裂' },
  { name: '克制',     desc: '隐忍中的爆发' },
  { name: '苦涩',     desc: '成人世界的无奈' },
  { name: '激昂',     desc: '理想主义的燃烧' },
];

// ============================================================
// 资料池 5：角色原型 (Archetypes) — 37+
// ============================================================
const ARCHETYPES = [
  { name: '英雄',        role: 'protagonist',   traits: ['坚毅', '正直', '理想主义', '自我怀疑', '使命感'],     motivation: '守护所爱之人',       arc: '从冲动走向成熟' },
  { name: '反英雄',      role: 'protagonist',   traits: ['玩世不恭', '冷幽默', '创伤后应激', '敏锐', '孤独'],   motivation: '赎过去的债',         arc: '在利他中重获价值' },
  { name: '反叛者',      role: 'protagonist',   traits: ['桀骜', '冲动', '反权威', '情感丰沛', '敏感'],       motivation: '打破不公的秩序',     arc: '从破坏者成为改革者' },
  { name: '导师',        role: 'mentor',        traits: ['智慧', '神秘', '过去创伤', '洞察', '节制'],         motivation: '传递未尽之志',       arc: '在离别中成全' },
  { name: '守门人',      role: 'antagonist',    traits: ['权威', '固执', '经验', '原则化', '警觉'],           motivation: '守护秩序不被破坏',   arc: '在最后时刻松动' },
  { name: '信使',        role: 'ally',          traits: ['行动派', '果决', '忠诚', '天真', '体力'],           motivation: '把真相带回家',       arc: '从信使成为同行者' },
  { name: '变形者',      role: 'foil',          traits: ['多面', '神秘', '洞察', '诱惑', '难以捉摸'],         motivation: '守护自身的真实',     arc: '在选择中暴露本相' },
  { name: '阴影',        role: 'antagonist',    traits: ['黑暗', '执念', '魅力', '智慧', '毁灭欲'],           motivation: '证明宿命的合理',     arc: '在自我矛盾中溃败' },
  { name: '骗子',        role: 'trickster',     traits: ['狡黠', '幽默', '机会主义', '自恋', '轻浮'],         motivation: '在混乱中获利',       arc: '在真诚面前失去伪装' },
  { name: '盟友',        role: 'ally',          traits: ['可靠', '温和', '智慧', '忠诚', '辅助'],             motivation: '成为主角的支柱',     arc: '在危难中自我觉醒' },
  { name: '爱人',        role: 'love_interest', traits: ['独立', '聪慧', '包容', '决断', '温度'],             motivation: '寻找灵魂共鸣',       arc: '从试探到交付' },
  { name: '君王',        role: 'antagonist',    traits: ['威严', '多疑', '孤独', '远见', '疲惫'],             motivation: '维持帝国的常青',     arc: '在权力巅峰失守' },
  { name: '贤者',        role: 'mentor',        traits: ['博学', '超脱', '幽默', '慈悲', '沉静'],             motivation: '保存古老的火种',     arc: '将火炬交付给下一代' },
  { name: '战士',        role: 'ally',          traits: ['勇敢', '忠诚', '耿直', '牺牲', '荣誉感'],           motivation: '为信念而战',         arc: '在和平中学会柔韧' },
  { name: '艺术家',      role: 'ally',          traits: ['敏感', '创造力', '脆弱', '激情', '内省'],           motivation: '捕捉无法言说之物',   arc: '在痛苦中重生' },
  { name: '守护者',      role: 'mentor',        traits: ['温柔', '坚定', '保护欲', '牺牲', '沉默'],           motivation: '为所爱者筑起屏障',   arc: '在放手后重生' },
  { name: '探索者',      role: 'protagonist',   traits: ['好奇', '不安分', '适应力', '独立', '冒险'],         motivation: '抵达未知的边界',     arc: '在归属中扎根' },
  { name: '创造者',      role: 'protagonist',   traits: ['执着', '想象', '牺牲', '孤独', '极致'],             motivation: '完成未竟之作',       arc: '在作品中完成自我' },
  { name: '统治者',      role: 'antagonist',    traits: ['野心', '谋略', '果断', '强硬', '孤独'],             motivation: '让世界按意志运行',   arc: '在暴政中自我吞噬' },
  { name: '魔术师',      role: 'ally',          traits: ['神秘', '聪慧', '异端', '洞察', '孤僻'],             motivation: '探究禁忌的真理',     arc: '在选择中失去超然' },
  { name: '愚者',        role: 'trickster',     traits: ['天真', '直言', '无畏', '打破成规', '纯真'],         motivation: '揭露虚伪的真相',     arc: '在世故中仍守护纯真' },
  { name: '复仇者',      role: 'antagonist',    traits: ['执念', '冷静', '危险', '痛苦', '决绝'],             motivation: '以牙还牙',           arc: '在复仇完成时失去自己' },
  { name: '流浪者',      role: 'protagonist',   traits: ['漂泊', '孤独', '洞察', '自由', '怀旧'],             motivation: '寻找一个能停下的地方', arc: '在归属中保留自由' },
  { name: '孤儿',        role: 'protagonist',   traits: ['敏感', '早熟', '渴望', '防御', '渴望认同'],         motivation: '寻找归属与认可',     arc: '在选择中与过去和解' },
  { name: '继承者',      role: 'protagonist',   traits: ['压力', '责任感', '成长', '犹豫', '自尊'],           motivation: '摆脱父辈的影子',     arc: '在选择中成为自己' },
  { name: '叛徒',        role: 'foil',          traits: ['双面', '怨恨', '利益', '怨念', '脆弱'],             motivation: '在失意中寻求补偿',   arc: '在选择中失去回头的路' },
  { name: '间谍',        role: 'foil',          traits: ['伪装', '冷静', '警觉', '多疑', '孤独'],             motivation: '在两个世界之间求生', arc: '在身份暴露后选择归属' },
  { name: '审讯者',      role: 'antagonist',    traits: ['冷静', '精准', '逻辑', '无情', '洞察'],             motivation: '撬开所有秘密',       arc: '在真相前动摇' },
  { name: '医生',        role: 'mentor',        traits: ['理性', '慈悲', '克制', '责任', '疲惫'],             motivation: '对抗死亡与遗忘',     arc: '在失败中重获意义' },
  { name: '工程师',      role: 'ally',          traits: ['逻辑', '实用', '内敛', '可靠', '疏离'],             motivation: '用技术解决世界',     arc: '在伦理中校准自我' },
  { name: '作家',        role: 'protagonist',   traits: ['内省', '观察', '拖延', '自我', '敏感'],             motivation: '把生活写成故事',     arc: '在虚构与真实间选择' },
  { name: '音乐家',      role: 'protagonist',   traits: ['激情', '敏感', '极端', '专注', '孤独'],             motivation: '抵达超越的频率',     arc: '在沉默中听清自己' },
  { name: '画家',        role: 'protagonist',   traits: ['凝视', '内省', '叛逆', '浪漫', '执着'],             motivation: '画出不可见之物',     arc: '在画布上完成自己' },
  { name: '学者',        role: 'mentor',        traits: ['博学', '忘我', '清贫', '执着', '温和'],             motivation: '保存正在消逝的知识', arc: '将火炬传递出去' },
  { name: '侦探',        role: 'protagonist',   traits: ['敏锐', '执着', '孤独', '观察', '逻辑'],             motivation: '让真相大白',         arc: '在真相中失去自己' },
  { name: '审判者',      role: 'antagonist',    traits: ['绝对', '冷酷', '原则', '孤高', '执念'],             motivation: '在规则中审判一切',   arc: '在同情中动摇' },
  { name: '救赎者',      role: 'protagonist',   traits: ['慈悲', '自我牺牲', '承担', '旧伤', '坚定'],         motivation: '用生命偿付过去',     arc: '在救赎中找到自己' },
  { name: '旁观者',      role: 'foil',          traits: ['观察', '疏离', '聪慧', '清醒', '虚无'],             motivation: '记录而不介入',       arc: '在介入中失去超然' },
  { name: '机械师',      role: 'ally',          traits: ['耐心', '巧手', '沉默', '可靠', '怀旧'],             motivation: '让遗物重新呼吸',     arc: '在修补中理解人生' },
];

// ============================================================
// 资料池 6：主题 (Themes) — 200+
// ============================================================
const THEMES = [
  '救赎', '复仇', '成长', '牺牲', '身份认同', '自由与枷锁', '爱与失去', '权力腐败',
  '科技异化', '人机关系', '末世求生', '循环', '命运', '选择', '悔恨', '谎言与真相',
  '信任与背叛', '孤独与连接', '记忆', '梦境', '现实与虚拟', '神性与人性', '正义',
  '道德困境', '家庭', '代际', '移民', '阶级', '种族', '性别', '信仰', '战争', '和平',
  '环保', '生态', '疾病', '健康', '生死', '永生', '时间', '空间', '存在', '虚无',
  '意义', '荒诞', '喜剧', '悲剧', '侦探', '解谜', '追踪', '逃亡', '追捕', '对决',
  '宽恕', '家族', '师徒', '姐妹', '兄弟', '母爱', '父爱', '初恋', '重逢', '告别',
  '葬礼', '婚礼', '节日', '传统', '现代化', '异化', '城市', '乡村', '海洋', '山脉',
  '北方', '南方', '边塞', '京都', '金融', '工业', '农业', '游牧', '星际', '深空',
  '沉船', '海难', '空难', '瘟疫', '流行病', '疫情', '毒品', '酒精', '赌博', '债务',
  '拍卖', '收藏', '艺术品', '文物', '考古', '古生物', '进化', '突变', '基因', '克隆',
  '意识上传', '脑机接口', '虚拟现实', '增强现实', '人工智能', '觉醒', '奇点', '后奇点',
  '算法', '数据', '监控', '隐私', '身份盗用', '黑市', '走私', '军火', '情报', '政治',
  '选举', '革命', '政变', '起义', '运动', '抵抗', '占领', '戒严', '流亡', '难民',
  '庇护', '流放', '囚禁', '越狱', '绑架', '拯救', '营救', '人质', '失踪', '谋杀',
  '悬案', '冤案', '翻案', '审判', '陪审', '辩诉', '自首', '证词', '伪证', '证据',
  '继承', '遗嘱', '财产', '家族企业', '王朝', '帝制', '共和', '民主', '独裁', '议会',
  '语言', '方言', '翻译', '密码', '加密', '解码', '密码学', '符号', '图腾', '神话',
  '民俗', '传说', '童话', '儿歌', '歌谣', '民歌', '摇滚', '电子', '古典', '爵士',
  '蓝调', '嘻哈', '金属', '朋克', '独立', '实验', '噪音', '氛围', '世界', '民族',
  '中世纪', '文艺复兴', '启蒙', '工业革命', '近代', '现代', '后现代', '解构', '建构',
  '解构主义', '结构主义', '后殖民', '女权', '男性气质', '女性气质', '酷儿', '跨性别',
  '残障', '老年', '儿童', '青少年', '中年', '壮年', '耄耋', '死亡', '濒死', '死后',
  '魂魄', '轮回', '投胎', '前生', '来世', '天堂', '地狱', '炼狱', '冥界', '神界',
];

// ============================================================
// 幕结构模板 (Act Structures) — 7
// ============================================================
const ACT_STRUCTURES = {
  '三幕剧': {
    acts: [
      { title: '第一幕 · 建置', beats: ['开场画面', '世界与人物', '触发事件', '第一情节点'] },
      { title: '第二幕 · 对抗', beats: ['副线展开', '中点反转', '第二情节点', '失去一切'] },
      { title: '第三幕 · 结局', beats: ['至暗时刻', '高潮对决', '终局画面'] },
    ],
  },
  '四幕剧': {
    acts: [
      { title: '第一幕 · 建置', beats: ['开场', '世界', '触发', '第一情节点'] },
      { title: '第二幕 · 上升', beats: ['副线', 'B 故事', '中点'] },
      { title: '第三幕 · 高潮', beats: ['失去一切', '至暗', '灵魂黑夜'] },
      { title: '第四幕 · 收尾', beats: ['第三幕入口', '高潮', '终局'] },
    ],
  },
  '五幕剧': {
    acts: [
      { title: '第一幕 · 建置', beats: ['开场', '世界', '事件'] },
      { title: '第二幕 · 上升', beats: ['发展', '副线', 'B 故事'] },
      { title: '第三幕 · 高潮', beats: ['中点', '扭转', '高潮'] },
      { title: '第四幕 · 下降', beats: ['下降', '失去', '至暗'] },
      { title: '第五幕 · 新秩序', beats: ['终局', '余波', '新秩序'] },
    ],
  },
  '救猫咪 15 拍': {
    acts: [
      { title: '第一幕', beats: ['开场画面', '主题陈述', '设置', '催化剂', '辩论', '第二幕入口'] },
      { title: '副线与乐趣', beats: ['副线', '乐趣游戏', '中点'] },
      { title: '反派逼近', beats: ['反派逼近', '失去一切', '灵魂的黑夜'] },
      { title: '终局', beats: ['第三幕入口', '高潮', '结局'] },
    ],
  },
  '英雄之旅 12 段': {
    acts: [
      { title: '启程', beats: ['平凡世界', '冒险召唤', '拒绝召唤', '遇见导师', '跨越门槛'] },
      { title: '试炼', beats: ['试炼盟友与敌人', '接近最深处', '重大考验', '获得宝物'] },
      { title: '归来', beats: ['归途', '复活', '携药归来'] },
    ],
  },
  '起承转合': {
    acts: [
      { title: '起', beats: ['开端', '缘起', '人物登场'] },
      { title: '承', beats: ['承接', '发展', '冲突累积'] },
      { title: '转', beats: ['转折', '高潮', '危机'] },
      { title: '合', beats: ['收束', '余韵', '终局'] },
    ],
  },
  '节拍表 8 拍': {
    acts: [
      { title: '上半场', beats: ['钩子', '触发', '第一关', '中点'] },
      { title: '下半场', beats: ['第二关', '至暗', '高潮', '解决'] },
    ],
  },
};

// ============================================================
// 场景模板库 (Scene Templates) — 8 类型
// ============================================================
const SCENE_TEMPLATES = {
  'opening': { // 开场钩子
    action: [
      '{era}的{place}，{time}，{atmos}。{intro}。',
      '{weather}的{place}，{intro}。',
      '{time}，{place}里{intro}。',
    ],
    hooks: [
      '{role}第一次发现{secret}的痕迹。',
      '{role}被{caller}找上门。',
      '{role}收到{message}，打破{ordinary}。',
      '{role}目睹{event}的爆发。',
    ],
    transition: ['CUT TO:', 'SMASH CUT TO:', 'FADE IN:', 'INTERCUT WITH:'],
  },
  'inciting': { // 触发事件
    action: [
      '{caller}在{place}找到了{role}，{news}在{role}的脸上炸开。',
      '{role}在{place}打开了{envelope}，{news}的{weight}沉入胸腔。',
    ],
    hooks: [
      '{role}意识到{consequence}已经无法回头。',
      '{role}做了一个{choice}，生活从此分叉。',
    ],
    transition: ['SMASH CUT TO:', 'MATCH CUT TO:', 'FADE OUT.', 'HARD CUT TO:'],
  },
  'rising': { // 推进情节
    action: [
      '{role}与{ally}在{place}讨论{strategy}，{tension}在沉默中累积。',
      '{role}在{place}展开{action}，{obstacle}接踵而至。',
      '{role}与{rival}在{place}对峙，{conflict}达到{wave}。',
    ],
    hooks: [
      '一个意外{cue}让{role}看到{twist}。',
      '{role}的{plan}被{spy}出卖。',
    ],
    transition: ['CONTINUED:', 'INTERCUT WITH:', 'CUT TO:', 'BACK TO:'],
  },
  'midpoint': { // 中点反转
    action: [
      '{role}在{place}发现{truth}——一切都是{conspiracy}。',
      '{role}与{antagonist}在{place}正面对峙，{mask}被撕破。',
    ],
    hooks: [
      '{role}的朋友是{traitor}。',
      '{role}自己才是{the_chosen}。',
    ],
    transition: ['SMASH CUT TO:', 'TIME CUT:', 'FADE TO BLACK.', 'IRIS OUT.'],
  },
  'reversal': { // 关系转折
    action: [
      '{role}与{the_one}在{place}的对话，{vulnerability}在月光下浮现。',
      '{role}在{place}目睹{betrayal}，{world}碎裂的声音清晰可闻。',
    ],
    hooks: [
      '{role}与{the_one}在{place}分享{the_secret}。',
      '{role}与{ally}在{place}争吵，{truth}脱口而出。',
    ],
    transition: ['CONTINUED:', 'DISSOLVE TO:', 'CUT TO:', 'FADE OUT.'],
  },
  'darknight': { // 至暗时刻
    action: [
      '{role}独自在{place}，{loss}的{weight}压在肩上。',
      '{role}在{place}的镜中看见{haunting}，过去的{trauma}浮出水面。',
    ],
    hooks: [
      '{role}决定放弃{the_quest}。',
      '{role}在{place}几乎失去自己。',
    ],
    transition: ['FADE TO BLACK.', 'HOLD ON BLACK.', 'SLOW DISSOLVE TO:', 'TIME CUT TO:'],
  },
  'climax': { // 高潮对决
    action: [
      '{role}与{antagonist}在{place}的{confrontation}，{weapon}相交。',
      '{role}在{place}做出{choice}，{consequence}在{time}内爆发。',
    ],
    hooks: [
      '{role}的{ability}在{place}完全释放。',
      '{role}在{place}的{choice}改写{the_world}。',
    ],
    transition: ['SMASH CUT TO:', 'MATCH CUT TO:', 'HARD CUT TO:', 'IRIS IN.'],
  },
  'resolution': { // 收尾余韵
    action: [
      '{era}的{place}，{time}，{atmos}。{role}站在{place2}，{change}已经完成。',
      '{place}的{time}，{role}与{the_one}的对话，{after}的生活从{scar}中生长。',
    ],
    hooks: [
      '{role}选择{after}。',
      '{role}把{message}留给{next}。',
    ],
    transition: ['FADE OUT.', 'THE END.', 'CUT TO BLACK.', 'FADE TO:'],
  },
};

// ============================================================
// 角色姓名池
// ============================================================
const SURNAMES_CN = ['李', '王', '张', '刘', '陈', '杨', '黄', '赵', '吴', '周', '徐', '孙', '马', '朱', '胡', '林', '何', '高', '罗', '郑', '梁', '谢', '宋', '唐', '韩', '曹', '许', '邓', '萧', '冯', '曾', '程', '蔡', '彭', '潘', '袁', '于', '董', '余', '苏', '叶', '吕', '魏', '蒋', '田', '杜', '丁', '沈', '姜', '范', '江', '傅', '钟', '卢', '汪', '戴', '崔', '任', '陆', '廖', '姚', '方', '金', '邱', '夏', '谭', '韦', '贾', '邹', '石', '熊', '孟', '秦', '阎', '薛', '侯', '雷', '白', '龙', '段', '郝', '孔', '邵', '史', '毛', '常', '万', '顾', '赖', '武', '康', '贺', '严', '尹', '钱', '施', '牛', '洪', '龚'];
const GIVEN_CN = ['子轩', '浩然', '梓萱', '欣怡', '俊豪', '雨桐', '晓彤', '志强', '美玲', '建国', '小敏', '国华', '静怡', '博文', '紫萱', '皓轩', '可馨', '嘉伟', '若曦', '建国', '思源', '梓豪', '婉婷', '浩宇', '心怡', '一鸣', '一凡', '逸尘', '清欢', '知行', '予安', '安和', '清辞', '落微', '云起', '怀瑾', '望舒', '晏清', '星河', '听雪', '观潮', '望远', '清越', '沐辰', '知言', '观棋', '问夏', '听蝉', '不器', '知秋', '如琢', '如磨', '知微', '怀远', '止戈', '清欢', '无欲', '若虚', '不染', '归棠', '望岳', '知返', '归帆', '眠云', '眠雪', '寻真', '知止', '致远', '行健', '道生', '如风', '知秋', '听雨', '摘星', '漱玉', '闻弦', '知春', '知秋', '听潮', '枕山'];
const SURNAMES_EN = ['Hawthorne', 'Wynter', 'Ashford', 'Blackwood', 'Crowley', 'Drake', 'Eames', 'Falconer', 'Graves', 'Halford', 'Ives', 'Jagger', 'Kingsley', 'Lazarus', 'Marchetti', 'Nash', 'Ortega', 'Pike', 'Quill', 'Ravens', 'Sinclair', 'Thorne', 'Underwood', 'Vance', 'Whittaker', 'Xavier', 'Young', 'Zane', 'Adler', 'Bishop', 'Cross', 'Darrow', 'Ellsworth', 'Fox', 'Greer', 'Holt', 'Irving', 'Jameson', 'Kane', 'Locke', 'Monroe', 'Noble'];
const GIVEN_EN = ['Eliot', 'Mira', 'Caleb', 'Iris', 'Theo', 'Wren', 'Silas', 'Juno', 'Felix', 'Maeve', 'Orion', 'Sage', 'Atlas', 'Lyra', 'Ronan', 'Eden', 'Cyrus', 'Hazel', 'Ezra', 'Vera', 'Alaric', 'Sloane', 'Tobias', 'Cora', 'Jasper', 'Iris', 'Cassian', 'Willa', 'Archer', 'Nora', 'Soren', 'Lila', 'Idris', 'Mabel', 'Rhys', 'June', 'Asher', 'Ada', 'Leif', 'Greta'];

// 标题元素库
const TITLE_OBJECTS = ['灯塔', '回声', '信', '星图', '密令', '影子', '挽歌', '风铃', '雨季', '玻璃', '密钥', '罗盘', '裂缝', '钟声', '旧屋', '黑匣子', '灰烬', '信号', '海图', '日历', '画像', '雪原', '潮汐', '长街', '医院', '站台', '花房', '钟楼', '碎片', '盲盒', '回廊', '霓虹', '剪影', '墓志铭', '白噪声', '旧照', '邮箱', '钢琴', '冷月', '碎镜', '边缘', '影', '小夜曲', '路', '沙漏', '纸船', '药', '信笺', '余烬', '暗流', '雪', '玻璃栈桥'];
const TITLE_SUBJECTS = ['最后的', '无人知晓的', '北方的', '第三种', '缓慢的', '失重的', '被遗忘的', '微小的', '永恒的', '黑夜的', '古老的', '从前的', '虚构的', '寂静的', '明日的', '第七日', '漫长的', '深海的', '关于', '一件', '半山', '山前', '灯下的', '夜半的', '夏日', '冬日', '初春', '深秋', '黄昏的', '清晨的', '蓝色', '灰色', '白色', '红色', '黑色', '无名的', '沉默的', '看不见的', '被听见', '不该被记住的', '无人认领的'];
const TITLE_SUFFIX = ['之下', '之后', '之前', '之间', '之外', '之境', '之约', '之歌', '手记', '备忘录', '残卷', '补遗', '补注', '物语', '考', '异闻录', '断章', '七章', '拾遗', '巡礼', '别录', '史记', '笺注', '后日谈', '前夜', '札记', '答问', '合奏', '独白', '副歌', '间奏', '回旋', '中板', '变奏', '夜曲', '终曲', '前奏', '终章', '尾声', '未完', '残篇', '拾零', '散记', '别章', '续编', '补叙'];

function makeTitle(genre) {
  const styles = [
    () => `${pick(TITLE_SUBJECTS)}${pick(TITLE_OBJECTS)}`,
    () => `${pick(TITLE_OBJECTS)}${pick(TITLE_SUFFIX)}`,
    () => `${pick(TITLE_OBJECTS)}`,
    () => `${pick(TITLE_SUBJECTS)}${pick(TITLE_OBJECTS)}的${pick(TITLE_SUBJECTS)}`,
  ];
  return pick(styles)();
}

// ============================================================
// 剧本类型
// ============================================================
const TYPES = [
  { name: '动画',    en: 'Animation',    traits: '注重视觉奇观与情感表达' },
  { name: '游戏',    en: 'Game',         traits: '强调分支叙事与玩家代入' },
  { name: '影视',    en: 'Film/TV',     traits: '完整三幕剧 / 多季叙事' },
  { name: '广播剧',  en: 'Audio Drama',  traits: '以声音构筑画面' },
  { name: '漫画脚本', en: 'Manga Script', traits: '强分镜、表演化' },
  { name: '小说大纲', en: 'Novel Outline', traits: '注重心理与时间线' },
  { name: '短剧',    en: 'Short Play',  traits: '紧凑、单场景或双场景' },
  { name: '剧本杀',  en: 'LARP Script', traits: '多角色、强推理性' },
];

// ============================================================
// Logline 模板填充
// ============================================================
const SLOTS = {
  near_future: ['2137', '2099', '2142', '2031', '2150', '2044'],
  place: ['霓虹深海', '北极高站', '月球背面', '黄浦江底', '撒哈拉深井', '纽约下城', '上海三区', '北京云端', '海上平台', '太空电梯顶'],
  tech: ['超弦引擎', '神经编织', '量子意识', '纳米孪生', '可控核聚变', '时间反演器', '黑洞能源', '心灵感应网格'],
  action: ['破解', '逆转', '封存', '复制', '传送到', '外泄'],
  role: ['前工程师', '辞职检察官', '失语作曲家', '退役宇航员', '通缉黑客', '落魄剧作家', '被除名的医生', '失去女儿的父亲', '前奥运选手', '没有执照的侦探'],
  quest: ['在 72 小时内关闭', '将证据送达', '解开最后一道谜', '回到原点', '与自己的过去对峙', '让真相不被抹去'],
  disaster: ['人造瘟疫', '能量海啸', '意识断网', '时间折叠', '维度塌陷', '雪崩', '金融危机'],
  pressure: ['围猎', '监控', '诱惑', '遗忘', '压力', '考验'],
  magical: ['双月', '永夜', '银雾', '永昼', '浮空岛', '倒影之海'],
  kingdom: ['翡翠王朝', '北境诸城', '东陆联邦', '龙脊帝国', '矮人山谷', '风帆海岸'],
  dark_lord: ['不死君王', '噬魂者', '永夜女王', '傀儡师', '深渊之母'],
  invasion: ['召唤', '苏醒', '破封', '归来', '降临'],
  modern: ['首尔', '上海', '洛杉矶', '北京', '东京'],
  broken: ['断裂的', '被灰烬覆盖的', '正在解体的', '被诅咒的', '正在消亡的'],
  soul: ['记忆', '挚爱', '名字', '回家的路', '一段旋律'],
  truth: ['挚友才是幕后黑手', '自己才是被选中的', '整个世界是模拟', '父母的死是自导自演', '旧爱早已原谅自己'],
  city: ['东京', '上海', '北京', '香港', '纽约', '巴黎', '伦敦', '首尔'],
  ordinary: ['会计师', '翻译', '咖啡师', '研究生', '外科医生', '建筑工人', '钢琴教师'],
  intrusion: ['一道血字', '一个孩子', '一场停电', '一位陌生访客', '一阵失重'],
  detective: ['警探', '私家侦探', '退休法医', '神学院学生', '心理侧写师', '记者'],
  crime: ['三起无头尸', '一桩旧案', '一场银行金库盗窃', '一份录音遗物', '一栋楼中楼失踪'],
  clue: ['一枚指纹', '一张底片', '一段口哨录音', '一只布偶', '一片粉笔灰'],
  twist: ['凶手', '动机', '时间线', '受害者身份'],
  mind: ['梦境', '记忆宫殿', '潜意识', '童年房间', '水中倒影'],
  alter: ['另一个自己', '内化的父亲', '消失的妹妹', '童年创伤的化身', '从未出生的兄弟'],
  observer: ['隔壁的病人', '镜中的自己', '窗户外的影子', '录音机里的声音', '床底的人'],
  patient: ['零号病人', '自己', '医生', '被遗忘的孩子', '谋杀者'],
  killer: ['凶手', '盗贼', '消失的同谋', '内鬼', '假死者'],
  identity: ['真实身份', '动机', '不在场证明', '通联密码', '秘密关系'],
  rot: ['阶层板结', '地产黑幕', '人口走私链', '校园腐败', '医疗系统溃烂'],
  safety: ['家人安全', '晋升', '既往不咎', '封口费', '移民'],
  ticking: ['48 小时', '倒计时', '午夜前', '末班车', '最后一程'],
  deadline: ['封闭车站', '沉没邮轮', '断裂桥梁', '缺氧空间站', '燃烧剧场'],
  hunter: ['连环杀手', '前雇主', '复仇的前同僚', '国家机器', '自己内心的阴影'],
  stakes: ['一枚核按钮', '孩子的性命', '一个世纪的秘密', '一桩冤案', '一段尘封的真相'],
  cursed: ['老宅', '森林小屋', '冰湖', '地铁隧道', '废弃医院', '北方村庄'],
  entity: ['幽魂', '双重身', '未亡人', '影子', '远古之物'],
  manifestation: ['镜像', '低语', '回声', '血液反写', '倒放的钟声'],
  sanity: ['理智', '记忆', '自我', '现实感', '与他人的边界'],
  ordinary_world: ['小镇邮局', '学校', '法庭', '社区诊所', '工厂', '编辑部'],
  otherworld: ['彼岸', '镜像维度', '冥界', '梦境', '过去与未来的缝隙'],
  cost: ['记忆', '家人', '未来', '灵魂的某个部分', '原本的平静'],
  unlikely: ['警探与嫌犯', '医生与患者', '作家与评论家', '指挥官与士兵', '前任与继任'],
  rivalry: ['争吵', '合作', '试探', '互不相让'],
  the_one: ['一位对手', '一段旧识', '一束陌生人的目光', '一位沉默的旅伴', '一封迟到的信'],
  fall: ['相恋', '重逢', '和解', '告别', '在错位中相识'],
  school: ['高中', '大学', '复读学校', '艺校', '国际学校'],
  season: ['初春', '深秋', '盛夏', '凛冬', '樱花季'],
  test: ['高考', '毕业', '家庭变故', '一次告白', '一场告别'],
  period: ['维多利亚', '民国', '清代', '昭和', '战前', '都铎'],
  forbidden: ['禁忌', '阶层悬殊', '兄妹', '仇家', '师徒'],
  scandal: ['风波', '震荡', '婚约作废', '家族分裂', '流亡'],
  passion: ['炽烈', '暗涌', '克制', '无声', '几乎错过'],
  circumstance: ['战争', '流亡', '政治', '疾病', '距离'],
  wrenched: ['硬生生', '无声地', '在最后一秒', '在车站月台', '在告解室'],
  plan: ['升职', '求婚', '逃亡', '复出', '复仇', '假死'],
  obstacle: ['前女友', '房东', '失忆', '黑社会', '假新闻', '一只猫'],
  chaos: ['混乱', '连锁反应', '多米诺', '一地鸡毛'],
  mishap: ['误会', '失态', '巧合', '乱点鸳鸯谱'],
  bleak: ['战后的', '雪夜的', '医院的', '破产的', '雨季的'],
  absurd: ['冷笑话', '黑色策略', '自嘲', '反讽剧本', '荒诞的婚礼'],
  meaningless: ['虚无', '终局', '命运', '终将腐烂的一切'],
  hypocrisy: ['慈善晚宴', '高校评委会', '地产界', '选秀节目', '政界'],
  role2: ['主持人', '老好人', '愤青', '记者', '反对者'],
  event: ['赤壁之战', '安史之乱', '南北朝分裂', '鸦片战争', '清末维新', '法国大革命', '南北战争'],
  change: ['王朝', '帝国', '秩序', '信仰', '世界格局'],
  storm: ['乱世', '动荡', '革命', '动荡年代', '战火'],
  choice: ['改变历史', '放弃一切', '背起家国', '献祭自己', '退隐江湖'],
  alternate: ['1949', '1865', '1644', '1789', '1791'],
  history: ['一个王朝的命运', '一条铁路的走向', '一位君主的命运', '一个民族的觉醒'],
  empire: ['大唐', '罗马', '拜占庭', '蒙古', '奥斯曼', '大秦'],
  war: ['黄巾起义', '南北朝', '战国', '二战', '太平洋战争', '冷战'],
  shape: ['重塑', '摧毁', '挽留', '背叛', '定义'],
  front: ['诺曼底', '斯大林格勒', '上甘岭', '太平洋', '沙漠'],
  conflict: ['堑壕', '巷战', '空战', '反游击', '补给线'],
  horror: ['泥泞', '死亡', '背叛', '失去', '战壕热'],
  sacrifice: ['一个人', '整个家庭', '一个连队', '一代人', '一封永不寄出的家书'],
  organization: ['军情六处', 'CIA', '摩萨德', '中情局', '克格勃'],
  mission: ['潜伏', '窃取', '颠覆', '情报交易', '暗杀'],
  loyalty: ['忠诚', '信仰', '原则', '人性', '底线'],
  ideology: ['主义', '阵营', '信条', '国族', '信仰'],
  quest: ['寻找', '送回', '揭开', '夺回', '献出'],
  journey: ['旅程', '道路', '远征', '航行', '跋涉'],
  terrain: ['沙漠', '雪山', '密林', '冻原', '海峡', '峡谷'],
  enemy: ['雇佣兵', '海盗', '军阀', '原住民', '旧秩序的守护者'],
  vehicle: ['卡车', '摩托', '吉普', '二手车', '老爷车'],
  companion: ['陌生人', '前恋人', '叔侄', '父女', '老友'],
  mile: ['一万公里', '数月', '半生', '整个夏天', '一次长假'],
  harsh: ['极寒', '炎热', '无水', '缺氧', '无光'],
  survival: ['求生', '坚守', '撤退', '跋涉', '等待救援'],
  threat: ['野兽', '感染', '辐射', '同类', '流寇', '异形'],
  year: ['高三', '大一', '研一', '高二', '初三'],
  pressure: ['升学', '友情背叛', '家庭剧变', '校园暴力', '初恋失意'],
  friendship: ['友情', '社团', '闺蜜', '兄弟会', '乐队'],
  finding: ['找到', '失去', '重塑', '确认', '告别'],
  company: ['投行', '律所', '互联网大厂', '咨询公司', '广告公司'],
  career: ['晋升', '跳槽', '创业', '被裁', '竞业'],
  office: ['办公室', '茶水间', '会议室', '电梯', '客户晚宴'],
  morality: ['道德', '原则', '法律', '客户', '家人'],
  family: ['老宅', '三代同堂', '重组家庭', '留守家庭', '海外华人家庭'],
  binding: ['团聚', '和解', '承担', '守护', '分担'],
  tearing: ['争吵', '误解', '积怨', '遗产', '代际'],
  generation: ['祖辈', '父辈', '子辈', '孙辈', '堂表'],
  gap: ['鸿沟', '沉默', '分歧', '隔阂', '碰撞'],
  ward: ['急诊室', 'ICU', '手术台', '儿科病房', '精神病院'],
  cases: ['一位病童', '一位临终老人', '一位母亲', '一位孤身少年', '一位拒绝治疗的老人'],
  life: ['生命', '生死', '尊严', '希望', '选择'],
  dignity: ['尊严', '临终', '家属', '自决', '同意'],
  court: ['法庭', '听证会', '仲裁庭', '军事法庭', '陪审团席'],
  client: ['冤案被告', '举报人', '前政客', '前 CEO', '受虐儿童'],
  truth: ['真相', '程序', '正义', '记忆', '证据'],
  law: ['法律', '程序', '人心', '证据', '判决'],
  jury: ['陪审', '法官', '旁听席', '媒体', '历史'],
  verdict: ['裁决', '审判', '宣判', '判决', '结果'],
  underworld: ['黑市', '赌场', '地下拳场', '走私线', '黑客圈'],
  ladder: ['升迁', '上位', '扩张', '复仇', '立威'],
  ambition: ['野心', '欲望', '执念', '控制', '占有'],
  paranoia: ['多疑', '恐惧', '失眠', '危机', '失势'],
  territory: ['码头', '老城区', '港口', '地下城', '边境小镇'],
  clan: ['家族', '帮派', '教团', '黑帮', '商会'],
  respect: ['声望', '地位', '义气', '家业', '铁腕'],
  price: ['复仇的代价', '失去所爱', '众叛亲离', '自我瓦解', '帝国的崩盘'],
  event: ['小行星撞击', '量子瘟疫', '太阳风暴', 'AI 觉醒', '冰川融化'],
  countdown: ['七十二小时', '七天', '三天两夜', '末班列车', '最后一程'],
  survivors: ['陌生人', '家人', '前同事', '孤儿', '陌生人'],
  haven: ['避难所', '安全区', '北方', '海底', '山巅'],
  radiation: ['辐射', '沙暴', '酸雨', '瘟疫', '异变'],
  raider: ['流寇', '变种人', '拾荒者', '军阀', '雇佣兵'],
  cache: ['旧时代的食物', '一段录音', '一幅画像', '一份名单', '一位幸存者'],
  neon: ['霓虹', '夜雨', '摩天', '电子', '合成'],
  megacity: ['新东京', '上海三区', '海上平台', '北极高站', '月面基地'],
  chrome: ['义体', '神经端口', '记忆植入', '身份芯片', '人造眼'],
  secret: ['被抹去的身份', '一次失败的植入', '一段被封存的记忆', '一位失联的妹妹', '一桩旧案'],
  corp: ['巨型企业', '财阀', '地下实验室', '政府机构', '影子寡头'],
  steam: ['蒸汽', '齿轮', '烟囱', '气压', '铜管'],
  invention: ['发明', '机器', '装置', '空中战舰', '时间仪'],
  change: ['颠覆', '改变', '重启', '结束', '开启'],
  theater: ['战场', '欧洲', '剧院', '首都', '前哨'],
  propaganda: ['宣传', '舆论', '军令', '命令', '指令'],
  resistance: ['抵抗', '叛乱', '地下', '异见', '流亡'],
  utopia: ['理想城', '阳光城', '垂直农场', '清洁能源', '再生社会'],
  underbelly: ['阴影', '暗面', '底层', '失序', '裂痕'],
  rot: ['腐化', '虚伪', '交易', '谎言', '不公'],
  isolated: ['偏远', '与世隔绝', '无信号', '雪封', '深埋'],
  unspeakable: ['不应被看见之物', '远古之影', '巨构', '深渊', '超越人智的存在'],
  fraying: ['崩解', '剥落', '消逝', '瓦解', '磨灭'],
  cultivation: ['修真', '修仙', '问道', '悟道', '证道'],
  path: ['长生路', '登天阶', '悟道途', '问心路', '破境路'],
  tribulation: ['天劫', '心魔', '情劫', '杀劫', '雷劫'],
  encounter: ['奇遇', '机缘', '因果', '渡化', '恩仇'],
  destiny: ['命运', '天命', '大道', '因果', '轮回'],
  immortal: ['仙', '神', '道', '长生', '永生'],
  realm: ['境', '界', '天', '地', '凡尘'],
  breakthrough: ['破境', '飞升', '合道', '成仙', '证道'],
  heart_demon: ['心魔', '执念', '旧爱', '愧疚', '执迷'],
  jianghu: ['江湖', '武林', '门派', '绿林', '侠道'],
  blade: ['剑', '刀', '拳', '意', '笔'],
  sect: ['门派', '帮会', '世家', '少林', '武当'],
  righteous: ['侠义', '正道', '江湖', '苍生', '家国'],
  mech: ['高达', '战甲', '机甲', '外骨骼', '巨像'],
  pilot: ['驾驶员', '机师', '机娘', '驾驶员', '神经链接者'],
  bond: ['羁绊', '共鸣', '纠缠', '灵魂绑定', '同调'],
  wire: ['控制', '协议', '限制', '人机', 'AI 协定'],
  kaiju: ['巨兽', '古神', '海怪', '异形', '深潜者'],
  abyss: ['深渊', '海底', '地下', '地幔', '极渊'],
  team: ['小队', '战队', '联队', '特遣队', '同盟'],
  weapon: ['巨炮', '高频刃', '聚变刃', '超弦矛', '反物质炮'],
  city: ['东京', '纽约', '上海', '香港', '旧金山'],
  stage: ['舞台', '剧场', '音乐厅', '演播厅', '巨蛋'],
  light: ['追光', '灯下', '聚光', '光圈', '光束'],
  dream: ['梦', '目标', '野心', '愿望', '约定'],
  backstage: ['后台', '化妆间', '休息室', '走廊', '楼梯'],
  tear: ['眼泪', '争吵', '矛盾', '崩溃', '撕裂'],
  arena: ['赛场', '擂台', '球场', '赛道', '赛场'],
  competition: ['决赛', '选拔', '联赛', '锦标赛', '赛季'],
  limit: ['极限', '自我', '身体', '心理', '瓶颈'],
  rival: ['对手', '宿敌', '队友', '老友', '镜像'],
  ingredient: ['一种食材', '山中野菜', '海盐', '故乡的米', '母亲的手艺'],
  technique: ['技法', '火候', '刀工', '调味', '摆盘'],
  dish: ['一道菜', '一份定食', '一桌家宴', '一场宴会', '一席夜宵'],
  taste: ['味道', '记忆', '乡愁', '亲情', '爱情'],
  memory: ['童年', '乡愁', '母亲', '父亲', '故乡'],
  encounter: ['相遇', '重逢', '别离', '告白', '错过'],
  stranger: ['陌生人', '老人', '孩子', '远客', '他乡人'],
  scar: ['印记', '故事', '伤疤', '缘分', '回忆'],
  compose: ['作曲', '弹奏', '指挥', '谱曲', '演奏'],
  melody: ['旋律', '主旋律', '动机', '和声', '复调'],
  trauma: ['创伤', '失去', '离别', '意外', '疾病'],
  frequency: ['频率', '波长', '振动', '共振', '回响'],
  studio: ['排练厅', '练功房', '舞蹈室', '剧场', '镜房'],
  movement: ['动作', '舞步', '肢体', '线条', '流动'],
  express: ['表达', '释放', '对抗', '寻找', '呈现'],
  soul: ['灵魂', '内在', '本我', '自我', '意识'],
  boundary: ['边界', '界限', '壁垒', '框架', '限制'],
  god: ['神', '神明', '天帝', '诸神', '神祇'],
  earth: ['大地', '人世', '凡间', '红尘', '山河'],
  worship: ['崇拜', '信仰', '敬畏', '供奉', '祭祀'],
  doubt: ['怀疑', '质问', '动摇', '反思', '背离'],
  trial: ['试炼', '考验', '折磨', '苦难', '难关'],
  innocent: ['纯真', '年幼', '天真', '无知', '单纯'],
  helper: ['精灵', '老者', '动物', '树木', '星星'],
  witch: ['女巫', '恶龙', '继母', '骗子', '风雪'],
  moral: ['道德', '寓意', '哲理', '故事', '教训'],
  forest: ['森林', '原野', '村庄', '城市', '山丘'],
  teach: ['教会', '启示', '指引', '留下', '传颂'],
  listener: ['听众', '孩子', '读者', '后人', '学生'],
  life: ['一生', '半生', '轨迹', '传记', '路'],
  humble: ['无名', '贫困', '卑微', '边缘', '底层'],
  apex: ['巅峰', '顶点', '迟暮', '陨落', '转折'],
  price: ['代价', '失去', '代价', '反噬', '代价'],
  legacy: ['遗产', '声名', '遗憾', '余响', '余温'],
  chapter: ['章节', '岁岁', '阶段', '段落', '时年'],
  subject: ['人物', '事件', '现象', '族群', '地点'],
  lens: ['镜头', '视角', '聚光灯', '时间', '回望'],
  emerge: ['浮现', '显现', '剥落', '浮现', '澄清'],
  format: ['格式', '结构', '惯例', '体例', '框架'],
  boundary: ['边界', '形式', '类型', '常规', '边界'],
  edge: ['边缘', '极致', '破格', '断裂', '先锋'],
  artist: ['创作者', '作者', '电影人', '剧作家', '导演'],
  contract: ['契约', '默契', '规则', '期待', '共识'],
  sequence: ['追逐', '战斗', '追车', '爆破', '营救'],
  chase: ['追逐', '追车', '追逃', '追踪', '追击'],
  stunt: ['特技', '动作', '爆破', '飞车', '肉搏'],
  stake: ['筹码', '赌注', '代价', '生死', '利害'],
};

// ============================================================
// 角色生成
// ============================================================
function makeName(culture) {
  if (culture === 'en' || rng() < 0.3) {
    return `${pick(SURNAMES_EN)} ${pick(GIVEN_EN)}`;
  }
  return `${pick(SURNAMES_CN)}${pick(GIVEN_CN)}`;
}

function makeCharacters(genre, era) {
  const archPool = ARCHETYPES;
  const n = rand(3, 7);
  const picked = pickN(archPool, n);
  return picked.map((a, i) => {
    const useEn = era.name === '当代' || era.name === '近现代' || era.name === '近未来' || era.name === '远未来' || era.name === '末日废土' || era.name === '后启示录' || era.name === '赛博朋克' || era.name === '蒸汽朋克';
    return {
      name: makeName(useEn ? 'en' : 'cn'),
      role: a.role,
      archetype: a.name,
      traits: pickN(a.traits, rand(2, 3)),
      motivation: a.motivation,
      arc: a.arc,
    };
  });
}

// ============================================================
// 设定 / 背景 生成
// ============================================================
const SETTING_TEMPLATES = [
  '{era}的{place}，{time}，{atmos}。{society}正在经历{change}，{role}在{location}过着{ordinary}的生活，直到{intrusion}撕开表面。',
  '{era}的{place}，{weather}，{atmos}。一场{event}刚刚结束，{role}的{life}被{wrenched}分叉，{consequence}在{terrain}的另一端等待。',
  '{era}的{place}，{atmos}。{society}里，{role}是{ordinary}，{secret}在他们之间流动，{betrayal}的预兆已经埋下。',
];

const SETTING_SLOTS = {
  time: ['凌晨', '黄昏', '正午', '深夜', '盛夏午后', '雪夜', '细雨清晨'],
  atmos: ['空气中弥漫着湿气', '霓虹将街道染成紫色', '沙尘掠过屋檐', '海雾在窗外交织', '铃声在巷尾回响', '白噪音成为背景', '电磁嗡鸣穿透墙壁', '风从北方来'],
  society: ['城市', '乡镇', '公司', '学院', '组织', '门派', '家族', '朝廷', '社团', '门派'],
  change: ['重组', '动荡', '裂变', '沉浮', '迁徙', '新秩序', '最后的辉煌'],
  location: ['老宅', '公寓', '阁楼', '地下室', '办公室', '茶馆', '咖啡馆', '医院', '学校', '码头'],
  ordinary: ['平凡', '规律', '麻木', '隐匿', '黯淡', '克制', '疏离'],
  intrusion: ['一封未署名的信', '一位远道而来的访客', '一场突发的断电', '一通来自过去的电话', '一次毫无预警的重逢', '一则似是而非的讣告'],
  weather: ['细雨', '大雪', '浓雾', '寒风', '酷暑', '黄沙漫天', '飞絮如雪', '雷鸣'],
  event: ['停电', '婚礼', '葬礼', '仪式', '瘟疫', '经济崩盘', '战争结束', '和约'],
  life: ['半生', '职业', '家庭', '婚姻', '信仰', '身份', '与所爱之人的关系'],
  wrenched: ['从此', '在某个深夜', '在一场雪中', '在告别之后', '在一次错过之后'],
  consequence: ['真相', '命运', '清算', '余波', '重逢', '答案'],
  terrain: ['城市的另一端', '北方的山间', '南方的海岸', '西方的沙漠', '东方的密林'],
  secret: ['一段不能说的过去', '一份未寄出的信', '一桩被掩埋的真相', '一段未完的旋律', '一位活着的人'],
  betrayal: ['背叛', '清算', '揭露', '选择', '告别'],
};

// ============================================================
// 对话模板
// ============================================================
const DIALOGUE_BANK = {
  default: [
    { line: '你以为你可以永远逃开吗？', para: '(低声)' },
    { line: '没有人可以永远逃开。', para: '' },
    { line: '那如果我不再想逃呢？', para: '(转身)' },
    { line: '——你想回到哪里？', para: '' },
    { line: '我想回到她还在的时候。', para: '(沉默良久)' },
    { line: '……我也想。', para: '' },
    { line: '你不欠我任何东西。', para: '' },
    { line: '我欠的，从不是东西。', para: '(看着窗外)' },
    { line: '听上去像一种回答。', para: '' },
    { line: '听上去像一个道歉。', para: '' },
    { line: '你有过这样的瞬间吗？', para: '' },
    { line: '——希望时间可以倒回的那一种？', para: '' },
    { line: '有。', para: '' },
    { line: '我几乎每天都有。', para: '' },
    { line: '我们先喝完这杯再说。', para: '' },
    { line: '好。', para: '' },
  ],
  suspense: [
    { line: '那扇门后是什么？', para: '' },
    { line: '你以为我会告诉你？', para: '' },
    { line: '你以为我不知道？', para: '(从口袋里掏出照片)' },
    { line: '……你从哪里拿到的？', para: '' },
    { line: '她留给我的。', para: '' },
    { line: '她？', para: '(声音一沉)' },
    { line: '她昨天才死。', para: '' },
    { line: '不，她三年前就死了。', para: '' },
    { line: '那么你看到的，是谁？', para: '' },
  ],
  romance: [
    { line: '我想问你一个问题。', para: '' },
    { line: '……问吧。', para: '' },
    { line: '如果明天我们就要分开呢？', para: '' },
    { line: '那我会——', para: '' },
    { line: '你会怎么做？', para: '' },
    { line: '我会再找到你。', para: '(看着她)' },
    { line: '……这是承诺吗？', para: '' },
    { line: '这是事实。', para: '' },
    { line: '听上去像一种回答。', para: '' },
    { line: '听上去像一个承诺。', para: '' },
  ],
  scifi: [
    { line: '系统显示节点正在衰减。', para: '' },
    { line: '还剩多少？', para: '' },
    { line: '按这个速率，十七分钟。', para: '' },
    { line: '来得及吗？', para: '' },
    { line: '如果我们现在就走。', para: '' },
    { line: '那你呢？', para: '' },
    { line: '我断后。', para: '' },
    { line: '……你每次都这样说。', para: '' },
    { line: '因为每次都是真的。', para: '' },
  ],
  fantasy: [
    { line: '师父，我们还走得出去吗？', para: '' },
    { line: '走不走得出去，不由路决定。', para: '' },
    { line: '那由什么决定？', para: '' },
    { line: '由你愿不愿意。', para: '' },
    { line: '……我愿意。', para: '' },
    { line: '那我们就走。', para: '' },
  ],
  horror: [
    { line: '你听到了吗？', para: '(压低声音)' },
    { line: '……什么？', para: '' },
    { line: '脚步声。', para: '' },
    { line: '我没听到。', para: '' },
    { line: '它就在门后。', para: '' },
    { line: '……不要回头。', para: '' },
  ],
  action: [
    { line: '你还有几发？', para: '' },
    { line: '两发。', para: '' },
    { line: '那就别浪费。', para: '' },
    { line: '我从来都不浪费。', para: '(扣下扳机)' },
    { line: '走！', para: '' },
  ],
  wuxia: [
    { line: '这一剑，我已等了你十年。', para: '' },
    { line: '你等的是剑。', para: '' },
    { line: '我等的是答案。', para: '' },
    { line: '那我现在给你。', para: '' },
    { line: '……愿闻其详。', para: '' },
  ],
  xianxia: [
    { line: '道兄，前方便是昆仑。', para: '' },
    { line: '渡过昆仑，便是彼岸。', para: '' },
    { line: '彼岸在何处？', para: '' },
    { line: '在你心里。', para: '' },
    { line: '……多谢。', para: '' },
  ],
};

const SCENE_TONE_BANK = ['default', 'suspense', 'romance', 'scifi', 'fantasy', 'horror', 'action', 'wuxia', 'xianxia'];

// ============================================================
// 场景生成
// ============================================================
function fillSlot(tpl, era) {
  return tpl.replace(/\{(\w+)\}/g, (_, k) => {
    // 优先用 era 自带地点
    if (k === 'place' || k === 'location' || k === 'place2') {
      return pick(era.place);
    }
    if (k === 'era') return era.name;
    if (k === 'time') return pick(SETTING_SLOTS.time);
    const s = SLOTS[k] || SETTING_SLOTS[k];
    return s ? pick(s) : '';
  });
}

function makeScene(genre, characters, era, sceneTemplate, locationHint, timeHint) {
  const tpl = SCENE_TEMPLATES[sceneTemplate];
  const actionText = fillSlot(pick(tpl.action), era);
  const hookText = fillSlot(pick(tpl.hooks), era);
  const fullAction = `${actionText}\n\n${hookText}`;

  // 选对话
  const toneKey = SCENE_TONE_BANK[Math.floor(rng() * SCENE_TONE_BANK.length)];
  const dialoguePool = DIALOGUE_BANK[toneKey];
  const numLines = rand(2, 4);
  const dialogue = [];
  for (let i = 0; i < numLines; i++) {
    const d = dialoguePool[Math.floor(rng() * dialoguePool.length)];
    const speaker = pick(characters).name;
    dialogue.push({
      character: speaker,
      line: d.line,
      parenthetical: d.para || undefined,
    });
  }

  const location = locationHint || `${era.place ? pick(era.place) : pick(['街角', '老屋', '密室', '车厢内', '荒原', '山道'])}`;
  const time = timeHint || pick(['夜', '清晨', '黄昏', '深夜', '凌晨', '午后', '黎明前']);

  return {
    number: 0, // 在调用处补
    heading: `INT. ${location.toUpperCase()} - ${time.toUpperCase()}`,
    location,
    time,
    action: fullAction,
    dialogue,
    transition: pick(tpl.transition),
  };
}

// ============================================================
// 完整剧本生成
// ============================================================
function makeScript(id, opts = {}) {
  const genre = opts.genre || pick(GENRES);
  const era = opts.era || pick(ERAS);
  const perspective = opts.perspective || pick(PERSPECTIVES);
  const tone = opts.tone || pick(TONES);
  const type = opts.type || pick(TYPES);
  const structureName = pick(Object.keys(ACT_STRUCTURES));
  const structure = ACT_STRUCTURES[structureName];
  const actCount = structure.acts.length;
  const actTitles = structure.acts.map((a, i) => ({ number: i + 1, title: a.title }));

  // 角色
  const characters = makeCharacters(genre, era);

  // 主题
  const themes = pickN(THEMES, rand(3, 5));

  // logline
  const loglineTpl = pick(genre.templates.logline);
  const logline = fillSlot(loglineTpl, era);

  // setting
  const settingTpl = pick(SETTING_TEMPLATES);
  const setting = fillSlot(settingTpl, era);

  // 标题
  const title = makeTitle(genre.name);

  // 幕 / 场
  const sceneOrder = ['opening', 'inciting', 'rising', 'rising', 'midpoint', 'reversal', 'rising', 'darknight', 'climax', 'resolution'];
  const acts = [];
  let sceneCounter = 1;
  for (let i = 0; i < actCount; i++) {
    const actDef = structure.acts[i];
    const numScenes = rand(2, 3);
    const scenes = [];
    for (let j = 0; j < numScenes; j++) {
      const tpl = sceneOrder[Math.floor(rng() * sceneOrder.length)];
      const sc = makeScene(genre, characters, era, tpl);
      sc.number = sceneCounter++;
      scenes.push(sc);
    }
    acts.push({
      number: i + 1,
      title: actDef.title,
      scenes,
    });
  }

  // 字数
  let wordCount = logline.length + setting.length;
  for (const a of acts) {
    for (const s of a.scenes) {
      wordCount += s.action.length;
      for (const d of s.dialogue) wordCount += d.line.length + 8;
    }
  }
  wordCount = Math.round(wordCount * 1.0);

  // tags
  const tags = pickN([genre.name, type.name, era.name, tone.name, perspective.name, structureName, ...themes], rand(4, 7));

  return {
    id,
    title,
    type: type.name,
    typeEn: type.en,
    genre: genre.name,
    genreEn: genre.en,
    era: era.name,
    perspective: perspective.name,
    perspectiveDesc: perspective.desc,
    tone: tone.name,
    toneDesc: tone.desc,
    structure: structureName,
    actCount,
    logline,
    setting,
    characters,
    themes,
    acts,
    wordCount,
    tags,
    createdAt: new Date(2025, 0, 1 + (id % 365)).toISOString().slice(0, 10),
  };
}

// ============================================================
// 工具
// ============================================================
function scriptToMarkdown(s) {
  const lines = [];
  lines.push(`# ${s.title}`);
  lines.push('');
  lines.push(`> ${s.logline}`);
  lines.push('');
  lines.push(`**题材**：${s.genre} | **类型**：${s.type} | **时代**：${s.era} | **视角**：${s.perspective} | **基调**：${s.tone} | **结构**：${s.structure}`);
  lines.push('');
  lines.push(`**主题**：${s.themes.join(' · ')}`);
  lines.push('');
  lines.push('## 设定');
  lines.push(s.setting);
  lines.push('');
  lines.push('## 角色');
  for (const c of s.characters) {
    lines.push(`- **${c.name}**（${c.archetype} · ${c.role}）：${c.traits.join('、')} —— 动机：${c.motivation}；弧线：${c.arc}`);
  }
  lines.push('');
  for (const a of s.acts) {
    lines.push(`## ACT ${a.number}：${a.title}`);
    lines.push('');
    for (const sc of a.scenes) {
      lines.push(`### 场 ${sc.number} — ${sc.heading}`);
      lines.push('');
      lines.push(sc.action);
      lines.push('');
      for (const d of sc.dialogue) {
        if (d.parenthetical) lines.push(`*${d.parenthetical}*`);
        lines.push(`**${d.character.toUpperCase()}**`);
        lines.push(d.line);
        lines.push('');
      }
      if (sc.transition) lines.push(`> ${sc.transition}`);
      lines.push('');
    }
  }
  return lines.join('\n');
}

// ============================================================
// 主程序
// ============================================================
function main() {
  const t0 = Date.now();
  console.log(`[forge] 开始生成 ${COUNT} 份剧本…`);
  const scripts = [];
  for (let i = 1; i <= COUNT; i++) {
    scripts.push(makeScript(i));
    if (i % 200 === 0) console.log(`[forge] ${i}/${COUNT}`);
  }
  const t1 = Date.now();
  console.log(`[forge] 内存组装完成：${(t1 - t0)}ms`);

  // 写出
  const out = `// SCRIPT.FORGE 数据集 — 由 generate-data.js 生成
// 种子：${SEED}  数量：${scripts.length}  生成时间：${new Date().toISOString()}
'use strict';
window.SCRIPTS = ${JSON.stringify(scripts, null, 0)};
`;
  fs.writeFileSync(OUT, out, 'utf8');
  const t2 = Date.now();
  const stat = fs.statSync(OUT);
  console.log(`[forge] 写出完成：${OUT}  ${(stat.size / 1024).toFixed(1)}KB  ${(t2 - t1)}ms`);
  console.log(`[forge] 题材分布：`);
  const map = new Map();
  for (const s of scripts) map.set(s.genre, (map.get(s.genre) || 0) + 1);
  for (const [k, v] of [...map.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${k.padEnd(8)} ${v}`);
  }
  console.log(`[forge] 总耗时：${(t2 - t0)}ms`);
}

if (require.main === module) main();

module.exports = { makeScript, scriptToMarkdown, GENRES, ERAS, TONES, PERSPECTIVES, ARCHETYPES, THEMES, ACT_STRUCTURES, SCENE_TEMPLATES };
