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

// ============= 道具与服装 =============

export interface Prop {
  id: string;
  name: string;
  category: 'weapon' | 'tool' | 'costume' | 'document' | 'ritual' | 'tech';
  owner?: string;                 // 归属角色
  significance: string;           // 重要性
  appearsIn: number[];            // 出现镜头
  estimatedValue?: string;        // 估价
}

export interface Costume {
  id: string;
  characterName: string;
  outfit: string;
  scenes: string;                 // 适用场景
  details: string;
}

export const props: Prop[] = [
  {
    id: 'prop-1',
    name: '破草帽',
    category: 'costume',
    owner: '陈守田',
    significance: '千年前封印渊时的装束，重披战袍的标志',
    appearsIn: [6, 10, 19, 20, 21, 25, 26, 50, 64, 67, 70],
  },
  {
    id: 'prop-2',
    name: '醒田铃',
    category: 'ritual',
    owner: '魏镇 → 燕无忧',
    significance: '可唤醒守田翁尘封记忆的核心道具',
    appearsIn: [5, 17, 18, 19, 35, 36, 37, 53, 54, 55, 60, 70],
  },
  {
    id: 'prop-3',
    name: '断潮刀',
    category: 'weapon',
    owner: '燕无忧',
    significance: '无鞘长刀，可切开空间裂隙',
    appearsIn: [10, 12, 20, 30, 31, 50, 51, 52, 60, 61, 62],
    estimatedValue: '价值无价 · 传说兵器',
  },
  {
    id: 'prop-4',
    name: '多维数据眼',
    category: 'tech',
    owner: '燕无忧',
    significance: '机械义眼，可视空间裂隙与维度',
    appearsIn: [11, 12, 20, 21, 30, 40, 50, 60],
  },
  {
    id: 'prop-5',
    name: '相机 + 存储卡',
    category: 'tech',
    owner: '李清禾',
    significance: '记录这一刻的人类唯一见证',
    appearsIn: [4, 5, 9, 13, 17, 18, 28, 31, 50, 66, 67, 68, 71],
  },
  {
    id: 'prop-6',
    name: '古观铜钟',
    category: 'ritual',
    significance: '自鸣千年的古钟，与醒田铃共鸣',
    appearsIn: [5, 18, 19, 35, 36, 37],
  },
  {
    id: 'prop-7',
    name: '笔记本',
    category: 'document',
    owner: '李清禾',
    significance: '扉页写着「田有守者」',
    appearsIn: [13, 28, 67, 71],
  },
  {
    id: 'prop-8',
    name: '农具（锄头、镰刀）',
    category: 'tool',
    owner: '陈守田',
    significance: '耕种姿态的隐喻——心境的修炼',
    appearsIn: [2, 3, 6, 9, 19, 20, 24, 27],
  },
];

export const costumes: Costume[] = [
  {
    id: 'costume-1',
    characterName: '陈守田',
    outfit: '农夫装扮',
    scenes: '所有镜头',
    details: '破旧的对襟布衣，灰褐色，宽大袖口。赤脚。腰间系一根草绳。手掌厚实如老树皮，指甲缝有洗不净的泥土。',
  },
  {
    id: 'costume-2',
    characterName: '陈守田',
    outfit: '战袍（千年之前）',
    scenes: '回忆 / 闪回镜头',
    details: '无具体服装，象征性的——破草帽、青灰色长衫。',
  },
  {
    id: 'costume-3',
    characterName: '燕无忧',
    outfit: '机械铠甲',
    scenes: '所有镜头',
    details: '半身机械铠甲，深铁灰，带有锈迹与战痕。右眼多维数据眼。腰部断潮刀。',
  },
  {
    id: 'costume-4',
    characterName: '李清禾',
    outfit: '年轻记者',
    scenes: '所有镜头',
    details: '牛仔外套，内搭白 T 恤。马尾。帆布包斜挎。胶卷相机（徕卡 M3 复古款）。',
  },
  {
    id: 'costume-5',
    characterName: '魏镇',
    outfit: '青色长衫',
    scenes: '第 1-4 幕',
    details: '清瘦，青色长衫，左手无名指缺一节。头发花白但精神矍铄。',
  },
];

// ============= 对白剧本页 =============

export interface DialogueLine {
  actId: number;
  shotId: number;
  character: string;
  parenthetical?: string;           // 表演提示
  line: string;                     // 对白
  tone?: string;                    // 语气
}

export const dialogueScript: DialogueLine[] = [
  { actId: 1, shotId: 7, character: '魏镇', line: '姑娘，你来找那个种地的？', tone: '平静' },
  { actId: 1, shotId: 9, character: '守田翁', parenthetical: '没有回头', line: '来了。', tone: '极轻' },
  { actId: 1, shotId: 12, character: '陈守田', parenthetical: '放下锄头', line: '……', tone: '沉默' },

  { actId: 2, shotId: 17, character: '魏镇', parenthetical: '摇动铜铃', line: '醒来吧，守田。', tone: '苍老' },
  { actId: 2, shotId: 20, character: '陈守田', line: '一个种地的。', tone: '狡黠' },
  { actId: 2, shotId: 21, character: '燕无忧', line: '你到底是谁？', tone: '质问' },

  { actId: 3, shotId: 28, character: '李清禾', parenthetical: '对镜头说', line: '我在写一个关于种地的老头。今天他不在田里。', tone: '记者腔' },
  { actId: 3, shotId: 31, character: '陈守田', line: '孩子，方向反了。', tone: '平静' },

  { actId: 4, shotId: 40, character: '燕无忧', line: '为什么……为什么我劈不开它？', tone: '绝望' },
  { actId: 4, shotId: 42, character: '陈守田', line: '你那刀意能切开空间，却切不开心中的虚空。', tone: '平静' },
  { actId: 4, shotId: 45, character: '魏镇', line: '（铃声化作金线飞升）', tone: '无声' },

  { actId: 5, shotId: 50, character: '陈守田', line: '孩子，过来。', tone: '平静' },
  { actId: 5, shotId: 52, character: '陈守田', line: '你那刀意，少了一颗心。', tone: '温和' },

  { actId: 6, shotId: 67, character: '李清禾', parenthetical: '翻开笔记本', line: '「田有守者」', tone: '低语' },
  { actId: 6, shotId: 70, character: '燕无忧', line: '我们……是不是该种点东西？', tone: '远方传来' },
  { actId: 6, shotId: 71, character: '李清禾', parenthetical: '笑了', line: '（第一次笑）', tone: '轻' },
];

// ============= 分镜草图符号 =============

export interface StoryboardFrame {
  shotId: number;
  composition: string;             // 构图符号（ASCII art）
  focalPoint: string;              // 焦点描述
  foreground: string;              // 前景
  midground: string;               // 中景
  background: string;              // 背景
  cameraAngle: 'eye-level' | 'low' | 'high' | 'birds-eye' | 'dutch' | 'over-shoulder';
  shotType: 'close-up' | 'medium' | 'wide' | 'extreme-wide' | 'insert';
}

export const generateStoryboardFrame = (shotId: number, scene: string, camera: string, mood: string): StoryboardFrame => {
  const isLow = camera.includes('仰拍') || camera.includes('低角度');
  const isHigh = camera.includes('俯拍') || camera.includes('天顶') || camera.includes('航拍');
  const isExtremeWide = scene === '大全景';
  const isClose = scene === '特写' || scene === '大特写';

  let composition = '';
  if (isExtremeWide) {
    composition = `┌────────────────────────────┐
│                            │
│   ◯ ◯ ◯   远 山 / 裂 隙     │
│                            │
│        ●●●                 │
│       (人物剪影)            │
│                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━ │
│  (地平线 / 空间分界)        │
└────────────────────────────┘`;
  } else if (isClose) {
    composition = `┌────────────────────────────┐
│  ┌──────────────────┐      │
│  │                  │      │
│  │      (  )        │      │
│  │    焦 点 在 此     │      │
│  │                  │      │
│  └──────────────────┘      │
│                            │
│     背景虚化 · 浅景深        │
└────────────────────────────┘`;
  } else {
    composition = `┌────────────────────────────┐
│                            │
│      (前景)                │
│                            │
│         ◯                  │
│        (人物)              │
│                            │
│      (背景)                │
│                            │
└────────────────────────────┘`;
  }

  const cameraAngle: StoryboardFrame['cameraAngle'] = isLow ? 'low' : isHigh ? 'high' : 'eye-level';
  const shotType: StoryboardFrame['shotType'] = isExtremeWide ? 'extreme-wide' : isClose ? 'close-up' : scene === '中景' || scene === '近景' ? 'medium' : 'wide';

  return {
    shotId,
    composition,
    focalPoint: `${mood}情绪的视觉中心`,
    foreground: scene === '大全景' ? '大地纹理 · 沙尘' : '次要元素',
    midground: '主要人物动作',
    background: '环境 / 远景 / 几何元素',
    cameraAngle,
    shotType,
  };
};

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

// ============= 音乐与声音设计 =============

export interface MusicCue {
  id: string;
  actId: number;
  shotId: number;
  theme: string;             // 主题，如"低沉吟唱"、"战鼓激昂"
  intensity: number;         // 1-10
  tempo: string;             // "Largo 60 BPM"
  musicalKey: string;        // "C minor"
  instruments: string[];     // 主奏乐器
  reference: string;         // 参考作曲家/影片
  description: string;       // 描述
}

export interface Leitmotif {
  id: string;
  characterName: string;
  alias: string;
  melody: string;            // 文字描述旋律轮廓
  musicalKey: string;
  tempo: string;
  primaryInstrument: string; // 主奏乐器
  emotion: string;
  description: string;
  color: string;             // 角色色
  waveform: number[];        // 波形数据 (0-1 数组, 32 个点)
  appearsIn: number[];       // 出现镜头
}

export interface SFXCategory {
  id: string;
  category: 'ambient' | 'foley' | 'hard';
  label: string;             // 中文标签
  color: string;
  icon: string;              // emoji
  description: string;
  examples: { name: string; count: number }[]; // 具体音效及使用次数
}

export interface MixBalance {
  actId: number;
  actTitle: string;
  dialogue: number;          // 0-100
  music: number;
  effects: number;
  description: string;       // 混音说明
}

