// ============= 类型定义 =============

export type SceneType =
  | '大全景' | '全景' | '远景' | '中景' | '近景' | '特写' | '大特写';

export type MoodTone =
  | 'epic'        // 史诗
  | 'tense'       // 紧张
  | 'mystic'      // 神秘
  | 'romantic'    // 浪漫
  | 'melancholy'  // 苍凉
  | 'triumphant'  // 胜利
  | 'quiet';      // 安静

export interface StoryboardShot {
  id: number;                    // 全局镜头编号
  actId: number;                 // 所属幕
  actShotIndex: number;          // 幕内序号
  timestamp: string;             // 时间码 (mm:ss)
  duration: number;              // 单镜头秒数
  scene: SceneType;              // 景别
  camera: string;                // 运镜描述
  location: string;              // 场景地点
  characters: string[];          // 出场角色
  content: string;               // 画面内容
  dialogue?: string;             // 台词
  effects: string;               // 特效/渲染
  sound: string;                 // 音效
  music?: string;                // 背景音乐
  mood: MoodTone;                // 情绪基调
  lighting?: string;             // 光线设计
  colorPalette?: string;         // 色调
  imagePrompt?: string;          // AI 图像生成提示词
  referenceShots?: string[];     // 参考镜头
}

export interface SceneMood {
  id: string;
  name: string;                  // 场景名
  actId: number;
  atmosphere: string;            // 氛围描述
  lighting: string;              // 光线
  weather: string;               // 天气
  timeOfDay: string;             // 时段
  soundDesign: string;           // 声音设计
  colorTemperature: string;      // 色温
  visualReferences: string[];    // 视觉参考
  props: string[];               // 关键道具
}

export interface WorldLore {
  id: string;
  category: 'geography' | 'history' | 'mythology' | 'technology' | 'culture';
  title: string;
  content: string;
  era?: string;                  // 时代
}

export interface RelationshipEdge {
  from: string;                  // 人物ID
  to: string;                    // 人物ID
  type: 'ally' | 'enemy' | 'mentor' | 'family' | 'rival' | 'witness';
  description: string;
  intensity: number;             // 1-10
}

export interface Character {
  id: string;
  name: string;                  // 姓名
  alias?: string;                // 别名
  role: 'protagonist' | 'antagonist' | 'mentor' | 'support' | 'witness';
  age: string;
  appearance: string;            // 外貌
  background: string;            // 背景
  ability: string;               // 能力
  arc: string;                   // 人物弧光
}

export interface Act {
  id: number;
  title: string;
  subtitle: string;
  duration: string;              // e.g. "20min"
  durationSeconds: number;       // 1200
  theme: string;
  emotionalArc: string;          // 情绪弧线
  summary: string;               // 剧情概要
  keyBeats: string[];            // 关键节拍
  shots: StoryboardShot[];       // 12个镜头
  accentColor: string;
  glyph: string;
}

export interface Script {
  id: string;
  title: string;
  englishTitle: string;
  genre: string;
  totalDuration: string;        // 120min
  totalShots: number;           // 72
  logline: string;               // 一句话故事
  synopsis: string;              // 故事梗概
  theme: string;                 // 主题
  tone: string;                  // 基调
  visualStyle: string;           // 视觉风格
  referenceFilms: string[];      // 参考影片
  characters: Character[];
  acts: Act[];
  createdAt: string;
}

// ============= 人物 =============

export const characters: Character[] = [
  {
    id: 'old-farmer',
    name: '陈守田',
    alias: '守田翁',
    role: 'protagonist',
    age: '看似七十',
    appearance: '身材瘦削，脊背微驼，满脸沟壑，衣衫褴褛。赤脚。手掌厚实如老树皮。',
    background: '传说中的人物。千年以前以一己之力封印虚空巨兽「渊」，自此隐姓埋名于黄土高坡。世间早已忘记他的名字。',
    ability: '言出法随的宇宙级神力——可操控空间褶皱、引力场、物质几何崩解。平时以「种地」作为心境的修炼。',
    arc: '从被遗忘的农夫，到被迫重披战袍的守望者，最终以从容一推彻底湮灭虚空之敌。',
  },
  {
    id: 'yan-wuyou',
    name: '燕无忧',
    alias: '长刀客',
    role: 'antagonist',
    age: '三十又八',
    appearance: '身形如铁塔，半身机械铠甲。右眼被改造成多维数据眼，可视空间裂隙。左腰悬一柄无鞘长刀「断潮」。',
    background: '前帝国第七机甲师首席刀客。三十年前亲眼目睹父母被虚空吞噬，从此立誓以刀劈开虚空。但每劈一次，虚空就多一道裂隙。',
    ability: '刀意可切开空间裂隙，但每次使用都会加速虚空巨兽的苏醒。',
    arc: '从复仇者沦为加速灾难的罪人，最终在老头面前放下执念。',
  },
  {
    id: 'li-qinghe',
    name: '李清禾',
    alias: '青禾',
    role: 'witness',
    age: '二十二',
    appearance: '年轻女记者。马尾，帆布包，笔记本上密密麻麻写着关于「守田翁」的老人采访。',
    background: '地方报社实习记者，跟拍黄土高原的空村异象，意外撞见老头与巨兽的对决。',
    ability: '普通人类。但她的镜头是这场神战唯一的「人类记忆」。',
    arc: '从对超自然现象的怀疑，到成为人类文明记录这一刻的亲历者。',
  },
  {
    id: 'wei-zhen',
    name: '魏镇',
    alias: '守钟人',
    role: 'mentor',
    age: '九十三',
    appearance: '清瘦老者，青色长衫，左手无名指缺一节。',
    background: '山中古观最后一位守钟人。知晓守田翁的传说，手中持有唤醒他心境的「醒田铃」。',
    ability: '可唤醒守田翁尘封千年的记忆。',
    arc: '将守田翁的真相交予青禾，死于巨兽裂隙吞噬之瞬。',
  },
];

