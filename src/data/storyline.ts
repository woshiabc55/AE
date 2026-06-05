import type { Storyline } from "./types";

export const storyline: Storyline = {
  title: "《终末地：陈千语外传》主干线",
  overview:
    "以『真龙后裔』身份光环与日常干员『小可爱』真实属性之间的反差为核心笑点引擎，把每一集呆萌反转的短剧，串成一条可被系列化、可持续更新的IP主线。",
  acts: [
    {
      phase: 1,
      title: "人设建立",
      summary: "陈千语以正义使者姿态登场，揭穿她闯祸+甩锅的双重属性；再以高帧率龙语展示她的家族秘技搞笑面。",
      keyPoints: [
        "EP.01《终末地最大嫌疑人》：严肃外表 × 闯祸内核",
        "EP.02《啥子传奇之咚咚咚》：假正经的祖传龙语",
        "建立『假正经 → 闯祸 → 甩锅 → 萌混过关』叙事节奏",
      ],
      status: "completed",
    },
    {
      phase: 2,
      title: "关系深化",
      summary: "在更多元的任务/事件/外勤中扩展人物关系网，让『受害者』『被甩锅者』『围观者』同时具备反击属性。",
      keyPoints: [
        "佩丽卡升级为『默契配合的受害者搭档』",
        "伊冯升级为『有仇必报的反击型角色』",
        "管理员升级为『被陈千语拖下水的共犯』",
        "陈家先祖成为黑历史回忆杀常驻嘉宾",
      ],
      status: "in-progress",
    },
    {
      phase: 3,
      title: "真相揭露",
      summary: "『真龙后裔』称号被某次大型事件彻底质疑——实际上陈家血脉早已稀释，她只是一只学会了龙语的源石小龙崽。",
      keyPoints: [
        "反转点：『真龙后裔』只是称号的延续，血脉早已稀释",
        "不影响她的可爱属性，反而强化反差",
        "为 Slogan 盖章：『听说是真龙后裔，其实就是个小可爱』",
      ],
      status: "planned",
    },
  ],
  recurringElements: [
    { name: "开场固定POSE", description: "陈千语对镜头一本正经地宣言 → 必被打脸" },
    { name: "龙尾鬼畜", description: "闯祸或得意时的标志性动作" },
    { name: "『管理员』称谓", description: "贯穿全系列的第四面墙对象" },
    { name: "魔性BGM", description: "每集专属洗脑旋律，与陈千语同步自带" },
    { name: "黑历史回忆杀", description: "每集末尾30秒固定槽点" },
    { name: "甩锅逻辑链", description: "闯祸 → 严肃甩锅 → 被打脸 → 龙尾鬼畜 → 萌混过关" },
  ],
  slogans: [
    {
      main: "终末地最大『关系户』背锅侠",
      sub: "好吧这次还是我！ —— 来自 EP.01 的金句",
    },
    {
      main: "听说是真龙后裔，其实就是个小可爱。",
      sub: "系列官方盖章 Slogan —— 来自 EP.02 的彩蛋",
    },
  ],
  extensions: [
    { name: "训练室闯祸系列", hook: "物理破坏 + 甩锅", status: "ready" },
    { name: "祖传秘技系列", hook: "假正经技能展示", status: "ready" },
    { name: "任务汇报系列", hook: "报告里夹带私货", status: "stock" },
    { name: "干员食堂系列", hook: "源石饼争夺战", status: "stock" },
    { name: "陈家祠堂系列", hook: "拜见先祖 = 挨打回忆", status: "stock" },
    { name: "塔卫二外勤系列", hook: "野外生存翻车实录", status: "stock" },
  ],
};
