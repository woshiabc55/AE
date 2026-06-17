import { textToImageUrl } from "@/lib/utils";

/**
 * 设定图集合：每条都对应一张 text_to_image 可生成的图。
 * 用于"图库"页面、首页"设定图墙"等。
 */
export interface ConceptImage {
  id: string;
  prompt: string;
  title: string;
  subtitle: string;
  category: "skin" | "scene" | "weapon" | "wallpaper" | "keyart";
  paletteFrom: string;
  paletteTo: string;
  game: string;
  hero?: string;
}

export const CONCEPT_IMAGES: ConceptImage[] = [
  // 王者荣耀皮肤 / 关键艺术
  {
    id: "kog-li-bai-fengqiuhuang",
    prompt:
      "Li Bai Feng Qiu Huang skin, phoenix and immortal swordsman, golden red, fireworks, romance, ultra detailed, 4k, masterpiece",
    title: "凤求凰",
    subtitle: "李白 · 限定",
    category: "skin",
    paletteFrom: "#fbbf24",
    paletteTo: "#dc2626",
    game: "王者荣耀",
    hero: "李白",
  },
  {
    id: "kog-li-bai-qiannianzhihu",
    prompt:
      "Li Bai Thousand Years Fox, nine tailed fox spirit swordsman, purple fire, jade moonlight, masterpiece",
    title: "千年之狐",
    subtitle: "李白 · 传说",
    category: "skin",
    paletteFrom: "#a855f7",
    paletteTo: "#1e1b4b",
    game: "王者荣耀",
    hero: "李白",
  },
  {
    id: "kog-diaochan-yujian-shenlu",
    prompt:
      "Diao Chan Encounter Divine Deer, mystical deer antler maiden, sakura, soft pastel, fantasy, ultra detailed",
    title: "遇见神鹿",
    subtitle: "貂蝉 · 限定",
    category: "skin",
    paletteFrom: "#fda4af",
    paletteTo: "#fbcfe8",
    game: "王者荣耀",
    hero: "貂蝉",
  },
  {
    id: "kog-diaochan-maoying",
    prompt:
      "Diao Chan Phantom Cat Dance, black cat magic, dark neon, witch aesthetic, masterpiece",
    title: "猫影幻舞",
    subtitle: "貂蝉 · 传说",
    category: "skin",
    paletteFrom: "#0f172a",
    paletteTo: "#a855f7",
    game: "王者荣耀",
    hero: "貂蝉",
  },
  {
    id: "kog-lu-bu-tianmo",
    prompt:
      "Lu Bu Heaven Demon Chaos, dark demon general with crimson halberd, hell fire, dark fantasy, masterpiece",
    title: "天魔缭乱",
    subtitle: "吕布 · 限定",
    category: "skin",
    paletteFrom: "#dc2626",
    paletteTo: "#0f172a",
    game: "王者荣耀",
    hero: "吕布",
  },
  {
    id: "kog-lu-bu-morijinjia",
    prompt:
      "Lu Bu Apocalypse Mecha, cyber mecha warlord, neon red, mechanical, ultra detailed",
    title: "末日机甲",
    subtitle: "吕布 · 传说",
    category: "skin",
    paletteFrom: "#f97316",
    paletteTo: "#7c2d12",
    game: "王者荣耀",
    hero: "吕布",
  },
  {
    id: "kog-wuzetian-nikesi",
    prompt:
      "Wu Zetian Nyx Oracle, cosmic goddess, starry night sky, purple gold, divine, masterpiece",
    title: "倪克斯神谕",
    subtitle: "武则天 · 限定",
    category: "skin",
    paletteFrom: "#a855f7",
    paletteTo: "#fbbf24",
    game: "王者荣耀",
    hero: "武则天",
  },
  {
    id: "kog-yao-yujian-shenlu",
    prompt:
      "Yao Encounter Divine Deer, deer spirit, moonlit forest, soft glow, fantasy maiden, masterpiece",
    title: "遇见神鹿",
    subtitle: "瑶 · 限定",
    category: "skin",
    paletteFrom: "#fde68a",
    paletteTo: "#a5f3fc",
    game: "王者荣耀",
    hero: "瑶",
  },
  {
    id: "kog-huatam-jiuwu",
    prompt:
      "Hua Mulan Nine Five Supreme, empress with golden dragon robe, royal purple gold, masterpiece",
    title: "九五至尊",
    subtitle: "花木兰 · 限定",
    category: "skin",
    paletteFrom: "#fbbf24",
    paletteTo: "#7c3aed",
    game: "王者荣耀",
    hero: "花木兰",
  },
  {
    id: "kog-gongsunli-wuxianxing",
    prompt:
      "Gongsun Li Infinite Star Officer, holographic idol, cyber pop, kawaii, neon, masterpiece",
    title: "无限星赏官",
    subtitle: "公孙离 · 限定",
    category: "skin",
    paletteFrom: "#22d3ee",
    paletteTo: "#f472b6",
    game: "王者荣耀",
    hero: "公孙离",
  },
  {
    id: "kog-zhaoyun-yinqing",
    prompt:
      "Zhao Yun Engine Heart, cyber mecha warrior, blue neon, futuristic armor, masterpiece",
    title: "引擎之心",
    subtitle: "赵云 · 传说",
    category: "skin",
    paletteFrom: "#3b82f6",
    paletteTo: "#0f172a",
    game: "王者荣耀",
    hero: "赵云",
  },
  {
    id: "kog-hanxin-bailongyin",
    prompt:
      "Han Xin White Dragon Chant, white dragon general, jade armor, ink painting style, masterpiece",
    title: "白龙吟",
    subtitle: "韩信 · 传说",
    category: "skin",
    paletteFrom: "#a5f3fc",
    paletteTo: "#0ea5e9",
    game: "王者荣耀",
    hero: "韩信",
  },
  {
    id: "kog-miyamoto-fantian",
    prompt:
      "Miyamoto Musashi Hell Eye, oni samurai, red demon, dark moon, ultra detailed",
    title: "地狱之眼",
    subtitle: "宫本武藏 · 传说",
    category: "skin",
    paletteFrom: "#dc2626",
    paletteTo: "#7c2d12",
    game: "王者荣耀",
    hero: "宫本武藏",
  },
  {
    id: "kog-daji-rewen",
    prompt:
      "Daji Passionate Samba, samba dancer, tropical carnival, feathers, vibrant color, masterpiece",
    title: "热情桑巴",
    subtitle: "妲己 · 传说",
    category: "skin",
    paletteFrom: "#facc15",
    paletteTo: "#dc2626",
    game: "王者荣耀",
    hero: "妲己",
  },
  {
    id: "kog-arthur-siwang",
    prompt:
      "Arthur Death Knight, dark gothic knight, crimson cape, demon sword, masterpiece",
    title: "死亡骑士",
    subtitle: "亚瑟 · 传说",
    category: "skin",
    paletteFrom: "#0f172a",
    paletteTo: "#dc2626",
    game: "王者荣耀",
    hero: "亚瑟",
  },
  {
    id: "kog-houyi-huangjin",
    prompt:
      "Hou Yi Golden Sagittarius, golden constellation archer, zodiac armor, divine bow, masterpiece",
    title: "黄金射手座",
    subtitle: "后羿 · 限定",
    category: "skin",
    paletteFrom: "#fbbf24",
    paletteTo: "#92400e",
    game: "王者荣耀",
    hero: "后羿",
  },
  {
    id: "kog-lianpo-yinhu",
    prompt:
      "Lian Po Tiger Rui Yan, traditional Chinese tiger general, fire festival, masterpiece",
    title: "寅虎·瑞焰",
    subtitle: "廉颇 · 限定",
    category: "skin",
    paletteFrom: "#f97316",
    paletteTo: "#dc2626",
    game: "王者荣耀",
    hero: "廉颇",
  },
  {
    id: "kog-chengyaojin-aiyu",
    prompt:
      "Cheng Yaojin Love and Justice, super hero police captain, comic style, bright color, masterpiece",
    title: "爱与正义",
    subtitle: "程咬金 · 勇者",
    category: "skin",
    paletteFrom: "#0ea5e9",
    paletteTo: "#fbbf24",
    game: "王者荣耀",
    hero: "程咬金",
  },

  // 原神 关键艺术
  {
    id: "gs-raiden-keyart",
    prompt:
      "Raiden Shogun key visual, electro archon, sakura petals, purple lightning, Inazuma, masterpiece",
    title: "一心净土",
    subtitle: "雷电将军 · 角色立绘",
    category: "keyart",
    paletteFrom: "#a855f7",
    paletteTo: "#7c3aed",
    game: "原神",
    hero: "雷电将军",
  },
  {
    id: "gs-nahida-keyart",
    prompt:
      "Nahida key visual, dendro archon, lotus throne, dreamlike forest, green fairy, masterpiece",
    title: "翠翎之鸾",
    subtitle: "纳西妲 · 角色立绘",
    category: "keyart",
    paletteFrom: "#34d399",
    paletteTo: "#a3e635",
    game: "原神",
    hero: "纳西妲",
  },
  {
    id: "gs-hutao-keyart",
    prompt:
      "Hu Tao key visual, ghost girl with butterfly, plum blossom fire, Liyue harbor, masterpiece",
    title: "雪隐梅香",
    subtitle: "胡桃 · 角色立绘",
    category: "keyart",
    paletteFrom: "#f87171",
    paletteTo: "#7c2d12",
    game: "原神",
    hero: "胡桃",
  },
  {
    id: "gs-furina-keyart",
    prompt:
      "Furina key visual, hydro archon, opera stage, blue top hat, fountain, masterpiece",
    title: "司颂之星",
    subtitle: "芙宁娜 · 角色立绘",
    category: "keyart",
    paletteFrom: "#60a5fa",
    paletteTo: "#06b6d4",
    game: "原神",
    hero: "芙宁娜",
  },
  {
    id: "gs-ayaka-keyart",
    prompt:
      "Kamisato Ayaka key visual, cryo princess, snow, sakura, miko shrine maiden, masterpiece",
    title: "白鹭之华",
    subtitle: "神里绫华 · 角色立绘",
    category: "keyart",
    paletteFrom: "#a5f3fc",
    paletteTo: "#7dd3fc",
    game: "原神",
    hero: "神里绫华",
  },
  {
    id: "gs-zhongli-keyart",
    prompt:
      "Zhongli key visual, geo archon, golden spear, pillars of stone, Liyue, masterpiece",
    title: "岩王帝君",
    subtitle: "钟离 · 角色立绘",
    category: "keyart",
    paletteFrom: "#fbbf24",
    paletteTo: "#92400e",
    game: "原神",
    hero: "钟离",
  },
  {
    id: "gs-scene-inazuma",
    prompt:
      "Inazuma City scenery, electro region, sakura, japanese architecture, lightning storm, fantasy, masterpiece",
    title: "稻妻城",
    subtitle: "原神 · 场景",
    category: "scene",
    paletteFrom: "#a855f7",
    paletteTo: "#7c3aed",
    game: "原神",
  },
  {
    id: "gs-scene-liyue",
    prompt:
      "Liyue Harbor scenery, geo region, chinese architecture, lanterns, golden sunset, masterpiece",
    title: "璃月港",
    subtitle: "原神 · 场景",
    category: "scene",
    paletteFrom: "#fbbf24",
    paletteTo: "#7c2d12",
    game: "原神",
  },
  {
    id: "gs-scene-sumeru",
    prompt:
      "Sumeru rainforest, dendro region, ancient ruins, lush jungle, god rays, masterpiece",
    title: "须弥雨林",
    subtitle: "原神 · 场景",
    category: "scene",
    paletteFrom: "#34d399",
    paletteTo: "#065f46",
    game: "原神",
  },
  {
    id: "gs-scene-fontaine",
    prompt:
      "Fontaine underwater city, hydro region, art nouveau architecture, magical fountains, masterpiece",
    title: "枫丹廷",
    subtitle: "原神 · 场景",
    category: "scene",
    paletteFrom: "#60a5fa",
    paletteTo: "#06b6d4",
    game: "原神",
  },

  // 英雄联盟
  {
    id: "lol-ahri-kda",
    prompt:
      "K/DA Ahri stage performance, neon lights, pop idol, holographic stage, masterpiece",
    title: "K/DA 阿狸",
    subtitle: "英雄联盟 · 传说",
    category: "skin",
    paletteFrom: "#f472b6",
    paletteTo: "#a855f7",
    game: "英雄联盟",
    hero: "阿狸",
  },
  {
    id: "lol-ahri-sgs",
    prompt:
      "Star Guardian Ahri, magical girl anime, cosmic background, twin tails, masterpiece",
    title: "星之守护者",
    subtitle: "英雄联盟 · 限定",
    category: "skin",
    paletteFrom: "#a5f3fc",
    paletteTo: "#f472b6",
    game: "英雄联盟",
    hero: "阿狸",
  },
  {
    id: "lol-jinx-sgs",
    prompt:
      "Star Guardian Jinx, magical girl anime, blue pink hair, cosmic weapon, masterpiece",
    title: "星之守护者",
    subtitle: "英雄联盟 · 限定",
    category: "skin",
    paletteFrom: "#22d3ee",
    paletteTo: "#f472b6",
    game: "英雄联盟",
    hero: "金克丝",
  },
  {
    id: "lol-yasuo-hys",
    prompt:
      "Nightbringer Yasuo, dark samurai with shadow, lightning, monochrome, masterpiece",
    title: "黑夜使者",
    subtitle: "英雄联盟 · 限定",
    category: "skin",
    paletteFrom: "#0f172a",
    paletteTo: "#a5f3fc",
    game: "英雄联盟",
    hero: "亚索",
  },
  {
    id: "lol-thresh-dyxz",
    prompt:
      "Hellscape Thresh, demon chain warden, hellfire, red, dark fantasy, masterpiece",
    title: "地狱行者",
    subtitle: "英雄联盟 · 限定",
    category: "skin",
    paletteFrom: "#dc2626",
    paletteTo: "#0f172a",
    game: "英雄联盟",
    hero: "锤石",
  },
  {
    id: "lol-lux-sgs",
    prompt:
      "Star Guardian Lux, magical girl anime, cosmic goddess, light, masterpiece",
    title: "星之守护者",
    subtitle: "英雄联盟 · 限定",
    category: "skin",
    paletteFrom: "#fde68a",
    paletteTo: "#a5f3fc",
    game: "英雄联盟",
    hero: "拉克丝",
  },

  // CS2 武器皮肤
  {
    id: "cs-awp-julong",
    prompt:
      "AWP Dragon Lore, ancient dragon engraved on sniper rifle, gold red, fantasy, masterpiece",
    title: "巨龙传说",
    subtitle: "AWP · 限定",
    category: "weapon",
    paletteFrom: "#fbbf24",
    paletteTo: "#dc2626",
    game: "CS2",
  },
  {
    id: "cs-ak47-huoshe",
    prompt:
      "AK-47 Fire Serpent, fire snake engraving on rifle, orange black, masterpiece",
    title: "火蛇",
    subtitle: "AK-47 · 限定",
    category: "weapon",
    paletteFrom: "#f97316",
    paletteTo: "#0f172a",
    game: "CS2",
  },
  {
    id: "cs-ak47-hongxian",
    prompt:
      "AK-47 Redline, red futuristic tech, crimson, carbon fiber, masterpiece",
    title: "红线",
    subtitle: "AK-47 · 传说",
    category: "weapon",
    paletteFrom: "#dc2626",
    paletteTo: "#1f2937",
    game: "CS2",
  },
  {
    id: "cs-awp-yehuo",
    prompt:
      "AWP Wildfire, graffiti fire flames on sniper rifle, masterpiece",
    title: "野火",
    subtitle: "AWP · 传说",
    category: "weapon",
    paletteFrom: "#f97316",
    paletteTo: "#fbbf24",
    game: "CS2",
  },

  // 我的世界
  {
    id: "mc-creeper",
    prompt:
      "Minecraft Creeper close up, pixel green explosion, minecraft style 3d render, masterpiece",
    title: "苦力怕",
    subtitle: "我的世界 · 经典生物",
    category: "keyart",
    paletteFrom: "#22c55e",
    paletteTo: "#15803d",
    game: "我的世界",
  },
  {
    id: "mc-enderdragon",
    prompt:
      "Minecraft Ender Dragon, end dimension, purple void, dragon wings, minecraft style 3d render, masterpiece",
    title: "末影龙",
    subtitle: "我的世界 · 终极 Boss",
    category: "keyart",
    paletteFrom: "#7c3aed",
    paletteTo: "#1e1b4b",
    game: "我的世界",
  },
  {
    id: "mc-steve",
    prompt:
      "Minecraft Steve, voxel hero, blocky character, 3d render, masterpiece",
    title: "Steve",
    subtitle: "我的世界 · 主角",
    category: "keyart",
    paletteFrom: "#a16207",
    paletteTo: "#1d4ed8",
    game: "我的世界",
  },
  {
    id: "mc-overworld",
    prompt:
      "Minecraft Overworld, voxel landscape, sunset, mountains, 3d render, masterpiece",
    title: "主世界",
    subtitle: "我的世界 · 场景",
    category: "scene",
    paletteFrom: "#84cc16",
    paletteTo: "#fbbf24",
    game: "我的世界",
  },

  // 永劫无间
  {
    id: "nk-matari",
    prompt:
      "Matari Naraka, ninja shadow with twin daggers, purple fog, fantasy, masterpiece",
    title: "玛塔",
    subtitle: "永劫无间 · 角色",
    category: "keyart",
    paletteFrom: "#a855f7",
    paletteTo: "#1e3a8a",
    game: "永劫无间",
    hero: "玛塔",
  },
  {
    id: "nk-kurumi",
    prompt:
      "Kurumi Naraka, japanese katana maiden, cherry blossom, kimono, dark fantasy, masterpiece",
    title: "胡桃",
    subtitle: "永劫无间 · 角色",
    category: "keyart",
    paletteFrom: "#f43f5e",
    paletteTo: "#7c2d12",
    game: "永劫无间",
    hero: "胡桃",
  },
  {
    id: "nk-scene",
    prompt:
      "Naraka Bladepoint map, ancient chinese battlefield, sword marks, sunset, masterpiece",
    title: "聚窟洲",
    subtitle: "永劫无间 · 场景",
    category: "scene",
    paletteFrom: "#ea580c",
    paletteTo: "#1c1917",
    game: "永劫无间",
  },

  // 绝区零
  {
    id: "zzz-ellen",
    prompt:
      "Ellen Joe Zenless Zone Zero, ice sword maid, blue white, snowy, modern anime, masterpiece",
    title: "艾莲·乔",
    subtitle: "绝区零 · 限定",
    category: "skin",
    paletteFrom: "#60a5fa",
    paletteTo: "#a5f3fc",
    game: "绝区零",
    hero: "艾莲",
  },
  {
    id: "zzz-miyabi",
    prompt:
      "Miyabi Zenless Zone Zero, japanese katana, sakura, pink purple, modern anime, masterpiece",
    title: "雅",
    subtitle: "绝区零 · 限定",
    category: "skin",
    paletteFrom: "#c084fc",
    paletteTo: "#fb7185",
    game: "绝区零",
    hero: "雅",
  },

  // 绝地求生
  {
    id: "pubg-erangel",
    prompt:
      "PUBG Erangel map, abandoned military base, war, sunset, photorealistic, masterpiece",
    title: "艾伦格",
    subtitle: "绝地求生 · 场景",
    category: "scene",
    paletteFrom: "#a3a3a3",
    paletteTo: "#365314",
    game: "绝地求生",
  },

  // 通用 wallpaper
  {
    id: "wp-cyberpunk-1",
    prompt:
      "Cyberpunk neon city, flying cars, magenta and cyan, futuristic, ultra detailed, 4k wallpaper",
    title: "霓虹都市",
    subtitle: "Wallpaper · 16:9",
    category: "wallpaper",
    paletteFrom: "#a855f7",
    paletteTo: "#06b6d4",
    game: "综合",
  },
  {
    id: "wp-fantasy-1",
    prompt:
      "Floating magical islands, waterfalls, fantasy castle, golden hour, ultra detailed wallpaper",
    title: "浮空之境",
    subtitle: "Wallpaper · 16:9",
    category: "wallpaper",
    paletteFrom: "#facc15",
    paletteTo: "#22d3ee",
    game: "综合",
  },
  {
    id: "wp-samurai",
    prompt:
      "Lone samurai on cliff, red moon, dark mountains, ukiyo-e meets cyber, masterpiece wallpaper",
    title: "孤月武士",
    subtitle: "Wallpaper · 16:9",
    category: "wallpaper",
    paletteFrom: "#dc2626",
    paletteTo: "#0f172a",
    game: "综合",
  },
  {
    id: "wp-galaxy",
    prompt:
      "Spiral galaxy, purple blue, distant stars, ultra detailed space wallpaper",
    title: "星海漫游",
    subtitle: "Wallpaper · 16:9",
    category: "wallpaper",
    paletteFrom: "#a855f7",
    paletteTo: "#1e1b4b",
    game: "综合",
  },
];

/** 计算所有 concept image 的 URL 列表，用于批量预热 */
export function allConceptImageUrls(): string[] {
  return CONCEPT_IMAGES.map((c) => textToImageUrl(c.prompt, "portrait_4_3"));
}
