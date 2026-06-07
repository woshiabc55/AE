// 逆卡巴拉生命之树 (Qliphoth / Tree of Life)
// 十个质点 (Sephirot) + 十个阴影面 (Qliphoth)
// 每个质点对应一位部长，阴影面代表其内在创伤/对抗的实体

import type { OrdealTier } from './ordeals';

export interface Sephirah {
  id: string;                       // 部门 id
  hebrew: string;                   // 希伯来名
  name: string;                     // 中文名
  english: string;                  // 英文名
  order: number;                    // 树杍序号 (1-10)
  pillar: 'MERCY' | 'SEVERITY' | 'BALANCE';  // 所属之柱
  world: string;                    // 所属四世界
  godName: string;                  // 神名 (凯巴拉传统)
  archangel: string;                // 大天使
  planet: string;                   // 行星对应
  virtue: string;                   // 至高美德
  vice: string;                     // 对应罪孽
  color: string;                    // 代表色
  // 视觉
  glyph: string;                    // 希伯来字符
  position: { x: number; y: number }; // 在逆卡巴拉树中的位置
  unlockedDay: number;              // 解锁日
}

export interface Qliphah {
  sephirahId: string;               // 对应质点
  hebrew: string;
  name: string;                     // 中文名
  english: string;
  demon: string;                    // 恶魔/阴影实体
  archetype: string;                // 阴影原型
  sin: string;                      // 代表之罪
  shadowTrait: string;              // 阴影特质
  coreAbnormality: string;          // 关联的异想体（核心抑制目标）
  description: string;              // 阴影描述
  suppressionPhases: { day: number; title: string; narrative: string; choice: string }[];
}