export const musicCues: MusicCue[] = [
  // 第一幕：觉醒（安静起始）
  {
    id: 'cue-1',
    actId: 1,
    shotId: 1,
    theme: '远古低吟',
    intensity: 2,
    tempo: 'Largo 50 BPM',
    musicalKey: 'A minor',
    instruments: ['古琴', '埙', '环境低频'],
    reference: '谭盾《卧虎藏龙》',
    description: '空旷的晨雾，开场只有古琴泛音与埙的呜咽。3000年沉睡的开始。',
  },
  {
    id: 'cue-2',
    actId: 1,
    shotId: 6,
    theme: '命运擦肩',
    intensity: 4,
    tempo: 'Adagio 70 BPM',
    musicalKey: 'E phrygian',
    instruments: ['古琴', '箫', '弦乐拨奏'],
    reference: '久石让《幽灵公主》',
    description: '魏镇与陈守田擦肩而过，弦乐轻轻一拨，命运开始编织。',
  },

  // 第二幕：战场召唤
  {
    id: 'cue-3',
    actId: 2,
    shotId: 17,
    theme: '醒田铃响',
    intensity: 7,
    tempo: 'Andante 90 BPM',
    musicalKey: 'D dorian',
    instruments: ['铜铃', '定音鼓', '人声低吟'],
    reference: '汉斯·季默《蝙蝠侠：黑暗骑士崛起》',
    description: '铜铃声破开千年沉寂，鼓点像心跳逐渐加速。醒来的不只是守田，还有整个故事。',
  },
  {
    id: 'cue-4',
    actId: 2,
    shotId: 21,
    theme: '身份质问',
    intensity: 5,
    tempo: 'Moderato 85 BPM',
    musicalKey: 'B minor',
    instruments: ['箫', '二胡', '弦乐颤音'],
    reference: '陈其钢《归来》',
    description: '燕无忧逼问陈守田真实身份，弦乐带不安的颤音，二胡拉出疑问的旋律。',
  },

  // 第三幕：天坠
  {
    id: 'cue-5',
    actId: 3,
    shotId: 28,
    theme: '天空撕裂',
    intensity: 9,
    tempo: 'Allegro 140 BPM',
    musicalKey: 'C minor',
    instruments: ['全乐队', '定音鼓', '铜管', '合唱团'],
    reference: '约翰·威廉姆斯《星球大战》',
    description: '巨兽的影子笼罩大地，铜管怒吼，合唱团齐唱出深渊的悲鸣。',
  },
  {
    id: 'cue-6',
    actId: 3,
    shotId: 36,
    theme: '万民俯首',
    intensity: 8,
    tempo: 'Maestoso 120 BPM',
    musicalKey: 'F minor',
    instruments: ['管风琴', '合唱团', '定音鼓'],
    reference: '霍尔斯特《行星组曲》',
    description: '巨兽降临天庭寺，所有人跪伏。管风琴的低频让大地都在震动。',
  },

  // 第四幕：神力爆发
  {
    id: 'cue-7',
    actId: 4,
    shotId: 43,
    theme: '破土而出',
    intensity: 10,
    tempo: 'Presto 160 BPM',
    musicalKey: 'D minor',
    instruments: ['全乐队', '中国打击乐', '电吉他'],
    reference: '汉斯·季默《盗梦空间》',
    description: '陈守田破土而出，三千年积蓄的神力瞬间爆发。东西方乐器激烈碰撞。',
  },
  {
    id: 'cue-8',
    actId: 4,
    shotId: 50,
    theme: '刀光剑影',
    intensity: 10,
    tempo: 'Vivace 170 BPM',
    musicalKey: 'G minor',
    instruments: ['弦乐群', '定音鼓', '镲片'],
    reference: '久石让《影武者》',
    description: '断潮刀出鞘，刀光如银河倾泻。弦乐急速拉奏，金属打击乐如星火迸射。',
  },

  // 第五幕：神战
  {
    id: 'cue-9',
    actId: 5,
    shotId: 55,
    theme: '天地之决',
    intensity: 10,
    tempo: 'Allegro feroce 180 BPM',
    musicalKey: 'C# minor',
    instruments: ['全乐队', '合唱团', '电子合成器'],
    reference: '霍华德·肖《指环王》',
    description: '陈守田与渊的决战，作曲家用了三段式——慢板的回忆、快板的交锋、静止的爆发。',
  },
  {
    id: 'cue-10',
    actId: 5,
    shotId: 62,
    theme: '封印咏叹',
    intensity: 9,
    tempo: 'Larghetto 75 BPM',
    musicalKey: 'A minor',
    instruments: ['无伴奏合唱', '古琴', '箫'],
    reference: '莫里康内《教会》',
    description: '陈守田咏唱封印咒语，无伴奏合唱用东方五声音阶，悲壮而神圣。',
  },

  // 第六幕：余韵
  {
    id: 'cue-11',
    actId: 6,
    shotId: 66,
    theme: '废墟晨光',
    intensity: 3,
    tempo: 'Adagio 65 BPM',
    musicalKey: 'G major',
    instruments: ['古琴', '箫', '长笛'],
    reference: '久石让《天空之城》',
    description: '战斗结束，晨光照在废墟上。音乐回到开头的主题，但加入了长笛——希望。',
  },
  {
    id: 'cue-12',
    actId: 6,
    shotId: 70,
    theme: '守望永恒',
    intensity: 5,
    tempo: 'Andante 80 BPM',
    musicalKey: 'C major',
    instruments: ['古琴', '弦乐', '合唱团'],
    reference: '谭盾《英雄》',
    description: '陈守田站在田野上回望的镜头。弦乐缓缓上行，合唱唱出主题的完结。',
  },
];

// 主导动机 - 用波形数据代表旋律轮廓
const chenWave = [0.3, 0.5, 0.7, 0.4, 0.2, 0.6, 0.8, 0.6, 0.3, 0.5, 0.7, 0.9, 0.7, 0.5, 0.3, 0.4, 0.6, 0.8, 0.6, 0.4, 0.3, 0.5, 0.7, 0.5, 0.3, 0.4, 0.6, 0.4, 0.2, 0.3, 0.5, 0.3];
const yanWave = [0.2, 0.4, 0.6, 0.8, 0.9, 0.7, 0.5, 0.8, 0.9, 0.6, 0.4, 0.7, 0.8, 0.5, 0.3, 0.6, 0.8, 0.7, 0.5, 0.4, 0.6, 0.8, 0.7, 0.5, 0.4, 0.6, 0.5, 0.3, 0.4, 0.6, 0.4, 0.2];
const qingWave = [0.4, 0.3, 0.5, 0.4, 0.6, 0.5, 0.7, 0.6, 0.8, 0.7, 0.6, 0.7, 0.8, 0.7, 0.6, 0.5, 0.7, 0.6, 0.5, 0.4, 0.6, 0.5, 0.4, 0.3, 0.5, 0.4, 0.3, 0.2, 0.4, 0.3, 0.2, 0.1];
const weiWave = [0.5, 0.5, 0.5, 0.5, 0.6, 0.7, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.6, 0.7, 0.5, 0.4, 0.5, 0.5, 0.5, 0.5];
const yuanWave = [0.9, 0.85, 0.95, 0.8, 0.9, 0.7, 0.95, 0.85, 0.9, 0.75, 0.95, 0.85, 0.9, 0.8, 0.7, 0.85, 0.95, 0.8, 0.9, 0.75, 0.95, 0.85, 0.9, 0.8, 0.7, 0.85, 0.95, 0.8, 0.9, 0.75, 0.85, 0.9];

export const leitmotifs: Leitmotif[] = [
  {
    id: 'motive-1',
    characterName: '陈守田',
    alias: '守田翁',
    melody: '下行五度跳跃，渐强收尾——沉稳如大地',
    musicalKey: 'D minor',
    tempo: 'Andante 80 BPM',
    primaryInstrument: '古琴',
    emotion: '守望、苍凉、坚定',
    description: '五声音阶起，结尾落在低音 sol。三千年的孤独凝结成这五个音。每次出现都让观众心头一紧。',
    color: '#d4af37',
    waveform: chenWave,
    appearsIn: [1, 6, 9, 12, 17, 20, 25, 43, 50, 62, 64, 67, 70],
  },
  {
    id: 'motive-2',
    characterName: '燕无忧',
    alias: '风之女',
    melody: '八度跳跃加颤音，向上冲击——锋利如剑',
    musicalKey: 'A minor',
    tempo: 'Allegro 130 BPM',
    primaryInstrument: '二胡',
    emotion: '锋利、急切、执着',
    description: '开头的八度跳跃如剑出鞘，连续颤音带出急切。越接近目标越快越尖——如同她的执念。',
    color: '#ff6b35',
    waveform: yanWave,
    appearsIn: [21, 26, 35, 40, 45, 55, 60],
  },
  {
    id: 'motive-3',
    characterName: '李清禾',
    alias: '雾中子',
    melody: '半音级进加回旋——迷惘中寻路',
    musicalKey: 'E phrygian',
    tempo: 'Moderato 85 BPM',
    primaryInstrument: '箫',
    emotion: '迷惘、温柔、觉醒',
    description: '三连音的半音级进像在迷雾中摸索。回旋结构暗示轮回——她的使命在千年间循环。',
    color: '#a29bfe',
    waveform: qingWave,
    appearsIn: [7, 22, 30, 38, 47, 56, 65],
  },
  {
    id: 'motive-4',
    characterName: '魏镇',
    alias: '守陵人',
    melody: '重复的同音反复——如同呼吸与心跳',
    musicalKey: 'B minor',
    tempo: 'Adagio 70 BPM',
    primaryInstrument: '埙',
    emotion: '苍老、神秘、悲悯',
    description: '单一音符的反复，如同三千年的呼吸。埙的音色苍老如大地，让观众感受到时间的重量。',
    color: '#74b9ff',
    waveform: weiWave,
    appearsIn: [3, 7, 13, 17, 29, 58, 71],
  },
  {
    id: 'motive-5',
    characterName: '渊',
    alias: '宇宙巨兽',
    melody: '全音阶不协和音团——非人类、不可名状',
    musicalKey: '无调性',
    tempo: 'Rubato 自由',
    primaryInstrument: '电子合成器 + 低音合唱',
    emotion: '恐惧、原始、不可名状',
    description: '不协和音团渐强渐弱，如同深渊的呼吸。配以低于人耳的次声波，物理上让观众感到不安。',
    color: '#9d0208',
    waveform: yuanWave,
    appearsIn: [28, 32, 36, 41, 48, 55, 61],
  },
];

export const sfxLibrary: SFXCategory[] = [
  {
    id: 'sfx-1',
    category: 'ambient',
    label: '环境氛围',
    color: '#74b9ff',
    icon: '🌫',
    description: '营造空间感的持续性背景声场',
    examples: [
      { name: '晨雾山林风', count: 8 },
      { name: '寺庙钟声回荡', count: 5 },
      { name: '巨兽低频震动', count: 7 },
      { name: '雷暴电弧', count: 4 },
      { name: '空谷回响', count: 3 },
    ],
  },
  {
    id: 'sfx-2',
    category: 'foley',
    label: 'Foley 拟音',
    color: '#d4af37',
    icon: '👣',
    description: '脚步、衣物、道具的真实接触声',
    examples: [
      { name: '赤脚踩泥', count: 12 },
      { name: '布衣摩擦', count: 15 },
      { name: '锄头挖地', count: 6 },
      { name: '草帽沙沙', count: 3 },
      { name: '翻书页', count: 2 },
    ],
  },
  {
    id: 'sfx-3',
    category: 'hard',
    label: '硬音效',
    color: '#ff3838',
    icon: '⚡',
    description: '瞬间爆发的强冲击声',
    examples: [
      { name: '刀剑交锋', count: 18 },
      { name: '天崩地裂', count: 5 },
      { name: '巨兽咆哮', count: 9 },
      { name: '火焰喷射', count: 7 },
      { name: '金石碎裂', count: 11 },
      { name: '地震轰鸣', count: 6 },
    ],
  },
];

