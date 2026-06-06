// 分镜 21-25 数据 — 来自《赤霄》分镜脚本
// 时间码为 3:00 - 3:15，整段 15 秒

export type ShotId = "shot-21" | "shot-22" | "shot-23" | "shot-24" | "shot-25";
export type LayerKey = "narrative" | "camera" | "audio" | "vfx";

export interface Shot {
  id: ShotId;
  index: 21 | 22 | 23 | 24 | 25;
  timecode: { start: string; end: string; duration: number };
  title: string;
  subtitle: string;
  depth: number; // 单位：米，负数代表海面下
  altitude?: number; // 用于镜头 25 末尾
  shotSize: string;
  shotType: string;
  movement: string;
  focalNote: string;
  visual: string[];
  vfx: string[];
  audio: string[];
  imax: string[];
  motionBlur: string;
  cameraNote: string;
  lighting: { from: string; to: string };
  palette: { bg: string; accent: string; text: string };
  motif: string; // 用于右侧切换器对应字符
  gpsMark: { x: number; y: number }; // 画面主体在镜框内的相对位置
}

export const shots: Shot[] = [
  {
    id: "shot-21",
    index: 21,
    timecode: { start: "3:00", end: "3:03", duration: 3 },
    title: "海面·漂浮物",
    subtitle: "OCEAN SURFACE / DRIFT",
    depth: 0,
    shotSize: "远景 → 中景",
    shotType: "WIDE → MEDIUM",
    movement: "无人机缓推 200m → 50m",
    focalNote: "焦点从海面收拢至漂浮物体 · 0.3s 失焦→合焦",
    visual: [
      "太平洋，正午，无风",
      "海面如深蓝色绸缎，波纹极细",
      "橙红色物体漂浮在浪间",
      "赤霄机甲左肩装甲残片，约 2 米长",
      "不规则撕裂状，边缘碳纤维层剥离",
      "内衬银灰色钛合金外露",
      "海面空无一物——无铁铮、无其他碎片、无油污",
    ],
    vfx: [
      "阳光在水面的焦散闪烁",
      "残片随波浪起伏，每次下沉边缘小气泡被挤出、上升破裂",
      "残片表面清晰爪痕：三道平行凹槽，深 3cm",
      "凹槽底部嵌有一块暗紫色怪兽角质碎片",
    ],
    audio: [
      "海浪轻柔“哗——唰——”循环",
      "每 3 秒一次涌浪，残片金属碰撞海水发出低沉“咚”声",
      "类似敲击半浸的金属桶",
      "无音乐 · 无对话",
    ],
    imax: [
      "残片材质细节占满视网膜：碳纤维布丝缕分明",
      "每根纤维在阳光下反光",
      "浪尖泡沫半透明，内部折射七彩光谱",
      "背景水平线绝对平直",
    ],
    motionBlur: "缓推时 0.3s 焦外旋转虚化",
    cameraNote: "机位从 200m 高度匀速下降至 50m",
    lighting: { from: "顶光", to: "顶侧光" },
    palette: { bg: "#0F2A3D", accent: "#E63946", text: "#E8E8E8" },
    motif: "▣",
    gpsMark: { x: 0.5, y: 0.5 },
  },
  {
    id: "shot-22",
    index: 22,
    timecode: { start: "3:03", end: "3:06", duration: 3 },
    title: "水下·下沉轨迹",
    subtitle: "UNDERWATER / DESCENT",
    depth: -8,
    shotSize: "水下中景·侧跟",
    shotType: "MEDIUM / TRACKING",
    movement: "垂直下潜 2m/s · 与下沉物保持固定水平距离",
    focalNote: "中景清晰 · 前景碎屑轻微失焦 · 背景海水虚化",
    visual: [
      "水下 8 米处，铁铮的身体正在下沉",
      "赤红色驾驶服严重破损",
      "右臂从肘部以下完全撕裂，露出碳纤维义肢银色骨架",
      "左大腿外侧 30cm 裂口，海水灌入鼓胀成不规则球囊",
      "面朝下，双臂自然垂落，头部歪向一侧",
      "眼睛紧闭，嘴唇发紫——无呼吸气泡，肺已进水",
      "机械左眼镜头盖自动关闭（保护机制）",
      "黑色短发在水中像海藻般缓慢飘动",
      "沉速 0.8m/s，角度 70°，头低脚高",
    ],
    vfx: [
      "丁达尔效应光柱从水面射入",
      "光柱中悬浮浮游生物和金属碎屑",
      "铁铮穿过光柱时破损处逸出细小气泡",
      "气泡上升时逐渐缩小、最后消失",
    ],
    audio: [
      "水下低频环境音：船舶引擎余韵般的低频嗡鸣（实为海水分子振动）",
      "气泡破裂有极弱“噼”声",
      "无心跳 · 无呼吸",
    ],
    imax: [
      "前景失焦碎屑 → 中景清晰身体 → 背景无限深邃蓝黑",
      "驾驶服布料水中褶皱的每一道纹理",
      "后颈旧伤疤：5cm 白色凸起瘢痕组织",
    ],
    motionBlur: "相对静止，身体无运动模糊；背景海水有垂直方向速度线",
    cameraNote: "机位始终与铁铮身体保持水平 0.5m",
    lighting: { from: "顶光光柱", to: "侧逆光" },
    palette: { bg: "#0A1620", accent: "#C9D4DA", text: "#D4D4D4" },
    motif: "↓",
    gpsMark: { x: 0.5, y: 0.55 },
  },
  {
    id: "shot-23",
    index: 23,
    timecode: { start: "3:06", end: "3:09", duration: 3 },
    title: "海底·着陆",
    subtitle: "SEAFLOOR / IMPACT",
    depth: -3800,
    shotSize: "广角·固定机位",
    shotType: "WIDE / STATIC",
    movement: "相机固定海床上方 0.3m，视角略仰",
    focalNote: "广角极度深焦 · 残骸与人体同为微小主体",
    visual: [
      "马里亚纳海沟，深度约 3800 米",
      "灰白色钙质软泥，表面覆盖深灰色沉积物",
      "（火山灰与怪兽组织降解物的混合）",
      "海床上散落赤霄残骸：",
      "  · 熔化的胸甲 3m×2m",
      "  · 半截左前臂，五指张开如斩断的手",
      "  · 几根弯曲的液压管",
      "铁铮双脚触底，软泥激起灰白烟尘",
      "侧倒，左肩先着地，半侧卧姿势面朝相机",
      "烟尘缓慢扩散，形成直径 4 米的浑圆区域",
    ],
    vfx: [
      "烟尘物理模拟：紧凑雾状 → 边缘卷曲漩涡 → 缓慢升腾稀释",
      "最后 20% 烟尘在半秒内突然加速扩散（海底微弱洋流）",
      "触底时破损处挤出最后几颗极小气泡，无声破裂",
    ],
    audio: [
      "身体触底：极沉重、通过骨骼传导的低频“咚”",
      "类似用拳头猛敲浸水厚木板",
      "烟尘扩散时无声",
      "然后 · 沉寂",
    ],
    imax: [
      "软泥质感如牙膏的粘稠膏体",
      "铁铮陷入其中约 10cm，形成完美人形凹陷",
      "胸甲熔化金属重新凝固成泪滴状，拳头大小",
      "微弱虚构补光在泪滴上反射",
    ],
    motionBlur: "触底瞬间一帧的垂直震动模糊（模拟冲击波）",
    cameraNote: "固定机位 · 0.3m 海床高度 · 略仰视角",
    lighting: { from: "微弱补光", to: "微弱补光" },
    palette: { bg: "#050810", accent: "#6B5B73", text: "#B0B0B0" },
    motif: "○",
    gpsMark: { x: 0.5, y: 0.6 },
  },
  {
    id: "shot-24",
    index: 24,
    timecode: { start: "3:09", end: "3:12", duration: 3 },
    title: "特写·静止的脸",
    subtitle: "EXTREME CLOSE-UP / STILL FACE",
    depth: -3800,
    shotSize: "大特写",
    shotType: "ECU",
    movement: "相机从头顶方向缓慢弧线移至正侧面，距离 30cm",
    focalNote: "面部极限浅景深 · 睫毛与机械盖磨损纹可辨",
    visual: [
      "铁铮已死亡。皮肤呈现灰紫色，嘴唇发绀",
      "鼻孔和嘴角有微量海水渗出",
      "右眼半睁，角膜浑浊，瞳孔散大固定",
      "左眼机械镜头盖彻底关闭，呈纯黑平面",
      "额头新伤口：归墟爆炸碎片划开，边缘皮肤外翻",
      "露出深红肌肉组织，几无出血（血压为零）",
      "表情松弛——无痛苦，无恐惧，肉体的中性静止",
      "一根 5mm 海螺恰好落在左眼机械盖上，暂歇",
    ],
    vfx: [
      "海水悬浮颗粒缓慢飘过脸庞",
      "颗粒触碰睫毛时睫毛不颤动（无肌肉张力）",
      "嘴角海水停留 2 秒后因表面张力失衡滑落",
      "沿下颌线滚下，滴入软泥形成极小凹坑",
      "相机弧线运动使顶光变为侧逆光",
    ],
    audio: [
      "完全静默",
      "仅海水分子运动白噪声（需高频扬声器还原）",
      "为强化寂静插入 -80dB 录音棚本底噪声",
    ],
    imax: [
      "右眼角膜表面细小划痕（潜水镜压痕）",
      "虹膜色素失去光泽呈死灰色",
      "机械镜头盖上有战斗中被碎石划过的磨损纹路",
      "面部汗毛在水中飘浮，每一根清晰可见",
    ],
    motionBlur: "弧线运动缓慢，无模糊",
    cameraNote: "30cm 距离 · 顶光 → 侧逆光",
    lighting: { from: "顶光", to: "侧逆光" },
    palette: { bg: "#030608", accent: "#1A1A1A", text: "#888888" },
    motif: "✕",
    gpsMark: { x: 0.5, y: 0.5 },
  },
  {
    id: "shot-25",
    index: 25,
    timecode: { start: "3:12", end: "3:15", duration: 3 },
    title: "拉远·黑暗",
    subtitle: "PULL-BACK / SUNSET",
    depth: 0,
    altitude: 100,
    shotSize: "极远景",
    shotType: "EXTREME WIDE / CRANE UP",
    movement: "每秒 5m 匀速向上拉升 · 海床 → 海面以上 100m",
    focalNote: "前景残骸迅速变小 · 深度巨大跨越感",
    visual: [
      "0.5s：铁铮全身侧卧软泥中",
      "1.0s：周围残骸——胸甲、左臂、液压管",
      "1.5s：整个残骸区直径 50m，钢铁坟场",
      "2.0s：海沟地形，残骸区只是其中小斑块",
      "2.5s：海沟悬崖壁 + 遥远海面光晕",
      "3.0s：冲出水面，看到太平洋广阔海面 + 水平线夕阳",
      "（时间从正午推进到傍晚）",
      "铁铮与所有残骸已完全消失在视野中",
      "画面只剩海、天、逐渐暗下的光",
    ],
    vfx: [
      "拉升时海水颜色从深黑→深蓝→灰蓝渐变",
      "冲出水面前阳光从头顶变为侧射",
      "水面焦散冲出瞬间短暂过曝",
      "云层是真实体积云渲染，缓慢移动",
    ],
    audio: [
      "低频环境音逐渐降低",
      "取而代之海面以上的风声和海浪声",
      "冲破水面时清晰“啵”声",
      "风浪充满声道",
      "最后海浪声逐渐降低",
      "最后一声拍打后——黑屏",
    ],
    imax: [
      "拉升过程中深度跨越的体感冲击",
      "海面冲出时视野突然开阔的“释放”感",
      "但内容上没有释放——铁铮留在海底，无人知晓",
    ],
    motionBlur: "海床与残骸明显垂直运动模糊；海面以上画面清晰",
    cameraNote: "5m/s 垂直拉升 · 3800m 跨越 · 时间跳跃 6+ 小时",
    lighting: { from: "正午顶光", to: "夕阳侧光" },
    palette: { bg: "#0A0F1A", accent: "#F4A261", text: "#F4A261" },
    motif: "↗",
    gpsMark: { x: 0.5, y: 0.4 },
  },
];

export const layers: { key: LayerKey; label: string; cn: string }[] = [
  { key: "narrative", label: "NARRATIVE", cn: "叙事" },
  { key: "camera", label: "CAMERA", cn: "镜头" },
  { key: "audio", label: "AUDIO", cn: "声音" },
  { key: "vfx", label: "VFX", cn: "特效" },
];

export const projectMeta = {
  title: "赤霄",
  titleEn: "CHIXIAO",
  sequence: "SEQ 21-25",
  timecode: "3:00 — 3:15",
  duration: 15,
  director: "（虚构）",
  dop: "（虚构）",
  vfxSupervisor: "（虚构）",
  format: "IMAX 3D · 65mm",
};
