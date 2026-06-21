import type { OutlineChapter } from "./types";

// 高等数学复习提纲 - Mock 数据
export const outlineChapters: OutlineChapter[] = [
  {
    id: "ch1",
    number: "第一章",
    numeral: "Ⅰ",
    title: "函数与极限",
    subtitle: "Functions and Limits",
    weight: 92,
    hours: 16,
    summary:
      "函数的概念与性质、极限的定义与运算、无穷小与无穷大、连续性。这是整个微积分的逻辑起点，极限思想贯穿始终。",
    points: [
      {
        id: "p1-1",
        title: "函数的概念与基本性质",
        level: "熟练掌握",
        description:
          "理解函数的定义、定义域与值域；掌握函数的有界性、单调性、奇偶性与周期性。",
        exampleRef: { examId: "exam-2023-mid", questionLabel: "一·1" },
      },
      {
        id: "p1-2",
        title: "反函数与复合函数",
        level: "掌握",
        description: "理解反函数的概念，掌握复合函数的分解与构造。",
      },
      {
        id: "p1-3",
        title: "数列极限的定义与性质",
        level: "理解",
        description:
          "ε-N 语言；掌握极限的唯一性、有界性与保号性；四则运算法则。",
      },
      {
        id: "p1-4",
        title: "函数极限",
        level: "熟练掌握",
        description:
          "ε-δ 语言；左右极限；极限存在的充要条件；两个重要极限。",
        exampleRef: { examId: "exam-2023-mid", questionLabel: "一·2" },
      },
      {
        id: "p1-5",
        title: "无穷小与无穷大",
        level: "掌握",
        description:
          "无穷小的定义与阶的比较（高阶、低阶、同阶、等价）；等价无穷小替换求极限。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "一·1" },
      },
      {
        id: "p1-6",
        title: "函数的连续性",
        level: "熟练掌握",
        description:
          "连续的定义；间断点分类；闭区间上连续函数的性质（最值、有界、零点、介值）。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "四·15" },
      },
    ],
  },
  {
    id: "ch2",
    number: "第二章",
    numeral: "Ⅱ",
    title: "导数与微分",
    subtitle: "Derivatives and Differentials",
    weight: 88,
    hours: 14,
    summary:
      "导数的定义、几何意义、求导法则、高阶导数、微分及其应用。导数是刻画函数变化率的核心工具。",
    points: [
      {
        id: "p2-1",
        title: "导数的定义",
        level: "熟练掌握",
        description:
          "导数的定义式；左导数与右导数；可导与连续的关系；导数的几何意义（切线斜率）与物理意义。",
        exampleRef: { examId: "exam-2023-mid", questionLabel: "一·3" },
      },
      {
        id: "p2-2",
        title: "求导法则与公式",
        level: "熟练掌握",
        description:
          "四则运算法则、反函数求导、复合函数链式法则、隐函数求导、对数求导法、参数方程求导。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "三·12" },
      },
      {
        id: "p2-3",
        title: "高阶导数",
        level: "掌握",
        description: "高阶导数的定义与计算；常见函数的 n 阶导数公式；Leibniz 公式。",
      },
      {
        id: "p2-4",
        title: "微分及其应用",
        level: "理解",
        description: "微分的定义；微分形式不变性；微分在近似计算中的应用。",
      },
    ],
  },
  {
    id: "ch3",
    number: "第三章",
    numeral: "Ⅲ",
    title: "微分中值定理与导数应用",
    subtitle: "Mean Value Theorems & Applications",
    weight: 85,
    hours: 16,
    summary:
      "罗尔、拉格朗日、柯西中值定理；洛必达法则；泰勒公式；函数单调性、极值、最值与曲线凹凸性。",
    points: [
      {
        id: "p3-1",
        title: "微分中值定理",
        level: "熟练掌握",
        description:
          "罗尔定理、拉格朗日中值定理、柯西中值定理的条件与结论；构造辅助函数证明问题。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "四·16" },
      },
      {
        id: "p3-2",
        title: "洛必达法则",
        level: "熟练掌握",
        description: "0/0 与 ∞/∞ 型未定式；其他未定式的转化；洛必达法则的适用条件。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "三·11" },
      },
      {
        id: "p3-3",
        title: "泰勒公式",
        level: "掌握",
        description:
          "带有拉格朗日余项的泰勒公式；常见函数的麦克劳林展开；泰勒公式的应用。",
      },
      {
        id: "p3-4",
        title: "函数的单调性与极值",
        level: "熟练掌握",
        description:
          "利用一阶导数判别单调性；极值的必要条件与充分条件；最值问题。",
        exampleRef: { examId: "exam-2023-mid", questionLabel: "二·10" },
      },
      {
        id: "p3-5",
        title: "曲线的凹凸性与拐点",
        level: "掌握",
        description: "利用二阶导数判别凹凸性；拐点的判定；渐近线；函数作图。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "二·8" },
      },
    ],
  },
  {
    id: "ch4",
    number: "第四章",
    numeral: "Ⅳ",
    title: "不定积分",
    subtitle: "Indefinite Integrals",
    weight: 78,
    hours: 12,
    summary:
      "原函数与不定积分的概念、基本积分公式、换元积分法、分部积分法、有理函数积分。",
    points: [
      {
        id: "p4-1",
        title: "不定积分的概念与性质",
        level: "理解",
        description: "原函数与不定积分；基本积分表；线性性质。",
      },
      {
        id: "p4-2",
        title: "换元积分法",
        level: "熟练掌握",
        description: "第一类换元（凑微分）；第二类换元（三角换元、根式换元）。",
        exampleRef: { examId: "exam-2023-mid", questionLabel: "二·9" },
      },
      {
        id: "p4-3",
        title: "分部积分法",
        level: "熟练掌握",
        description: "分部积分公式；选择 u 与 dv 的原则；递推应用。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "三·13" },
      },
      {
        id: "p4-4",
        title: "有理函数与可化为有理函数的积分",
        level: "掌握",
        description: "有理函数的部分分式分解；三角有理式积分；简单无理式积分。",
      },
    ],
  },
  {
    id: "ch5",
    number: "第五章",
    numeral: "Ⅴ",
    title: "定积分及其应用",
    subtitle: "Definite Integrals & Applications",
    weight: 90,
    hours: 18,
    summary:
      "定积分的定义与性质、微积分基本定理、定积分计算、反常积分、定积分的几何与物理应用。",
    points: [
      {
        id: "p5-1",
        title: "定积分的概念与性质",
        level: "理解",
        description:
          "分割、求和、取极限；可积条件；定积分的线性性、可加性、保号性、估值定理与中值定理。",
      },
      {
        id: "p5-2",
        title: "微积分基本定理",
        level: "熟练掌握",
        description:
          "变上限积分的求导；牛顿-莱布尼茨公式；变限积分函数的性质。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "二·10" },
      },
      {
        id: "p5-3",
        title: "定积分的计算",
        level: "熟练掌握",
        description: "换元法与分部法在定积分中的应用；奇偶性与周期性的利用；Wallis 公式。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "二·9" },
      },
      {
        id: "p5-4",
        title: "反常积分",
        level: "掌握",
        description: "无穷限反常积分与无界函数反常积分；敛散性判别；比较判别法。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "一·5" },
      },
      {
        id: "p5-5",
        title: "定积分的应用",
        level: "熟练掌握",
        description:
          "元素法；平面图形面积；旋转体体积；平行截面面积已知的立体体积；弧长；旋转体侧面积。",
        exampleRef: { examId: "exam-2024-final", questionLabel: "三·14" },
      },
    ],
  },
  {
    id: "ch6",
    number: "第六章",
    numeral: "Ⅵ",
    title: "多元函数微分学",
    subtitle: "Differential Calculus of Multivariable Functions",
    weight: 82,
    hours: 18,
    summary:
      "多元函数的极限与连续、偏导数、全微分、复合函数与隐函数求导、多元极值与条件极值。",
    points: [
      {
        id: "p6-1",
        title: "多元函数的概念与极限",
        level: "理解",
        description: "邻域、开集、闭集；多元函数极限；连续性。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "一·1" },
      },
      {
        id: "p6-2",
        title: "偏导数与全微分",
        level: "熟练掌握",
        description: "偏导数定义与计算；全微分定义；可微、偏导存在与连续的关系。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "一·2" },
      },
      {
        id: "p6-3",
        title: "复合函数与隐函数求导",
        level: "熟练掌握",
        description: "多元复合函数链式法则；隐函数存在定理；方程组情形。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "二·6" },
      },
      {
        id: "p6-4",
        title: "多元函数的极值",
        level: "掌握",
        description: "无条件极值的充分条件；拉格朗日乘数法求条件极值；最值应用问题。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "三·11" },
      },
    ],
  },
  {
    id: "ch7",
    number: "第七章",
    numeral: "Ⅶ",
    title: "重积分",
    subtitle: "Multiple Integrals",
    weight: 76,
    hours: 14,
    summary:
      "二重积分的概念与性质、直角坐标与极坐标计算、三重积分、重积分的应用。",
    points: [
      {
        id: "p7-1",
        title: "二重积分的概念与性质",
        level: "理解",
        description: "二重积分定义；线性性、可加性、保号性、对称性。",
      },
      {
        id: "p7-2",
        title: "二重积分的计算",
        level: "熟练掌握",
        description:
          "直角坐标系下化二次积分；极坐标变换；积分次序交换；对称性简化。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "一·5" },
      },
      {
        id: "p7-3",
        title: "三重积分",
        level: "掌握",
        description: "直角坐标、柱坐标、球坐标下三重积分的计算。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "二·7" },
      },
    ],
  },
  {
    id: "ch8",
    number: "第八章",
    numeral: "Ⅷ",
    title: "无穷级数",
    subtitle: "Infinite Series",
    weight: 80,
    hours: 18,
    summary:
      "常数项级数敛散性、正项级数判别法、交错级数、绝对收敛与条件收敛、幂级数与函数展开。",
    points: [
      {
        id: "p8-1",
        title: "常数项级数的概念与性质",
        level: "理解",
        description: "级数收敛与发散；收敛级数的基本性质；级数收敛的必要条件。",
      },
      {
        id: "p8-2",
        title: "正项级数判别法",
        level: "熟练掌握",
        description: "比较判别法、比值判别法、根值判别法；p 级数敛散性。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "一·3" },
      },
      {
        id: "p8-3",
        title: "交错级数与绝对收敛",
        level: "掌握",
        description: "莱布尼茨判别法；绝对收敛与条件收敛的概念与判别。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "二·8" },
      },
      {
        id: "p8-4",
        title: "幂级数",
        level: "熟练掌握",
        description: "收敛半径与收敛域；幂级数的运算；和函数的求解。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "一·4" },
      },
      {
        id: "p8-5",
        title: "函数的幂级数展开",
        level: "掌握",
        description: "泰勒级数与麦克劳林级数；间接展开法；常见函数展开式。",
        exampleRef: { examId: "exam-2024-final-b", questionLabel: "二·9" },
      },
    ],
  },
];

export function getChapterById(id: string): OutlineChapter | undefined {
  return outlineChapters.find((c) => c.id === id);
}