export const mixBalances: MixBalance[] = [
  {
    actId: 1,
    actTitle: '觉醒',
    dialogue: 35,
    music: 50,
    effects: 15,
    description: '对白主导开场人物，音乐以古琴低吟铺垫环境感。',
  },
  {
    actId: 2,
    actTitle: '战场召唤',
    dialogue: 45,
    music: 40,
    effects: 15,
    description: '大量对话揭示身份谜题，铜铃主题首次出现，音效轻量。',
  },
  {
    actId: 3,
    actTitle: '天坠',
    dialogue: 20,
    music: 30,
    effects: 50,
    description: '天崩地裂，音效压倒性主导。低频雷鸣贯穿全幕。',
  },
  {
    actId: 4,
    actTitle: '神力爆发',
    dialogue: 10,
    music: 45,
    effects: 45,
    description: '配乐与音效各半壁江山，全乐队与中国打击乐激烈碰撞。',
  },
  {
    actId: 5,
    actTitle: '神战',
    dialogue: 5,
    music: 50,
    effects: 45,
    description: '决战配乐主导，合唱团与硬音效交织，零对白。',
  },
  {
    actId: 6,
    actTitle: '余韵',
    dialogue: 25,
    music: 65,
    effects: 10,
    description: '音乐回归主题，对白收束人物的情感，音效几乎隐退。',
  },
];

// ============= 色彩脚本 =============

export interface ColorCue {
  id: string;
  actId: number;
  shotId: number;
  paletteName: string;            // 调色名称
  primaryColor: string;           // 主色
  secondaryColor: string;         // 辅色
  accentColor: string;            // 点缀色
  temperature: 'warm' | 'cool' | 'neutral' | 'mixed';
  saturation: number;             // 0-100
  brightness: number;             // 0-100
  contrast: number;               // 0-100
  lutStyle: string;               // LUT 风格名
  description: string;            // 调色说明
  reference: string;              // 参考影片/摄影师
}

export interface ActPalette {
  actId: number;
  actTitle: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  temperature: 'warm' | 'cool' | 'neutral' | 'mixed';
  evolution: string;              // 色彩演化方向
  keywords: string[];             // 调色关键词
  description: string;
}

export interface ColorTemperaturePoint {
  actId: number;
  actTitle: string;
  temperature: number;            // -100 冷蓝 ~ +100 暖橙
  saturation: number;             // 0-100
  contrast: number;               // 0-100
}

export interface CharacterPalette {
  characterName: string;
  alias: string;
  primaryColor: string;           // 主色
  secondaryColor: string;         // 辅色
  meaning: string;                // 色彩象征
  evolution: string;              // 角色色彩演化
  sceneUsage: { actId: number; color: string; note: string }[];
}

export interface LUTStyle {
  id: string;
  name: string;
  description: string;
  primaryHue: string;             // 主色相 hex
  shadowTint: string;             // 阴影色
  highlightTint: string;          // 高光色
  contrast: 'low' | 'medium' | 'high' | 'extreme';
  saturation: 'low' | 'medium' | 'high';
  useCases: string[];             // 适用场景
  reference: string;              // 参考影片
}

// 12 个关键镜头的色彩设计
export const colorCues: ColorCue[] = [
  {
    id: 'color-1',
    actId: 1,
    shotId: 1,
    paletteName: '破晓金辉',
    primaryColor: '#d4af37',
    secondaryColor: '#2a1f10',
    accentColor: '#f4d03f',
    temperature: 'warm',
    saturation: 35,
    brightness: 65,
    contrast: 45,
    lutStyle: '晨雾金调',
    description: '初升的太阳穿过晨雾，田野被染成淡金色。远景使用单色调，暗示守田的三千年孤独。',
    reference: '罗杰·迪金斯《大地惊雷》',
  },
  {
    id: 'color-2',
    actId: 1,
    shotId: 6,
    paletteName: '青灰人间',
    primaryColor: '#5a6470',
    secondaryColor: '#8a8a8a',
    accentColor: '#a29bfe',
    temperature: 'cool',
    saturation: 25,
    brightness: 50,
    contrast: 55,
    lutStyle: '去饱和青调',
    description: '魏镇与守田相遇的瞬间，画面去饱和至灰青色。暗示现实与超自然世界的边界。',
    reference: '罗伯特·理查森《血色将至》',
  },
  {
    id: 'color-3',
    actId: 2,
    shotId: 17,
    paletteName: '铜铃赤金',
    primaryColor: '#c45a1a',
    secondaryColor: '#3d1a0a',
    accentColor: '#f4d03f',
    temperature: 'warm',
    saturation: 70,
    brightness: 50,
    contrast: 75,
    lutStyle: '黄昏金调',
    description: '铜铃摇响的瞬间，画面从冷灰瞬间切换为赤金。色彩跳跃——千年封印被打破的视觉呈现。',
    reference: '沃伊切赫·谢尔宾斯基《荒野猎人》',
  },
  {
    id: 'color-4',
    actId: 2,
    shotId: 21,
    paletteName: '质问紫雾',
    primaryColor: '#7a4a8a',
    secondaryColor: '#3a2a4a',
    accentColor: '#a29bfe',
    temperature: 'cool',
    saturation: 50,
    brightness: 45,
    contrast: 65,
    lutStyle: '紫色戏剧调',
    description: '燕无忧逼问守田身份。紫色是不安与神秘的混合——既非敌意也非善意。',
    reference: '艾曼努尔·卢贝兹金《入侵脑细胞》',
  },
  {
    id: 'color-5',
    actId: 3,
    shotId: 28,
    paletteName: '血红天坠',
    primaryColor: '#9d0208',
    secondaryColor: '#1a0000',
    accentColor: '#ff3838',
    temperature: 'warm',
    saturation: 85,
    brightness: 35,
    contrast: 95,
    lutStyle: '血红暴力调',
    description: '天空撕裂的瞬间，整个画面染成血色。红色浓度达到全片最高——灾难降临。',
    reference: '罗杰·迪金斯《银翼杀手2049》',
  },
  {
    id: 'color-6',
    actId: 3,
    shotId: 36,
    paletteName: '深渊灰黑',
    primaryColor: '#0a0a0a',
    secondaryColor: '#1a1a1a',
    accentColor: '#9d0208',
    temperature: 'cool',
    saturation: 10,
    brightness: 20,
    contrast: 90,
    lutStyle: '极简高对比',
    description: '巨兽降临天庭寺。几乎单色的黑灰——只有渊的瞳孔是血红色。',
    reference: '罗伯特·理查森《血色将至》',
  },
  {
    id: 'color-7',
    actId: 4,
    shotId: 43,
    paletteName: '破土金光',
    primaryColor: '#f4d03f',
    secondaryColor: '#8b7500',
    accentColor: '#ff6b35',
    temperature: 'warm',
    saturation: 90,
    brightness: 85,
    contrast: 80,
    lutStyle: '破晓圣光调',
    description: '陈守田破土而出的瞬间。金光从地下爆发，整个画面过曝至 105%——神力溢出。',
    reference: '艾曼努尔·卢贝兹金《生命之树》',
  },
  {
    id: 'color-8',
    actId: 4,
    shotId: 50,
    paletteName: '刀光银河',
    primaryColor: '#e8e8f0',
    secondaryColor: '#74b9ff',
    accentColor: '#ff3838',
    temperature: 'cool',
    saturation: 60,
    brightness: 75,
    contrast: 85,
    lutStyle: '金属冷光调',
    description: '断潮刀出鞘。冷光银白为主，唯一暖色是渊的鲜血红。冷暖对撞的极致张力。',
    reference: '丁正勋《老男孩》',
  },
  {
    id: 'color-9',
    actId: 5,
    shotId: 55,
    paletteName: '神战金红',
    primaryColor: '#d4af37',
    secondaryColor: '#9d0208',
    accentColor: '#f4d03f',
    temperature: 'warm',
    saturation: 95,
    brightness: 60,
    contrast: 100,
    lutStyle: '史诗金红调',
    description: '陈守田与渊的决战。金色（守田）与红色（渊）的对撞——神性与人性的最终对抗。',
    reference: '拉迪斯拉夫·多恩《光影对决》',
  },
  {
    id: 'color-10',
    actId: 5,
    shotId: 62,
    paletteName: '封印纯金',
    primaryColor: '#f4d03f',
    secondaryColor: '#1a1a0a',
    accentColor: '#ffffff',
    temperature: 'warm',
    saturation: 80,
    brightness: 90,
    contrast: 85,
    lutStyle: '神圣金色调',
    description: '封印咒语咏唱。画面几近单色金色——超越物质世界的瞬间。',
    reference: '丹尼·科恩《权力的游戏》',
  },
  {
    id: 'color-11',
    actId: 6,
    shotId: 66,
    paletteName: '废墟晨曦',
    primaryColor: '#8aaab5',
    secondaryColor: '#3a4a55',
    accentColor: '#f4d03f',
    temperature: 'cool',
    saturation: 40,
    brightness: 70,
    contrast: 50,
    lutStyle: '冷暖中性调',
    description: '战斗结束后的废墟。冷蓝灰为主，唯一点缀是远处田野的金色——希望的回归。',
    reference: '罗杰·迪金斯《1917》',
  },
  {
    id: 'color-12',
    actId: 6,
    shotId: 70,
    paletteName: '守望永恒',
    primaryColor: '#d4af37',
    secondaryColor: '#2a1f10',
    accentColor: '#f4d03f',
    temperature: 'warm',
    saturation: 60,
    brightness: 75,
    contrast: 60,
    lutStyle: '守望金调',
    description: '陈守田站在田野上回望。色调与开场第一镜呼应——三千年的循环，首尾相连。',
    reference: '马利克·本森纽尔《与神同行》',
  },
];

