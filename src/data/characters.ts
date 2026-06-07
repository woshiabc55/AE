// 角色设计系统
// 1. 部长（Director）档案 - 10 位
// 2. 员工原型（Archetype）- 6 大类
// 3. 主管（Player）背景设定

import { qliphoth, sephirot } from './qliphoth';

// 部长档案
export interface DirectorProfile {
  sephirahId: string;
  hebrewName: string;
  nickname: string;             // 玩家在游戏中会看到的称呼
  age: number;
  appearance: {
    hairColor: string;
    eyeColor: string;
    outfit: string;             // 像素描述
    height: string;
    visualTags: string[];       // 视觉标签（如：发带、眼镜、伤疤）
  };
  personality: {
    mbti: string;               // 简化 MBTI
    enneagram: string;          // 九型人格
    coreTrait: string;          // 核心特质
    virtue: string;             // 美德
    flaw: string;               // 缺陷
  };
  voice: {
    tone: string;               // 语气
    speechStyle: string;        // 说话方式
    catchphrase: string;        // 口头禅
  };
  background: string;           // 背景故事
  motivation: string;           // 行动动机
  trauma: string;               // 心理创伤
  death: string;                // 死亡/机器化背景
  relationship: {               // 与其他部长的关系
    ally: string[];
    rival: string[];
    complex: string[];
  };
  storyBeats: {                 // 5 天剧情节拍
    day: number;
    beat: string;
    emotion: 'neutral' | 'anxious' | 'angry' | 'sad' | 'hopeful' | 'broken';
  }[];
  battle: {                     // 核心抑制（boss 战）形式
    phases: number;
    pattern: string;
    weakness: string;
  };
}

