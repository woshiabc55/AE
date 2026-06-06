// 世界观数据 —— 来自 /workspace/世界观设定卡.md
// 仅供本页静态展示使用

export const meta = {
  title: "建木 → 长安",
  subtitle: "Shennong's Pillar to the Vermilion Gate",
  tagline: "小队集结于建木之巅 · 俯冲穿界 · 出画朱雀",
  source: "世界观设定卡 v1.1",
};

export const characters: Array<{
  id: number;
  name: string;
  role: string;
  position: string;
  face: string;
  pose: string;
  prop: string;
  lightNote: string;
  quote: string;
}> = [
  {
    id: 9,
    name: "蚩奼",
    role: "能量核心操作员",
    position: "楔形箭头·侧翼",
    face: "专注抿嘴 · 眼神锁定核心",
    pose: "手指在能量核心表面快速操作",
    prop: "能量核心",
    lightNote: "核心蓝光随呼吸脉动",
    quote: "「核心节律与呼吸同频」",
  },
  {
    id: 10,
    name: "伏鹤",
    role: "翼装突击位",
    position: "楔形箭头·侧翼",
    face: "嘴角微扬 · 自信",
    pose: "机关翼展开时身体后仰 · 重心后移",
    prop: "机关翼",
    lightNote: "无",
    quote: "「蓄力起跳 · 决胜一瞬」",
  },
  {
    id: 1,
    name: "队长",
    role: "五人小队领导者",
    position: "楔形箭头·最前端",
    face: "沉稳 · 望向东方",
    pose: "全队视线统一指向穿界门",
    prop: "—",
    lightNote: "无",
    quote: "「向东」",
  },
];

export const scenes: Array<{
  id: string;
  name: string;
  subtitle: string;
  colorTemp: string;
  lighting: string;
  atmosphere: string;
  detail: string;
  swatch: string;
}> = [
  {
    id: "A",
    name: "建木之巅",
    subtitle: "起点 · 蓄势",
    colorTemp: "冷紫 · 7500K",
    lighting: "顶光冷调 · 高对比",
    atmosphere: "黎明前 · 静谧",
    detail: "五人楔形站位 · 能量核心蓝光明灭 · 机关翼蓄力",
    swatch: "from-ink-700 to-ink-900",
  },
  {
    id: "B",
    name: "紊流海",
    subtitle: "中段 · 俯冲",
    colorTemp: "中性 · 5500K",
    lighting: "云隙光柱 · 体积云动态",
    atmosphere: "云如凝固浪 · 边缘锐利",
    detail: "0 → 200 km/h 体感加速 · 真空尾迹 · 撕裂云层",
    swatch: "from-ink-800 via-ink-700 to-ink-900",
  },
  {
    id: "C",
    name: "穿界门 (19)",
    subtitle: "通道 · 时空",
    colorTemp: "错位 · RGB",
    lighting: "青铜回纹 · 内部扭曲隧道",
    atmosphere: "低频 50Hz 嗡声",
    detail: "2 Hz 水波状空间涟漪 · 防护结界仅碰撞显形",
    swatch: "from-bronze-700 via-ink-800 to-ink-900",
  },
  {
    id: "D",
    name: "朱雀门 (16)",
    subtitle: "终点 · 出画",
    colorTemp: "暖金 · 3200K",
    lighting: "侧逆光 · 淡金光晕",
    atmosphere: "大气透视 · 远景蒙光",
    detail: "中轴线穿入 · 如箭矢破空",
    swatch: "from-bronze-600 via-gold-500 to-gold-200",
  },
];

export const props: Array<{
  id: string;
  name: string;
  form: string;
  color: string;
  rhythm: string;
  mechanic: string;
  chips: string[];
}> = [
  {
    id: "core",
    name: "能量核心",
    form: "掌中卵形装置",
    color: "冷蓝 #4FA8FF",
    rhythm: "明灭频率 = 持有者呼吸",
    mechanic: "提供穿越动力 · 蓝光脉动",
    chips: ["breath-rhythm", "core-blue"],
  },
  {
    id: "wing",
    name: "机关翼",
    form: "金属翼面外骨骼",
    color: "青铜 #7A5C2E",
    rhythm: "瞬态展开",
    mechanic: "弹簧/连杆释放 · 抵消前向反作用力",
    chips: ["spring-release", "bronze"],
  },
  {
    id: "gate",
    name: "穿界门 (19)",
    form: "青铜回纹门框 + 内部时空隧道",
    color: "青铜渐变 → 隧道错位色",
    rhythm: "2 Hz 涟漪 · 振幅随距离衰减",
    mechanic: "穿越时 RGB 错位 0.3s · 防护结界碰撞显形",
    chips: ["2Hz", "0.3s", "50Hz-hum", "RGB-shift"],
  },
];