export const actPalettes: ActPalette[] = [
  {
    actId: 1,
    actTitle: '觉醒',
    primaryColor: '#d4af37',
    secondaryColor: '#3a2a10',
    accentColor: '#f4d03f',
    temperature: 'warm',
    evolution: '冷蓝晨雾 → 暖金破晓',
    keywords: ['晨雾', '破晓', '金辉', '孤独'],
    description: '全片最柔和的色彩。开场用低饱和的金色调，暗示守田如同初升的太阳——沉睡了三千年的神祇。',
  },
  {
    actId: 2,
    actTitle: '战场召唤',
    primaryColor: '#c45a1a',
    secondaryColor: '#3d1a0a',
    accentColor: '#a29bfe',
    temperature: 'warm',
    evolution: '青灰人间 → 铜铃赤金',
    keywords: ['铜铃', '紫雾', '质问', '觉醒'],
    description: '从冷灰向暖金跳跃。铜铃响起时，色彩骤然升温——封印被打破的瞬间也是色彩革命的瞬间。',
  },
  {
    actId: 3,
    actTitle: '天坠',
    primaryColor: '#9d0208',
    secondaryColor: '#0a0a0a',
    accentColor: '#ff3838',
    temperature: 'mixed',
    evolution: '血红天坠 → 深渊灰黑',
    keywords: ['血红', '深渊', '灾难', '极简'],
    description: '全片最黑暗的一幕。色彩被剥离至黑灰红三色。红色作为巨兽的"标记色"出现。',
  },
  {
    actId: 4,
    actTitle: '神力爆发',
    primaryColor: '#f4d03f',
    secondaryColor: '#74b9ff',
    accentColor: '#ff3838',
    temperature: 'warm',
    evolution: '破土金光 → 刀光银河',
    keywords: ['金光', '破土', '刀光', '冷暖对撞'],
    description: '色彩最爆炸的一幕。守田的金色与渊的红色对撞，每个镜头都使用强烈对比。',
  },
  {
    actId: 5,
    actTitle: '神战',
    primaryColor: '#d4af37',
    secondaryColor: '#9d0208',
    accentColor: '#ffffff',
    temperature: 'warm',
    evolution: '神战金红 → 封印纯金',
    keywords: ['金红', '对撞', '封印', '神圣'],
    description: '决战双色调——金色对红色。封印完成时归一为纯金，神性战胜兽性。',
  },
  {
    actId: 6,
    actTitle: '余韵',
    primaryColor: '#8aaab5',
    secondaryColor: '#d4af37',
    accentColor: '#f4d03f',
    temperature: 'mixed',
    evolution: '废墟晨曦 → 守望永恒',
    keywords: ['晨曦', '废墟', '守望', '循环'],
    description: '回到开场的色调。冷蓝废墟中守田独自站立，色调与第一镜呼应——首尾构成完整循环。',
  },
];

export const colorTemperatureCurve: ColorTemperaturePoint[] = [
  { actId: 1, actTitle: '觉醒', temperature: 30, saturation: 35, contrast: 50 },
  { actId: 2, actTitle: '战场召唤', temperature: 10, saturation: 55, contrast: 65 },
  { actId: 3, actTitle: '天坠', temperature: -20, saturation: 75, contrast: 90 },
  { actId: 4, actTitle: '神力爆发', temperature: 50, saturation: 85, contrast: 85 },
  { actId: 5, actTitle: '神战', temperature: 40, saturation: 95, contrast: 95 },
  { actId: 6, actTitle: '余韵', temperature: 20, saturation: 50, contrast: 55 },
];

export const characterPalettes: CharacterPalette[] = [
  {
    characterName: '陈守田',
    alias: '守田翁',
    primaryColor: '#d4af37',
    secondaryColor: '#8b7500',
    meaning: '古金、丰收、神性、永恒',
    evolution: '从蒙尘的灰金（沉睡时）到耀眼的纯金（觉醒时），最后回到沉稳的守望金',
    sceneUsage: [
      { actId: 1, color: '#5a4a20', note: '沉睡中' },
      { actId: 2, color: '#c45a1a', note: '铜铃唤醒' },
      { actId: 4, color: '#f4d03f', note: '神力爆发' },
      { actId: 5, color: '#f4d03f', note: '封印咏唱' },
      { actId: 6, color: '#d4af37', note: '回归守望' },
    ],
  },
  {
    characterName: '燕无忧',
    alias: '风之女',
    primaryColor: '#ff6b35',
    secondaryColor: '#9d0208',
    meaning: '火红、急切、执着、悲剧',
    evolution: '从炽烈的橙红到战斗的深红，最后在余韵中淡化为暖橙',
    sceneUsage: [
      { actId: 1, color: '#ff6b35', note: '初登场' },
      { actId: 2, color: '#7a4a8a', note: '质问时偏紫' },
      { actId: 4, color: '#ff3838', note: '战斗炽烈' },
      { actId: 5, color: '#9d0208', note: '神战血色' },
      { actId: 6, color: '#ff9f43', note: '归于平静' },
    ],
  },
  {
    characterName: '李清禾',
    alias: '雾中子',
    primaryColor: '#a29bfe',
    secondaryColor: '#5a4a8a',
    meaning: '紫雾、迷惘、超凡、轮回',
    evolution: '冷紫到暖紫再到淡紫——穿越迷雾的过程',
    sceneUsage: [
      { actId: 1, color: '#5a4a8a', note: '雾中现身' },
      { actId: 2, color: '#7a4a8a', note: '介入战斗' },
      { actId: 3, color: '#a29bfe', note: '见证天坠' },
      { actId: 5, color: '#c0a8ff', note: '觉醒时刻' },
      { actId: 6, color: '#a29bfe', note: '完成使命' },
    ],
  },
  {
    characterName: '魏镇',
    alias: '守陵人',
    primaryColor: '#74b9ff',
    secondaryColor: '#3a4a55',
    meaning: '冷蓝、苍老、时间、悲悯',
    evolution: '从冷蓝到雾灰——守陵人逐渐隐入历史',
    sceneUsage: [
      { actId: 1, color: '#74b9ff', note: '初遇' },
      { actId: 2, color: '#5a6470', note: '揭示身份' },
      { actId: 3, color: '#3a4a55', note: '远观天坠' },
      { actId: 5, color: '#5a6470', note: '见证决战' },
      { actId: 6, color: '#8aaab5', note: '归于晨雾' },
    ],
  },
];

export const lutStyles: LUTStyle[] = [
  {
    id: 'lut-1',
    name: '晨雾金调',
    description: '高光偏暖、阴影偏青、低对比。营造东方水墨的清雅感',
    primaryHue: '#d4af37',
    shadowTint: '#3a4a55',
    highlightTint: '#f4d03f',
    contrast: 'low',
    saturation: 'low',
    useCases: ['第一幕开场', '第六幕余韵', '守田的独处'],
    reference: '罗杰·迪金斯《大地惊雷》',
  },
  {
    id: 'lut-2',
    name: '黄昏金调',
    description: '高饱和、中等对比。史诗般的暖意',
    primaryHue: '#c45a1a',
    shadowTint: '#3d1a0a',
    highlightTint: '#f4d03f',
    contrast: 'high',
    saturation: 'high',
    useCases: ['第二幕铜铃响', '陈守田觉醒', '战争戏'],
    reference: '沃伊切赫·谢尔宾斯基《荒野猎人》',
  },
  {
    id: 'lut-3',
    name: '深渊灰黑',
    description: '极低饱和、极高对比。黑灰红三色',
    primaryHue: '#1a1a1a',
    shadowTint: '#000000',
    highlightTint: '#9d0208',
    contrast: 'extreme',
    saturation: 'low',
    useCases: ['第三幕天坠', '巨兽降临', '深渊场景'],
    reference: '罗杰·迪金斯《银翼杀手2049》',
  },
  {
    id: 'lut-4',
    name: '神圣金调',
    description: '纯金主调、近乎单色、过曝。超物质感',
    primaryHue: '#f4d03f',
    shadowTint: '#1a1a0a',
    highlightTint: '#ffffff',
    contrast: 'high',
    saturation: 'medium',
    useCases: ['第五幕封印咏唱', '陈守田神力全开', '希望时刻'],
    reference: '艾曼努尔·卢贝兹金《生命之树》',
  },
];

// ============= VFX 特效镜头分解 =============

export type VFXComplexity = 'simple' | 'medium' | 'complex' | 'extreme';

export interface VFXShot {
  id: string;
  actId: number;
  shotId: number;
  complexity: VFXComplexity;
  elements: string[];            // ['creature', 'environment', 'particle', 'simulation']
  tools: string[];               // ['Houdini', 'Maya', 'Nuke']
  reference: string;
  description: string;
  estimatedRenderHours: number;
  layers: number;                // 渲染图层数
  artist: string;                // 负责艺术家
  breakdown: {
    modeling: number;            // 0-100 占比
    texturing: number;
    rigging: number;
    animation: number;
    lookdev: number;
    lighting: number;
    render: number;
    comp: number;
  };
}

export interface VFXAsset {
  id: string;
  name: string;
  category: 'creature' | 'environment' | 'prop' | 'fx';
  description: string;
  scale: string;
  polyCount: string;
  textureRes: string;
  riggingNotes: string;
  references: string[];
  buildTime: string;             // 制作周期
}

export interface VFXDiscipline {
  id: string;
  name: string;
  chineseName: string;
  icon: string;
  description: string;
  shotCount: number;
  toolChain: string[];
  color: string;
  headcount: number;             // 团队人数
}

export interface RenderPipelineStage {
  id: string;
  stage: string;
  chineseName: string;
  description: string;
  hoursPerShot: number;
  icon: string;
  color: string;
  deliverables: string[];
}