// ============= 镜头生成 =============

interface ShotTemplate {
  scene: SceneType;
  camera: string;
  content: (act: Act, idx: number) => string;
  effects: (act: Act) => string;
  sound: (act: Act) => string;
  mood: MoodTone;
  music?: string;
  dialogue?: string;
  lighting?: string;
  colorPalette?: string;
  imagePrompt?: string;
  referenceShots?: string[];
}

const act1Templates: ShotTemplate[] = [
  {
    scene: '大全景',
    camera: '卫星级俯拍 → 急速下沉',
    content: () => '地球轮廓在IMAX画幅中旋转，黄土高原的地表纹理纤毫毕现。一道金线从地表射出，划破云层——是守田翁的脚印，千年之前留下的。',
    effects: () => 'IMAX 8K渲染 / 大气层物理散射 / 长焦空间站视角',
    sound: () => '宇宙低频 / 大气摩擦',
    mood: 'epic',
    music: 'Hans Zimmer 风格 · 低频弦乐群 + 太古吟唱',
    lighting: '自然日光 · 晨曦金 · 影子极长',
    colorPalette: '琥珀金 + 大地棕 + 太空靛蓝',
    imagePrompt: 'IMAX cinematic satellite view of Earth, slowly descending to Loess Plateau in China, golden light beam piercing clouds, dust particles in atmosphere, 8K hyperrealistic, color palette amber and indigo',
    referenceShots: ['《2001太空漫游》开场', '《沙丘》沙虫降临', '《降临》七肢桶降临'],
  },
  {
    scene: '远景',
    camera: '长焦压缩 → 横移',
    content: () => '黄土高坡，老农牵着一头老牛走在田埂上。衣衫褴褛，脊背微驼，每一步都像踩在时间的刻度上。',
    effects: () => '3渲2角色 / 4K胶片颗粒 / 沙尘粒子',
    sound: () => '风声 / 老牛蹄音 / 远处鸡鸣',
    mood: 'quiet',
  },
  {
    scene: '特写',
    camera: '微距 → 慢速推近',
    content: () => '老农的手——布满老茧的掌心，插秧般的精准。指尖触到新翻的泥土时，泥土泛起淡淡金光。',
    effects: () => '皮肤毛孔级细节 / 微观粒子捕捉',
    sound: () => '泥土翻动 / 极轻微的「嗡」',
    mood: 'mystic',
  },
  {
    scene: '中景',
    camera: '稳定跟拍',
    content: () => '青禾背着相机包走在空村中。家家户户房门大开，鸡犬无声。她在一面墙上看见了一行字——「田有守者」。',
    effects: () => '虚化前景 / 异乡感色调',
    sound: () => '脚步声 / 不安的低频',
    mood: 'tense',
  },
  {
    scene: '近景',
    camera: '手持晃动',
    content: () => '青禾推开古观大门，蛛网与香灰飞舞。正殿一尊铜钟仍在自鸣，铃舌无风自动——铃舌上刻着「醒田」二字。',
    effects: () => '体积光 / 灰尘粒子 / 慢动作',
    sound: () => '钟声悠长 / 呼吸声',
    mood: 'mystic',
  },
  {
    scene: '特写',
    camera: '快速推拉',
    content: () => '魏镇自蒲团上缓缓睁眼。九十三岁的眼睛，却清澈得像黄土高原的天。',
    effects: () => '瞳孔捕捉 / 浅景深',
    sound: () => '极轻的「嗯」',
    mood: 'mystic',
  },
  {
    scene: '中景',
    camera: '固定',
    content: () => '魏镇开口，声音像古井里打上来的水：「姑娘，你来找那个种地的？」',
    effects: () => '正反打 / 自然光',
    sound: () => '方言 / 钟声余韵',
    mood: 'quiet',
  },
  {
    scene: '大全景',
    camera: '航拍 → 急速下推',
    content: () => '镜头从天空俯冲而下，黄土地表逐渐显形——一垄一垄的田地，整齐得像神留下的指纹。',
    effects: () => '航拍级视角 / 大景深',
    sound: () => '风声加剧 / 隐喻的低频',
    mood: 'epic',
  },
  {
    scene: '特写',
    camera: '固定',
    content: () => '守田翁停下手中锄头。他没有回头，却说：「来了。」',
    effects: () => '浅景深 / 暖色调',
    sound: () => '锄头入土声 / 心跳',
    mood: 'mystic',
  },
  {
    scene: '远景',
    camera: '长焦压缩',
    content: () => '远处地平线，一团黑雾缓缓升起。雾中隐约有机械铠甲的反光——是燕无忧。',
    effects: () => '空气透视 / 大气扭曲',
    sound: () => '金属摩擦 / 风的呜咽',
    mood: 'tense',
  },
  {
    scene: '近景',
    camera: '肩扛跟拍',
    content: () => '燕无忧的右眼突然变成多维数据眼，瞳孔中倒映着无数空间坐标：「渊的封印……裂了。」',
    effects: () => '数据流UI / 机械义眼细节',
    sound: () => '电子杂音 / 心跳',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '微距慢速',
    content: () => '守田翁的锄头柄上，缓缓浮现出一道金色裂纹——像心脏开始跳动。',
    effects: () => '微观粒子 / 金光绽放',
    sound: () => '清脆的「叮」',
    mood: 'mystic',
  },
];