export const vfx: Array<{
  stage: string;
  effect: string;
  param: string;
  solution: string;
}> = [
  {
    stage: "建木集结",
    effect: "色温起点",
    param: "7500K · 冷紫",
    solution: "顶光冷调 + 紫调径向渐变",
  },
  {
    stage: "俯冲·紊流海",
    effect: "真空尾迹",
    param: "0 → 200 km/h",
    solution: "非线性速度曲线 · 体积云粒子置换",
  },
  {
    stage: "穿越穿界门",
    effect: "RGB 错位",
    param: "0.3 s",
    solution: "R/G/B 通道 0.1s 时序偏移",
  },
  {
    stage: "穿越穿界门",
    effect: "空间涟漪",
    param: "2 Hz",
    solution: "屏幕空间扭曲 · 正弦 UV",
  },
  {
    stage: "全程",
    effect: "防护结界",
    param: "碰撞触发",
    solution: "物理事件驱动材质 alpha",
  },
  {
    stage: "朱雀门出画",
    effect: "色温终点",
    param: "3200K · 暖金",
    solution: "侧逆光 + 淡金光晕大气透视",
  },
];

export const audio: Array<{
  event: string;
  sound: string;
  freq: string;
  type: "music" | "sfx";
}> = [
  {
    event: "建木蓄势",
    sound: "弦乐拨奏 (pizzicato)",
    freq: "全频段铺陈",
    type: "music",
  },
  {
    event: "俯冲爆发",
    sound: "铜管长音 (sustain)",
    freq: "中低频主导",
    type: "music",
  },
  {
    event: "穿界门开启",
    sound: "低频嗡声",
    freq: "50 Hz",
    type: "sfx",
  },
  {
    event: "穿越瞬间",
    sound: "RGB 错位感音效",
    freq: "0.3 s 瞬态",
    type: "sfx",
  },
  {
    event: "云层撕裂",
    sound: "真空尾迹（气压突变）",
    freq: "低频爆破",
    type: "sfx",
  },
  {
    event: "机关翼展开",
    sound: "金属咬合 / 连杆释放",
    freq: "瞬态 + 混响",
    type: "sfx",
  },
];

export const shots: Array<{
  id: string;
  content: string;
  movement: string;
  duration: string;
  assets: string;
}> = [
  {
    id: "S-01",
    content: "建木集结·五人楔形",
    movement: "静 → 缓推",
    duration: "2-3 s",
    assets: "角色(1/9/10) · 场景D-04",
  },
  {
    id: "S-02",
    content: "蚩奼调核心特写",
    movement: "推镜",
    duration: "1-2 s",
    assets: "D-01 · D-08",
  },
  {
    id: "S-03",
    content: "伏鹤展翼",
    movement: "甩镜",
    duration: "0.5-1 s",
    assets: "D-02 · D-09",
  },
  {
    id: "S-04",
    content: "穿界门开启",
    movement: "正面固定",
    duration: "1-2 s",
    assets: "D-07",
  },
  {
    id: "S-05",
    content: "俯冲·紊流海",
    movement: "跟拍主观",
    duration: "3-5 s",
    assets: "D-05 · D-09",
  },
  {
    id: "S-06",
    content: "穿越穿界门",
    movement: "主观 + RGB 错位",
    duration: "0.3 s",
    assets: "D-07",
  },
  {
    id: "S-07",
    content: "朱雀门中轴出画",
    movement: "急推",
    duration: "1-2 s",
    assets: "D-06",
  },
];

