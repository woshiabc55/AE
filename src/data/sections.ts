// 单页锚点配置
export const sections = [
  { id: "hero", label: "序章", code: "00" },
  { id: "profile", label: "档案", code: "01" },
  { id: "scripts", label: "剧本", code: "02" },
  { id: "storyline", label: "主线", code: "03" },
  { id: "slogans", label: "彩蛋", code: "04" },
] as const;

export type SectionId = (typeof sections)[number]["id"];