const act2Templates: ShotTemplate[] = [
  {
    scene: '大全景',
    camera: '天顶俯拍 → 急速下坠',
    content: () => '古观上空，空间突然出现一道黑色裂隙。裂隙不断扩张，吞噬着周围的光线。',
    effects: () => '空间扭曲 / 几何崩解 / IMAX 8K',
    sound: () => '次声波 / 玻璃碎裂',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '环绕长镜头',
    content: () => '燕无忧单手抽刀，刀身呈现几何切面的冷光。他抬头看向裂隙：「三十年……终于找到了。」',
    effects: () => '机械铠甲细节 / 慢动作刀光',
    sound: () => '金属出鞘 / 风的咆哮',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '快速推拉',
    content: () => '青禾端起相机，但取景器中的画面让她愣住——裂隙中似乎有巨大的瞳孔在注视。',
    effects: () => '第一人称视角 / 相机UI叠加',
    sound: () => '快门声 / 倒吸冷气',
    mood: 'tense',
  },
  {
    scene: '全景',
    camera: '不稳定手持 → 摇晃',
    content: () => '古观屋顶的瓦片开始坠落。魏镇站起身，从怀中取出一枚铜铃。',
    effects: () => '画面割裂 / 灰尘粒子',
    sound: () => '瓦片碎裂 / 钟声被淹没',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '魏镇摇动铜铃。铃声在IMAX级低频中震荡，铜铃上「醒田」二字同时金光绽放。',
    effects: () => '声波可视化 / 金光粒子',
    sound: () => '铃声深远 / 多层混响',
    mood: 'mystic',
  },
  {
    scene: '大全景',
    camera: '航拍 → 急速拉远',
    content: () => '铃声传遍黄土高原。守田翁田地中的每一株麦穗都向铃声方向倾斜。',
    effects: () => '粒子动态 / 麦浪物理',
    sound: () => '麦浪沙沙 / 远处铃声',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '稳定跟拍',
    content: () => '守田翁放下锄头。他缓缓转身——动作慢得像揭开千年尘封。',
    effects: () => '慢动作 / 沙尘漂浮',
    sound: () => '脚步缓慢 / 呼吸',
    mood: 'mystic',
  },
  {
    scene: '特写',
    camera: '快速变焦',
    content: () => '守田翁的眼睛——从浑浊的老人眼眸，骤然变成两枚燃烧的金色太阳。',
    effects: () => '瞳孔金光绽放 / 慢动作',
    sound: () => '一声清脆的「叮」',
    mood: 'epic',
  },
  {
    scene: '全景',
    camera: '急速后退',
    content: () => '守田翁每走一步，脚下的土地隆起、生长——不，是空间在跟随他的步伐重新生长。',
    effects: () => '空间褶皱 / 建筑跟随生长 / 速度线',
    sound: () => '轰鸣 / 编钟声起',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '环绕',
    content: () => '守田翁戴上一顶破草帽，与千年前他镇守虚空时的装束一模一样。',
    effects: () => '衣袂飘动 / 3渲2',
    sound: () => '布料声 / 风的呜咽',
    mood: 'quiet',
  },
  {
    scene: '近景',
    camera: '快速横移',
    content: () => '燕无忧握紧刀柄：「你到底是谁？」',
    effects: () => '机械义眼特写',
    sound: () => '金属摩擦',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '固定',
    content: () => '守田翁嘴角一丝狡黠的笑容：「一个种地的。」',
    effects: () => '面部微表情 / 中式幽默',
    sound: () => '轻笑 / 风声',
    mood: 'quiet',
  },
];

const act3Templates: ShotTemplate[] = [
  {
    scene: '大全景',
    camera: '天顶俯拍 → 急速下坠',
    content: () => '天空中裂隙彻底撕开。一颗巨大行星——不，是「渊」的眼睛——从裂隙中涌出。',
    effects: () => '大气摩擦粒子 / 物理模拟',
    sound: () => '次声波压迫 / 耳膜刺痛',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '稳定跟拍',
    content: () => '青禾被气浪掀翻，她抱紧相机不松手——这是唯一的人类见证。',
    effects: () => '慢动作 / 沙尘粒子',
    sound: () => '风吼 / 心跳',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '青禾的相机在颤抖，但镜头仍在对焦。',
    effects: () => '相机内部UI / 浅景深',
    sound: () => '快门声',
    mood: 'tense',
  },
  {
    scene: '大全景',
    camera: '360度环绕',
    content: () => '渊的全貌显露——一个由几何碎片组成的虚空巨兽，没有实体，只有不断崩解又重组的边缘。',
    effects: () => '3渲2完全释放 / 几何崩解',
    sound: () => '宇宙低频',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '肩扛',
    content: () => '燕无忧拔刀冲上：「我劈了你——」',
    effects: () => '刀光 / 速度线',
    sound: () => '刀鸣 / 风的咆哮',
    mood: 'tense',
  },
  {
    scene: '大全景',
    camera: '航拍',
    content: () => '刀光击中渊——但渊的边缘反而被劈得更开。更多的虚空从裂隙中涌出。',
    effects: () => '空间割裂 / 物理法则崩坏',
    sound: () => '玻璃碎裂放大千倍',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '快速推拉',
    content: () => '守田翁摇头：「孩子，方向反了。」',
    effects: () => '面部微表情',
    sound: () => '平静的方言',
    mood: 'quiet',
  },
  {
    scene: '中景',
    camera: '环绕长镜头',
    content: () => '守田翁缓缓抬手，掌心朝向渊。动作如农夫推犁般随意。',
    effects: () => '宇宙神力具象化 / 空间褶皱',
    sound: () => '极轻的「嗯」',
    mood: 'epic',
  },
  {
    scene: '大全景',
    camera: '急速后退',
    content: () => '渊瞬间静止——就像时间被剪断。所有几何碎片悬停。',
    effects: () => '时间静止 / 物质崩解',
    sound: () => '绝对静音',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '长焦',
    content: () => '守田翁单手向前一推——渊开始向内坍缩。',
    effects: () => '引力透镜 / 几何崩解',
    sound: () => '爆发性白噪音',
    mood: 'epic',
  },
  {
    scene: '大全景',
    camera: '航拍 → 急速下推',
    content: () => '渊彻底湮灭。但冲击波以几何倍数扩散，环形气浪摧毁方圆百里。',
    effects: () => '空间割裂 / 毁灭与安全边界',
    sound: () => '冲击波低频扫荡',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '稳定',
    content: () => '但守田翁和青禾所在之处，安然无恙——一丈之内，皆为净土。',
    effects: () => '对比色调 / 保护气场',
    sound: () => '余波 / 远处编钟',
    mood: 'quiet',
  },
];