export const vfxShots: VFXShot[] = [
  {
    id: 'vfx-1',
    actId: 3,
    shotId: 28,
    complexity: 'extreme',
    elements: ['creature', 'environment', 'particle', 'simulation', 'atmosphere'],
    tools: ['Houdini', 'Maya', 'Mari', 'Nuke', 'Karma XPU'],
    reference: 'WETA Digital《指环王：王者归来》',
    description: '天空撕裂瞬间——渊的影子笼罩大地。需 280 个 CG 元素层、1400 万粒子、480 核 CPU 渲染农场 36 小时。',
    estimatedRenderHours: 2400,
    layers: 280,
    artist: '吴·丹尼尔',
    breakdown: { modeling: 15, texturing: 10, rigging: 8, animation: 12, lookdev: 10, lighting: 8, render: 27, comp: 10 },
  },
  {
    id: 'vfx-2',
    actId: 3,
    shotId: 36,
    complexity: 'extreme',
    elements: ['creature', 'environment', 'digital-double', 'simulation'],
    tools: ['Houdini', 'Maya', 'ZBrush', 'Nuke', 'Redshift'],
    reference: 'ILM《复仇者联盟：终局之战》',
    description: '渊降临天庭寺的全身镜头。需要完整的角色绑定（4 万个骨骼）、布料解算、肌肉模拟、毛发系统。',
    estimatedRenderHours: 3200,
    layers: 420,
    artist: '陈·玛丽',
    breakdown: { modeling: 12, texturing: 8, rigging: 18, animation: 14, lookdev: 8, lighting: 6, render: 24, comp: 10 },
  },
  {
    id: 'vfx-3',
    actId: 4,
    shotId: 43,
    complexity: 'extreme',
    elements: ['creature', 'particle', 'simulation', 'atmosphere'],
    tools: ['Houdini', 'Maya', 'Nuke', 'Karma XPU'],
    reference: 'DNEG《沙丘》',
    description: '陈守田破土而出的瞬间——金色粒子爆发、土块解算、能量冲击波。三维空间内 500 万个金色粒子。',
    estimatedRenderHours: 1800,
    layers: 180,
    artist: '李·维克托',
    breakdown: { modeling: 8, texturing: 6, rigging: 4, animation: 15, lookdev: 12, lighting: 10, render: 30, comp: 15 },
  },
  {
    id: 'vfx-4',
    actId: 4,
    shotId: 50,
    complexity: 'complex',
    elements: ['particle', 'simulation', 'atmosphere'],
    tools: ['Houdini', 'Nuke'],
    reference: 'Method Studios《银翼杀手2049》',
    description: '断潮刀出鞘——刀光如银河倾泻。纯光效镜头，主要挑战在体积光 + 镜面反射。',
    estimatedRenderHours: 800,
    layers: 90,
    artist: '王·索菲亚',
    breakdown: { modeling: 5, texturing: 5, rigging: 0, animation: 20, lookdev: 18, lighting: 15, render: 25, comp: 12 },
  },
  {
    id: 'vfx-5',
    actId: 5,
    shotId: 55,
    complexity: 'extreme',
    elements: ['creature', 'environment', 'particle', 'simulation', 'atmosphere'],
    tools: ['Houdini', 'Maya', 'Mari', 'Nuke', 'Karma XPU'],
    reference: 'Framestore《奇幻森林》',
    description: '神战决战镜头。守田（金色神力）+ 渊（血红兽性）的光效对撞，64 个渲染图层，5000 万粒子。',
    estimatedRenderHours: 4500,
    layers: 640,
    artist: '吴·丹尼尔',
    breakdown: { modeling: 10, texturing: 8, rigging: 12, animation: 14, lookdev: 10, lighting: 8, render: 28, comp: 10 },
  },
  {
    id: 'vfx-6',
    actId: 5,
    shotId: 62,
    complexity: 'complex',
    elements: ['environment', 'particle', 'atmosphere'],
    tools: ['Houdini', 'Nuke'],
    reference: 'SPIR《银翼杀手2049》',
    description: '封印咏唱——金色咒文光环。粒子 + 体积光 + 后期合成。',
    estimatedRenderHours: 1200,
    layers: 120,
    artist: '陈·玛丽',
    breakdown: { modeling: 5, texturing: 5, rigging: 0, animation: 18, lookdev: 20, lighting: 12, render: 25, comp: 15 },
  },
  {
    id: 'vfx-7',
    actId: 2,
    shotId: 17,
    complexity: 'medium',
    elements: ['environment', 'particle', 'atmosphere'],
    tools: ['Houdini', 'Nuke'],
    reference: 'Rising Sun Pictures《X 战警：逆转未来》',
    description: '铜铃响起的瞬间——空气震动、尘埃飘散、远处微光。简单的 CG 增强，主要靠后期粒子。',
    estimatedRenderHours: 360,
    layers: 45,
    artist: '张·艾玛',
    breakdown: { modeling: 8, texturing: 6, rigging: 0, animation: 12, lookdev: 14, lighting: 18, render: 22, comp: 20 },
  },
  {
    id: 'vfx-8',
    actId: 2,
    shotId: 21,
    complexity: 'medium',
    elements: ['environment', 'atmosphere'],
    tools: ['Nuke'],
    reference: 'Method Studios《1917》',
    description: '质问场景的环境增强——雾气浓度调整、光线方向改变。主要是合成工作。',
    estimatedRenderHours: 200,
    layers: 25,
    artist: '李·维克托',
    breakdown: { modeling: 5, texturing: 5, rigging: 0, animation: 10, lookdev: 15, lighting: 20, render: 15, comp: 30 },
  },
  {
    id: 'vfx-9',
    actId: 3,
    shotId: 30,
    complexity: 'complex',
    elements: ['environment', 'simulation', 'atmosphere'],
    tools: ['Houdini', 'Maya', 'Nuke'],
    reference: 'ILM《碟中谍 6》',
    description: '天庭寺屋顶崩塌——瓦砾解算、烟雾、碎片轨迹。需要 RBD（刚体动力学）解算。',
    estimatedRenderHours: 1100,
    layers: 130,
    artist: '王·索菲亚',
    breakdown: { modeling: 12, texturing: 8, rigging: 4, animation: 18, lookdev: 10, lighting: 12, render: 24, comp: 12 },
  },
  {
    id: 'vfx-10',
    actId: 4,
    shotId: 47,
    complexity: 'complex',
    elements: ['creature', 'environment'],
    tools: ['Maya', 'Nuke', 'ZBrush'],
    reference: 'Framestore《银翼杀手2049》',
    description: '渊的近景特写——瞳孔细节、皮肤纹理、血液流动。需要极高精度的角色模型。',
    estimatedRenderHours: 1400,
    layers: 80,
    artist: '吴·丹尼尔',
    breakdown: { modeling: 18, texturing: 14, rigging: 8, animation: 10, lookdev: 12, lighting: 10, render: 18, comp: 10 },
  },
  {
    id: 'vfx-11',
    actId: 6,
    shotId: 66,
    complexity: 'medium',
    elements: ['environment', 'atmosphere'],
    tools: ['Nuke'],
    reference: 'Method Studios《1917》',
    description: '废墟晨曦——冷蓝调色 + 远景雾化 + 天空置换。',
    estimatedRenderHours: 240,
    layers: 30,
    artist: '张·艾玛',
    breakdown: { modeling: 3, texturing: 3, rigging: 0, animation: 8, lookdev: 15, lighting: 20, render: 21, comp: 30 },
  },
  {
    id: 'vfx-12',
    actId: 6,
    shotId: 70,
    complexity: 'simple',
    elements: ['environment', 'atmosphere'],
    tools: ['Nuke'],
    reference: 'DNEG《1917》',
    description: '守望永恒的最后一镜——天空增强 + 远景合成。简单但情绪关键。',
    estimatedRenderHours: 120,
    layers: 18,
    artist: '李·维克托',
    breakdown: { modeling: 3, texturing: 3, rigging: 0, animation: 8, lookdev: 15, lighting: 20, render: 21, comp: 30 },
  },
];

export const vfxAssets: VFXAsset[] = [
  {
    id: 'asset-1',
    name: '渊 / 宇宙巨兽',
    category: 'creature',
    description: '全片最重要的 CG 资产。300 米高的非人形态，需要从概念到最终渲染完整开发。',
    scale: '高度 300m · 体长 600m',
    polyCount: '4 个 LOD：180M / 45M / 12M / 3M 多边形',
    textureRes: '8K PBR · 4K 张贴法线 · 16K 流场贴图',
    riggingNotes: '4 万根骨骼 · 28 层肌肉系统 · 2 万根动态毛发 · 1 万 2 千根羽毛',
    references: ['H.R. Giger 异形原稿', 'Zdzisław Beksiński 油画', 'WETA 哥斯拉解剖图'],
    buildTime: '14 个月',
  },
  {
    id: 'asset-2',
    name: '天庭寺',
    category: 'environment',
    description: '古庙被巨兽摧毁的 CG 环境。完整 360 度可环视。',
    scale: '占地 250m × 180m · 高度 80m',
    polyCount: '60M 多边形（含破损）',
    textureRes: '4K 漫反射 + 2K 法线 + 1K 粗糙度',
    riggingNotes: '使用 Houdini 制作程序化破损，瓦砾、碎柱、断梁可单独刚体解算',
    references: ['山西佛光寺', '日本姬路城', '敦煌莫高窟 220 窟'],
    buildTime: '8 个月',
  },
  {
    id: 'asset-3',
    name: '晨雾山林',
    category: 'environment',
    description: '开场第一幕的山林环境——全 CG 的中国南方丘陵。',
    scale: '12 平方公里',
    polyCount: '120M 植被 + 80M 地形',
    textureRes: '程序化生成 + 8K 贴图',
    riggingNotes: 'SpeedTree 制作 5 万棵树，每棵都有独立的 wind 动画',
    references: ['黄山云海', '张家界国家森林公园', '巨蟒与圣杯实拍'],
    buildTime: '6 个月',
  },
  {
    id: 'asset-4',
    name: '断潮刀',
    category: 'prop',
    description: '陈守田的兵器——3000 年前的神器，被神力激活。',
    scale: '长度 1.2m',
    polyCount: '高模 80K · 低模 8K',
    textureRes: '4K 反射 + 2K 磨损贴图',
    riggingNotes: '需要单独的能量场绑定，光效与持刀者动作同步',
    references: ['越王勾践剑', '汉代环首刀', '《浪客剑心》逆刃刀'],
    buildTime: '3 个月',
  },
];

export const vfxDisciplines: VFXDiscipline[] = [
  {
    id: 'disc-1',
    name: 'Creature Design',
    chineseName: '生物设计',
    icon: '◇',
    description: '全片 CG 角色设计——渊、神兽、守护灵',
    shotCount: 18,
    toolChain: ['ZBrush', 'Maya', 'Mari', 'Houdini'],
    color: '#9d0208',
    headcount: 12,
  },
  {
    id: 'disc-2',
    name: 'Environment',
    chineseName: '环境延伸',
    icon: '◰',
    description: '实拍场景的 CG 扩展、远景置换、天空生成',
    shotCount: 42,
    toolChain: ['Maya', 'Houdini', 'Nuke', 'World Machine'],
    color: '#74b9ff',
    headcount: 18,
  },
  {
    id: 'disc-3',
    name: 'FX Simulation',
    chineseName: '特效模拟',
    icon: '✦',
    description: '粒子、流体、布料、刚体、毛发、解算',
    shotCount: 35,
    toolChain: ['Houdini', 'RealFlow', 'Thinking Particles'],
    color: '#ff6b35',
    headcount: 14,
  },
  {
    id: 'disc-4',
    name: 'Lookdev & Lighting',
    chineseName: '材质与灯光',
    icon: '☀',
    description: 'PBR 材质、HDRI 光照、色彩管线',
    shotCount: 52,
    toolChain: ['Mari', 'Substance', 'Katana', 'Karma'],
    color: '#d4af37',
    headcount: 16,
  },
  {
    id: 'disc-5',
    name: 'Compositing',
    chineseName: '后期合成',
    icon: '◐',
    description: '多层合成、抠像、色彩校正、最终输出',
    shotCount: 72,
    toolChain: ['Nuke', 'Fusion', 'After Effects'],
    color: '#a29bfe',
    headcount: 22,
  },
  {
    id: 'disc-6',
    name: 'Digital Double',
    chineseName: '数字替身',
    icon: '◑',
    description: '演员全身扫描、超高精度模型、表情捕捉',
    shotCount: 8,
    toolChain: ['Maya', 'ZBrush', 'Metahuman', 'Faceware'],
    color: '#1dd1a1',
    headcount: 6,
  },
];