export const deliverables: Array<{
  id: string;
  asset: string;
  type: string;
  note: string;
}> = [
  { id: "D-01", asset: "角色 蚩奼(9) 绑定", type: "角色", note: "含能量核心手部接触点" },
  { id: "D-02", asset: "角色 伏鹤(10) 绑定", type: "角色", note: "含机关翼骨骼驱动" },
  { id: "D-03", asset: "队长(1) + 群像 5 人", type: "角色", note: "楔形站位循环动画" },
  { id: "D-04", asset: "场景 建木之巅", type: "场景", note: "含冷紫调灯光预设" },
  { id: "D-05", asset: "场景 紊流海", type: "场景", note: "体积云 + 光柱系统" },
  { id: "D-06", asset: "场景 朱雀门(16)", type: "场景", note: "暖金光晕大气透视" },
  { id: "D-07", asset: "道具 穿界门(19)", type: "特效", note: "青铜回纹 + 时空隧道 + 2Hz 涟漪" },
  { id: "D-08", asset: "道具 能量核心", type: "道具", note: "蓝光明灭（呼吸节律）" },
  { id: "D-09", asset: "道具 机关翼", type: "道具", note: "展开瞬态动画" },
  { id: "D-10", asset: "配乐 + 音效", type: "音频", note: "弦乐拨奏→铜管 + 50Hz 嗡声" },
];

export const qualityBar: string[] = [
  "电影级材质（皮肤次表面散射 + 金属 IBL）",
  "体积云光照方向实时变化",
  "RGB 错位精确 0.3 s（不超不欠）",
  "50 Hz 低频嗡声清晰可感（不破音）",
  "楔形站位 + 队长在前符合分镜",
  "朱雀门出画方向为「中轴线穿入」",
  "图 1 材质基准已贯彻到所有 CG 资产",
];

export const softwareStack: Array<{ layer: string; tools: string }> = [
  { layer: "角色 / 动画", tools: "Maya · Blender" },
  { layer: "体积云 / 渲染", tools: "Houdini + Karma · Unreal Engine 5" },
  { layer: "合成", tools: "Nuke · After Effects" },
  { layer: "音频", tools: "Pro Tools · Reaper" },
];

// 分镜剧本数据 —— "大国莫" 项目 · 建木→长安 场次
export const scriptMeta = {
  project: "大国莫",
  series: "DAGUAMO",
  episode: "EP-001 · 建木之约",
  draft: "Draft v1.0 · 2026-06-05",
};

export type ScriptBeat = {
  character?: string;
  text: string;
  parenthetical?: string;
};

export type ScriptScene = {
  id: string;
  number: string; // 场 1
  title: string; // 建木之巅·集结
  location: string; // 外 · 建木之巅
  duration: string; // 2-3 s
  shot: string; // 全景 · 楔形站位
  visual: string; // 画面描述
  beats: ScriptBeat[];
  techNotes: string[]; // 技术提示
  sfx?: string[]; // 音效
  transition: string; // 转场
};