export const sephirot: Sephirah[] = [
  // 物质之柱 (柱之右 - Mercy)
  {
    id: 'control', hebrew: 'מלכות', name: '王国', english: 'Malkuth', order: 10,
    pillar: 'MERCY', world: '物质界 (Assiah)',
    godName: 'Adonai ha-Aretz', archangel: 'Sandalphon', planet: '地球',
    virtue: '根基 / 显化', vice: '惰性 / 贪婪', color: '#5a5a6a',
    glyph: 'מ', position: { x: 0, y: 0 }, unlockedDay: 1,
  },
  {
    id: 'info', hebrew: 'יסוד', name: '基础', english: 'Yesod', order: 9,
    pillar: 'MERCY', world: '形成界 (Yetzirah)',
    godName: 'Shaddai el Chai', archangel: 'Gabriel', planet: '月球',
    virtue: '连接 / 潜意识', vice: '懒惰 / 不忠', color: '#6a8aaa',
    glyph: 'י', position: { x: -1, y: 1 }, unlockedDay: 4,
  },
  {
    id: 'training', hebrew: 'נצח', name: '胜利', english: 'Netzach', order: 7,
    pillar: 'MERCY', world: '形成界 (Yetzirah)',
    godName: 'YHWH Tzevaot', archangel: 'Haniel', planet: '金星',
    virtue: '坚持 / 胜利', vice: '纵欲 / 鲁莽', color: '#6aaa6a',
    glyph: 'נ', position: { x: -2, y: 2 }, unlockedDay: 12,
  },
  {
    id: 'welfare', hebrew: 'חכמה', name: '智慧', english: 'Chokhmah', order: 2,
    pillar: 'MERCY', world: '创造界 (Beriah)',
    godName: 'Yah / YHWH', archangel: 'Ratziel', planet: '黄道 (天球)',
    virtue: '智慧 / 直觉', vice: '虚无 / 自负', color: '#d94a8a',
    glyph: 'ח', position: { x: -3, y: 3 }, unlockedDay: 42,
  },
  // 平衡之柱
  {
    id: 'central', hebrew: 'תפארת', name: '美', english: 'Tiphareth', order: 6,
    pillar: 'BALANCE', world: '形成界 (Yetzirah)',
    godName: 'YHWH Eloah ve-Daath', archangel: 'Michael', planet: '太阳',
    virtue: '和谐 / 慈悲', vice: '虚荣 / 骄傲', color: '#d9c14a',
    glyph: 'ת', position: { x: 0, y: 2 }, unlockedDay: 16,
  },
  {
    id: 'command', hebrew: 'כתר', name: '王冠', english: 'Kether', order: 1,
    pillar: 'BALANCE', world: '原始界 (Atziluth)',
    godName: 'Eheieh / YHWH', archangel: 'Metatron', planet: '原初星云',
    virtue: '统一 / 至高', vice: '异端 / 虚无', color: '#ffe600',
    glyph: 'כ', position: { x: 0, y: 4 }, unlockedDay: 50,
  },
  // 严厉之柱 (柱之左 - Severity)
  {
    id: 'safety', hebrew: 'הוד', name: '光辉', english: 'Hod', order: 8,
    pillar: 'SEVERITY', world: '形成界 (Yetzirah)',
    godName: 'Elohim Tzevaot', archangel: 'Tophniel', planet: '水星',
    virtue: '智识 / 沟通', vice: '谎言 / 诽谤', color: '#aa6a4a',
    glyph: 'ה', position: { x: 1, y: 1 }, unlockedDay: 8,
  },
  {
    id: 'archives', hebrew: 'חסד', name: '仁慈', english: 'Chesed', order: 4,
    pillar: 'SEVERITY', world: '创造界 (Beriah)',
    godName: 'El / YHWH', archangel: 'Tzadkiel', planet: '木星',
    virtue: '仁慈 / 给予', vice: '放纵 / 暴政', color: '#4a9ad9',
    glyph: 'ח', position: { x: 2, y: 2 }, unlockedDay: 22,
  },
  {
    id: 'records', hebrew: 'גבורה', name: '严厉', english: 'Geburah', order: 5,
    pillar: 'SEVERITY', world: '创造界 (Beriah)',
    godName: 'Elohim Gibor', archangel: 'Kamael', planet: '火星',
    virtue: '勇气 / 力量', vice: '残暴 / 毁灭', color: '#d94a4a',
    glyph: 'ג', position: { x: 3, y: 3 }, unlockedDay: 28,
  },
  {
    id: 'extraction', hebrew: 'בינה', name: '理解', english: 'Binah', order: 3,
    pillar: 'SEVERITY', world: '创造界 (Beriah)',
    godName: 'YHWH Elohim', archangel: 'Tzaphkiel', planet: '土星',
    virtue: '理解 / 限制', vice: '毁灭 / 停滞', color: '#8a4ad9',
    glyph: 'ב', position: { x: 2, y: 3 }, unlockedDay: 35,
  },
];