const act4Templates: ShotTemplate[] = [
  {
    scene: '大全景',
    camera: '航拍',
    content: () => '渊的残余仍在裂隙中蠕动。虚空不会一次死亡。',
    effects: () => '裂隙 / 几何碎片',
    sound: () => '低频呜咽',
    mood: 'tense',
  },
  {
    scene: '中景',
    camera: '肩扛',
    content: () => '燕无忧跌坐在地，握刀的手在颤抖：「为什么……为什么我劈不开它？」',
    effects: () => '机械铠甲细节',
    sound: () => '喘息 / 金属摩擦',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '守田翁看向燕无忧的右眼——那只多维数据眼。',
    effects: () => '眼中有倒影',
    sound: () => '电子杂音',
    mood: 'quiet',
  },
  {
    scene: '中景',
    camera: '稳定',
    content: () => '守田翁：「你那刀意能切开空间，却切不开心中的虚空。」',
    effects: () => '正反打',
    sound: () => '方言',
    mood: 'mystic',
  },
  {
    scene: '特写',
    camera: '快速推拉',
    content: () => '青禾的相机仍在录。她拍到守田翁眼中的人间烟火。',
    effects: () => '第一人称相机',
    sound: () => '快门',
    mood: 'quiet',
  },
  {
    scene: '大全景',
    camera: '天顶俯拍',
    content: () => '古观方向，魏镇抬头看向天空——裂隙正在向他所在的方向扩散。',
    effects: () => '时间紧迫感',
    sound: () => '编钟被淹没',
    mood: 'tense',
  },
  {
    scene: '中景',
    camera: '跟拍',
    content: () => '魏镇摇动铜铃，但铃声越来越弱——铃身开始出现裂纹。',
    effects: () => '裂纹蔓延',
    sound: () => '铃声破碎',
    mood: 'tense',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '魏镇的脸庞上露出平静的笑容——像一个种了一辈子地的老农。',
    effects: () => '浅景深 / 慢动作',
    sound: () => '极轻的呼吸',
    mood: 'melancholy',
  },
  {
    scene: '中景',
    camera: '环绕',
    content: () => '魏镇将铜铃抛向空中。铃声化作万千金线，飞向守田翁的方向。',
    effects: () => '金线轨迹',
    sound: () => '铃声飞升',
    mood: 'mystic',
  },
  {
    scene: '大全景',
    camera: '急速下推',
    content: () => '裂隙吞噬古观。魏镇的身影在虚空中被缓缓抹去。',
    effects: () => '虚空吞噬 / 几何崩解',
    sound: () => '低频哀鸣',
    mood: 'melancholy',
  },
  {
    scene: '特写',
    camera: '固定',
    content: () => '守田翁眼中闪过一丝哀伤，但只有一丝。',
    effects: () => '面部微表情',
    sound: () => '极轻的「唉」',
    mood: 'melancholy',
  },
  {
    scene: '大全景',
    camera: '航拍',
    content: () => '古观消失之处，只剩一颗铜铃坠落在焦土之上。',
    effects: () => '遗物特写',
    sound: () => '铃声最后一声',
    mood: 'melancholy',
  },
];

const act5Templates: ShotTemplate[] = [
  {
    scene: '大全景',
    camera: '天顶俯拍',
    content: () => '裂隙没有愈合，反而在吸收渊的残余后变得更加巨大。',
    effects: () => '扩张裂隙',
    sound: () => '次声波加剧',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '稳定',
    content: () => '守田翁抬头：「孩子，过来。」',
    effects: () => '逆光剪影',
    sound: () => '平静',
    mood: 'quiet',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '守田翁将那颗坠落的铜铃拾起，铃上的「醒田」二字仍在发光。',
    effects: () => '金光粒子',
    sound: () => '铃声微弱',
    mood: 'mystic',
  },
  {
    scene: '中景',
    camera: '肩扛',
    content: () => '守田翁将铜铃递给燕无忧：「你那刀意，少了一颗心。」',
    effects: () => '动作捕捉',
    sound: () => '金属轻响',
    mood: 'quiet',
  },
  {
    scene: '特写',
    camera: '快速推拉',
    content: () => '燕无忧的右眼第一次流下一滴泪——三十年来第一次。',
    effects: () => '泪光 / 机械眼',
    sound: () => '金属摩擦减弱',
    mood: 'melancholy',
  },
  {
    scene: '中景',
    camera: '环绕',
    content: () => '守田翁开始脱下草帽，露出一头银发——千年的重量。',
    effects: () => '衣袂飘动',
    sound: () => '布料',
    mood: 'epic',
  },
  {
    scene: '大全景',
    camera: '航拍 → 急速下推',
    content: () => '守田翁每走一步，脚下便开出一朵金莲——水墨画风的笔触。',
    effects: () => '水墨画风格 / 几何崩解',
    sound: () => '编钟声起',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '狂战运镜',
    content: () => '守田翁连续出拳——每一拳都在宇宙中形成涟漪般的冲击波。',
    effects: () => '速度线 / 动态模糊',
    sound: () => '打击音效层层叠加',
    mood: 'epic',
  },
  {
    scene: '大全景',
    camera: '360度环绕',
    content: () => '裂隙开始被冲击波挤压，开始向内坍缩。',
    effects: () => '空间割裂 / 物质崩解',
    sound: () => '宇宙低频',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '快速横移',
    content: () => '守田翁跃入空中。全身化为水墨金龙的形态。',
    effects: () => '水墨金龙 / 中国神话美学',
    sound: () => '龙吟',
    mood: 'epic',
  },
  {
    scene: '大全景',
    camera: '航拍',
    content: () => '金龙贯穿裂隙。裂隙在龙身中崩塌、湮灭。',
    effects: () => '3渲2完全释放 / 金光绽放',
    sound: () => '龙吟 + 宇宙寂静',
    mood: 'triumphant',
  },
  {
    scene: '大全景',
    camera: '航拍',
    content: () => '裂隙彻底消失。但守田翁没有从空中落下。',
    effects: () => '留白 / 慢动作',
    sound: () => '极轻的风',
    mood: 'melancholy',
  },
];