export const renderPipeline: RenderPipelineStage[] = [
  {
    id: 'pipe-1',
    stage: 'Modeling',
    chineseName: '建模',
    description: '从概念图到 3D 模型。低模 / 中模 / 高模 / LOD 完整制作',
    hoursPerShot: 80,
    icon: '◇',
    color: '#74b9ff',
    deliverables: ['高模 ZTL', '低模 OBJ', 'UV 展开'],
  },
  {
    id: 'pipe-2',
    stage: 'Texturing',
    chineseName: '材质绘制',
    description: 'PBR 材质——漫反射、法线、粗糙度、金属度、置换',
    hoursPerShot: 60,
    icon: '◐',
    color: '#a29bfe',
    deliverables: ['4K/8K 贴图集', 'Substance 源文件'],
  },
  {
    id: 'pipe-3',
    stage: 'Rigging',
    chineseName: '绑定',
    description: '骨骼系统、肌肉模拟、面部绑定、动力学控制',
    hoursPerShot: 120,
    icon: '⊞',
    color: '#1dd1a1',
    deliverables: ['骨骼资产', '控制器', '表情库'],
  },
  {
    id: 'pipe-4',
    stage: 'Animation',
    chineseName: '动画',
    description: '关键帧动画、动捕清理、布料 / 毛发 / 肌肉解算',
    hoursPerShot: 200,
    icon: '▶',
    color: '#d4af37',
    deliverables: ['动画缓存', '解算 ABC'],
  },
  {
    id: 'pipe-5',
    stage: 'Lookdev',
    chineseName: '材质预览',
    description: '材质在不同光照下的预览，匹配导演意图',
    hoursPerShot: 80,
    icon: '◉',
    color: '#f368e0',
    deliverables: ['Lookdev 球', '参考帧'],
  },
  {
    id: 'pipe-6',
    stage: 'Lighting',
    chineseName: '灯光',
    description: 'HDRI 光照、3 点布光、戏剧化氛围',
    hoursPerShot: 100,
    icon: '☀',
    color: '#f4d03f',
    deliverables: ['灯光文件', 'AOV 通道'],
  },
  {
    id: 'pipe-7',
    stage: 'Render',
    chineseName: '渲染',
    description: '分布式渲染农场——单镜头可 100-300 核并行',
    hoursPerShot: 600,
    icon: '⚡',
    color: '#ff6b35',
    deliverables: ['EXR 序列', '深度图', 'AOV 合成层'],
  },
  {
    id: 'pipe-8',
    stage: 'Comp',
    chineseName: '合成',
    description: '多层合成、抠像、调色、最终输出',
    hoursPerShot: 80,
    icon: '⊕',
    color: '#ff3838',
    deliverables: ['Nuke 脚本', '最终 EXR', 'DPX 序列'],
  },
];

// ============= 选角与演员 =============

export interface CastProfile {
  id: string;
  characterId: string;          // 关联到 characters 数组的 id
  characterName: string;
  alias: string;
  physicalRequirements: {
    ageRange: string;            // '55-70'
    height: string;              // '170-180cm'
    build: string;               // '精瘦 / 健硕 / 魁梧'
    distinctiveFeatures: string; // 面部特征
  };
  performanceKeywords: string[];  // 表演关键词
  emotionalRange: string[];       // 情绪范围
  specialSkills: string[];        // 特殊技能
  languageRequirements: string[]; // 语言
  referenceActors: ReferenceActor[];
  auditionScenes: AuditionScene[];
  workshopNotes: string;          // 排练导演备注
  castingDifficulty: 'low' | 'medium' | 'high' | 'extreme';
  castingReason: string;          // 选角理由
  color: string;                  // 角色色
}

export interface ReferenceActor {
  name: string;
  nationality: string;
  knownFor: string;
  reasonForReference: string;   // 选这位作参考的原因
  signature?: string;            // 标志性作品
}

export interface AuditionScene {
  id: string;
  title: string;
  fromAct: number;
  description: string;            // 场景描述
  emotionalContext: string;       // 情绪上下文
  directionNotes: string;         // 导演指示
  pageReference: string;          // 剧本页码
  sidesContent: string;           // 试镜片段对白
  partnerCharacter?: string;      // 对手戏角色
}

export interface RehearsalPlan {
  id: string;
  phase: string;                  // 阶段名
  duration: string;               // 时长
  participants: string[];         // 参与者
  activities: string[];           // 活动
  goals: string[];                // 目标
  notes: string;                  // 备注
}

export const castProfiles: CastProfile[] = [
  {
    id: 'cast-1',
    characterId: 'char-1',
    characterName: '陈守田',
    alias: '守田翁',
    physicalRequirements: {
      ageRange: '60-75',
      height: '170-180 cm',
      build: '瘦削但筋骨坚实',
      distinctiveFeatures: '深邃目光、刀刻般皱纹、关节粗大的手、晒黑皮肤',
    },
    performanceKeywords: ['隐忍', '苍凉', '坚毅', '沉默的力量', '三千年的重负', '大地般的稳定性'],
    emotionalRange: ['孤独的坚定', '对土地的深情', '觉醒时的神性爆发', '决战的悲壮', '回归的平静'],
    specialSkills: ['古琴演奏（基础）', '农活姿态', '长期持刀稳定性', '面部微表情控制'],
    languageRequirements: ['普通话（带地方口音）', '古汉语吟诵'],
    referenceActors: [
      {
        name: '李雪健',
        nationality: '中国',
        knownFor: '《焦裕禄》《杨善洲》',
        reasonForReference: '中国式农民的骨气与悲悯，三十年演艺生涯积累的厚重感',
        signature: '焦裕禄在风雪中推车',
      },
      {
        name: '渡边谦',
        nationality: '日本',
        knownFor: '《最后的武士》《盗梦空间》',
        reasonForReference: '武士道精神的"静"——沉默中蕴含巨大力量',
        signature: '最后的武士 准备切腹',
      },
      {
        name: '乔纳森·普莱斯',
        nationality: '英国',
        knownFor: '《加勒比海盗》',
        reasonForReference: '老年角色的戏剧张力与幽默感',
        signature: '巴博萨船长在月光下独白',
      },
    ],
    auditionScenes: [
      {
        id: 'aud-1a',
        title: '试镜 1A：破土瞬间',
        fromAct: 4,
        description: '陈守田封印解除、神力爆发、破土而出的内心独白',
        emotionalContext: '三千年的沉眠即将结束，但觉醒也意味着诀别',
        directionNotes: '演员需表现出"从极度静态到突然爆发"的张力。前 30 秒不动如山，后 30 秒逐渐颤抖、起身。',
        pageReference: '剧本 P.78 镜头 #43',
        sidesContent: '『三千年……三千年守这一片田。三千年等一个结果。今天……我等到了。』（停顿）『孩子们，往后这田……就交给你了。』',
        partnerCharacter: undefined,
      },
      {
        id: 'aud-1b',
        title: '试镜 1B：田间独白',
        fromAct: 1,
        description: '陈守田独自在田间劳作，与土地对话',
        emotionalContext: '平静的日常，但藏有三千年的疲惫',
        directionNotes: '最考验演员"在场感"的镜头。台词少，表演多。',
        pageReference: '剧本 P.12 镜头 #5',
        sidesContent: '（无台词。演员在田间浇水、拔草。目光偶尔抬起，落在远山。）',
        partnerCharacter: undefined,
      },
      {
        id: 'aud-1c',
        title: '试镜 1C：告别',
        fromAct: 6,
        description: '与燕无忧的最后一次对话',
        emotionalContext: '明知即将永别，但拒绝告别',
        directionNotes: '演员必须同时表现"克制"和"深情"——中国式父爱的精髓。',
        pageReference: '剧本 P.115 镜头 #68',
        sidesContent: '『丫头，你往东走。我往西去。咱们……不顺路。』',
        partnerCharacter: '燕无忧',
      },
    ],
    workshopNotes: '演员需提前 3 个月接受农活训练、书法训练、古琴入门。配合 2 周体能训练以应对 VFX 战斗戏份。武术指导为"袁家班"成员。',
    castingDifficulty: 'extreme',
    castingReason: '本片核心角色。需要在 60-75 岁年龄段找到兼具体力、神性、悲悯三位一体的演员。中国一线男演员中可选范围有限，需要慎重考虑海外华裔演员（如尊龙、巩俐同档）。',
    color: '#d4af37',
  },
  {
    id: 'cast-2',
    characterId: 'char-2',
    characterName: '燕无忧',
    alias: '风之女',
    physicalRequirements: {
      ageRange: '24-32',
      height: '165-172 cm',
      build: '精干、有肌肉线条',
      distinctiveFeatures: '锐利眼神、束发造型、左眉断眉（旧伤）',
    },
    performanceKeywords: ['锋利', '急切', '执着', '亦正亦邪', '执念的化身', '从冷到热的转变'],
    emotionalRange: ['复仇的冷峻', '质问的愤怒', '觉醒的迷茫', '信任的脆弱', '决战的悲怆'],
    specialSkills: ['武术（剑术）', '马术基础', '高强度打戏', '面部危险表情控制'],
    languageRequirements: ['普通话（带北方腔）', '古汉语斥责语'],
    referenceActors: [
      {
        name: '章子怡',
        nationality: '中国',
        knownFor: '《一代宗师》《卧虎藏龙》',
        reasonForReference: '东方女性的"狠"——凌厉、决绝、一往无前',
        signature: '宫二在火车站的雪夜',
      },
      {
        name: '汤唯',
        nationality: '中国',
        knownFor: '《晚秋》《刺客聂隐娘》',
        reasonForReference: '冷调下深藏情感——燕无忧的"克制"',
        signature: '聂隐娘在树上的凝视',
      },
      {
        name: '全度妍',
        nationality: '韩国',
        knownFor: '《密阳》《下女》',
        reasonForReference: '情绪的层次感——表面冷、内里热',
        signature: '密阳中教堂崩溃',
      },
    ],
    auditionScenes: [
      {
        id: 'aud-2a',
        title: '试镜 2A：质问陈守田',
        fromAct: 2,
        description: '燕无忧第一次逼问陈守田真实身份',
        emotionalContext: '数代人的仇恨突然涌上心头',
        directionNotes: '演员需在 90 秒内从克制到爆发再到克制。声音控制是关键。',
        pageReference: '剧本 P.45 镜头 #21',
        sidesContent: '『你守了三千年的田……可曾守过一个人？我太奶奶死的时候，你在哪里？』',
        partnerCharacter: '陈守田',
      },
      {
        id: 'aud-2b',
        title: '试镜 2B：拔剑瞬间',
        fromAct: 4,
        description: '准备与渊决战的内心戏',
        emotionalContext: '明知必死，但必须前进',
        directionNotes: '考验肢体表现力——拔剑、转身、眼神，三个动作讲完整段故事。',
        pageReference: '剧本 P.92 镜头 #49',
        sidesContent: '（无台词。拔剑、转身。镜头捕捉她下决心的瞬间。）',
        partnerCharacter: undefined,
      },
    ],
    workshopNotes: '演员需提前 4 个月接受剑术、骑术训练。配合咏春拳师父学习贴身短打。导演希望演员在开拍前完成至少 2000 次拔剑动作以达到肌肉记忆。',
    castingDifficulty: 'high',
    castingReason: '动作戏密集且需要细腻情感戏的过渡。中国 25-32 岁女演员中需要兼具"打女"和"文戏"能力者。建议考虑有武术功底的"打女"转型演员。',
    color: '#ff6b35',
  },
  {
    id: 'cast-3',
    characterId: 'char-3',
    characterName: '李清禾',
    alias: '雾中子',
    physicalRequirements: {
      ageRange: '22-28',
      height: '162-170 cm',
      build: '纤细、古典',
      distinctiveFeatures: '淡漠眼神、长直发、苍白皮肤、似笑非笑',
    },
    performanceKeywords: ['空灵', '超然', '轮回感', '半人半神', '温柔的距离感', '千年执念的冷静'],
    emotionalRange: ['雾中现身的疏离', '对陈守田的复杂情感', '见证历史的悲悯', '觉醒时刻的决绝', '完成使命的超脱'],
    specialSkills: ['武术（舞剑基础）', '气功/呼吸控制', '舞蹈基础（可选）'],
    languageRequirements: ['普通话（无明显口音）', '古汉语诵经'],
    referenceActors: [
      {
        name: '刘亦菲',
        nationality: '中国',
        knownFor: '《仙剑奇侠传》《花木兰》',
        reasonForReference: '古典美的现代演绎——仙气与侠气的融合',
        signature: '小龙女在绳上的睡姿',
      },
      {
        name: '长泽雅美',
        nationality: '日本',
        knownFor: '《海街日记》《唐人街探案3》',
        reasonForReference: '"空"的气质——日本物哀美学的具象化',
        signature: '海街四姐妹在樱花下散步',
      },
      {
        name: '凯瑞·穆丽根',
        nationality: '英国',
        knownFor: '《了不起的盖茨比》《西部世界》',
        reasonForReference: '古典与现代的混合气质',
        signature: '黛西在雨中凝望绿灯',
      },
    ],
    auditionScenes: [
      {
        id: 'aud-3a',
        title: '试镜 3A：雾中现身',
        fromAct: 1,
        description: '李清禾第一次出现在陈守田面前',
        emotionalContext: '跨越千年的相遇——熟悉又陌生',
        directionNotes: '考验"在场感"和"气场"。演员需让观众相信她就是"雾中子"。',
        pageReference: '剧本 P.18 镜头 #7',
        sidesContent: '『守田翁……你老了很多。』（轻笑）『我等了你三千年，你却连我的脸都不记得了。』',
        partnerCharacter: '陈守田',
      },
      {
        id: 'aud-3b',
        title: '试镜 3B：诵经',
        fromAct: 5,
        description: '协助陈守田封印渊时的诵经',
        emotionalContext: '明知自己将随之消散，但义无反顾',
        directionNotes: '演员需在 5 分钟内保持面部平静但眼眶含泪。',
        pageReference: '剧本 P.108 镜头 #62',
        sidesContent: '（无台词。演员闭目诵经。面部逐渐消散。）',
        partnerCharacter: '陈守田',
      },
    ],
    workshopNotes: '演员需提前 2 个月接受冥想、呼吸训练。配合戏剧老师学习"间离表演"——既能沉浸又能超然。导演强调"无表演的表演"是该角色的核心。',
    castingDifficulty: 'high',
    castingReason: '需要兼具古典美和现代感的年轻女演员。气质是首要考量，演技其次。建议考虑有舞蹈或戏曲功底的演员。',
    color: '#a29bfe',
  },
  {
    id: 'cast-4',
    characterId: 'char-4',
    characterName: '魏镇',
    alias: '守陵人',
    physicalRequirements: {
      ageRange: '70-90',
      height: '165-175 cm',
      build: '清瘦、佝偻',
      distinctiveFeatures: '浑浊眼神、稀疏白须、满布皱纹、瘦骨嶙峋',
    },
    performanceKeywords: ['苍老', '神秘', '悲悯', '时间的化身', '近乎透明的存在感', '三千年的重'],
    emotionalRange: ['古井般的平静', '对后辈的慈爱', '见证历史的疏离', '退场时的超脱'],
    specialSkills: ['老年步态', '古乐器演奏（埙/箫）', '低声台词控制'],
    languageRequirements: ['普通话（古朴）', '古汉语'],
    referenceActors: [
      {
        name: '游本昌',
        nationality: '中国',
        knownFor: '《济公》《繁花》',
        reasonForReference: '中国式"老神仙"——看似疯癫实则通透',
        signature: '济公在破庙里喝酒',
      },
      {
        name: '克里斯托弗·李',
        nationality: '英国',
        knownFor: '《指环王》《星球大战》',
        reasonForReference: '老年角色的"重量感"——声音、目光、举手投足都带 2000 年的历史',
        signature: '萨鲁曼被刺前的最后独白',
      },
    ],
    auditionScenes: [
      {
        id: 'aud-4a',
        title: '试镜 4A：初遇燕无忧',
        fromAct: 1,
        description: '魏镇与燕无忧在天庭寺山门初遇',
        emotionalContext: '明知命运却选择隐忍',
        directionNotes: '考验"老"和"慢"——每一个动作都要像 3000 年那么重。',
        pageReference: '剧本 P.16 镜头 #6',
        sidesContent: '『姑娘，你来找那个种地的？他在东边。走路慢点，三千年了，他不急。』（笑）『我急过，后来就不急了。』',
        partnerCharacter: '燕无忧',
      },
    ],
    workshopNotes: '演员需配合特型化妆团队（4 小时/天）。提前 1 个月接受埙/箫的演奏训练。声音指导为著名配音演员。',
    castingDifficulty: 'medium',
    castingReason: '中国 70-90 岁年龄段的老戏骨储备充足。建议优先考虑话剧舞台经验丰富、声音条件好的演员。',
    color: '#74b9ff',
  },
];

