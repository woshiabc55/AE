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
