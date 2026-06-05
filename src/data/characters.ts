import type { Character, Relation } from "./types";

export const characters: Character[] = [
  {
    id: "chenqianyu",
    name: "陈千语",
    role: "陈家后人 / 真龙后裔 / 源石干员",
    description:
      "陈家末代『真龙后裔』，名义上是源石工业的高阶干员，实际上是个自带BGM、一本正经胡说八道的闯祸精。蓝红龙尾既是真龙血脉的象征，也是她闯祸后『鬼畜甩锅』时的灵魂道具。",
    tags: ["真龙后裔", "陈家后人", "闯祸精", "鬼畜甩锅王", "源石干员"],
    accent: "crimson",
  },
  {
    id: "perlica",
    name: "佩丽卡",
    role: "陈千语的护卫对象 / 受害者视角",
    description:
      "陈千语被指派的护卫对象，皇家限量茶具收藏家。永远在陈千语闯祸后的第一现场，是『愤怒的受害者』视角担当。",
    tags: ["护卫对象", "皇家茶具", "受害者"],
    accent: "cyan",
  },
  {
    id: "yivon",
    name: "伊冯",
    role: "训练室同伴 / 被冤枉的背锅侠",
    description:
      "训练室的常客，源石饼爱好者。一脸懵逼地被陈千语当众指认为『罪魁祸首』，标志性登场是一边打嗝一边推门。",
    tags: ["训练室", "源石饼", "背锅侠"],
    accent: "paper",
  },
  {
    id: "admin",
    name: "管理员",
    role: "玩家 / 旁观者 / 第四面墙",
    description:
      "陈千语口中的『被告』，鬼畜摇头的核心观众，系列永恒的甩锅听众。",
    tags: ["玩家", "被告", "甩锅听众"],
    accent: "cyan",
  },
  {
    id: "ancestor",
    name: "先祖",
    role: "陈家前辈 / 精神导师 / 敲头者",
    description:
      "陈家祠堂里的精神导师，主要职能是在回忆杀中敲打小时候的陈千语。",
    tags: ["祠堂", "回忆杀", "敲头者"],
    accent: "crimson",
  },
];

export const relations: Relation[] = [
  { from: "chenqianyu", to: "perlica", type: "protects", label: "护卫" },
  { from: "chenqianyu", to: "yivon", type: "frames", label: "甩锅" },
  { from: "perlica", to: "chenqianyu", type: "targets", label: "质问" },
  { from: "chenqianyu", to: "admin", type: "observer", label: "解释" },
  { from: "ancestor", to: "chenqianyu", type: "mentor", label: "敲头" },
];