export const directors: DirectorProfile[] = [
  {
    sephirahId: 'control',
    hebrewName: 'מלכות',
    nickname: 'Malkuth',
    age: 32,
    appearance: {
      hairColor: '银灰',
      eyeColor: '蓝',
      outfit: '白色实验室外套 + 黑色高领 + 厚重工装靴',
      height: '165cm',
      visualTags: ['机械义眼（左）', '手腕有旧伤疤', '永远穿同一件外套'],
    },
    personality: {
      mbti: 'ISFJ',
      enneagram: '6w5',
      coreTrait: '把保护当成存在意义',
      virtue: '忠诚 / 务实',
      flaw: '不敢让任何人替她承担',
    },
    voice: {
      tone: '温柔但坚定',
      speechStyle: '多用短句，反问句，结尾常以"……你明白吗？"',
      catchphrase: '"我会照顾好他们的。"',
    },
    background: '前卡门研究小组核心成员。在伊诺克事件中失去左眼。事故后被艾因任命为首任部长。',
    motivation: '确保"伊诺克事件"不再重演',
    trauma: '那次实验中她按下了紧急制动——但那恰恰是导致事故的关键动作',
    death: '机械躯壳 + 残缺记忆。她记得一切，但已无法流泪。',
    relationship: {
      ally: ['training'],
      rival: ['records'],
      complex: ['safety'],
    },
    storyBeats: [
      { day: 1, beat: '欢迎与疑虑', emotion: 'anxious' },
      { day: 2, beat: '反复确认你不会离开', emotion: 'anxious' },
      { day: 3, beat: '讲述伊诺克事件', emotion: 'broken' },
      { day: 4, beat: '把当年未说出的话告诉你', emotion: 'sad' },
      { day: 5, beat: '交出钥匙，沉睡', emotion: 'hopeful' },
    ],
    battle: { phases: 3, pattern: '她会反复刷新小怪警告你"快逃"', weakness: '坚持不离开' },
  },
  {
    sephirahId: 'info',
    hebrewName: 'יסוד',
    nickname: 'Yesod',
    age: 28,
    appearance: {
      hairColor: '深棕',
      eyeColor: '绿',
      outfit: '黑色高领毛衣 + 厚框眼镜 + 录音笔永远挂在脖子上',
      height: '175cm',
      visualTags: ['眼镜反射出代码', '手指被墨水染黑', '永远在看屏幕'],
    },
    personality: {
      mbti: 'INTJ',
      enneagram: '5w4',
      coreTrait: '把信息当成"被记住"的唯一方式',
      virtue: '细致 / 准确',
      flaw: '无法区分真实记忆与档案记录',
    },
    voice: {
      tone: '冷静到令人不安',
      speechStyle: '陈述句为主，每句带编号或时间戳',
      catchphrase: '"请允许我记录这一刻。"',
    },
    background: '前 IT 工程师，艾因的童年挚友。他的记忆在第一次时间循环中已被改写过 12 次。',
    motivation: '让一切都被记录，这样"被遗忘"就再也不可能',
    trauma: '他曾经丢失过一段至关重要的记忆——那是关于他自己爱人的',
    death: '全身义体化，只保留大脑皮层的有机部分',
    relationship: {
      ally: ['central', 'archives'],
      rival: ['records'],
      complex: ['training'],
    },
    storyBeats: [
      { day: 1, beat: '递给你一份厚档案', emotion: 'neutral' },
      { day: 2, beat: '发现档案被自己篡改', emotion: 'anxious' },
      { day: 3, beat: '崩溃：他就是篡改者', emotion: 'broken' },
      { day: 4, beat: '交出主密钥', emotion: 'sad' },
      { day: 5, beat: '决定不再记录', emotion: 'hopeful' },
    ],
    battle: { phases: 4, pattern: '他会召唤"信息风暴"——所有过去的事件同时重播', weakness: '亲手销毁自己的档案' },
  },
  {
    sephirahId: 'safety',
    hebrewName: 'הוד',
    nickname: 'Hod',
    age: 35,
    appearance: {
      hairColor: '黑',
      eyeColor: '棕',
      outfit: '深蓝安保制服 + 防弹背心 + 大量徽章',
      height: '180cm',
      visualTags: ['左脸有伤疤', '绷带包裹的右手', '军靴'],
    },
    personality: {
      mbti: 'ESTJ',
      enneagram: '8w7',
      coreTrait: '把"控制"等同于"安全"',
      virtue: '忠诚 / 决断',
      flaw: '以保护为名施行暴政',
    },
    voice: {
      tone: '命令式',
      speechStyle: '祈使句为主，常用"现在立刻"',
      catchphrase: '"这是命令。"',
    },
    background: '前军事承包商，E 队组长。曾目睹整个安保组在突破事件中全灭。',
    motivation: '让"那次事件"永远不再发生',
    trauma: '他亲手关上了逃生通道——这是他最后悔的命令',
    death: '肉体保存完好，但记忆被强制改写',
    relationship: {
      ally: ['records'],
      rival: ['training'],
      complex: ['control'],
    },
    storyBeats: [
      { day: 1, beat: '加装金属探测仪', emotion: 'neutral' },
      { day: 2, beat: '开始怀疑员工', emotion: 'angry' },
      { day: 3, beat: '讲述那次事件', emotion: 'broken' },
      { day: 4, beat: '承认自己关了通道', emotion: 'sad' },
      { day: 5, beat: '拆除探测仪', emotion: 'hopeful' },
    ],
    battle: { phases: 3, pattern: '他会设下三道安全门，每道后都有一个"必须被牺牲的人"', weakness: '相信你' },
  },
  {
    sephirahId: 'training',
    hebrewName: 'נצח',
    nickname: 'Netzach',
    age: 41,
    appearance: {
      hairColor: '棕',
      eyeColor: '红',
      outfit: '皱巴巴的西装外套 + 永远有酒渍的衬衫',
      height: '178cm',
      visualTags: ['黑眼圈', '胡茬', '手里永远端着威士忌'],
    },
    personality: {
      mbti: 'ENFP',
      enneagram: '7w8',
      coreTrait: '把酒精当成"暂停哀悼"的方式',
      virtue: '共情 / 乐观',
      flaw: '无法真正面对失去',
    },
    voice: {
      tone: '轻佻掩盖悲伤',
      speechStyle: '反问句、自嘲、转折多',
      catchphrase: '"……要喝一杯吗？"',
    },
    background: '前心理辅导员，在第一次时间循环中目睹 142 名员工相继死去。',
    motivation: '让死者不被遗忘',
    trauma: '他记得每一个死者的名字、面孔、口头禅',
    death: '义体化后保留"嗜酒"程序——以提醒自己"还有未做完的事"',
    relationship: {
      ally: ['control', 'welfare'],
      rival: ['safety', 'records'],
      complex: ['extraction'],
    },
    storyBeats: [
      { day: 1, beat: '递酒', emotion: 'neutral' },
      { day: 2, beat: '展示 142 个名字', emotion: 'sad' },
      { day: 3, beat: '加上第 143 个名字', emotion: 'broken' },
      { day: 4, beat: '承认从未真正哀悼', emotion: 'sad' },
      { day: 5, beat: '烧掉名单', emotion: 'hopeful' },
    ],
    battle: { phases: 5, pattern: '他会召唤所有死者的灵魂，让他们"再次死亡"', weakness: '为他们流下眼泪' },
  },
  {
    sephirahId: 'central',
    hebrewName: 'תפארת',
    nickname: 'Tiphareth',
    age: 30,
    appearance: {
      hairColor: '金',
      eyeColor: '金',
      outfit: '白色长风衣 + 金色胸针（六芒星）',
      height: '172cm',
      visualTags: ['光环一样的发丝', '背光轮廓', '永远的微笑'],
    },
    personality: {
      mbti: 'INFJ',
      enneagram: '1w9',
      coreTrait: '把"完美"当成对他人的暴力',
      virtue: '洞察 / 协调',
      flaw: '不允许任何人替他分担',
    },
    voice: {
      tone: '温和到令人窒息',
      speechStyle: '常以"我们"开头，结尾是"好吗？"',
      catchphrase: '"我们可以一起承担。"',
    },
    background: '七位部长意志的"统一接口"。在第 8 次时间循环后被艾因选中。',
    motivation: '让七位部长的意志不再分裂',
    trauma: '他每次"统一"都要吸收其他部长的痛苦',
    death: '部分机械化，保留表情能力——这是艾因的"怜悯"',
    relationship: {
      ally: ['welfare', 'info'],
      rival: ['extraction', 'records'],
      complex: ['central'],
    },
    storyBeats: [
      { day: 1, beat: '展示完美秩序', emotion: 'neutral' },
      { day: 2, beat: '压制异议', emotion: 'neutral' },
      { day: 3, beat: '承认"我累了"', emotion: 'broken' },
      { day: 4, beat: '分发责任', emotion: 'sad' },
      { day: 5, beat: '学习共同承担', emotion: 'hopeful' },
    ],
    battle: { phases: 4, pattern: '他会召唤 7 位部长的"投影"，要你同时应付 7 种攻击', weakness: '让他承认"我不够好"' },
  },
  {
    sephirahId: 'archives',
    hebrewName: 'חסד',
    nickname: 'Chesed',
    age: 38,
    appearance: {
      hairColor: '白',
      eyeColor: '蓝',
      outfit: '紫色长袍 + 厚重眼镜 + 翡翠戒指',
      height: '170cm',
      visualTags: ['长白胡须', '和蔼的笑容', '拐杖（已不再需要）'],
    },
    personality: {
      mbti: 'ENFJ',
      enneagram: '2w3',
      coreTrait: '把"仁慈"当成隐瞒的借口',
      virtue: '慷慨 / 同理',
      flaw: '以保护为名施加谎言',
    },
    voice: {
      tone: '温柔到令人警惕',
      speechStyle: '常以"为了他们好"开头',
      catchphrase: '"有些事，他们不需要知道。"',
    },
    background: '前医生，曾在 6 次循环中亲手关闭感染区。',
    motivation: '让员工"不被真相压垮"',
    trauma: '他每次关闭感染区时都听到了求救声',
    death: '完全机械化，但保留了"温柔"的声音合成',
    relationship: {
      ally: ['info', 'welfare'],
      rival: ['records'],
      complex: ['control'],
    },
    storyBeats: [
      { day: 1, beat: '递给你厚档案并叮嘱"别看 47 页"', emotion: 'neutral' },
      { day: 2, beat: '你看了 47 页', emotion: 'anxious' },
      { day: 3, beat: '被质问', emotion: 'angry' },
      { day: 4, beat: '承认隐瞒', emotion: 'sad' },
      { day: 5, beat: '打开所有档案', emotion: 'hopeful' },
    ],
    battle: { phases: 3, pattern: '他会召唤"被隐瞒的真相"作为敌人——它们会越来越真', weakness: '要求他公开一切' },
  },
  {
    sephirahId: 'records',
    hebrewName: 'גבורה',
    nickname: 'Geburah',
    age: 36,
    appearance: {
      hairColor: '红',
      eyeColor: '琥珀',
      outfit: '深红执法服 + 链条腰带 + 多枚勋章',
      height: '183cm',
      visualTags: ['右眼伤疤', '金属义手', '永不脱下的手套'],
    },
    personality: {
      mbti: 'ENTJ',
      enneagram: '8w3',
      coreTrait: '把"审判"当成生存方式',
      virtue: '勇气 / 决断',
      flaw: '以复仇为名施加残暴',
    },
    voice: {
      tone: '冷硬',
      speechStyle: '陈述句、命令句、从不反问',
      catchphrase: '"以记录之名。"',
    },
    background: '前军事审判官，第 4 次循环中全家被异想体屠杀。',
    motivation: '让每个"应当负责"的人都付出代价',
    trauma: '他也是被自己审判的人之一',
    death: '机械义手，保留"审判"的强制记忆',
    relationship: {
      ally: ['safety'],
      rival: ['training', 'archives'],
      complex: ['command'],
    },
    storyBeats: [
      { day: 1, beat: '递黑名单', emotion: 'angry' },
      { day: 2, beat: '争执"公司需要"', emotion: 'angry' },
      { day: 3, beat: '承认"我也曾被清除"', emotion: 'broken' },
      { day: 4, beat: '自省', emotion: 'sad' },
      { day: 5, beat: '烧掉名单', emotion: 'hopeful' },
    ],
    battle: { phases: 4, pattern: '他会召唤 100 个"被记录的灵魂"，每个都要被审判', weakness: '让他审判自己' },
  },
  {
    sephirahId: 'extraction',
    hebrewName: 'בינה',
    nickname: 'Binah',
    age: 45,
    appearance: {
      hairColor: '黑',
      eyeColor: '紫',
      outfit: '黑色长袍 + 厚重头巾 + 多层项链',
      height: '168cm',
      visualTags: ['苍白到不真实', '手指间夹着羽毛', '从不笑'],
    },
    personality: {
      mbti: 'INTP',
      enneagram: '5w6',
      coreTrait: '把"理解"当成诅咒',
      virtue: '洞察 / 深度',
      flaw: '理解一切，所以无法原谅',
    },
    voice: {
      tone: '低沉到令人不安',
      speechStyle: '长句，复杂结构，常用比喻',
      catchphrase: '"你不会活着走出去。"',
    },
    background: '前理论物理学家，第 1 次循环就被艾因选为研究伙伴。',
    motivation: '让"理解"成为对所有事的救赎',
    trauma: '她理解了异想体的来源——包括"我们自己"',
    death: '义体化后保留"理解"程序——这是她的永恒诅咒',
    relationship: {
      ally: ['welfare', 'info'],
      rival: ['central'],
      complex: ['command'],
    },
    storyBeats: [
      { day: 1, beat: '预测你的结局', emotion: 'neutral' },
      { day: 2, beat: '讲解所有异想体来源', emotion: 'sad' },
      { day: 3, beat: '"知道一切的人最痛苦"', emotion: 'broken' },
      { day: 4, beat: '邀请你一起"知道"', emotion: 'angry' },
      { day: 5, beat: '"也许不知道也是一种幸福"', emotion: 'hopeful' },
    ],
    battle: { phases: 5, pattern: '她会召唤"知识本身"作为敌人——会读你的每一个想法', weakness: '拒绝她的知识' },
  },
  {
    sephirahId: 'welfare',
    hebrewName: 'חכמה',
    nickname: 'Chokhmah',
    age: 27,
    appearance: {
      hairColor: '银白',
      eyeColor: '金',
      outfit: '实验服 + 缠满绷带 + 永远在写笔记',
      height: '176cm',
      visualTags: ['左眼伤疤', '手指有实验灼伤', '从不摘下护目镜'],
    },
    personality: {
      mbti: 'ENTP',
      enneagram: '7w6',
      coreTrait: '把"天才"当成逃避现实的方式',
      virtue: '创造 / 智慧',
      flaw: '知识的代价他从不告诉别人',
    },
    voice: {
      tone: '兴奋',
      speechStyle: '长句、术语、跳跃式思维',
      catchphrase: '"这个数据太美了！"',
    },
    background: '前量子物理天才，3 分钟内解决了艾因 2 年的难题。',
    motivation: '让知识成为救赎',
    trauma: '他的左眼是研究自己的代价',
    death: '部分义体化，保留"创造力"',
    relationship: {
      ally: ['archives', 'extraction'],
      rival: ['safety'],
      complex: ['central'],
    },
    storyBeats: [
      { day: 1, beat: '展示 3 分钟解难题', emotion: 'neutral' },
      { day: 2, beat: '想研究你', emotion: 'anxious' },
      { day: 3, beat: '实验出错，失去左眼', emotion: 'broken' },
      { day: 4, beat: '"我无法理解自己"', emotion: 'sad' },
      { day: 5, beat: '成熟：知道什么不该问', emotion: 'hopeful' },
    ],
    battle: { phases: 3, pattern: '他会召唤"未解的问题"作为敌人，每个都会自我复制', weakness: '让他承认"我不知道"' },
  },
  {
    sephirahId: 'command',
  hebrewName: 'כתר',
  nickname: 'Kether',
  age: -1,
    appearance: {
      hairColor: '纯白',
      eyeColor: '金色（左）/ 紫红（右）',
      outfit: '黑色长袍 + 金色冠冕 + 多重光环',
      height: '185cm',
      visualTags: ['永远背光', '两个重叠的影子', '从不摘下冠冕'],
    },
    personality: {
      mbti: 'ENFJ',
      enneagram: '4w5',
      coreTrait: '把"王冠"当成分裂的根源',
      virtue: '统一 / 远见',
      flaw: '与自己的"另一个"长期争论',
    },
    voice: {
      tone: '双重（两个声音叠加）',
      speechStyle: '每句话都会重复一次，但用词略有不同',
      catchphrase: '"我们 / 我"',
    },
    background: 'Kether 是艾因的"另一面"——但他已经分不清哪个是艾因。',
    motivation: '让"统一"不再是分裂的代名词',
    trauma: '他在第 12 次循环时分裂成了两个',
    death: '永生，但已不再是"人"',
    relationship: {
      ally: ['central'],
      rival: ['extraction'],
      complex: ['command'],
    },
    storyBeats: [
      { day: 1, beat: '递王冠', emotion: 'neutral' },
      { day: 2, beat: '两个意志争吵', emotion: 'angry' },
      { day: 3, beat: '"我们都是主管"', emotion: 'broken' },
      { day: 4, beat: '建议和解', emotion: 'sad' },
      { day: 5, beat: '两个意志合一', emotion: 'hopeful' },
    ],
    battle: { phases: 5, pattern: '他会同时是 2 个 boss——一个慈悲、一个毁灭', weakness: '让两者和解' },
  },
];

