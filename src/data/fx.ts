// 4 个 HTML 动效：驴车漂移、岐沟关溃败、陈家谷伏击、澶渊之盟
// 每个 fx 包含：技术栈、说明、可在 React 中作为独立子组件渲染

export type FxTech = "css" | "svg" | "canvas";

export type Fx = {
  id: string;
  name: string;
  hint: string;
  tech: FxTech;
  caption: string;
  promptNote: string; // 同步给 AI 的「引用效果」提示
};

export const FX: Fx[] = [
  {
    id: "fx-donkey",
    name: "驴车漂移",
    hint: "CSS 关键帧：驴车冲刺 → 急转 → 翻覆",
    tech: "css",
    caption: "高粱河 · 皇帝驾驴车三十里狂奔",
    promptNote:
      "画面以横向运动为主：车在前景疾驰，背景不断后移；两次急转时画面倾斜 ±6°；可在画面边缘加入飞掠的箭矢，模拟追击。",
  },
  {
    id: "fx-qigou",
    name: "岐沟关溃败",
    hint: "SVG 河流 + 飞溅血点 + 战马阵列",
    tech: "svg",
    caption: "岐沟关 · 万骑冲阵、沙河不流",
    promptNote:
      "前景血色 SVG 河流横向铺底，骑兵阵列以阶梯状从画面右下方涌入；溃逃的宋军以散点 + 拖尾 SVG 路径表现；尾部留 0.3 秒静默以突出「沙河为之不流」。",
  },
  {
    id: "fx-chenjia",
    name: "陈家谷伏击",
    hint: "CSS 月光 + 落空伏兵 + 残旗",
    tech: "css",
    caption: "陈家谷口 · 救兵不至、孤月照征袍",
    promptNote:
      "画面以极低饱和度的冷蓝 + 米白为基调；一束窄光柱从画面顶部中央向下落，象征月光；风中残旗作 CSS 摇摆；落空时以红色印章从画面右下角飞出。",
  },
  {
    id: "fx-chanyuan",
    name: "澶渊之盟",
    hint: "SVG 黄河 + 双岸对峙 + 落款朱印",
    tech: "svg",
    caption: "澶渊之盟 · 黄河两岸、百年兄弟",
    promptNote:
      "横向构图，黄色巨流自左向右；以中线为界，上为宋下为辽；中央由两个印章动画同步落定；末尾以宣纸纹理 + 书法笔触 1 秒扫过。",
  },
];