export const scriptScenes: ScriptScene[] = [
  {
    id: "S-01",
    number: "场 1",
    title: "建木之巅 · 集结",
    location: "外 · 建木之巅 · 黎明前",
    duration: "2-3 s",
    shot: "全景 → 缓推 · 楔形站位",
    visual:
      "建木顶端平台，五人呈楔形箭头排列。蚩奼立于东翼，低头调试手中卵形装置；伏鹤于西翼，金属翼面蓄势待发。众人目光一致投向东方——那里，一扇青铜回纹门框正缓缓自虚空中显形。",
    beats: [
      { character: "队长", text: "向东。", parenthetical: "沉稳 · 视线锁定" },
    ],
    techNotes: [
      "色温 7500K · 冷紫",
      "顶光冷调 · 高对比",
      "五人站位：队长(1)居最前，蚩奼(9)·伏鹤(10)分列两翼",
    ],
    sfx: ["弦乐拨奏 (pizzicato) 渐入"],
    transition: "缓推 → 切",
  },
  {
    id: "S-02",
    number: "场 2",
    title: "蚩奼 · 核心节律",
    location: "内 · 特写",
    duration: "1-2 s",
    shot: "推镜 · 手部特写",
    visual:
      "蚩奼的双手在能量核心表面快速操作。核心是冷蓝卵形光球，明灭频率与她的呼吸完全同步——吸气时光芒收敛，呼气时迸出蓝色脉冲。",
    beats: [
      {
        character: "蚩奼",
        text: "……与呼吸同频。",
        parenthetical: "专注抿嘴 · 眼神锁定核心",
      },
    ],
    techNotes: [
      "明灭周期 ≈ 3.6 s（与呼吸节律匹配）",
      "冷蓝 #4FA8FF · 核心光晕 + 旋转虚环",
    ],
    sfx: ["核心低频脉冲声（与明灭同步）"],
    transition: "甩镜 → 切",
  },
  {
    id: "S-03",
    number: "场 3",
    title: "伏鹤 · 展翼",
    location: "外 · 半身",
    duration: "0.5-1 s",
    shot: "甩镜 · 半身仰拍",
    visual:
      "伏鹤嘴角微扬。机关翼自背后弹簧机构猛然释放，金属翼面在晨光中划出弧线——他的身体本能后仰，重心后移，抵消展开瞬间的反作用力。",
    beats: [
      {
        character: "伏鹤",
        text: "起。",
        parenthetical: "自信 · 蓄力起跳姿态",
      },
    ],
    techNotes: [
      "机关翼：弹簧 / 连杆释放瞬态",
      "青铜 #7A5C2E 金属 IBL",
    ],
    sfx: ["金属咬合 + 连杆释放 + 混响"],
    transition: "甩镜 → 切",
  },
  {
    id: "S-04",
    number: "场 4",
    title: "穿界门 · 启",
    location: "外 · 穿界门 (19)",
    duration: "1-2 s",
    shot: "正面固定 · 仰角",
    visual:
      "青铜回纹门框完全显形。门内是扭曲的时空隧道——色彩如被搅动的油彩，缓慢旋动。门框外缘泛起水波状金色涟漪，以 2 Hz 频率向外扩散，振幅随距离衰减。",
    beats: [],
    techNotes: [
      "门框：青铜回纹",
      "空间涟漪：2 Hz · 振幅 ∝ 1/r",
      "防护结界：淡金蜂窝网格（仅碰撞显形）",
    ],
    sfx: ["50 Hz 低频嗡声持续"],
    transition: "叠化 → 跟拍",
  },
  {
    id: "S-05",
    number: "场 5",
    title: "俯冲 · 紊流海",
    location: "外 · 紊流海",
    duration: "3-5 s",
    shot: "跟拍主观 · 加速",
    visual:
      "镜头紧随队长，箭矢般向下扎入云海。速度曲线非线性——前 30% 时长已完成 70% 加速，体感从静止骤升至 200 km/h。紊流海的云如凝固的浪，边缘锐利，被身体撕开时留下真空尾迹。云隙漏下光柱，光照方向实时变化。",
    beats: [
      { character: "群像", text: "（风声压过呼吸，仅余衣料猎猎作响）" },
    ],
    techNotes: [
      "速度曲线 0 → 200 km/h · 非线性",
      "体积云 · 粒子置换 + 低密度区域 mask 反向",
      "真空尾迹：气压突变瞬态爆破",
    ],
    sfx: ["弦乐拨奏 → 铜管长音（sustain）渐入", "风噪渐入"],
    transition: "主观 → 黑场",
  },
  {
    id: "S-06",
    number: "场 6",
    title: "穿越 · 错位",
    location: "内 · 穿界门隧道",
    duration: "0.3 s",
    shot: "主观 · RGB 错位",
    visual:
      "镜头冲入门框。0.3 秒内，红 / 绿 / 蓝三色通道依次错位——世界如被撕成三层半透明负片。错位结束的瞬间，光骤然从暖金一侧涌来。",
    beats: [],
    techNotes: [
      "R / G / B 通道 0.1s 时序偏移（红→绿→蓝）",
      "总时长 0.3 s · 不可超不可欠",
    ],
    sfx: ["RGB 错位感音效（0.3 s 瞬态）"],
    transition: "叠化 → 急推",
  },
  {
    id: "S-07",
    number: "场 7",
    title: "朱雀门 · 出画",
    location: "外 · 朱雀门 (16)",
    duration: "1-2 s",
    shot: "急推 · 中轴线",
    visual:
      "宏伟城门由远及近，蒙在淡金光晕中。镜头如箭矢破空，精准自朱雀门中轴线穿入。城楼匾额一闪而逝，画面收束于黑场——下一个故事的开端。",
    beats: [],
    techNotes: [
      "色温 3200K · 暖金",
      "侧逆光 + 淡金光晕大气透视",
      "出画方向：中轴线穿入（不可偏）",
    ],
    sfx: ["铜管长音收尾 · 50Hz 嗡声渐弱至静音"],
    transition: "至黑场 · 下一场",
  },
];