// 员工原型（Archetype）
export interface EmployeeArchetype {
  id: string;
  name: string;
  temperament: 'MELANCHOLIC' | 'SANGUINE' | 'CHOLERIC' | 'PHLEGMATIC';
  fourHumor: 'BLOOD' | 'YELLOW_BILE' | 'BLACK_BILE' | 'PHLEGM';
  description: string;
  // 偏好
  preferredWork: ('INSTINCT' | 'INSIGHT' | 'COMMUNICATION' | 'OPPRESSION' | 'SUPPRESSION' | 'CONTAINMENT')[];
  dislikedWork: ('INSTINCT' | 'INSIGHT' | 'COMMUNICATION' | 'OPPRESSION' | 'SUPPRESSION' | 'CONTAINMENT')[];
  // 表现
  successBonus: number;       // 偏好工作成功率加成
  failPenalty: number;        // 厌恶工作失败概率加成
  panicResistance: number;    // 恐慌抗性 0-1
  // 视觉
  spriteColor: string;
  portraitBg: string;
  voice: string;
  catchphrase: string;
  backstory: string;          // 简化背景
}

export const employeeArchetypes: EmployeeArchetype[] = [
  {
    id: 'guardian',
    name: '守护者',
    temperament: 'MELANCHOLIC',
    fourHumor: 'BLACK_BILE',
    description: '冷静、慎重、永不放弃的同事。她像一座沉默的灯塔。',
    preferredWork: ['SUPPRESSION', 'CONTAINMENT'],
    dislikedWork: ['OPPRESSION', 'COMMUNICATION'],
    successBonus: 0.18, failPenalty: 0.10, panicResistance: 0.7,
    spriteColor: '#4a6a8a', portraitBg: '#1a2a3a',
    voice: '低沉、谨慎',
    catchphrase: '"我还在。"',
    backstory: '前医疗兵。在伊诺克事件中失去了挚友，自此只做"活着走出来"的工作。',
  },
  {
    id: 'prodigy',
    name: '天才',
    temperament: 'SANGUINE',
    fourHumor: 'BLOOD',
    description: '聪慧、好奇、对一切都要问"为什么"的年轻人。',
    preferredWork: ['INSIGHT', 'COMMUNICATION'],
    dislikedWork: ['INSTINCT', 'OPPRESSION'],
    successBonus: 0.22, failPenalty: 0.05, panicResistance: 0.3,
    spriteColor: '#c08aff', portraitBg: '#2a1a3a',
    voice: '明亮、急促',
    catchphrase: '"我想到一个好主意！"',
    backstory: '大学辍学生，相信"理解"是解药。',
  },
  {
    id: 'soldier',
    name: '士兵',
    temperament: 'CHOLERIC',
    fourHumor: 'YELLOW_BILE',
    description: '严格、自律、以命令为先。他从不说"我不行"。',
    preferredWork: ['INSTINCT', 'OPPRESSION'],
    dislikedWork: ['INSIGHT', 'COMMUNICATION'],
    successBonus: 0.20, failPenalty: 0.08, panicResistance: 0.8,
    spriteColor: '#c14a4a', portraitBg: '#3a1a1a',
    voice: '硬朗、命令式',
    catchphrase: '"执行。"',
    backstory: '退役军人。他相信纪律能战胜一切——包括恐惧。',
  },
  {
    id: 'medic',
    name: '医师',
    temperament: 'MELANCHOLIC',
    fourHumor: 'BLACK_BILE',
    description: '温柔、细致、永远以"活着"为第一优先。',
    preferredWork: ['INSIGHT', 'CONTAINMENT'],
    dislikedWork: ['OPPRESSION'],
    successBonus: 0.15, failPenalty: 0.05, panicResistance: 0.6,
    spriteColor: '#7ac14a', portraitBg: '#1a3a1a',
    voice: '柔和、缓慢',
    catchphrase: '"先让我看看你的伤。"',
    backstory: '前急诊科护士。她见过太多死亡，所以更执着于"活着"的意义。',
  },
  {
    id: 'executive',
    name: '执行者',
    temperament: 'PHLEGMATIC',
    fourHumor: 'PHLEGM',
    description: '冷静、理性、永远保持距离感。她像一台精密的仪器。',
    preferredWork: ['CONTAINMENT', 'INSIGHT'],
    dislikedWork: ['OPPRESSION', 'INSTINCT'],
    successBonus: 0.18, failPenalty: 0.06, panicResistance: 0.9,
    spriteColor: '#4a8ac1', portraitBg: '#1a2a3a',
    voice: '平稳、机械式',
    catchphrase: '"已记录。"',
    backstory: '前精算师。她将一切都视为"概率"，包括自己活着的几率。',
  },
  {
    id: 'fanatic',
    name: '狂信者',
    temperament: 'CHOLERIC',
    fourHumor: 'YELLOW_BILE',
    description: '激烈、虔诚、相信"接触"是与神性沟通的方式。',
    preferredWork: ['COMMUNICATION', 'OPPRESSION'],
    dislikedWork: ['SUPPRESSION'],
    successBonus: 0.25, failPenalty: 0.20, panicResistance: 0.0,
    spriteColor: '#c19a4a', portraitBg: '#3a2a1a',
    voice: '高亢、神秘',
    catchphrase: '"它终于听见我了！"',
    backstory: '前邪教成员。他相信异想体是"神"，而工作是与神对话。',
  },
];

// 主管（玩家角色）背景
export const playerProfile = {
  name: '主管',
  trueName: '???',
  background: '你从前的记忆全数被抹除。你被安排在控制室，每天与十位部长与数十种异想体打交道。',
  origin: '你是艾因计划中的第 12 个主管——前 11 个都已死亡。',
  power: '你可以"回溯"——这是 TT2 协议赋予你的特权。',
  weakness: '每一次回溯，你都会失去一段记忆。',
  endGoal: '在 50 天内让所有异想体"觉醒"，从而触发最终解封。',
};
