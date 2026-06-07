// 分镜表 - 至少 18 个镜头，覆盖两场北伐 + 杨业殉国 + 澶渊之盟
// 每条镜头包含：镜号、景别、运镜、画面描述（中文）、AI Prompt（英文）、时长、配乐情绪

export type ShotType =
  | "大远景"
  | "远景"
  | "全景"
  | "中景"
  | "近景"
  | "特写"
  | "主观";

export type Shot = {
  id: string;
  actId: string;
  number: string; // 镜号 1-01
  shotType: ShotType;
  movement: string; // 运镜
  duration: number; // 秒
  summary: string; // 一句话摘要
  visualCn: string; // 画面描述（中文）
  promptEn: string; // AI 文生视频/图 Prompt
  music: string; // 配乐情绪
  castIds?: string[]; // 出场人物
  fxId?: string; // 关联特效
};

export const SHOTS: Shot[] = [
  // ===== 引子 =====
  {
    id: "s-0-1",
    actId: "act-0",
    number: "1-01",
    shotType: "大远景",
    movement: "航拍缓推",
    duration: 12,
    summary: "燕云十六州山河俯瞰",
    visualCn:
      "黄河以北、太行山以北的整片燕云大地，云层翻涌，长城如龙脊蜿蜒，远处烽燧冒烟。",
    promptEn:
      "Ultra-wide aerial shot of the Sixteen Prefectures of Yan-Yun in 936 AD, misty Taihang mountains, Great Wall snaking across ridges, smoldering beacon towers, golden hour backlight, ink-wash palette, cinematic 4K, slow dolly-in.",
    music: "低沉埙 + 鼓",
    castIds: [],
  },
  {
    id: "s-0-2",
    actId: "act-0",
    number: "1-02",
    shotType: "中景",
    movement: "缓推 + 烟雾遮挡",
    duration: 10,
    summary: "石敬瑭割让燕云",
    visualCn:
      "昏黄朝堂内，石敬瑭跪献燕云地图，烛光摇曳，契丹使者在侧冷笑。",
    promptEn:
      "Medium shot, dimly lit Tang-style throne room, 936 AD, Chinese warlord Shi Jingtang kneeling and offering a scroll map, Khitan envoy smirking in shadow, warm candlelight, smoke wafting, painted scroll aesthetic.",
    music: "低弦",
  },
  {
    id: "s-0-3",
    actId: "act-0",
    number: "1-03",
    shotType: "特写",
    movement: "硬切",
    duration: 6,
    summary: "赵光义握剑立誓",
    visualCn:
      "赵光义侧脸特写，目光如炬，手中长剑映出烽火，刀鞘上刻「光义」二字。",
    promptEn:
      "Close-up of Emperor Zhao Guangyi, 976 AD, side profile, fierce gaze, hand gripping a long jian sword, firelight reflected on the blade, name 'Guangyi' carved on the scabbard, ink-painting rim light.",
    music: "鼓点 + 剑鸣",
    castIds: ["c-zhaoguangi"],
  },

  // ===== 第一幕 高粱河之败 =====
  {
    id: "s-1-1",
    actId: "act-1",
    number: "2-01",
    shotType: "远景",
    movement: "横移",
    duration: 10,
    summary: "太平兴国四年正月北伐",
    visualCn:
      "宋军铁骑自镇州出发，旌旗蔽日，马蹄扬尘，漫天朱旗横越太行山口。",
    promptEn:
      "Wide tracking shot, Song dynasty imperial army marching out of Zhenzhou, 979 AD, masses of red banners, cavalry dust clouds, sun glare on helmets, epic cinematic scale, anamorphic lens.",
    music: "行军鼓 + 唢呐",
    castIds: ["c-panmei", "c-zhaoguangi"],
  },
  {
    id: "s-1-2",
    actId: "act-1",
    number: "2-02",
    shotType: "中景",
    movement: "环绕",
    duration: 8,
    summary: "北汉末帝出降",
    visualCn:
      "北汉皇帝刘继元素衣出城，双手奉上降表，身后是残破的太原城。",
    promptEn:
      "Medium 360-degree shot, Last Northern Han emperor Liu Jiyuan in white surrender robes, 979 AD, offering a wooden surrender tablet, crumbling Taiyuan walls behind, overcast light.",
    music: "哀笛",
  },
  {
    id: "s-1-3",
    actId: "act-1",
    number: "2-03",
    shotType: "全景",
    movement: "俯拍",
    duration: 12,
    summary: "宋军仓促东进",
    visualCn:
      "镇州校场，赵光义高踞将台，下令即刻东进，下方宋军神色疲惫、铠甲蒙尘。",
    promptEn:
      "Top-down cinematic shot, Song army encampment at Zhenzhou, 979 AD, Emperor Zhao Guangyi on a command platform, exhausted soldiers in dust-covered armor, dusk light, painted scroll palette.",
    music: "低鼓",
    castIds: ["c-zhaoguangi"],
  },
  {
    id: "s-1-4",
    actId: "act-1",
    number: "2-04",
    shotType: "远景",
    movement: "缓推",
    duration: 9,
    summary: "宋军围困幽州",
    visualCn:
      "幽州城墙高耸，宋军四面围合如铁桶，城头旌旗猎猎，远处太行山余脉苍茫。",
    promptEn:
      "Wide shot, Song army surrounding the Liao Southern Capital Youzhou on all four sides, 979 AD, layered siege camps, towering city walls, distant misty mountains, smoke from many cookfires.",
    music: "战鼓隆隆",
  },
  {
    id: "s-1-5",
    actId: "act-1",
    number: "2-05",
    shotType: "中景",
    movement: "跟拍",
    duration: 7,
    summary: "韩德让巡视城头",
    visualCn:
      "韩德让披甲持剑，在幽州城头夜巡，火把映照下他目光冷峻。",
    promptEn:
      "Handheld follow shot, Han Derang in armor patrolling Youzhou city walls at night, 979 AD, torchlight flickering on his face, grim determination, ink-wash shadows.",
    music: "低沉弦乐",
    castIds: ["c-handera"],
  },
  {
    id: "s-1-6",
    actId: "act-1",
    number: "2-06",
    shotType: "全景",
    movement: "横摇",
    duration: 8,
    summary: "辽国铁骑驰援",
    visualCn:
      "北方草原上，耶律休哥率五院军铁骑昼夜狂奔，马蹄踏起烟尘如云。",
    promptEn:
      "Panoramic tracking shot, Khitan general Yelu Xiuge leading the Wuyuan cavalry charging across the Mongolian steppe at full gallop, 979 AD, dust clouds, banners snapping, dynamic motion blur.",
    music: "马蹄鼓 + 笛",
    castIds: ["c-yeluxiu"],
  },
  {
    id: "s-1-7",
    actId: "act-1",
    number: "2-07",
    shotType: "特写",
    movement: "快切 + 慢动作",
    duration: 6,
    summary: "高粱河中箭",
    visualCn:
      "赵光义大腿中箭，慢镜头下血雾飞溅，他跌落马背，铠甲撞击地面。",
    promptEn:
      "Slow-motion close-up, arrow piercing Emperor Zhao Guangyi's thigh, 979 AD Battle of Gaoliang River, blood spray in golden backlight, falling armor clanging, dramatic shallow depth of field.",
    music: "瞬间静默 + 鼓击",
    castIds: ["c-zhaoguangi"],
    fxId: "fx-donkey",
  },
  {
    id: "s-1-8",
    actId: "act-1",
    number: "2-08",
    shotType: "全景",
    movement: "跟拍 + 甩镜",
    duration: 9,
    summary: "驴车漂移",
    visualCn:
      "赵光义驾驴车在乱军中疾驰，辽骑在身后追杀，尘土飞扬，驴车几次急转险些翻覆。",
    promptEn:
      "Dynamic tracking shot, Emperor Zhao Guangyi fleeing on a donkey cart, Khitan cavalry in pursuit, 979 AD Gaoliang River, dust and arrows, dramatic whip-pan, cinematic 4K.",
    music: "急促鼓点",
    castIds: ["c-zhaoguangi"],
    fxId: "fx-donkey",
  },

  // ===== 第二幕 七年酝酿 =====
  {
    id: "s-2-1",
    actId: "act-2",
    number: "3-01",
    shotType: "中景",
    movement: "缓推",
    duration: 8,
    summary: "赵光义卧薪尝胆",
    visualCn:
      "开封宫中夜半，赵光义独坐烛前，面前是阵图卷轴和北方舆图，墙上挂着高粱河战图。",
    promptEn:
      "Medium slow push-in, Emperor Zhao Guangyi alone in candlelit palace study, 985 AD, battle maps of Gaoliang River on the wall, scroll of formations on the desk, late-night atmosphere.",
    music: "独奏古琴",
    castIds: ["c-zhaoguangi"],
  },
  {
    id: "s-2-2",
    actId: "act-2",
    number: "3-02",
    shotType: "全景",
    movement: "航拍",
    duration: 9,
    summary: "辽朝太后临朝",
    visualCn:
      "辽上京朝堂，萧燕燕抱幼帝耶律隆绪端坐龙椅，韩德让立于侧，群臣肃立。",
    promptEn:
      "Wide aerial shot, Liao dynasty court in Shangjing, 982 AD, Empress Dowager Xiao Yanyan holding young Emperor Yelü Longxu on the throne, Han Derang standing by, ministers in silence.",
    music: "庄严鼓 + 箫",
    castIds: ["c-xiaoyanyan", "c-handera"],
  },
  {
    id: "s-2-3",
    actId: "act-2",
    number: "3-03",
    shotType: "特写",
    movement: "硬切",
    duration: 5,
    summary: "赵光义决意北伐",
    visualCn:
      "赵光义目光中闪过杀意，手掌重重按在北方舆图上，红朱砂墨溅开。",
    promptEn:
      "Hard-cut close-up, Emperor Zhao Guangyi's eyes flashing with ambition, palm slamming the northern map, cinnabar ink splashing, 985 AD, dramatic rim light.",
    music: "鼓击 + 弦断",
    castIds: ["c-zhaoguangi"],
  },

  // ===== 第三幕 雍熙北伐 =====
  {
    id: "s-3-1",
    actId: "act-3",
    number: "4-01",
    shotType: "全景",
    movement: "分屏",
    duration: 10,
    summary: "三路大军分进",
    visualCn:
      "分屏三路：东路曹彬出雄州，中路田重进出飞狐，西路潘美杨业出雁门。",
    promptEn:
      "Triple split-screen composition, three Song armies advancing simultaneously in 986 AD: Cao Bin's Eastern Route leaving Xiongzhou, Tian Zhongjin's Central Route crossing Feihu, Pan Mei & Yang Ye's Western Route through Yanmen Pass, each panel with distinct color grading.",
    music: "三声鼓递进",
    castIds: ["c-caobin", "c-panmei", "c-yangye"],
  },
  {
    id: "s-3-2",
    actId: "act-3",
    number: "4-02",
    shotType: "远景",
    movement: "推进",
    duration: 9,
    summary: "中西北两路连捷",
    visualCn:
      "飞狐、蔚州、寰州、朔州、应州、云州六城城头接连换上宋旗，潘美杨业策马入城。",
    promptEn:
      "Sweeping push-in, Song banners rising over six cities in succession, 986 AD Yongxi Northern Campaign, Pan Mei and Yang Ye riding into a captured prefecture, cheering civilians, painted scroll panoramic.",
    music: "凯旋鼓",
    castIds: ["c-panmei", "c-yangye"],
  },
  {
    id: "s-3-3",
    actId: "act-3",
    number: "4-03",
    shotType: "中景",
    movement: "缓推",
    duration: 8,
    summary: "曹彬涿州逗留",
    visualCn:
      "曹彬在涿州城头踱步，眉头紧锁，远方粮道空空如也，士兵倦怠倚墙。",
    promptEn:
      "Medium shot, General Cao Bin pacing atop Zhuozhou city wall, 986 AD, furrowed brow, empty supply road in the distance, exhausted Song soldiers leaning against battlements, golden late afternoon.",
    music: "低弦",
    castIds: ["c-caobin"],
  },
  {
    id: "s-3-4",
    actId: "act-3",
    number: "4-04",
    shotType: "远景",
    movement: "航拍俯冲",
    duration: 10,
    summary: "萧燕燕亲率援军",
    visualCn:
      "辽国大军南下的铁流，萧燕燕白马银甲，与耶律休哥并辔而行，旌旗遮天。",
    promptEn:
      "Drone-style dive shot, Liao reinforcements pouring south, 986 AD, Empress Dowager Xiao Yanyan in silver armor on white horse, riding shoulder to shoulder with Yelu Xiuge, banners filling the sky.",
    music: "战鼓 + 唢呐",
    castIds: ["c-xiaoyanyan", "c-yeluxiu"],
  },
  {
    id: "s-3-5",
    actId: "act-3",
    number: "4-05",
    shotType: "全景",
    movement: "快摇",
    duration: 7,
    summary: "曹彬下令南撤",
    visualCn:
      "曹彬拔出令旗向南一挥，宋军开始溃退，阵型大乱，旗帜东倒西歪。",
    promptEn:
      "Fast pan, General Cao Bin waving the southward retreat flag, 986 AD, Song army formations collapsing, banners tumbling, dust rising, panic spreading.",
    music: "鼓点骤紧",
    castIds: ["c-caobin"],
  },
  {
    id: "s-3-6",
    actId: "act-3",
    number: "4-06",
    shotType: "全景",
    movement: "甩镜",
    duration: 8,
    summary: "岐沟关总攻",
    visualCn:
      "耶律休哥率铁骑在岐沟关追上宋军，排山倒海冲阵，宋军被踩入沙河。",
    promptEn:
      "Whip-pan wide shot, Yelu Xiuge leading the decisive cavalry charge at Qigou Pass, 986 AD, Song soldiers trampled into the Sha River, blood staining the water red, cinematic 4K slow motion finale.",
    music: "满弓弦乐",
    castIds: ["c-yeluxiu"],
    fxId: "fx-qigou",
  },
  {
    id: "s-3-7",
    actId: "act-3",
    number: "4-07",
    shotType: "中景",
    movement: "缓推",
    duration: 9,
    summary: "杨业含泪请战",
    visualCn:
      "杨业含泪向潘美抱拳，身后是其子杨延玉与数十老兵，营帐内烛影昏黄。",
    promptEn:
      "Medium slow push-in, General Yang Ye tearfully clasping fists with Pan Mei, 986 AD, his son Yang Yanyu and veteran soldiers behind, dim candlelit tent, painted scroll composition.",
    music: "胡笳",
    castIds: ["c-yangye", "c-panmei", "c-wangshen"],
  },
  {
    id: "s-3-8",
    actId: "act-3",
    number: "4-08",
    shotType: "全景",
    movement: "升格慢镜",
    duration: 10,
    summary: "陈家谷口空无一人",
    visualCn:
      "杨业浑身浴血冲入陈家谷口，发现伏兵全撤，谷中空寂，唯余冷月与长风。",
    promptEn:
      "Slow-motion wide shot, blood-soaked Yang Ye riding into empty Chenjia Valley, 986 AD, no ambush troops, only cold moon and wind, painted scroll atmosphere, melancholic.",
    music: "埙独奏 + 鼓点渐隐",
    castIds: ["c-yangye"],
    fxId: "fx-chenjia",
  },

  // ===== 史诗落幕 =====
  {
    id: "s-4-1",
    actId: "act-4",
    number: "5-01",
    shotType: "远景",
    movement: "航拍",
    duration: 9,
    summary: "守内虚外",
    visualCn:
      "北宋汴梁全景，宫城巍峨，但北方边关只剩零星烽燧，象征性防御。",
    promptEn:
      "Wide aerial shot, Northern Song capital Bianliang, 988 AD, grand palace city in center, but northern frontier reduced to a few lonely beacon towers, defensive posture, painted scroll.",
    music: "低沉宫乐",
  },
  {
    id: "s-4-2",
    actId: "act-4",
    number: "5-02",
    shotType: "全景",
    movement: "横移",
    duration: 9,
    summary: "澶渊之盟",
    visualCn:
      "澶州城外，宋辽使臣对坐于黄河岸边签约，宋真宗与萧燕燕隔河相望。",
    promptEn:
      "Wide lateral shot, Chanyuan Treaty signing 1004 AD, Song and Liao envoys seated across the Yellow River, Song Emperor Zhenzong and Empress Dowager Xiao Yanyan visible on opposite banks, painted scroll composition.",
    music: "礼乐 + 鼓",
    castIds: ["c-xiaoyanyan"],
    fxId: "fx-chanyuan",
  },
  {
    id: "s-4-3",
    actId: "act-4",
    number: "5-03",
    shotType: "大远景",
    movement: "拉远",
    duration: 8,
    summary: "燕云四百年后归汉",
    visualCn:
      "镜头由北宋边关拉至明朝洪武年间，朱元璋大军收复燕云，镜头叠化宣纸水墨。",
    promptEn:
      "Extreme wide shot pulling back through 400 years of history, ending on Ming dynasty Hongwu era 1368 AD, Zhu Yuanzhang's army retaking Yan-Yun, painted scroll dissolves into ink wash.",
    music: "编钟 + 鼓",
  },
];