export const rehearsalPlan: RehearsalPlan[] = [
  {
    id: 'reh-1',
    phase: 'PRE-PRODUCTION WORKSHOP',
    duration: '4 周',
    participants: ['陈守田演员', '燕无忧演员', '李清禾演员', '魏镇演员', '导演', '武术指导', '表演指导'],
    activities: ['剧本围读（全员）', '人物小传讨论', '试装与造型定稿', '表演风格统一', '基础武术训练'],
    goals: ['演员之间建立化学反应', '确认角色动机与情感线索', '确定表演风格基线'],
    notes: '围读 2 周。每天 4 小时。所有演员必须到场。导演亲自带读。',
  },
  {
    id: 'reh-2',
    phase: 'MOVEMENT WORKSHOP',
    duration: '6 周',
    participants: ['陈守田演员', '燕无忧演员', '李清禾演员', '武术指导团队'],
    activities: ['古琴/埙/剑术基础', '农活姿态训练', '打戏套招设计', 'VFX 空打训练', '体能训练'],
    goals: ['演员在 VFX 镜头中能完成"无形战斗"', '动作戏流畅且不重复', '基础体能保证拍摄周期'],
    notes: '重点是 VFX 配合训练——演员需要在"无实物"情况下表现出刀光、能量等。需要动作捕捉标记。',
  },
  {
    id: 'reh-3',
    phase: 'LOCATION REHEARSAL',
    duration: '3 周',
    participants: ['全员主演', '武术指导', '摄影指导', '制片主任'],
    activities: ['主要外景地踏勘', '天庭寺布景区排练', '声场测试', '光照测试', '应急演练'],
    goals: ['演员熟悉拍摄环境', '确立主要镜头的走位', '测试特殊环境（雾、雨、风）的拍摄方案'],
    notes: '与摄影指导密切配合。每场戏至少走位 2 次。',
  },
  {
    id: 'reh-4',
    phase: 'INTIMATE SCENES REHEARSAL',
    duration: '2 周',
    participants: ['陈守田演员', '燕无忧演员', '李清禾演员', '导演'],
    activities: ['重点情感戏对戏', '独白与旁白录制', '无声表演镜头', '情绪记忆调用'],
    goals: ['情感戏达到"无表演"状态', '演员之间的化学反应达到最佳', '建立信任以便导演随时调整'],
    notes: '导演与演员一对一工作。每场戏 2-3 天反复打磨。',
  },
  {
    id: 'reh-5',
    phase: 'FINAL ENSEMBLE',
    duration: '1 周',
    participants: ['全员主演', '全体剧组'],
    activities: ['全片连贯彩排', '重点转场确认', '总表与计划最终确认'],
    goals: ['所有演员准备就绪', '团队状态调整到最佳'],
    notes: '开机前最后一次全员集合。',
  },
];

// ============= 营销与发行 =============

export interface Tagline {
  id: string;
  version: string;             // 主版/国际版/中国版
  language: string;            // 语种
  text: string;                // 一句线
  englishText?: string;        // 英文版（如有）
  target: string;              // 目标受众
  tone: string;                // 调性
  description: string;         // 创作思路
}

export interface PosterConcept {
  id: string;
  name: string;                // 海报名
  visual: string;              // 视觉描述
  colorScheme: { primary: string; secondary: string; accent: string };
  typography: string;          // 字体设计
  composition: string;         // 构图思路
  keyElements: string[];       // 关键元素
  emotion: string;             // 情绪
  targetAudience: string;      // 目标受众
  releaseStage: 'teaser' | 'main' | 'character' | 'final';  // 释出阶段
}

export interface TargetAudience {
  id: string;
  segment: string;             // 受众分层
  ageRange: string;
  gender: string;
  interests: string[];
  motivations: string[];       // 观看动机
  channels: string[];          // 触达渠道
  expectedShare: number;       // 预期占比
  ticketPrice: string;         // 票价敏感度
  hookLine: string;            // 一句话钩子
  color: string;
}

export interface MarketingPhase {
  id: string;
  month: string;               // 月份（如 "M-6" 开机前 6 月）
  phaseName: string;           // 阶段名
  focus: string;               // 重点
  activities: string[];        // 活动
  channels: string[];          // 渠道
  budgetShare: number;         // 预算占比 0-100
  kpis: string[];              // KPI
  milestones: string[];        // 关键节点
}

export interface FestivalStrategy {
  id: string;
  festival: string;            // 电影节
  type: 'A-list' | 'B-list' | 'Specialty' | 'Asian';
  timing: string;              // 时间
  strategy: 'premiere' | 'competition' | 'special-screening' | 'market';
  expectedOutcome: string;
  historical: string;          // 历年参赛情况
  relevance: 'high' | 'medium' | 'low';
}