const act6Templates: ShotTemplate[] = [
  {
    scene: '大全景',
    camera: '航拍',
    content: () => '天空重新变得平静。黄土高原的麦田仍在风中摇曳。',
    effects: () => '《沙丘》低饱和色调',
    sound: () => '风声 / 麦浪',
    mood: 'quiet',
  },
  {
    scene: '中景',
    camera: '稳定',
    content: () => '燕无忧仍握着铜铃，跪在焦土之上。',
    effects: () => '遗物特写',
    sound: () => '极轻的铃声',
    mood: 'melancholy',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '青禾走到他身旁，没有说话，只是把镜头对准他。',
    effects: () => '记者视角',
    sound: () => '快门',
    mood: 'quiet',
  },
  {
    scene: '大全景',
    camera: '航拍',
    content: () => '远方地平线，太空舰队的剪影出现——文明对这一刻的回应。',
    effects: () => '《沙丘》色调',
    sound: () => '引擎低频',
    mood: 'epic',
  },
  {
    scene: '中景',
    camera: '固定',
    content: () => '青禾的镜头扫过麦田。每株麦穗都向天空微微倾斜——像在鞠躬。',
    effects: () => '麦浪物理',
    sound: () => '麦浪沙沙',
    mood: 'quiet',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '青禾翻开笔记本。扉页上写着——「田有守者」。',
    effects: () => '手写字迹',
    sound: () => '翻页声',
    mood: 'quiet',
  },
  {
    scene: '中景',
    camera: '稳定',
    content: () => '燕无忧站起身，将铜铃挂在胸前。',
    effects: () => '动作捕捉',
    sound: () => '金属轻响',
    mood: 'quiet',
  },
  {
    scene: '大全景',
    camera: '缓慢拉升',
    content: () => '夕阳西下。两个身影的剪影在麦田中拉得很长。',
    effects: () => '《沙丘》低饱和',
    sound: () => '风声',
    mood: 'melancholy',
  },
  {
    scene: '特写',
    camera: '微距',
    content: () => '青禾的相机里，存储卡红灯闪烁——这是她一生最重要的照片。',
    effects: () => '相机UI',
    sound: () => '电子提示',
    mood: 'quiet',
  },
  {
    scene: '中景',
    camera: '稳定',
    content: () => '燕无忧开口，声音像远方传来：「我们……是不是该种点东西？」',
    effects: () => '面部微表情',
    sound: () => '方言',
    mood: 'quiet',
  },
  {
    scene: '特写',
    camera: '固定',
    content: () => '青禾笑了——是这一天里她第一次笑。',
    effects: () => '浅景深',
    sound: () => '极轻的笑',
    mood: 'romantic',
  },
  {
    scene: '大全景',
    camera: '航拍 → 黑屏',
    content: () => '画面缓缓拉远，色调彻底归于《沙丘》低饱和的苍凉。',
    effects: () => '黑屏 / 完结',
    sound: () => '编钟最后一声',
    mood: 'melancholy',
  },
];

const allTemplates: ShotTemplate[][] = [
  act1Templates,
  act2Templates,
  act3Templates,
  act4Templates,
  act5Templates,
  act6Templates,
];

// ============= 构建剧本 =============

const actMetadata = [
  {
    title: '第一幕：醒田',
    subtitle: 'Awakening the Field',
    theme: '一个被遗忘的农夫，一群被遗忘的人，一片等待被守望的田。',
    summary: '现代记者青禾在黄土高原的空村中追踪异象。古观最后一位守钟人魏镇，将一段被掩埋千年的真相缓缓揭开——田有守者，名守田翁。',
    keyBeats: ['空村异象', '古观相遇', '醒田铃响', '守田翁转身'],
    durationSeconds: 1200,
    accentColor: '#d4af37',
    glyph: '壹',
  },
  {
    title: '第二幕：虚空刀',
    subtitle: 'Blade of the Void',
    theme: '复仇者的刀，越劈越深的不是虚空，是自己的执念。',
    summary: '三十年前失去父母的刀客燕无忧，以机甲之躯劈向虚空巨兽「渊」的封印。守田翁被迫从千年隐居中苏醒，以一顶破草帽的从容，重披战袍。',
    keyBeats: ['裂隙初现', '铃响八方', '守田翁转身', '一个种地的'],
    durationSeconds: 1200,
    accentColor: '#ff6b35',
    glyph: '贰',
  },
  {
    title: '第三幕：渊临',
    subtitle: 'The Abyss Arrives',
    theme: '神不需要武器，神只需要伸手。',
    summary: '虚空巨兽「渊」自裂隙中涌出，无实体、只有几何崩解的边缘。守田翁以农夫推犁般的随意动作，让渊瞬间静止、坍缩、湮灭。',
    keyBeats: ['渊初显形', '燕无忧劈空', '守田翁推掌', '渊之湮灭'],
    durationSeconds: 1200,
    accentColor: '#e85d04',
    glyph: '叁',
  },
  {
    title: '第四幕：钟灭',
    subtitle: 'The Bell Silenced',
    theme: '有些人以死为钟声，只为唤醒那个种地的。',
    summary: '古观守钟人魏镇在裂隙逼近时摇动铜铃，最终以身殉铃，将「醒田」二字的回响送入守田翁的心中。',
    keyBeats: ['魏镇摇铃', '金线飞升', '古观被吞', '铃声最后一声'],
    durationSeconds: 1200,
    accentColor: '#d62828',
    glyph: '肆',
  },
  {
    title: '第五幕：神战',
    subtitle: 'The Divine Duel',
    theme: '每一步开一朵金莲，每一拳是宇宙的涟漪。',
    summary: '守田翁将铜铃托付给燕无忧，自己跃入空中化为水墨金龙，贯穿虚空裂隙。神战的余波中，他选择留下。',
    keyBeats: ['铃托付', '每步金莲', '金龙贯穿', '守田翁未归'],
    durationSeconds: 1200,
    accentColor: '#9d0208',
    glyph: '伍',
  },
  {
    title: '第六幕：余韵',
    subtitle: 'The Quiet Aftermath',
    theme: '沙丘的苍凉里，传来一声东方编钟。',
    summary: '太空舰队出现，但麦田仍在风中摇曳。燕无忧戴上了那枚铜铃，青禾合上了笔记本。『田有守者』，从此有了新的守望。',
    keyBeats: ['麦田鞠躬', '舰队的剪影', '我们种点东西', '编钟余韵'],
    durationSeconds: 1200,
    accentColor: '#6c757d',
    glyph: '陆',
  },
];