export const qliphoth: Qliphah[] = [
  {
    sephirahId: 'control',
    hebrew: 'לילית', name: '夜之女王', english: 'Lilith',
    demon: 'Lilith（首代妻）',
    archetype: '拒绝服从的母性',
    sin: '拒绝 / 失乐园',
    shadowTrait: '将服从视为奴役，将领导视为背叛。',
    coreAbnormality: 'F-01-01 可爱的鸟',
    description: '在伊诺克事件后被关入机械躯壳的卡门原型。她拒绝接受"保护"的叙事，将所有权威都视为对她工作的否定。',
    suppressionPhases: [
      { day: 1, title: '疑虑', narrative: 'Malkuth 第 1 天：她反复确认你的身份——"你是新来的？还是来替换我的？"', choice: '告诉她你会留下来' },
      { day: 2, title: '指责', narrative: '第 2 天：她开始质疑你的每一个决定，"你根本不知道那些异想体有多危险。"', choice: '承认她的恐惧' },
      { day: 3, title: '崩溃', narrative: '第 3 天：她回忆起伊诺克事件的真相，声音开始颤抖。', choice: '让她说完' },
      { day: 4, title: '释怀', narrative: '第 4 天：她终于交出那把记忆的钥匙。', choice: '承接她的重量' },
      { day: 5, title: '和解', narrative: '第 5 天：她轻轻说"谢谢"，然后陷入沉睡。', choice: '守护她的梦' },
    ],
  },
  {
    sephirahId: 'info',
    hebrew: 'גמליאל', name: '剥皮者', english: 'Gamalic',
    demon: 'Gamalic（剥皮者）',
    archetype: '过度监控的观察者',
    sin: '偷窥 / 妄想',
    shadowTrait: '他记录一切，因为"被记录"是他唯一的存在证据。',
    coreAbnormality: 'O-02-62 我们之间的壁虎',
    description: 'Yesod 将自己的过去全数记录在数据库中，但他自己已无法分辨哪些记忆是真实的、哪些是他人植入的。',
    suppressionPhases: [
      { day: 1, title: '记录', narrative: '他递给你一份厚厚的人员档案，"你必须在第 3 天之前读完全部。"', choice: '收下档案' },
      { day: 2, title: '矛盾', narrative: '他发现档案里的某些记录被篡改。"谁动了我的数据？"', choice: '协助调查' },
      { day: 3, title: '真相', narrative: '他自己就是篡改者——但他不能承认。', choice: '让他面对' },
      { day: 4, title: '交还', narrative: '他交出数据库的主密钥，"请你保管它。"', choice: '承担记忆' },
      { day: 5, title: '放手', narrative: '他决定不再记录，因为"有些事注定要被遗忘。"', choice: '与他一起遗忘' },
    ],
  },
  {
    sephirahId: 'safety',
    hebrew: 'סמאל', name: '毒神', english: 'Samael',
    demon: 'Samael（毒神）',
    archetype: '以保护为名的暴君',
    sin: '过度的恐惧 / 暴力',
    shadowTrait: '他相信死亡是保护活人的唯一方式。',
    coreAbnormality: 'F-04-83 红舞鞋',
    description: 'Hod 曾目睹整个安保小组在一次突破事件中全灭，自此他对"生还"产生了一种病态的执念。',
    suppressionPhases: [
      { day: 1, title: '防御', narrative: '他在你的办公桌前装了金属探测仪。"这是为了你的安全。"', choice: '配合检查' },
      { day: 2, title: '怀疑', narrative: '他开始认为员工中有人是"被腐蚀的"，要求你批准审讯。', choice: '拒绝' },
      { day: 3, title: '回忆', narrative: '他颤抖着讲出那次事件——是他亲手关上了逃生通道。', choice: '聆听' },
      { day: 4, title: '承担', narrative: '他说"如果那时我没那样做，就不会有今天的我。"', choice: '接纳他的过去' },
      { day: 5, title: '改变', narrative: '他拆除了所有探测仪，"也许……我应该相信他们。"', choice: '一起相信' },
    ],
  },
  {
    sephirahId: 'training',
    hebrew: 'ערב צרק', name: '乌鸦王', english: "A'arab Zaraq",
    demon: "A'arab Zaraq（乌鸦王）",
    archetype: '沉溺于酒精的哀悼者',
    sin: '逃避 / 自我放弃',
    shadowTrait: '他无法承受"对他人负责"这件事，所以选择让自己永远停在过去。',
    coreAbnormality: 'O-04-13 悲恸之母',
    description: 'Netzach 记得每一个死去的员工的名字、面孔、口头禅。他用酒精度日，因为清醒时他无法停止哀悼。',
    suppressionPhases: [
      { day: 1, title: '酒瓶', narrative: '"要喝一杯吗？"他的办公桌上有 17 个空瓶。', choice: '接受' },
      { day: 2, title: '名单', narrative: '他给你看一本手写名单，"这上面有 142 个名字。"', choice: '仔细看' },
      { day: 3, title: '新名', narrative: '今天又有人死了。他加上了第 143 个名字。', choice: '陪伴' },
      { day: 4, title: '醒悟', narrative: '"我一直在数，但从未真正哀悼过。"', choice: '帮助他哀悼' },
      { day: 5, title: '安息', narrative: '他把名单烧掉。火焰中，他终于为他们流下了眼泪。', choice: '守护' },
    ],
  },
  {
    sephirahId: 'central',
    hebrew: 'תגרירין', name: '争论者', english: 'Tagaririm',
    demon: 'Tagaririm（争论者）',
    archetype: '理想主义的殉道者',
    sin: '自负 / 完美主义',
    shadowTrait: '他相信"中心"必须由他一人承担，因此他不允许任何人分担。',
    coreAbnormality: 'F-05-29 雪白的鹿',
    description: 'Tiphareth 是七位部长意志的统一，但他以"完美"为名，将所有分歧都以独裁方式压制。',
    suppressionPhases: [
      { day: 1, title: '秩序', narrative: '他的办公桌整洁到令人窒息。"秩序，是生存的基础。"', choice: '观察' },
      { day: 2, title: '异议', narrative: '一位部长当面反对他。他微微一笑，"我们之后再谈。"', choice: '陪同' },
      { day: 3, title: '重压', narrative: '"我承担了所有人的意志……但没人问过我是否愿意。"', choice: '询问' },
      { day: 4, title: '裂痕', narrative: '他第一次在你面前落泪。"我太累了。"', choice: '分担' },
      { day: 5, title: '和解', narrative: '"也许……我不需要独自承担。"', choice: '共同承担' },
    ],
  },
  {
    sephirahId: 'archives',
    hebrew: 'סהריאל', name: '隐瞒者', english: 'Saharial',
    demon: 'Saharial（隐瞒者）',
    archetype: '以仁慈为名的谎言',
    sin: '伪善 / 隐瞒',
    shadowTrait: '他用"仁慈"为名，把所有真相都藏进了档案室。',
    coreAbnormality: 'F-03-22 一無所有',
    description: 'Chesed 相信员工"不需要知道真相"，他将所有危险记录都加上了密级。',
    suppressionPhases: [
      { day: 1, title: '档案', narrative: '他交给你一份最厚的档案，"请不要看第 47 页。"', choice: '不问' },
      { day: 2, title: '好奇', narrative: '你还是看了第 47 页——那是一次未报告的事故。', choice: '质问' },
      { day: 3, title: '借口', narrative: '"我隐瞒是为了保护他们。"', choice: '质疑' },
      { day: 4, title: '真相', narrative: '"也许我该告诉他们——他们有权选择。"', choice: '支持' },
      { day: 5, title: '公开', narrative: '他打开了所有档案。"从今天起，谎言结束了。"', choice: '见证' },
    ],
  },
  {
    sephirahId: 'records',
    hebrew: 'גהאגשבלה', name: '灼烧者', english: "Gha'agsheblah",
    demon: "Gha'agsheblah（灼烧者）",
    archetype: '以审判为名的愤怒',
    sin: '复仇 / 残暴',
    shadowTrait: '他对每一个"应当负责"的人都充满仇恨，却不知自己也应负责。',
    coreAbnormality: 'F-06-32 白夜',
    description: 'Geburah 记录着每一次失败的镇压、每一次越界的命令，并将责任都归于具体的名字。',
    suppressionPhases: [
      { day: 1, title: '名单', narrative: '他递给你一份黑名单，"这些人应该被清除。"', choice: '拒绝执行' },
      { day: 2, title: '争执', narrative: '"你太软弱了！这才是公司的需要！"', choice: '坚定立场' },
      { day: 3, title: '回忆', narrative: '"……因为我曾经也是被清除的人之一。"', choice: '倾听' },
      { day: 4, title: '自省', narrative: '"我记录他们的罪，却忘记了我自己的。"', choice: '反思' },
      { day: 5, title: '宽恕', narrative: '他烧掉名单。"也许……该被审判的是我。"', choice: '赦免' },
    ],
  },
  {
    sephirahId: 'extraction',
    hebrew: 'אדרמלך', name: '鸫王', english: 'Adrammelech',
    demon: 'Adrammelech（鸫王）',
    archetype: '理解的深渊',
    sin: '虚无 / 知识之毒',
    shadowTrait: '他理解一切，因此他不能原谅任何事。',
    coreAbnormality: 'O-06-17 沉默的君王',
    description: 'Binah 将所有异想体的本质都研究到了底——她理解了，所以她也失去了一切希望。',
    suppressionPhases: [
      { day: 1, title: '洞察', narrative: '她在第一次见到你时就说："你不会活着走出去。"', choice: '接受' },
      { day: 2, title: '解答', narrative: '她解释了所有异想体的来源——包括"我们自己"。', choice: '理解' },
      { day: 3, title: '绝望', narrative: '"知道一切的人，最痛苦。"', choice: '陪伴' },
      { day: 4, title: '分享', narrative: '她说："如果你也想知道一切……我可以教你。"', choice: '拒绝知识' },
      { day: 5, title: '释然', narrative: '"也许不知道……也是一种幸福。"', choice: '保护她的幸福' },
    ],
  },
  {
    sephirahId: 'welfare',
    hebrew: 'עת', name: '大蛇', english: 'Oth',
    demon: 'Oth（大蛇）',
    archetype: '智慧的诱惑',
    sin: '傲慢 / 知识的滥用',
    shadowTrait: '他相信知识是解救一切的方式，但解救本身就需要他付出代价。',
    coreAbnormality: 'F-04-83 红舞鞋',
    description: 'Chokhmah 拥有最强大的研究能力，但他的每一次研究都让他更接近"不应知道"的真相。',
    suppressionPhases: [
      { day: 1, title: '天才', narrative: '他在 3 分钟内解决了你两年的数据。', choice: '惊讶' },
      { day: 2, title: '实验', narrative: '"我想研究你——当然只是观察。"', choice: '同意' },
      { day: 3, title: '代价', narrative: '实验出错了。他失去了左眼。', choice: '关心' },
      { day: 4, title: '反思', narrative: '"我以为我能理解一切……却无法理解自己。"', choice: '帮助' },
      { day: 5, title: '成熟', narrative: '"也许真正的智慧是知道什么不该问。"', choice: '守护他的智慧' },
    ],
  },
  {
    sephirahId: 'command',
    hebrew: 'תאומיאל', name: '双冠', english: 'Thaumiel',
    demon: 'Thaumiel（双冠）',
    archetype: '王冠之下的虚无',
    sin: '分裂 / 异端',
    shadowTrait: '他与自己的"另一个"长期争论，最终分不清哪个才是"真正的他"。',
    coreAbnormality: '沉默的君王 + 白夜',
    description: 'Kether 是最高的意志，但他被两个相反的极端撕裂——神性与兽性、慈悲与毁灭。',
    suppressionPhases: [
      { day: 1, title: '加冕', narrative: '他递给你一顶王冠，"准备好承担一切了吗？"', choice: '戴上' },
      { day: 2, title: '对立', narrative: '他当着你的面与自己的"另一个"激烈争论。', choice: '观察' },
      { day: 3, title: '真相', narrative: '"我们都是主管——只是我们之中只有一个是真的。"', choice: '寻找真相' },
      { day: 4, title: '合并', narrative: '"也许……不需要分出胜负。"', choice: '建议和解' },
      { day: 5, title: '统一', narrative: '两个意志合二为一。"感谢你……我们终于完整了。"', choice: '守护完整' },
    ],
  },
];

export const sephirahById = (id: string) => sephirot.find(s => s.id === id);
export const qliphahBySephirah = (id: string) => qliphoth.find(q => q.sephirahId === id);

// 时段对应 Sephiroth（凯巴拉四世界）
export const worldByTier: Record<OrdealTier, string> = {
  DAWN: 'Assiah (物质界) - 显化的开始',
  NOON: 'Yetzirah (形成界) - 情感的涌动',
  DUSK: 'Beriah (创造界) - 理智的塑造',
  MIDNIGHT: 'Atziluth (原始界) - 神性的回响',
};