export const taglines: Tagline[] = [
  {
    id: 'tag-1',
    version: '主版',
    language: '中文',
    text: '守三千年田，等一个人。',
    englishText: 'Three thousand years of waiting. One final battle.',
    target: '中国 30-60 岁男性核心观众',
    tone: '史诗、悲壮、内敛',
    description: '直击陈守田的核心动机——三千年守望的重量。简短对仗，句式有力，符合中国式文人的表达。',
  },
  {
    id: 'tag-2',
    version: '国际版',
    language: 'English',
    text: 'When the heavens fall, who stands for the earth?',
    target: '北美/欧洲 IMAX 核心观众',
    tone: '史诗、宏大、普世',
    description: '国际化表达——"天地"作为普世意象。疑问句式激发观众好奇心。',
  },
  {
    id: 'tag-3',
    version: '中国版',
    language: '中文',
    text: '种田的人，成了神。',
    target: '中国年轻观众（20-35）',
    tone: '反英雄、个性、网感',
    description: '反差对比激发传播——"种田"和"神"的强烈对比，暗示"逆袭"叙事。',
  },
  {
    id: 'tag-4',
    version: '情感版',
    language: '中文',
    text: '她的恨，他的守，三千年的了断。',
    target: '中国女性观众',
    tone: '情感、纠葛、人性',
    description: '三人关系驱动——燕无忧的恨、 陈守田的守、李清禾的轮回。',
  },
  {
    id: 'tag-5',
    version: '日本版',
    language: '日本語',
    text: '三千年の孤独が、今始まる。',
    englishText: 'Three thousand years of solitude. Begins now.',
    target: '日本文化爱好者、动漫迷',
    tone: '物哀、内省、诗意',
    description: '借鉴日本"物哀"美学——孤独、宿命、诗意。',
  },
  {
    id: 'tag-6',
    version: 'IMAX 版',
    language: '中文 + English',
    text: 'IMAX 银幕，容得下三千年的守望。',
    englishText: 'Only IMAX can hold three thousand years.',
    target: 'IMAX 巨幕厅观众',
    tone: '沉浸、技术、专属',
    description: '突出 IMAX 银幕的不可替代性——只有 IMAX 才能呈现这规模。',
  },
];

export const posterConcepts: PosterConcept[] = [
  {
    id: 'poster-1',
    name: '守望者',
    visual: '陈守田背影剪影站在金色麦田中央，远方天空撕裂露出渊的瞳孔',
    colorScheme: { primary: '#d4af37', secondary: '#3a1a0a', accent: '#9d0208' },
    typography: '黑色无衬线主标题，下方金色手写体"对决"',
    composition: '三分构图——下方田野 2/3，上方天空 1/3，人物剪影居中',
    keyElements: ['陈守田背影', '金色麦田', '撕裂天空', '渊的瞳孔', '断潮刀轮廓'],
    emotion: '史诗、悲壮、孤独',
    targetAudience: '核心观众、奖项评委',
    releaseStage: 'main',
  },
  {
    id: 'poster-2',
    name: '神战',
    visual: '陈守田（金色神力）与渊（血红兽性）的对撞瞬间，画面分割为冷暖两半',
    colorScheme: { primary: '#9d0208', secondary: '#d4af37', accent: '#0a0a0a' },
    typography: '主标题居中，分割线穿过字体',
    composition: '对角线构图——左下角陈守田挥刀，右上角渊的爪子落下',
    keyElements: ['陈守田金色光效', '渊血红色光效', '冷暖对撞', '碎裂岩石'],
    emotion: '紧张、动作、高潮',
    targetAudience: '动作片爱好者、年轻男性观众',
    releaseStage: 'main',
  },
  {
    id: 'poster-3',
    name: '三千年',
    visual: '极简——金色手写"三千年"三字，背景为陈守田的皱纹特写',
    colorScheme: { primary: '#d4af37', secondary: '#1a0a00', accent: '#f4d03f' },
    typography: '超大手写毛笔字"三千年"——书法家题写',
    composition: '极简——三字占 80%，下方小字"对决"',
    keyElements: ['书法字体', '陈守田皱纹特写', '无 CG 元素'],
    emotion: '人文、诗意、奖项指向',
    targetAudience: '电影节评委、艺术片爱好者',
    releaseStage: 'final',
  },
];

export const targetAudiences: TargetAudience[] = [
  {
    id: 'aud-1',
    segment: 'IMAX 核心观众',
    ageRange: '25-55',
    gender: '男性 60% / 女性 40%',
    interests: ['IMAX 影迷', '特效大片爱好者', '科幻/奇幻/史诗'],
    motivations: ['极致视听体验', '社交话题', '导演/明星阵容'],
    channels: ['IMAX 官方 APP', '豆瓣', '微博电影', '知乎', 'B 站影视区'],
    expectedShare: 35,
    ticketPrice: '高 (60-150元)',
    hookLine: '只有在 IMAX 银幕上才能看到这规模',
    color: '#ff6b35',
  },
  {
    id: 'aud-2',
    segment: '中国神话/玄幻爱好者',
    ageRange: '18-40',
    gender: '男性 70% / 女性 30%',
    interests: ['《山海经》', '修仙/玄幻小说', '中国神话研究', '国风文化'],
    motivations: ['中国神话的世界观', '史诗感', '文化认同'],
    channels: ['抖音', 'B 站', '小红书', '起点/番茄小说', '知乎中国神话话题'],
    expectedShare: 30,
    ticketPrice: '中 (40-80元)',
    hookLine: '《山海经》里的怪物在 IMAX 银幕活过来',
    color: '#d4af37',
  },
  {
    id: 'aud-3',
    segment: '文艺片观众',
    ageRange: '28-50',
    gender: '男性 45% / 女性 55%',
    interests: ['《卧虎藏龙》', '《一代宗师》', '东方美学', '慢电影', '戛纳/威尼斯'],
    motivations: ['东方美学的银幕化', '演员的表演', '导演的作者性'],
    channels: ['豆瓣', '虹膜', '深焦', '电影旬报', '法国《电影手册》'],
    expectedShare: 15,
    ticketPrice: '高 (50-100元)',
    hookLine: '它可能是十年来最中国化的 IMAX 巨制',
    color: '#a29bfe',
  },
  {
    id: 'aud-4',
    segment: '家庭/合家欢',
    ageRange: '8-65',
    gender: '无差别',
    interests: ['合家欢娱乐', '中国故事', 'CG 视觉', '老人/小孩都能看'],
    motivations: ['带孩子体验', '家庭活动', '文化传承'],
    channels: ['微信朋友圈', '亲子 KOL', '春节档宣传', '央视电影频道'],
    expectedShare: 20,
    ticketPrice: '中 (40-80元)',
    hookLine: '三代人一起看的中国神话',
    color: '#1dd1a1',
  },
];

export const marketingTimeline: MarketingPhase[] = [
  {
    id: 'mkt-1',
    month: 'M-6 (拍摄期)',
    phaseName: '概念预热',
    focus: '建立认知、制造悬念',
    activities: ['官方微博/微信注册', '导演首支 vlog 释出', '概念海报 (3 张) 静默发布', 'IMAX 战略合作签约新闻', '业内看片会 (制片圈)'],
    channels: ['官方社媒', '娱乐媒体', '行业自媒体'],
    budgetShare: 10,
    kpis: ['微博粉丝 100 万', '豆瓣想看 50 万', 'B 站影视区口碑'],
    milestones: ['官宣', '首张概念海报'],
  },
  {
    id: 'mkt-2',
    month: 'M-4 (后期开始)',
    phaseName: '内容释出',
    focus: '第一波物料——角色、剧情、世界观',
    activities: ['4 角色海报', '第一支预告片 (90s)', '4 角色短视频花絮', '导演访谈', '选角纪录片《三千年的寻找》'],
    channels: ['抖音', 'B 站', '微博', '豆瓣', '知乎', 'YouTube'],
    budgetShare: 15,
    kpis: ['预告片播放量 5000 万', '抖音挑战赛 1 亿', '4 角色话题 10 个热搜'],
    milestones: ['首支预告', '角色海报', '媒体看片'],
  },
  {
    id: 'mkt-3',
    month: 'M-2 (上映前 2 月)',
    phaseName: '口碑建立',
    focus: '行业内看片、口碑发酵、KOL 推荐',
    activities: ['IMAX 专场看片 50 场', 'KOL/影评人提前看片', '豆瓣开分', 'B 站/小红书种草', '路演 (10 个城市)'],
    channels: ['豆瓣', '小红书', 'B 站', '抖音', '路演'],
    budgetShare: 25,
    kpis: ['豆瓣开分 8.0+', '猫眼想看 100 万', 'B 站 1 万+ 长评'],
    milestones: ['豆瓣开分', '路演启动'],
  },
  {
    id: 'mkt-4',
    month: 'M-1 (上映前 1 月)',
    phaseName: '话题冲刺',
    focus: '大众普及、社交话题、联名合作',
    activities: ['第二支预告片 (动作版)', '主题曲 MV (3 首)', '联名 (麦当劳/瑞幸/故宫)', '艺人/网红短视频二创', '微博热搜购买 (4 个话题)'],
    channels: ['所有社交媒体', '联名品牌', 'KOL 二创', '抖音挑战赛'],
    budgetShare: 30,
    kpis: ['第二支预告 1 亿播放', '联名销售 5 亿', '微博热搜 4 个'],
    milestones: ['动作预告', '联名发布', '倒计时海报'],
  },
  {
    id: 'mkt-5',
    month: 'M-0 (上映月)',
    phaseName: '上映爆发',
    focus: '首周票房、口碑营销、长线运营',
    activities: ['首映礼 (北京/上海/纽约)', '媒体铺天盖地', 'CGV/万达 IMAX 主题展', '二创激励 (10 万奖金)', '实时票房直播'],
    channels: ['全部媒体', '院线合作', '短视频平台', '直播平台'],
    budgetShare: 20,
    kpis: ['首周票房 8 亿', '猫眼 9.5+', '微博话题 100 亿阅读'],
    milestones: ['首映礼', '首日票房破亿', '首周破 8 亿'],
  },
];

export const festivalStrategy: FestivalStrategy[] = [
  {
    id: 'fest-1',
    festival: '威尼斯电影节 (Venice)',
    type: 'A-list',
    timing: '8-9 月 (上映前 1-2 月)',
    strategy: 'premiere',
    expectedOutcome: '金狮奖提名、最佳技术贡献、场刊高分',
    historical: '2023《可怜的东西》金狮奖；2022《伊尼舍林的报丧女妖》获奖',
    relevance: 'high',
  },
  {
    id: 'fest-2',
    festival: '戛纳电影节 (Cannes)',
    type: 'A-list',
    timing: '5 月 (次年)',
    strategy: 'special-screening',
    expectedOutcome: '一种关注单元、技术奖项',
    historical: '2023《利益区域》评审团大奖；2024《香巴拉》一种关注',
    relevance: 'high',
  },
  {
    id: 'fest-3',
    festival: '多伦多电影节 (TIFF)',
    type: 'A-list',
    timing: '9 月 (北美首映)',
    strategy: 'premiere',
    expectedOutcome: '观众选择奖、北美口碑',
    historical: '2023《美国小说》观众选择奖；2022《女人们的谈话》',
    relevance: 'high',
  },
  {
    id: 'fest-4',
    festival: '东京国际电影节 (TIFF)',
    type: 'Asian',
    timing: '10-11 月 (亚洲首映)',
    strategy: 'premiere',
    expectedOutcome: '亚洲口碑、亚洲市场铺垫',
    historical: '2023《怪物》是枝裕和获开幕影片；2022《某个男人》',
    relevance: 'high',
  },
  {
    id: 'fest-5',
    festival: '奥斯卡 (Academy Awards)',
    type: 'A-list',
    timing: '次年 2-3 月',
    strategy: 'competition',
    expectedOutcome: '最佳国际影片、最佳摄影、最佳视觉效果提名',
    historical: '《瞬息全宇宙》2023 七项奥斯卡；《银翼杀手2049》最佳摄影/视效',
    relevance: 'high',
  },
];