// 时间码生成器
const generateTimestamp = (actIndex: number, shotIndex: number, secondsPerShot: number): string => {
  const totalSeconds = actIndex * 1200 + shotIndex * secondsPerShot;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(3, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const SECONDS_PER_SHOT = 100; // 120min / 72shots

// ============= 自动增强细节 =============

const lightingByMood: Record<MoodTone, string> = {
  epic: '强对比 · 伦勃朗光 · 史诗轮廓',
  tense: '低角度侧光 · 阴影吞没 · 焦灼',
  mystic: '体积光 · 神光穿透 · 雾霭',
  romantic: '暖色柔光 · 黄金时刻 · 漫射',
  melancholy: '阴天散射 · 偏冷蓝 · 烟雨',
  triumphant: '金光万道 · 高调 · 圣光',
  quiet: '自然柔光 · 静谧 · 薄雾',
};

const colorByMood: Record<MoodTone, string> = {
  epic: '金 + 棕 + 血红',
  tense: '冷铁 + 火橙 + 黑',
  mystic: '靛青 + 紫 + 银',
  romantic: '蜜糖 + 桃粉 + 暖白',
  melancholy: '沙土 + 雾蓝 + 苍灰',
  triumphant: '金 + 朱红 + 圣白',
  quiet: '暖白 + 麦黄 + 浅金',
};

const musicByMood: Record<MoodTone, string> = {
  epic: 'Hans Zimmer 风格 · 低频弦乐群 + 太古吟唱',
  tense: 'Tension Strings · 金属打击 · 心跳鼓',
  mystic: '空灵梵唱 + 风铃 + 古琴',
  romantic: '竖琴泛音 + 弦乐四重奏',
  melancholy: '古琴独奏 + 大提琴低吟',
  triumphant: '铜管全奏 + 定音鼓 + 合唱',
  quiet: '风声 + 麦浪 + 鸟鸣',
};

const referenceByMood: Record<MoodTone, string[]> = {
  epic: ['《2001太空漫游》', '《沙丘》', '《指环王》'],
  tense: ['《一代宗师》', '《老男孩》走廊战', '《杀死比尔》'],
  mystic: ['《一代宗师》金楼', '《卧虎藏龙》竹林', '《刺客聂隐娘》'],
  romantic: ['《爱在黎明破晓前》', '《花样年华》'],
  melancholy: ['《沙丘》', '《银翼杀手2049》', '《大佛普拉斯》'],
  triumphant: ['《指环王》圣盔谷', '《复仇者联盟》集结'],
  quiet: ['《小森林》', '《人生果实》', '《一一》'],
};

const buildActs = (): Act[] => {
  return actMetadata.map((meta, actIdx) => {
    const templates = allTemplates[actIdx] ?? [];
    const shots: StoryboardShot[] = templates.map((tmpl, idx) => {
      const contentFn = tmpl.content as unknown as (act: Act, idx: number) => string;
      const effectsFn = tmpl.effects as unknown as (act: Act) => string;
      const soundFn = tmpl.sound as unknown as (act: Act) => string;
      const resolveField = (field: unknown): string | undefined => {
        if (typeof field === 'function') {
          return (field as () => string | undefined)();
        }
        if (typeof field === 'string') {
          return field;
        }
        return undefined;
      };

      const resolveArray = (field: unknown): string[] | undefined => {
        if (typeof field === 'function') {
          return (field as () => string[] | undefined)();
        }
        if (Array.isArray(field)) {
          return field;
        }
        return undefined;
      };

      return {
        id: actIdx * 12 + idx + 1,
        actId: actIdx + 1,
        actShotIndex: idx + 1,
        timestamp: generateTimestamp(actIdx, idx, SECONDS_PER_SHOT),
        duration: SECONDS_PER_SHOT,
        scene: tmpl.scene,
        camera: tmpl.camera,
        location: locationByAct(actIdx),
        characters: charactersByAct(actIdx, idx),
        content: contentFn({} as Act, idx),
        effects: effectsFn({} as Act),
        sound: soundFn({} as Act),
        music: resolveField(tmpl.music) ?? musicByMood[tmpl.mood],
        dialogue: resolveField(tmpl.dialogue),
        lighting: resolveField(tmpl.lighting) ?? lightingByMood[tmpl.mood],
        colorPalette: resolveField(tmpl.colorPalette) ?? colorByMood[tmpl.mood],
        imagePrompt: resolveField(tmpl.imagePrompt) ?? generateDefaultPrompt(tmpl, actIdx, idx),
        referenceShots: resolveArray(tmpl.referenceShots) ?? referenceByMood[tmpl.mood],
        mood: tmpl.mood,
      };
    });

    return {
      id: actIdx + 1,
      title: meta.title,
      subtitle: meta.subtitle,
      duration: `${Math.round(meta.durationSeconds / 60)}min`,
      durationSeconds: meta.durationSeconds,
      theme: meta.theme,
      emotionalArc: emotionalArcByAct(actIdx),
      summary: meta.summary,
      keyBeats: meta.keyBeats,
      shots,
      accentColor: meta.accentColor,
      glyph: meta.glyph,
    };
  });
};

const generateDefaultPrompt = (tmpl: ShotTemplate, actIdx: number, shotIdx: number): string => {
  return `IMAX cinematic ${tmpl.scene} shot, ${tmpl.camera}, Act ${actIdx + 1} shot ${shotIdx + 1}, ${colorByMood[tmpl.mood]} color palette, ${lightingByMood[tmpl.mood]}, 8K hyperrealistic, ${tmpl.mood} atmosphere, Loess Plateau China mythological epic, Chinese ink painting meets sci-fi`;
};

// ============= 场景气氛板 =============

export const sceneMoods: SceneMood[] = [
  {
    id: 'mood-1',
    name: '黄土高坡',
    actId: 1,
    atmosphere: '太古、宁静、神秘的东方乡土',
    lighting: '晨曦斜照 · 暖金柔光',
    weather: '晴朗微风 · 偶有沙尘',
    timeOfDay: '清晨 06:00',
    soundDesign: '风声 + 麦浪 + 老牛蹄音 + 远处鸡鸣',
    colorTemperature: '3200K 暖金',
    visualReferences: ['《黄土地》', '《一秒钟》', '《人生》'],
    props: ['破草帽', '老锄头', '水烟袋'],
  },
  {
    id: 'mood-2',
    name: '古观废墟',
    actId: 1,
    atmosphere: '尘封、庄严、藏有千年秘密',
    lighting: '屋顶透光 · 体积光柱',
    weather: '阴天 · 微雨',
    timeOfDay: '正午 12:00',
    soundDesign: '编钟余韵 + 雨打瓦 + 香灰落地',
    colorTemperature: '5600K 冷白',
    visualReferences: ['《刺客聂隐娘》', '《卧虎藏龙》', '《英雄》'],
    props: ['古观铜钟', '醒田铃', '香案', '铜镜'],
  },
  {
    id: 'mood-3',
    name: '宇宙裂隙',
    actId: 3,
    atmosphere: '虚空、压迫、几何崩解的末世感',
    lighting: '无主光 · 裂隙冷光 · 粒子辉',
    weather: '虚空 / 无天气',
    timeOfDay: '永恒',
    soundDesign: '次声波 + 玻璃碎裂 + 粒子摩擦',
    colorTemperature: '冷青 7000K',
    visualReferences: ['《降临》', '《湮灭》', '《银翼杀手2049》'],
    props: ['几何碎片', '空间褶皱', '引力气浪'],
  },
  {
    id: 'mood-4',
    name: '麦田黄昏',
    actId: 6,
    atmosphere: '沙丘式的苍凉 + 东方编钟的余韵',
    lighting: '夕阳低角度 · 影子极长 · 暖橙',
    weather: '晴 · 微风',
    timeOfDay: '黄昏 18:30',
    soundDesign: '编钟 + 风声 + 太空舰队引擎低频',
    colorTemperature: '2400K 暖橙',
    visualReferences: ['《沙丘》', '《天地玄黄》', '《一一》'],
    props: ['铜铃', '相机', '麦穗'],
  },
];

// ============= 世界观 =============

export const worldLore: WorldLore[] = [
  {
    id: 'lore-1',
    category: 'geography',
    title: '黄土高坡',
    content: '位于中国西北部，海拔 1500-2000 米。千年的风沙将这里雕琢成沟壑纵横的褶皱，被称为"上帝指纹"。这里曾是华夏文明的发源地之一。',
    era: '永恒',
  },
  {
    id: 'lore-2',
    category: 'geography',
    title: '守田翁的田地',
    content: '位于黄土高坡的一处偏僻山谷。传说中，每一垄田都对应着天上的一颗星辰。当守田翁转身时，所有田垄会跟随他的脚步隆起、生长。',
  },
  {
    id: 'lore-3',
    category: 'history',
    title: '千年封印',
    content: '公元 1026 年。虚空巨兽「渊」自裂隙降临，几乎吞噬整个中原。一位无名农夫以一己之力将其封印于"醒田"之中。从此农夫隐姓埋名，自称守田翁。',
    era: '北宋 · 1026年',
  },
  {
    id: 'lore-4',
    category: 'history',
    title: '虚空苏醒',
    content: '近三十年来，渊的封印开始出现裂隙。人类将其解释为"空间异常现象"。但古观守钟人魏镇知道：守田翁的封印正在失效。',
    era: '现代',
  },
  {
    id: 'lore-5',
    category: 'mythology',
    title: '虚空巨兽·渊',
    content: '没有实体的虚空存在，由不断崩解又重组的几何碎片构成。它的"身体"就是空间本身。唯一能封印它的，是更强大的空间之力——言出法随。',
  },
  {
    id: 'lore-6',
    category: 'mythology',
    title: '醒田铃',
    content: '古观传下来的铜铃，铃舌刻"醒田"二字。可唤醒守田翁尘封千年的记忆。铃声在 IMAX 级低频中震荡，能让高原上的每一株麦穗都向铃声方向倾斜。',
  },
  {
    id: 'lore-7',
    category: 'mythology',
    title: '炽龙',
    content: '水墨风格的虚影之龙，仅存于守田翁的言出法随之间。盘旋时如同东方水墨画活过来，释放的威压可让敌方时空扭曲。',
  },
  {
    id: 'lore-8',
    category: 'technology',
    title: '多维数据眼',
    content: '燕无忧的右眼被改造成的机械义眼。可视空间裂隙、维度坐标、引力场。是当今人类科技的巅峰——但也让他陷入了"用刀劈开虚空"的执念。',
  },
  {
    id: 'lore-9',
    category: 'culture',
    title: '田有守者',
    content: '高原上世代流传的一句话。意为"田地有守护之人"。守田翁的传说演变成了对所有"在人间烟火中守望"之人的隐喻——可以是种地的农夫，也可以是按下快门的记者。',
  },
];

// ============= 人物关系 =============

export const relationships: RelationshipEdge[] = [
  { from: 'old-farmer', to: 'yan-wuyou', type: 'mentor', description: '点化其放下执念', intensity: 7 },
  { from: 'yan-wuyou', to: 'old-farmer', type: 'rival', description: '质问、寻仇、最终臣服', intensity: 8 },
  { from: 'old-farmer', to: 'wei-zhen', type: 'ally', description: '千年知己，以铃声相系', intensity: 9 },
  { from: 'wei-zhen', to: 'old-farmer', type: 'mentor', description: '为其守住最后的人间', intensity: 10 },
  { from: 'li-qinghe', to: 'old-farmer', type: 'witness', description: '记录这一刻的人类', intensity: 6 },
  { from: 'li-qinghe', to: 'yan-wuyou', type: 'ally', description: '陪伴他走过余波', intensity: 5 },
  { from: 'wei-zhen', to: 'li-qinghe', type: 'mentor', description: '将真相托付于她', intensity: 8 },
  { from: 'yan-wuyou', to: 'wei-zhen', type: 'rival', description: '间接被其死亡触动', intensity: 4 },
];

const locationByAct = (actIdx: number): string => {
  const locs = [
    ['黄土高原', '古观', '田埂', '高原空村'],
    ['古观上空', '高原田地', '守田翁院落'],
    ['裂隙上空', '高原焦土'],
    ['古观', '高原焦土', '守田翁田地'],
    ['裂隙上空', '高原上空', '宇宙边际'],
    ['黄土高原', '麦田', '太空舰队'],
  ];
  const set = locs[actIdx] ?? ['黄土高原'];
  return set[Math.floor(Math.random() * set.length)] ?? '黄土高原';
};

const charactersByAct = (actIdx: number, shotIdx: number): string[] => {
  const all = ['陈守田', '燕无忧', '李清禾', '魏镇'];
  switch (actIdx) {
    case 0:
      if (shotIdx < 3) return [all[0]];
      if (shotIdx < 5) return [all[2]];
      if (shotIdx < 7) return [all[2], all[3]];
      return [all[0], all[1]];
    case 1:
      return [all[0], all[1], all[2]];
    case 2:
      return [all[0], all[1], all[2]];
    case 3:
      return [all[0], all[1], all[2], all[3]];
    case 4:
      return [all[0], all[1]];
    case 5:
      return [all[1], all[2]];
    default:
      return [all[0]];
  }
};

const emotionalArcByAct = (actIdx: number): string => {
  const arcs = [
    '安静 → 神秘 → 不安',
    '紧张 → 神秘 → 释然',
    '紧张 → 紧张 → 史诗 → 安静',
    '紧张 → 苍凉 → 神秘',
    '史诗 → 苍凉 → 史诗 → 苍凉',
    '安静 → 苍凉 → 安静',
  ];
  return arcs[actIdx] ?? '';
};

export const script: Script = {
  id: 'duel-across-cosmos',
  title: '对决',
  englishTitle: 'A Duel Across the Cosmos',
  genre: '神话史诗 · 科幻 · 武侠',
  totalDuration: '120min',
  totalShots: 72,
  logline: '千年以前封印虚空巨兽的农夫，被一个复仇刀客和一个年轻记者的闯入而重披战袍——一推湮星，一跃化龙，宇宙级的对决最终归于麦田与编钟。',
  synopsis: '传说中的人物陈守田，千年以前以一己之力封印虚空巨兽「渊」，自此隐姓埋名于黄土高坡。三十年前，巨兽开始苏醒，机甲刀客燕无忧以劈开虚空的方式复仇，却每劈一次都让裂隙更深。年轻女记者李清禾在高原空村中撞见真相，而古观守钟人魏镇以生命为代价，摇响「醒田」之铃——召唤那个种地的老农，重披战袍。',
  theme: '田有守者——人间的烟火与宇宙的神力，在一片麦田中和解。',
  tone: '史诗 · 苍凉 · 中式幽默',
  visualStyle: 'IMAX 8K 渲染 / 3渲2 角色融入 IC 级现实环境 / 水墨画风格 / 《沙丘》低饱和色调',
  referenceFilms: ['《沙丘》', '《一代宗师》', '《英雄》', '《降临》'],
  characters,
  acts: buildActs(),
  createdAt: '2026-06-11',
};

// ============= 工具函数 =============

export const getTotalShots = (): number => script.acts.reduce((sum, a) => sum + a.shots.length, 0);

export const getShotById = (id: number): StoryboardShot | undefined => {
  for (const act of script.acts) {
    const found = act.shots.find((s) => s.id === id);
    if (found) return found;
  }
  return undefined;
};

export const getActById = (id: number): Act | undefined => {
  return script.acts.find((a) => a.id === id);
};
